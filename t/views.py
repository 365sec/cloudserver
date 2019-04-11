# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import connection

import time
from collections import OrderedDict
from datetime import timedelta, datetime
from django.db.models import Max, Avg, F, Q, Count
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.forms.models import model_to_dict

from django.views.decorators.http import require_http_methods
from django.db import transaction
import json

import hashlib
import geoip2.database
from .scan import get_scan

# Create your views here.
from pymysql.constants.FIELD_TYPE import JSON

from t.models import agents
from t.models import attack_event
from t.models import event_knowledge
from t.models import plugins
from t.models import users

SENSOR_TYPE = {'10001': 'Java Rasp探针', '10002': 'PHP Rasp探针', '20001': 'IIS探针'}
INTERCEPT_STATUS = {'block': '拦截', 'log': '记录', 'ignore': '忽略'}
THREAT_LEVEL = {0: '严重', 1: '高危', 2: '中危', 3: '低危'}
AGENT_ID = None


def auth(func):
    def wrapper(request):
        if request.session.has_key('superuser'):
            return func(request)
        else:
            # return HttpResponse('auth failed!', content_type='application/json')
            return redirect('/login')

    return wrapper


def refresh_agent_id():
    global AGENT_ID
    AGENT_ID = hashlib.md5(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))).hexdigest()[8:-8]


refresh_agent_id()


def readConfig(filename):
    try:
        f = open(filename, "r")
        content = f.read()
        f.close()
        return content
    except Exception as e:
        print(e)


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
    except Exception as e:
        data = {
            "code": 1,
            "message": 'Database operation failed.'
        }
        print(e)
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
        print(u.password)
        print(m2.hexdigest())
        if u.password == m2.hexdigest():
            request.session['username'] = username
            request.session['superuser'] = u.superuser
            request.session['is_login'] = True
            request.session.set_expiry(1800)
            return redirect('/index')

    return render(request, 'login.html', {})


def loginout(request):
    request.session.clear()
    return redirect('/login')


@auth
def agent_query(request):
    global SENSOR_TYPE

    # 当前页码数
    page = request.POST.get("page")
    page = int(page)
    result = None
    if request.session['superuser']:
        result = agents.objects.all().order_by("-online")
    else:
        username = request.session['username']
        result = agents.objects.filter(owner=username).order_by("-online")
    # 每页显示多少个数据
    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    agents_list = []
    for x in result[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)

        y['sensor_type_id'] = SENSOR_TYPE.get(y['sensor_type_id'], '')
        y['online'] = '在线' if y['online'] else '离线'
        y['disabled'] = '是' if y['disabled'] else '否'

        for k, v in y.items():
            if not y[k]:
                y[k] = ''
        y = json.dumps(y)

        agents_list.append(y)
    data = {
        "agents": agents_list,
        "max_size": max_size,
        "page": page,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')


@auth
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
    for x in event_knowledge.objects.filter(event_type=1):
        event_div_arr.append(x.event_name)
        event_dic[x.event_name] = x.event_id
    if attack_type != "" and attack_type != None:
        filter_condition['event_id'] = event_dic[attack_type]

    # 关于报警消息的过滤
    msg_filter = None
    attack_msg = request.POST.get("attack_msg")
    if attack_msg != "" and attack_msg != None:
        # filter_condition['plugin_message__icontains']=attack_msg
        msg_filter = Q(plugin_message__icontains=attack_msg) | Q(target=attack_msg) | Q(url__icontains=attack_msg) | Q(
            agent_id=attack_msg) | Q(attack_source__icontains=attack_msg)

    # 关于攻击时间的过滤
    attack_time = request.POST.get("attack_time")
    if attack_time != "" and attack_time != None:
        start_time = attack_time.split(" ~ ")[0]
        end_time = attack_time.split(" ~ ")[1]
        filter_condition['event_time__range'] = [start_time, end_time]

    # 关于攻击等级的过滤
    attack_level = request.POST.get("attack_level")
    if attack_level != "" and attack_level != None:
        attack_level = int(attack_level)
        filter_condition['threat_level'] = attack_level

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
        y['attack_type1'] = y['attack_type']
        try:
            y['attack_type'] = event_knowledge.objects.get(event_id=y['event_id']).event_name
        except Exception as e:
            y['attack_type'] = ''
        y['plugin_message'] = y['plugin_message'].replace('<', '&lt').replace('>', '&gt')
        y['attack_params'] = y['attack_params'].replace('<', '&lt').replace('>', '&gt')
        y['url'] = y['url'].replace('<', '&lt').replace('>', '&gt')
        y['body'] = y['body'].replace('<', '&lt').replace('>', '&gt')
        y['plugin_message'] = y['plugin_message'].replace('"', '&quot;')

        # 查询城市
        y['city'] = ''

        str_ip = y['attack_source'].split(".")[0]
        if str_ip == "172" or str_ip == "192" or str_ip == "10":
            y['city'] = "局域网"
        elif str_ip == "127" or str_ip == "" or str_ip == "::1":
            y['city'] = "本机"
        try:
            # gi = geoip2.database.Reader('geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
            # response = gi.city(y['attack_source'])
            # y['city'] = response.country.names['zh-CN'] + "-" + response.subdivisions[0].names['zh-CN'] + "-" + \
            #             response.city.names['zh-CN']
            y['city'] = ip_to_address(y['attack_source'])
        except Exception as e:
            pass
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


@auth
def attack_query_source(request):
    # 上一次查询到的位置
    last = request.POST.get("last")
    last = int(last)
    # 查询的被攻击的id
    ip = request.POST.get("ip")

    attack_source = request.POST.get('attack_source')
    # print("被攻击ip ")
    # print(ip)
    # print("攻击源ip ")
    # print(attack_source)
    # print("上次查询到 ")
    # print(last)

    # 剩下还有多少条
    remain = 0
    # 总共条数
    num = 0
    # 被攻击时间
    time = None
    # 攻击者ip
    attack_ip = None
    # 攻击者位置
    attack_addr = None
    # 插件消息
    attack_plugin_msg = None
    # 是否被拦截
    intercept_state = None

    result = attack_event.objects.all().values_list('event_time', 'attack_source', 'plugin_message',
                                                    'intercept_state').filter(server_ip=ip, attack_source=attack_source)
    num = result.count()
    last_next = last + 10
    if last + 10 > num:
        last_next = num
    last_next = int(last_next)
    list_x_all = []

    # print("本次查询到")
    # print(last_next)
    # print("总数")
    # print(num)
    for x in result[last:last_next]:
        list_x = []
        list_x.append(x[0].strftime("%Y-%m-%d %H:%M:%S"))
        list_x.append(x[1])
        str_ip = list_x[1].split(".")[0]
        if str_ip == "172" or str_ip == "192" or str_ip == "10":
            list_x[1] = ("局域网")
        elif str_ip == "127" or str_ip == "" or str_ip == "::1":
            list_x[1] = ("本机")
        else:
            try:
                # gi = geoip2.database.Reader('geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
                # response = gi.city(x[1])
                # res = response.country.names['zh-CN'] + "-" + response.subdivisions[0].names['zh-CN'] + "-" + \
                #       response.city.names['zh-CN']
                print("asdsadsa")
                res = ip_to_address(x[1])
                list_x[1] = (res)
            except Exception as e:
                print(e)
        list_x.append(x[1])
        list_x.append(x[2].replace('<', '&lt').replace('>', '&gt'))
        list_x.append(INTERCEPT_STATUS.get(x[3], ''))
        list_x_all.append(list_x)

    remain = num - last_next
    data = {}
    data['list'] = list_x_all
    data['remain'] = remain
    data['last_next'] = last_next
    data['all_num'] = num
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


@auth
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
    threat_level_list = attack.filter(**filter_condition).values_list('threat_level').annotate(
        aaa=Count('threat_level'))
    threat_level_dict = {}
    for item in threat_level_list:
        threat_level_dict[item[0]] = item[1]

    data['threat_level_dict'] = threat_level_dict
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


@auth
def query_attack_source(request):
    # 0代表世界 1代表中国
    flag = request.POST.get("flag")

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

        except Exception as e:
            continue
        if flag == 0 and response.country.names['zh-CN'] in ['中国','香港','澳门','台湾'] :

            try:
                key = item[0] + '\r\n' + response.subdivisions.most_specific.name + ' ' + response.city.name
                attack_source_map[key] = [response.location.longitude, response.location.latitude, item[1]]
            except Exception as e:
                attack_source_map[item[0]] = [response.location.longitude, response.location.latitude, item[1]]
        else:
            try:
                key = item[0] + '\r\n' + response.subdivisions.most_specific.name + ' ' + response.city.name
                attack_source_map[key] = [response.location.longitude, response.location.latitude, item[1]]
            except Exception as e:
                attack_source_map[item[0]] = [response.location.longitude, response.location.latitude, item[1]]

    data['attrack_source_dic'] = attrack_source_dic
    data['attack_source_map'] = attack_source_map
    # print(attack_source_map)
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


def query_attack_source_map(request):
    attack_source_map = {}
    data = {}
    attack = attack_event.objects
    attrack_source = attack.values_list('attack_source').annotate(number=Count('attack_source')).order_by('-number')
    gi = geoip2.database.Reader('geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
    for item in attrack_source:
        response = None
        try:
            response = gi.city(item[0])

        except Exception as e:
            continue

        try:
            key = item[0] + '\r\n' + response.subdivisions.most_specific.name + ' ' + response.city.name
            attack_source_map[key] = [response.location.longitude, response.location.latitude, item[1]]
        except Exception as e:
            attack_source_map[item[0]] = [response.location.longitude, response.location.latitude, item[1]]

    data['attack_source_map'] = attack_source_map
    print(attack_source_map)
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


@auth
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
        # print (str(end_data))
        attrack_time_dic[str(end_data)] = attrack_time.filter(
            event_time__range=[start_time + timedelta(1), end_data + timedelta(1)]).count()
        end_data = (end_data - timedelta(1))
    attrack_time_dic_list = []
    # print(attrack_time_dic)

    for x in attrack_time_dic:
        attrack_time_dic_list.append([x, attrack_time_dic[x]])

    data['attrack_time_dic'] = attrack_time_dic_list

    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


@auth
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

    attrack_times = attack.filter(~Q(event_id__in=[0, 999]), **filter_condition).values_list('event_id').annotate(
        Count('event_id'))
    attrack_times1 = sorted(attrack_times, key=lambda item: item[1], reverse=True)
    attack_type1 = {}
    for x in attrack_times1:
        name = attack_type[str(x[0])]
        attack_type1[name] = x[1]
        if len(attack_type1) >= num:
            break
    attack_type1 = sorted(attack_type1.items(), key=lambda item: item[1], reverse=True)

    data['attrack_type_times'] = attack_type1
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


@auth
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

    data['attrack_recent_warning'] = recent_warning
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


def plugins_manage(request):
    id = request.POST.get("id")

    result = plugins.objects.all().filter(agent_id=id)
    data1 = {}
    for x in result:
        data1 = model_to_dict(x)
    data = data1
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


def plugins_update(request):
    id = request.POST.get('id')
    algo = request.POST.get('algo')
    http = request.POST.get('http')
    glob = request.POST.get('glob')

    plugin = plugins.objects.get(agent_id=id)
    plugin.algorithm_config = algo
    plugin.httpProtectConfig = http
    plugin.globalConfig = glob
    timeArray = time.localtime()
    otherStyleTime = time.strftime("%Y%m%d-%H%M%S", timeArray)

    plugin.plugin_version = otherStyleTime
    plugin.save()

    data = {"aaa": 132}
    return HttpResponse(data, content_type='application/json')


@auth
def data_count(request):
    # 关于攻击时间的过滤

    attack_time_range = request.POST.get("attack_time")
    num = 30  # 前num天
    dt_e = datetime.now().date()  # 2018-7-15
    dt_s = (dt_e - timedelta(num))  # 2018-7-08
    if attack_time_range != "" and attack_time_range != None:
        dt_s = attack_time_range.split(" ~ ")[0]
        dt_e = attack_time_range.split(" ~ ")[1]
    attack_time_range = attack_event.objects.filter(event_time__range=(dt_s, dt_e))
    # strftime("%Y-%m-%d %H:%M:%S")

    attack = attack_time_range
    # 统计攻击源
    attack_source = attack.values_list('attack_source').annotate(number=Count('attack_source')).order_by('-number')
    # attack_source = sorted(attack_source, key=lambda item: item[1], reverse=True)
    # 攻击源及地理位置统计
    attack_source_list = []
    for x in attack_source:
        y = list(x)
        str_ip = y[0].split(".")[0]
        if str_ip == "172" or str_ip == "192" or str_ip == "10":
            y.append("局域网")
        elif str_ip == "127" or str_ip == "" or str_ip == "::1":
            y.append("本机")
        else:
            try:
                res = ip_to_address(x[0])
                y.append(res)
            except Exception as e:
                print(e)
        attack_source_list.append(y)
    # 统计严重级别
    attack_level = attack.values_list('threat_level').annotate(number=Count('threat_level')).order_by('-number')
    # print(attack_level)
    attack_level_list = []
    for x in attack_level:
        y = list(x)
        y[0] = THREAT_LEVEL.get(x[0], '')
        attack_level_list.append(y)
    # attack_level_list = sorted(attack_level_list, key=lambda item: item[1], reverse=True)

    # 主要攻击时间段及总体趋势
    # 统计前num天的攻击次数，攻击趋势分析
    date = dt_s
    cursor = connection.cursor()
    cursor.execute(
        "SELECT DATE_FORMAT( event_time, '%%Y-%%m-%%d' ) AS dataTime, "
        "COUNT(1) AS countNumber FROM`t_attack_event`"
        "WHERE event_time >%s GROUP BY dataTime  ",
        date)
    attack_time_dic_list = cursor.fetchall()
    attack_time_dic_list = list(attack_time_dic_list)

    # 资产统计 系统、服务器类型
    attack_server = attack.values_list('server_type').annotate(number=Count('server_type')).order_by('-number')
    # attack_server = sorted(attack_server, key=lambda item: item[1], reverse=True)
    attack_server_list = []
    for x in attack_server:
        attack_server_list.append(list(x))
    # 服务器ip和地址位置分布
    attack_server_ip = attack.values_list('server_ip').annotate(number=Count('server_ip')).order_by('-number')
    # attack_server_ip = sorted(attack_server_ip, key=lambda item: item[1], reverse=True)
    attack_server_ip_list = []
    for x in attack_server_ip:
        y = list(x)
        address = ip_to_address(y[0])[0]
        y.append(address)
        attack_server_ip_list.append(y)
    # 事件类型统计
    attack_type = {}
    attack_type_list = []
    result = event_knowledge.objects.all()
    for x in result:
        attack_type[str(x.event_id)] = x.event_name
    attack_type_ = attack.values_list('event_id').annotate(number=Count('event_id')).order_by('-number')
    # attack_type_ = sorted(attack_type_, key=lambda item: item[1], reverse=True)
    for x in attack_type_:
        y = list(x)
        if y[0] == 0:
            continue
        y[0] = attack_type[str(y[0])]
        attack_type_list.append(y)
    # 网站域名统计
    attack_target_list = []
    attack_target = attack.values_list('target').annotate(number=Count('target')).order_by('-number')
    # print(attack_target)
    # attack_target = sorted(attack_target, key=lambda item: item[1], reverse=True)
    for x in attack_target:
        attack_target_list.append(x)

    # user_agent 扫描器排名
    attack_user_agent = attack.values_list('user_agent').annotate(number=Count('user_agent')).order_by('-number')
    # attack_user_agent = sorted(attack_user_agent, key=lambda item: item[1], reverse=True)
    attack_scan_list = {}
    for x in attack_user_agent:
        name = get_scan(x[0])
        if name:
            if name not in attack_scan_list:
                attack_scan_list[name] = x[1]
            else:
                attack_scan_list[name] += x[1]
    data = {"attack_source": attack_source_list,
            "attack_level": attack_level_list,
            "attack_time_dic": attack_time_dic_list,
            "attack_server": attack_server_list,
            "attack_server_ip": attack_server_ip_list,
            "attack_type": attack_type_list,
            "attack_target": attack_target_list,
            "attack_scan": attack_scan_list,
            }
    return HttpResponse(json.dumps(data), content_type='application/json')


def ip_to_address(ip):
    # 将ip转换成对应的中文地点

    str = ip.split(".")[0]
    y = ''
    if str == "172" or str == "192" or str == "10":
        y = "局域网"
    elif str == "127" or str == "" or str == "::1":
        y = "本机"
    else:
        result = []
        try:
            gi = geoip2.database.Reader('geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
            response = gi.city(ip)
        except Exception as e:
            pass
        try:
            result.append(response.country.names['zh-CN'])
        except Exception as e:
            pass
        try:
            result.append(response.subdivisions.most_specific.names['zh-CN'])
        except Exception as e:
            pass
        try:
            result.append(response.city.names['zh-CN'])
        except Exception as e:
            pass

        y = '-'.join(result)
    # print(ip)
    # print(y)
    return y
