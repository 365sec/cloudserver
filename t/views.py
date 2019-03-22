# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import time
from collections import OrderedDict
from datetime import timedelta, datetime
from django.db.models import Max, Avg, F, Q, Count
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.forms.models import model_to_dict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.http import require_http_methods
from django.db import transaction
import json
import math
import hashlib
import geoip2.database

# Create your views here.
from pymysql.constants.FIELD_TYPE import JSON

from t.models import agents
from t.models import attack_event
from t.models import event_knowledge
from t.models import plugins
from t.models import users

SENSOR_TYPE = {'10001':'Java Rasp探针','10002':'PHP Rasp探针', '20001':'IIS探针'}
INTERCEPT_STATUS = {'block':'拦截', 'log':'记录'}
THREAT_LEVEL = {0:'严重',1:'高危',2:'中危',3:'低危'}
AGENT_ID = None

def refresh_agent_id():
    global AGENT_ID
    AGENT_ID = hashlib.md5(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))).hexdigest()[8:-8]

refresh_agent_id()

def readConfig(filename):
    try:
        f = open(filename, "r")
        content = f.read()
        f.close();
        return content
    except Exception, e:
        print e

@require_http_methods(['GET'])
def index(request):
    is_login = request.session.get('is_login', False)
    if is_login:
        context = {}
        context['agent_id'] = AGENT_ID
        context['login_username'] = request.session['username']
        return render(request, 'index.html', context)
    else:
        return redirect('/login')

def add_host(request):
    is_login = request.session.get('is_login', False)
    if not is_login:
        return redirect('/login')

    remark_message = request.POST.get('remarkmsg')
    try:
        with transaction.atomic():
            agent = agents()
            agent.disabled = 0
            agent.online = 0
            agent.agent_id = AGENT_ID
            agent.remark = remark_message
            agent.owner = 'test'
            agent.save()

            # 在t_plugins中增加记录
            plugin = plugins()
            plugin.agent_id = AGENT_ID
            plugin.plugin_name = "offical"
            timeArray = time.localtime()
            plugin.plugin_version = time.strftime("%Y%m%d-%H%M%S", timeArray)
            plugin.algorithm_config = readConfig("config/algorithm_config.conf")
            plugin.globalConfig = readConfig("config/globalConfig.conf")
            plugin.httpProtectConfig = readConfig("config/httpProtectConfig.conf")
            plugin.plugin_template = readConfig("config/plugin_template.conf")
            plugin.save()
            refresh_agent_id()
    except Exception, e:
        data = {
            "code": 1,
            "message": 'Database operation failed.'
        }
        print e
        return HttpResponse(json.dumps(data), content_type='application/json')
    data = {
        "code": 0,
        "message": 'sucessful.',
        'agent_id': AGENT_ID
    }
    return HttpResponse(json.dumps(data), content_type='application/json')

@require_http_methods(['GET', 'POST'])
def login(request):
    if request.method == 'GET':
        return render(request, 'login.html', {})
    elif request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        m2 = hashlib.md5()
        m2.update(password)
        u = users.objects.filter(username=username).first()
        print u.password
        print m2.hexdigest()
        if u.password == m2.hexdigest():
            request.session['username'] = username
            request.session['superuser'] = u.superuser
            request.session['is_login'] = True
            request.session.set_expiry(20)
            return redirect('/index')

    return render(request, 'login.html', {})

def loginout(request):
    request.session.clear()
    return redirect('/login')

def agent_query(request):
    global SENSOR_TYPE

    # 当前页码数
    page=request.POST.get("page")
    page=int(page)
    result = None
    if request.session['superuser']:
        result= agents.objects.all()
    else:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
    # 每页显示多少个数据
    page_size=15
    # 最大分页数
    max_size=(result.count()+page_size-1)/page_size
    if max_size==0:
        max_size=1
    if page>max_size:
        page=max_size
    agents_list=[]
    for x in result[(page-1)*page_size:(page)*page_size]:
        y=model_to_dict(x)

        y['sensor_type_id'] = SENSOR_TYPE.get(y['sensor_type_id'], '')
        y['online'] = '在线' if y['online'] else '离线'
        y['disabled'] = '是' if y['disabled'] else '否'

        for k, v in y.items():
            if not y[k]:
                y[k] = ''
        y=json.dumps(y)

        agents_list.append(y)
    data={
        "agents":agents_list,
        "max_size":max_size,
        "page":page,
    }
    return HttpResponse(json.dumps(data),content_type='application/json')

def attack_event_query(request):

    # 当前页码数
    page = request.POST.get("page")
    page = int(page)

    filter_condition = {}

    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 关于攻击类型的过滤
    attack_type = request.POST.get("attack_type")
    event_dic = {}
    event_div_arr = []
    for x in event_knowledge.objects.all():
        event_div_arr.append(x.event_name)
        event_dic[x.event_name] = x.event_id
    if attack_type != "" and attack_type != None:
        filter_condition['event_id']=event_dic[attack_type]

    # 关于报警消息的过滤
    msg_filter = None
    attack_msg = request.POST.get("attack_msg")
    if attack_msg != "" and attack_msg != None:
        #filter_condition['plugin_message__icontains']=attack_msg
        msg_filter = Q(plugin_message__icontains=attack_msg) | Q(target=attack_msg) | Q(url__icontains=attack_msg) | Q(agent_id=attack_msg)

    # 关于攻击时间的过滤
    attack_time = request.POST.get("attack_time")
    if attack_time != "" and attack_time != None:
        start_time = attack_time.split(" ~ ")[0]
        end_time = attack_time.split(" ~ ")[1]
        filter_condition['event_time__range']=[start_time, end_time]

    # 关于攻击等级的过滤
    attack_level = request.POST.get("attack_level")
    if attack_level != "" and attack_level != None:
        attack_level = int(attack_level)
        filter_condition['threat_level']=attack_level

    if msg_filter:
        result = attack_event.objects.filter(msg_filter, **filter_condition).order_by('-event_time')
    else:
        result = attack_event.objects.filter(**filter_condition).order_by('-event_time')

    max_lenth = result.count()
    # 每页显示多少个数据
    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    stack_list = []
    for x in result[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)
        y['event_time'] = y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
        y['intercept_state'] = INTERCEPT_STATUS.get(y['intercept_state'], '')
        y['threat_level'] = THREAT_LEVEL.get(y['threat_level'], '')
        try:
            y['attack_type'] = event_knowledge.objects.get(event_id=y['event_id']).event_name
        except Exception as e:
            y['attack_type'] = ''
        y['plugin_message'] = y['plugin_message'].replace('<', '&lt').replace('>', '&gt')
        y['url'] = y['url'].replace('<', '&lt').replace('>', '&gt')
        y['body'] = y['body'].replace('<', '&lt').replace('>', '&gt')
        y['plugin_message'] = y['plugin_message'].replace('"', '&quot;')

        stack_list.append(y)

    data = {
        "stack": stack_list,
        "max_size": max_size,
        "page": page,
        "attack_type": event_div_arr,
        "attack_level": attack_level,
    }

    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


def query_threat_level(request):
    data = {}
    attack = attack_event.objects

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计风险等级
    threat_level_list = attack.filter(**filter_condition).values_list('threat_level').annotate(aaa=Count('threat_level'))
    threat_level_dict = {}
    for item in threat_level_list:
        threat_level_dict[item[0]] = item[1]

    data['threat_level_dict'] = threat_level_dict
    data=json.dumps(data)

    return HttpResponse(data,content_type='application/json')

def query_attack_source(request):
    data = {}
    attack = attack_event.objects

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计attack_source
    attrack_source = attack.filter(**filter_condition).values_list('attack_source').annotate(Count('attack_source'))
    attrack_source = sorted(attrack_source, key=lambda item: item[1], reverse=True)
    # 统计前10条记录
    attrack_source_dic = {}
    for x in attrack_source[:12]:
        attrack_source_dic[str(x[0])] = x[1]
    attrack_source_dic = sorted(attrack_source_dic.items(), key=lambda item: item[1], reverse=True)

    gi = geoip2.database.Reader('geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
    attack_source_map = {}

    for item in attrack_source:
        response = None
        try:
            response = gi.city(item[0])

        except Exception, e:
            continue

        try:
            key = item[0] + '\r\n' + response.subdivisions.most_specific.name + ' ' + response.city.name
            attack_source_map[key] = [response.location.longitude, response.location.latitude, item[1]]
        except Exception, e:
            attack_source_map[item[0]] = [response.location.longitude, response.location.latitude, item[1]]

    data['attrack_source_dic']=attrack_source_dic
    data['attack_source_map'] = attack_source_map
    data=json.dumps(data)

    return HttpResponse(data,content_type='application/json')

def query_attack_times(request):
    data = {}
    attack = attack_event.objects

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计前num天的攻击次数，攻击趋势分析
    num = 15
    dt_s = datetime.now().date()  # 2018-7-15
    dt_e = (dt_s - timedelta(num))  # 2018-7-08
    filter_condition['event_time__range'] = [dt_e + timedelta(1), dt_s + timedelta(1)]
    attrack_time = attack.filter(**filter_condition)
    attrack_time_dic = OrderedDict()
    end_data = datetime.now().date()
    for x in range(num):
        start_time = (end_data - timedelta(1))
        attrack_time_dic[str(end_data)] = attrack_time.filter(
            event_time__range=[start_time + timedelta(1), end_data + timedelta(1)]).count()
        end_data = (end_data - timedelta(1))
    attrack_time_dic_list = []

    for x in attrack_time_dic:
        attrack_time_dic_list.append([x, attrack_time_dic[x]])

    data['attrack_time_dic']=attrack_time_dic_list

    data=json.dumps(data)

    return HttpResponse(data,content_type='application/json')

def query_attack_type(request):
    data = {}
    attack = attack_event.objects

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计攻击事件
    attack_type = {}
    result = event_knowledge.objects.all()
    for x in result:
        attack_type[str(x.event_id)] = x.event_name

    num = 12

    attrack_times = attack.filter(~Q(event_id__in=[0, 999]), **filter_condition).values_list('event_id').annotate(Count('event_id'))
    attrack_times1 = sorted(attrack_times, key=lambda item: item[1], reverse=True)
    attack_type1 = {}
    for x in attrack_times1:
        name = attack_type[str(x[0])]
        attack_type1[name] = x[1]
        if len(attack_type1) >= num:
            break
    attack_type1 = sorted(attack_type1.items(), key=lambda item: item[1], reverse=True)

    data['attrack_type_times']=attack_type1
    data=json.dumps(data)

    return HttpResponse(data,content_type='application/json')

def query_attack_warn(request):
    data = {}
    attack = attack_event.objects

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = agents.objects.filter(owner=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    attack_type = {}
    result = event_knowledge.objects.all()
    for x in result:
        attack_type[str(x.event_id)] = x.event_name

    recent_warning_list = []
    result = attack.filter(~Q(event_id__in=[0, 999]), **filter_condition).order_by('-event_time')
    for x in result[:10]:
        x.event_time = x.event_time.strftime("%Y-%m-%d %H:%M:%S")
        x.event_id = attack_type[str(x.event_id)]
        x.plugin_message = x.plugin_message.replace('<', '&lt').replace('>', '&gt')
        x.plugin_message = x.plugin_message.replace('"', '&quot;')
        temp = model_to_dict(x)
        recent_warning_list.append(temp)
    recent_warning = {"data": recent_warning_list}

    data['attrack_recent_warning']=recent_warning
    data=json.dumps(data)

    return HttpResponse(data,content_type='application/json')


def plugins_manage(request):
    id=request.POST.get("id")

    result=plugins.objects.all().filter(agent_id=id)
    data1={}
    for x in result:
        data1=model_to_dict(x)
    data=data1
    data=json.dumps(data)
    return HttpResponse(data,content_type='application/json')

def plugins_update(request):
    id=request.POST.get('id')
    algo=request.POST.get('algo')
    http=request.POST.get('http')
    glob=request.POST.get('glob')

    plugn=plugins.objects.get(agent_id=id)
    plugn.algorithm_config=algo
    plugn.httpProtectConfig=http
    plugn.globalConfig=glob
    timeArray=time.localtime()
    otherStyleTime=time.strftime("%Y%m%d-%H%M%S",timeArray)

    plugn.plugin_version=otherStyleTime
    plugn.save()

    data={"aaa":132}
    return HttpResponse(data,content_type='application/json')
