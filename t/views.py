# -*- coding:utf-8 -*-
from __future__ import unicode_literals

from itertools import chain

from django.db import connection

from collections import OrderedDict
from datetime import timedelta, datetime
from django.db.models import Max, Avg, F, Q, Count
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.forms.models import model_to_dict
from django.views.decorators.http import require_http_methods
from django.db import transaction
from pymysql.constants.FIELD_TYPE import JSON

import time
import json
import hashlib
import geoip2.database
from common.scan import get_scan
from common.common import readConfig, ip_to_address

from t.models import TWebAgents
from t.models import THostAgents
from t.models import TWebEvent as TAttackEvent
from t.models import TBaselineCheck
from t.models import TWebEvent
from t.models import TFileIntegrity
from t.models import TLogAnalysisd
from t.models import TBaselineKnowledge

from t.models import TEventKnowledge
from t.models import TConfig
from t.models import TUsers
from t.auth import auth
from t.login import get_agent_id
from t.login import refresh_agent_id

SENSOR_TYPE = {'10001': 'Java Rasp探针', '10002': 'PHP Rasp探针', '20001': 'IIS探针'}
INTERCEPT_STATUS = {'block': '拦截', 'log': '记录', 'ignore': '忽略'}
THREAT_LEVEL = {0: '严重', 1: '高危', 2: '中危', 3: '低危'}


def get_host_agent_id(request):
    data={"agent_id":get_agent_id()}

    return HttpResponse(json.dumps(data), content_type='application/json')

def add_host(request):
    is_login = request.session.get('is_login', False)
    if not is_login:
        return redirect('/login')

    remark_message = request.POST.get('remarkmsg')
    # print (remark_message)
    try:
        with transaction.atomic():
            agent = THostAgents()
            agent.disabled = 0
            agent.online = 0
            agent.agent_id = get_agent_id()
            agent.remark = remark_message
            agent.owner = request.session['username']
            agent.save()
            # 在t_plugins中增加记录
            plugin = TConfig()
            plugin.agent_id = get_agent_id()
            plugin.plugin_name = "offical"
            timeArray = time.localtime()
            plugin.plugin_version = time.strftime("%Y%m%d-%H%M%S", timeArray)
            plugin.algorithm_config = readConfig("data/rasp_config/algorithm_config.conf")
            plugin.globalConfig = readConfig("data/rasp_config/globalConfig.conf")
            plugin.httpProtectConfig = readConfig("data/rasp_config/httpProtectConfig.conf")
            plugin.plugin_template = readConfig("data/rasp_config/plugin_template.conf")
            plugin.config = readConfig("data/rasp_config/config.conf")
            plugin.save()
            # 在t_baseline_check中添加记录
            t_baseline_check=TBaselineCheck()
            t_baseline_check.agent_id = get_agent_id()
            t_baseline_check.check_status = 0
            t_baseline_check.result = readConfig("data/base_line/result.conf")
            t_baseline_check.save()

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
        'agent_id': get_agent_id()
    }
    return HttpResponse(json.dumps(data), content_type='application/json')


@auth
def agent_query(request):
    global SENSOR_TYPE
    # 当前页码数
    page = request.POST.get("page")
    page = int(page)
    result = None
    if request.session['superuser']:
        result = THostAgents.objects.all().order_by("-online")
    else:
        username = request.session['username']
        result = THostAgents.objects.filter(owner=username).order_by("-online")
    # 每页显示多少个数据

    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    TAgents_list = []
    for x in result[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)
        # print (y)
        y['last_hearbeat'] = y['last_hearbeat'].strftime("%Y-%m-%d %H:%M:%S")
        # y['sensor_type_id'] = SENSOR_TYPE.get(y['sensor_type_id'], '')
        y['online'] = '在线' if y['online'] else '离线'
        y['disabled'] = '是' if y['disabled'] else '否'

        for k, v in y.items():
            if not y[k]:
                y[k] = ''
        y = json.dumps(y)

        TAgents_list.append(y)
    data = {
        "agents": TAgents_list,
        "max_size": max_size,
        "page": page,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')


@auth
def server_agent_query(request):
    '''
    查询服务端的 agent
    :param request:
    :return:
    '''
    global SENSOR_TYPE
    # 当前页码数
    page = request.POST.get("page")
    page = int(page)
    result = None
    if request.session['superuser']:
        result = THostAgents.objects.all().order_by("-online")
    else:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username).order_by("-online")


    last_1m=result.filter(last_hearbeat__gte=(datetime.now()-timedelta(minutes=1))).count()
    last_10m=result.filter(last_hearbeat__gte=(datetime.now()-timedelta(minutes=10))).count()
    last_30m=result.filter(last_hearbeat__gte=(datetime.now()-timedelta(minutes=30))).count()
    last_online={"last_1m":last_1m,"last_10m":last_10m,"last_30m":last_30m}
    # 每页显示多少个数据

    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    TAgents_list = []
    for x in result[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)
        # print (y)
        if y['last_hearbeat']:
            y['last_hearbeat'] = y['last_hearbeat'].strftime("%Y-%m-%d %H:%M:%S")
        # y['sensor_type_id'] = SENSOR_TYPE.get(y['sensor_type_id'], '')
        y['online'] = '在线' if y['online'] else '离线'
        y['disabled'] = '是' if y['disabled'] else '否'

        for k, v in y.items():
            if not y[k]:
                y[k] = ''
        y = json.dumps(y)

        TAgents_list.append(y)
    data = {
        "agents": TAgents_list,
        "max_size": max_size,
        "page": page,
        "last_online": last_online,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')

@auth
def web_agent_query(request):
    '''
    查询web_agent
    :param request:
    :return:
    '''
    global SENSOR_TYPE
    # 当前页码数
    page = request.POST.get("page")
    page = int(page)
    result = None
    if request.session['superuser']:
        result = TWebAgents.objects.all().order_by("-online")
    else:
        filter_condition = {}
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids
        result = TWebAgents.objects.all().filter(**filter_condition).order_by("-online")

    # 每页显示多少个数据
    # for x in result:
    #     print (x)
    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    TAgents_list = []
    for x in result[(page - 1) * page_size:(page) * page_size]:
        try:
            y = model_to_dict(x)
            hostname = THostAgents.objects.all().filter(agent_id=y['agent_id']).first()
            if  not hostname:
                continue
            if hasattr(hostname,"internal_ip"):
                y['register_ip'] = hostname.internal_ip
            elif hasattr(hostname,"extranet_ip"):
                y['register_ip'] = hostname.extranet_ip
            else:
                y['register_ip'] = ""
            y['hostname'] = hostname.host_name
            y['sensor_type_id'] = SENSOR_TYPE.get(y['sensor_type_id'], '')
            y['online'] = '在线' if y['online'] else '离线'
            y['disabled'] = '是' if y['disabled'] else '否'
            if y['last_heartbeat']:
                y['last_heartbeat'] = y['last_heartbeat'].strftime("%Y-%m-%d %H:%M:%S")

            for k, v in y.items():
                if not y[k]:
                    y[k] = ''
            y = json.dumps(y)
            # print (y)
            TAgents_list.append(y)
        except Exception, e:
            print (e)
    data = {
        "agents": TAgents_list,
        "max_size": max_size,
        "page": page,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')


@auth
def attack_event_query(request):
    #获得下拉框列表
    event_div_arr = []
    event_dic = {}
    for x in TEventKnowledge.objects.filter(allow_search=1).order_by("event_id"):
        event_div_arr.append(x.event_name)
        event_dic[x.event_name] = x.event_id
    #获得不被允许查询列表
    not_allow_search=TEventKnowledge.objects.filter(~Q(allow_search=1)).values("event_id")
    not_allow_search_list=[]
    for x in not_allow_search:
        not_allow_search_list.append(x['event_id'])
    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir={}
    for x in THostAgents.objects.all().values_list("agent_id","host_name","internal_ip","extranet_ip"):
        if x[2]=="" or x[2] == None:
            hostname_dir[str(x[0])]=[x[1],x[3]]
        else:
            hostname_dir[str(x[0])]=[x[1],x[2]]
    #attack/query
    # 当前页码数
    page = request.POST.get("page")
    page = int(page)
    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    tweb_obj = TWebEvent.objects.all()
    tfile_obj = TFileIntegrity.objects.all()
    tlog_obj = TLogAnalysisd.objects.all()

    # 根据agent_id的过滤
    agent_id=request.POST.get("agent_id")
    if agent_id != "" and agent_id != None:
        tfile_obj = tfile_obj.filter(agent_id=agent_id)
        tlog_obj = tlog_obj.filter(agent_id=agent_id)
        tweb_obj = tweb_obj.filter(agent_id=agent_id)
        # print (agent_id)
    else:
        tfile_obj = tfile_obj.filter(**filter_condition)
        tlog_obj = tlog_obj.filter(**filter_condition)
        tweb_obj = tweb_obj.filter(**filter_condition)

    # 关于攻击类型的过滤,在搜索界面展示的下拉框
    attack_type = request.POST.get("attack_type")

    if attack_type != "" and attack_type != None:
        tfile_obj = tfile_obj.filter(event_id=event_dic[attack_type])
        tlog_obj = tlog_obj.filter(event_id=event_dic[attack_type])
        tweb_obj = tweb_obj.filter(event_id=event_dic[attack_type])

    # 关于报警消息的过滤
    msg_filter = None
    attack_msg = request.POST.get("attack_msg")
    if attack_msg != "" and attack_msg != None:
        # filter_condition['plugin_message__icontains']=attack_msg
        tfile_msg_filter = Q(event_name__icontains=attack_msg) | Q(full_log__icontains=attack_msg)
        tlog_msg_filter = Q(event_name__icontains=attack_msg) | Q(comment__icontains=attack_msg)
        tweb_msg_filter = Q(event_name__icontains=attack_msg) | Q(plugin_message__icontains=attack_msg)
        tfile_obj = tfile_obj.filter(tfile_msg_filter)
        tlog_obj = tlog_obj.filter(tlog_msg_filter)
        tweb_obj = tweb_obj.filter(tweb_msg_filter)

    # 关于攻击时间的过滤
    attack_time = request.POST.get("attack_time")

    if attack_time != "" and attack_time != None:
        start_time = datetime.strptime(attack_time.split(" ~ ")[0], "%Y-%m-%d")
        end_time = datetime.strptime(attack_time.split(" ~ ")[1], "%Y-%m-%d")+timedelta(1)
        tfile_obj = tfile_obj.filter(event_time__range=(start_time, end_time))
        tlog_obj = tlog_obj.filter(event_time__range=(start_time, end_time))
        tweb_obj = tweb_obj.filter(event_time__range=(start_time, end_time))

    # 关于攻击等级的过滤
    attack_level = request.POST.get("attack_level")
    if attack_level != "" and attack_level != None:
        attack_level = int(attack_level)
        tweb_obj = tweb_obj.filter(threat_level=attack_level)
        tlog_obj = tlog_obj.filter(threat_level=attack_level)
        if attack_level != 3:
            tfile_obj = tfile_obj.filter(event_issue_id=0)

    # if msg_filter:
    #     result = TAttackEvent.objects.filter(msg_filter, **filter_condition).order_by('-event_time')
    # else:
    #     result = TAttackEvent.objects.filter(**filter_condition).order_by('-event_time')

    # 过滤不被允许查询的结果
    for x in not_allow_search_list:
        tlog_obj=tlog_obj.filter(~Q(event_id=x))
        tfile_obj=tfile_obj.filter(~Q(event_id=x))
        tweb_obj=tweb_obj.filter(~Q(event_id=x))

    # 每张表需要查询的数据
    tweb = tweb_obj.values_list("agent_id", "event_time", "event_name", "plugin_message", "attack_source", "server_ip",
                                "event_issue_id", "event_id","event_category","threat_level","status",'intercept_state')
    tfile = tfile_obj.values_list("agent_id", "event_time", "event_name", "full_log", "unused", "unused",
                                  "event_issue_id", "event_id","event_category","unused","status","unused")
    tlog = tlog_obj.values_list("agent_id", "event_time", "event_name", "comment", "srcip", "dstip", "event_issue_id",
                                "event_id","event_category","threat_level","status","unused")
    # 三张表联合查询
    qchain = tweb.union(tlog, tfile,all=True)
    result = qchain.order_by("-event_time")

    max_lenth = result.count()
    # 每页显示多少个数据
    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    attack_list = []
    if page < 1:
        page = 1
    for x in result[(page - 1) * page_size:(page) * page_size]:
        x = list(x)
        for z in range(len(x)):
            if x[int(z)] == None:
                x[int(z)] = ""

        y = {}
        y['agent_id'] = x[0]
        y['event_time'] = x[1].strftime("%Y-%m-%d %H:%M:%S")
        y['event_name'] = x[2]
        y['comment'] = x[3].replace('<', '&lt').replace('>', '&gt').replace('"', '&quot;')
        y['attack_source'] = x[4]
        y['server_ip'] = x[5]
        y['event_issue_id'] = x[6]
        try:
            # y['hostname'] = THostAgents.objects.all().filter(agent_id=x[0]).values_list("host_name").first()[0]
            y['hostname'] = hostname_dir[x[0]][0]
            y['host_ip'] = hostname_dir[x[0]][1]
        except Exception as e:
            print (e)
            y['hostname']="主机已被删除"
            y['host_ip']="主机已被删除"
            # continue
        if x[8]=="web_event":
            y['threat_level']=int(x[9])
        elif x[8]=="log_analysisd":
            y['threat_level']=int(x[9])
        elif x[8]=="file_integrity":
            y['threat_level']=3
        y['status']=x[10]
        if not x[11]:
            x[11]="log"
        y['intercept_state']=INTERCEPT_STATUS[x[11]]
        attack_list.append(y)

    data = {
        "attack": attack_list,
        "max_size": max_size,
        "page": page,
        "attack_type": event_div_arr,
        "attack_level": attack_level,
        "attack_hostname": hostname_dir,
    }

    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


@auth
def query_detail_data(request):
    '''
    根据ID查询相应表的单条数据
    :param id:
    :return:
    '''
    id = request.POST.get("id")
    tweb_obj = TWebEvent.objects.all()
    tfile_obj = TFileIntegrity.objects.all()
    tlog_obj = TLogAnalysisd.objects.all()
    obj = None
    y = {}
    if id and id != "":
        tfile_obj = tfile_obj.filter(event_issue_id=id)
        tlog_obj = tlog_obj.filter(event_issue_id=id)
        tweb_obj = tweb_obj.filter(event_issue_id=id)
    if tfile_obj:
        obj = tfile_obj.first()
        y = model_to_dict(obj)
        y['event_time'] = y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
    if tlog_obj:
        obj = tlog_obj.first()
        y = model_to_dict(obj)
        y['event_time'] = y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
        # 查询城市
        y['city'] = ''
        if y['event_id'] in [2010, 2000]:
            if 'windows' in y['group']:
                y['login_type'] = 'rdp'
            elif 'ssh' in y['group']:
                y['login_type'] = 'ssh'
        else:
            y['login_type'] = ''

        if "." in y['srcip']:
            str_ip = y['srcip'].split(".")[0]
            if str_ip == "172" or str_ip == "192" or str_ip == "10":
                y['city'] = "局域网"
            elif str_ip == "127" or str_ip == "" or str_ip == "::1":
                y['city'] = "本机"
            try:
                y['city'] = ip_to_address(y['attack_source'])
            except Exception as e:
                pass
    if tweb_obj:
        obj = tweb_obj.first()
        y = model_to_dict(obj)
        y['event_time'] = y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
        y['intercept_state'] = INTERCEPT_STATUS.get(y['intercept_state'], '')
        y['threat_level'] = THREAT_LEVEL.get(y['threat_level'], '')
        y['attack_type1'] = y['attack_type']
        try:
            y['attack_type'] = TEventKnowledge.objects.get(event_id=y['event_id']).event_name
        except Exception as e:
            y['attack_type'] = ''
        y['plugin_message'] = y['plugin_message'].replace('<', '&lt').replace('>', '&gt')
        y['attack_params'] = y['attack_params'].replace('<', '&lt').replace('>', '&gt')
        y['url'] = y['url'].replace('<', '&lt').replace('>', '&gt')
        y['body'] = y['body'].replace('<', '&lt').replace('>', '&gt')
        y['plugin_message'] = y['plugin_message'].replace('"', '&quot;')

        # 查询城市
        y['city'] = ip_to_address(y['attack_source'])

        # str_ip = y['attack_source'].split(".")[0]
        # if str_ip == "172" or str_ip == "192" or str_ip == "10":
        #     y['city'] = "局域网"
        # elif str_ip == "127" or str_ip == "" or str_ip == "::1":
        #     y['city'] = "本机"
        # try:
        #     y['city'] = ip_to_address(y['attack_source'])
        # except Exception as e:
        #     pass

    # y['event_time']=y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
    data = json.dumps(y)
    return HttpResponse(data, content_type='application/json')


def query_web_agent_by_agent_id(request):
    '''

   查询web_agent
   :param request:
   :return:
   '''
    global SENSOR_TYPE
    # 当前页码数
    page = request.POST.get("page")
    agent_id = request.POST.get("agent_id")
    page = int(page)
    result = None
    if request.session['superuser']:
        result = TWebAgents.objects.all().order_by("-online")
    else:
        username = request.session['username']
        filter_condition = {}
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids
        result = TWebAgents.objects.all().filter(**filter_condition).order_by("-online")
    if  agent_id:
        # 每页显示多少个数据
        result=result.filter(agent_id=agent_id)
    page_size = 15
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    if page<1:
        page=1
    TAgents_list = []
    for x in result[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)
        hostname = THostAgents.objects.all().filter(agent_id=agent_id).first()
        # print (hostname)
        if hostname.internal_ip:
            y['register_ip'] = hostname.internal_ip
        else:
            y['register_ip'] = hostname.extranet_ip
        y['hostname'] = hostname.host_name
        y['sensor_type_id'] = SENSOR_TYPE.get(y['sensor_type_id'], '')
        y['online'] = '在线' if y['online'] else '离线'
        y['disabled'] = '是' if y['disabled'] else '否'
        y['last_heartbeat'] = y['last_heartbeat'].strftime("%Y-%m-%d %H:%M:%S") if y.get('last_heartbeat', None) else ''

        for k, v in y.items():
            if not y[k]:
                y[k] = ''
        y = json.dumps(y)
        # print (y)
        TAgents_list.append(y)
    data = {
        "agents": TAgents_list,
        "max_size": max_size,
        "page": page,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')


def query_web_event_by_app_id(request):
    #获得下拉框列表
    event_div_arr = []
    event_dic = {}
    for x in TEventKnowledge.objects.filter(allow_search=1).order_by("event_id"):
        event_div_arr.append(x.event_name)
        event_dic[x.event_name] = x.event_id
    #获得不被允许查询列表
    not_allow_search=TEventKnowledge.objects.filter(~Q(allow_search=1)).values("event_id")
    not_allow_search_list=[]
    for x in not_allow_search:
        not_allow_search_list.append(x['event_id'])
    #获得agent_id 跟主机名称的dir
    hostname_dir={}
    for x in THostAgents.objects.all().values_list("agent_id","host_name","internal_ip"):
        hostname_dir[str(x[0])]=[x[1],x[2]]
        # 当前页码数
    page = request.POST.get("page")
    app_id = request.POST.get("app_id")
    page = int(page)
    # print (app_id)
    # result = TWebEvent.objects.filter(app_id=app_id).order_by("-event_time")
    tweb_obj = TWebEvent.objects.all().filter(app_id=app_id)
    # 关于报警消息的过滤
    msg_filter = None
    attack_msg = request.POST.get("attack_msg")
    if attack_msg != "" and attack_msg != None:
        # filter_condition['plugin_message__icontains']=attack_msg
        tweb_msg_filter = Q(event_name__icontains=attack_msg) | Q(plugin_message__icontains=attack_msg)
        tweb_obj = tweb_obj.filter(tweb_msg_filter)
    # 关于攻击时间的过滤
    attack_time = request.POST.get("attack_time")
    if attack_time != "" and attack_time != None:
        start_time = datetime.strptime(attack_time.split(" ~ ")[0], "%Y-%m-%d")
        end_time = datetime.strptime(attack_time.split(" ~ ")[1], "%Y-%m-%d")+timedelta(1)
        tweb_obj = tweb_obj.filter(event_time__range=(start_time, end_time))

    # 关于攻击类型的过滤

    # 过滤不被允许查询的结果
    # not_allow_search=TEventKnowledge.objects.filter(~Q(allow_search=1)).values("event_id")
    # not_allow_search_list=[]
    # for x in not_allow_search:
    #     not_allow_search_list.append(x['event_id'])
    for x in not_allow_search_list:
        tweb_obj=tweb_obj.filter(~Q(event_id=x))
    tweb_obj=tweb_obj.order_by("-event_time")


    #攻击类型过滤
    attack_type = request.POST.get("attack_type")
    if attack_type != "" and attack_type != None:
        tweb_obj = tweb_obj.filter(event_id=event_dic[attack_type])

    # 关于攻击等级的过滤
    attack_level = request.POST.get("attack_level")
    if attack_level != "" and attack_level != None:
        attack_level = int(attack_level)
        tweb_obj = tweb_obj.filter(threat_level = attack_level)



    # 每页显示多少个数据

    page_size = 15
    # 最大分页数
    max_size = (tweb_obj.count() + page_size - 1) / page_size
    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    if page < 1:
        page = 1
    event_list = []
    for x in tweb_obj[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)
        y['plugin_message']=y['plugin_message'].replace('<', '&lt').replace('>', '&gt')
        y['event_time'] = y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
        try:
            y['attack_type'] = TEventKnowledge.objects.get(event_id=y['event_id']).event_name
        except Exception as e:
            y['attack_type'] = ''
        event_list.append(y)

    data = {
        "event_list": event_list,
        "max_size": max_size,
        "page": page,
        "attack_type": event_div_arr,
        # "attack_level": attack_level,
    }
    # print (data)

    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')

def change_web_event_remark(request):

    id = request.POST.get("app_id")
    remark=request.POST.get("new_remark")
    data_type=request.POST.get("data_type")
    if data_type=="web":
        web_obj=TWebAgents.objects.all().filter(app_id=id).first()
        web_obj.remark=remark
        web_obj.save()
    elif data_type=="server":
        server_obj=THostAgents.objects.all().filter(agent_id=id).first()
        server_obj.remark=remark
        server_obj.save()
    data = {
    }

    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')

def change_status(request):
    id = request.POST.get("id")
    obj = None

    file_obj= TFileIntegrity.objects.all().filter(event_issue_id=id)
    log_obj=TLogAnalysisd.objects.all().filter(event_issue_id=id)
    web_obj=TWebEvent.objects.all().filter(event_issue_id=id)

    if  file_obj.exists():
        obj=file_obj.first()
    if log_obj.exists():
        obj=log_obj.first()
    if web_obj.exists():
        obj=web_obj.first()
    # print model_to_dict(obj)
    # print (obj.status)
    obj.status = 1
    obj.save()
    data = {

    }
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')

@auth
def attack_query_source(request):
    '''
    攻击源ip相关查询
    :param request:
    :return:
    '''
    # 上一次查询到的位置
    last = request.POST.get("last")
    last = int(last)
    # 查询的被攻击的id
    ip = request.POST.get("ip")
    agent_id = request.POST.get("agent_id")

    attack_source = request.POST.get('attack_source')

    # print (ip)
    # print (attack_source)
    # print (agent_id)
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

    result = TAttackEvent.objects.all().values_list('event_time', 'attack_source', 'plugin_message',
                                                    'intercept_state','unused','event_name','event_id').filter( ~Q(event_id__in=[2011,2012,2013]), attack_source=attack_source,agent_id=agent_id )
    log_obj=TLogAnalysisd.objects.all().values_list('event_time','srcip','event_name','unused','host_name','dstuser','event_id').filter(~Q(event_id__in=[2011,2012,2013]), dstip=ip, srcip=attack_source,agent_id=agent_id)
    result=result.union(log_obj,all=True).order_by('event_time')
    # result=log_obj
    num = result.count()
    last_next = last + 10
    if last + 10 > num:
        last_next = num
    last_next = int(last_next)
    list_x_all = []

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
                res = ip_to_address(x[1])
                list_x[1] = (res)
            except Exception as e:
                print(e)
        list_x.append(x[1])
        x2=x[2]
        if x[4]:
            x2=[x[4],x[5],x[2]]
            list_x.append(x2)
        else:
            list_x.append(x2.replace('<', '&lt').replace('>', '&gt'))

        list_x.append(INTERCEPT_STATUS.get(x[3], '记录'))
        list_x_all.append(list_x)

    remain = num - last_next
    data = {}
    data['list'] = list_x_all
    data['remain'] = remain
    data['last_next'] = last_next
    data['all_num'] = num
    data = json.dumps(data)
    # print(data)
    return HttpResponse(data, content_type='application/json')


@auth
def server_attack_trend(request):
    '''
    安全分析
    :param request:
    :return:
    '''
    id = request.POST.get("id")
    tweb_obj = TWebEvent.objects.all().filter(agent_id=id)
    tfile_obj = TFileIntegrity.objects.all().filter(agent_id=id)
    tlog_obj = TLogAnalysisd.objects.all().filter(agent_id=id)

    all_count = tweb_obj.count()+tfile_obj.count()+tlog_obj.count()
    # 统计今日、昨日、这周的攻击情况
    date = datetime.today().day
    # dt_s = datetime.now().date()  # 2018-7-15
    # dt_e = (dt_s - timedelta(num))  # 2018-7-08
    dt_s = datetime.now().date()
    time_list_d = OrderedDict()
    time_list_y = OrderedDict()
    time_list_w = OrderedDict()
    num_list = {}
    # dt_s=dt_s+timedelta(1)
    for x in range(25):
        time_list_d[str(x).zfill(2) + ":00"] = 0
        time_list_y[str(x).zfill(2) + ":00"] = 0
        time_list_w[str(x).zfill(2) + ":00"] = 0
    for d in range(3):
        dt_s = datetime.now().date()
        if(d==0):
            dt_s = (dt_s + timedelta(1))
            dt_e = (dt_s - timedelta(1))
        if(d==1):
            dt_s = dt_s
            dt_e = (dt_s - timedelta(1))
        if (d==2):
            dt_s = (dt_s + timedelta(1))
            dt_e = (dt_s - timedelta(7))

        tweb_obj1 = tweb_obj.filter(event_time__range=(dt_e, dt_s)).extra(
            select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d %%H')"}) \
            .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')
        tfile_obj1 = tfile_obj.filter(event_time__range=(dt_e, dt_s)).extra(
            select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d %%H')"}) \
            .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')
        tlog_obj1 = tlog_obj.filter(event_time__range=(dt_e, dt_s)).extra(
            select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d %%H')"}) \
            .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')
        union_obj = tweb_obj1.union(tfile_obj1, tlog_obj1,all=True)

        if d == 0:
            for x in union_obj:
                time1 = x['event_time'].split(" ")[1] + ":00"
                time_list_d[time1] += x['num']
            num_list['tday'] = time_list_d
        if d == 1:
            for x in union_obj:
                time1 = x['event_time'].split(" ")[1] + ":00"
                time_list_y[time1] += x['num']
            num_list['yday'] = time_list_y
        if d == 2:
            for x in union_obj:
                time1 = x['event_time'].split(" ")[1] + ":00"
                time_list_w[time1] += x['num']
            num_list['week'] = time_list_w

    tweb_obj1=tweb_obj.values_list("event_name").annotate(number=Count('event_name'))
    tfile_obj1=tfile_obj.values_list("event_name").annotate(number=Count('event_name'))
    tlog_obj1=tlog_obj.values_list("event_name").annotate(number=Count('event_name'))
    union_obj2=tweb_obj1.union(tfile_obj1,tlog_obj1,all=True).order_by("-number")
    # 攻击类型类型及数目
    # union_obj3=union_obj2.values_list("event_name").annotate(number=Count('event_name'))
    type_num=list(union_obj2)


    # 攻击类型分析及被攻击网站列表
    tweb_obj1=tweb_obj.values_list("target").annotate(number=Count('target'))
    # tfile_obj1=tfile_obj.values_list("unused").annotate(number=Count('event_name'))
    tlog_obj1=tlog_obj.values_list("dstip").annotate(number=Count('dstip'))
    union_obj2=tweb_obj1.union(tlog_obj1,all=True).order_by("-number")
    web_num=list(union_obj2)
    # 攻击严重等级饼状图
    tweb_obj1=tweb_obj.values_list("threat_level").annotate(number=Count('threat_level'))
    tfile_obj1=tfile_obj.count()
    tlog_obj1=tlog_obj.values_list("threat_level").annotate(number=Count('threat_level'))
    # union_obj2=tweb_obj1.union(tlog_obj1).order_by("-number")
    # print (tlog_obj.values_list("threat_level").annotate(number=Count('threat_level')))
    level_num_list=[["严重",0],["高危",0],["中危",0],["信息",0]]
    level_num_list[3][1]=tfile_obj1
    for x in list(tweb_obj1):
        # print (x)
        if x[0]==0:
            level_num_list[0][1]+=x[1]
        if x[0]==1:
            level_num_list[1][1]+=x[1]
        if x[0]==2:
            level_num_list[2][1]+=x[1]
        if x[0]==3:
            level_num_list[3][1]+=x[1]
    for x in list(tlog_obj1):
        # print (x)
        if x[0]==0:
            level_num_list[0][1]+=x[1]
        if x[0]==1:
            level_num_list[1][1]+=x[1]
        if x[0]==2:
            level_num_list[2][1]+=x[1]
        if x[0]==3:
            level_num_list[3][1]+=x[1]

    data = {
        "num_list": num_list,
        "type_num":type_num[0:10],
        "web_num":web_num[0:10],
         "level_num":level_num_list[0:10],
         "all_count":all_count,
    }
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


@auth
def web_attack_trend(request):
    '''
    网站安全分析
    :param request:
    :return:
    '''
    id = request.POST.get("id")
    tweb_obj = TWebEvent.objects.all().filter(app_id=id)
    all_count=tweb_obj.count()
    # 统计今日、昨日、这周的攻击情况
    date = datetime.today().day
    # dt_s = datetime.now().date()  # 2018-7-15
    # dt_e = (dt_s - timedelta(num))  # 2018-7-08
    dt_s = datetime.now().date()
    time_list_d = OrderedDict()
    time_list_y = OrderedDict()
    time_list_w = OrderedDict()
    num_list = {}
    num=0
    # dt_s=dt_s+timedelta(1)
    for x in range(25):
        time_list_d[str(x).zfill(2) + ":00"] = 0
        time_list_y[str(x).zfill(2) + ":00"] = 0
        time_list_w[str(x).zfill(2) + ":00"] = 0
    for d in range(3):
        dt_s = datetime.now().date()
        if(num==0):
            dt_s = (dt_s + timedelta(1))
            dt_e = (dt_s - timedelta(1))
        if(num==1):
            dt_s = dt_s
            dt_e = (dt_s - timedelta(1))
        if (num==2):
            dt_s = (dt_s + timedelta(1))
            dt_e = (dt_s - timedelta(7))

        tweb_obj1 = tweb_obj.filter(event_time__range=(dt_e, dt_s)).extra(
            select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d %%H')"}) \
            .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')

        union_obj = tweb_obj1

        if num == 0:
            for x in union_obj:
                time1 = x['event_time'].split(" ")[1] + ":00"
                time_list_d[time1] += x['num']
            num_list['tday'] = time_list_d
        if num == 1:
            for x in union_obj:
                time1 = x['event_time'].split(" ")[1] + ":00"
                time_list_y[time1] += x['num']
            num_list['yday'] = time_list_y
        if num == 2:
            for x in union_obj:
                time1 = x['event_time'].split(" ")[1] + ":00"
                time_list_w[time1] += x['num']
            num_list['week'] = time_list_w
        num+=1
    # 攻击类型类型及数目
    # attack_source = attack.values_list('attack_source').annotate(number=Count('attack_source')).order_by('-number')
    tweb_obj_type_num=tweb_obj.values_list("event_name").annotate(number=Count('event_name')).order_by('-number')


    # 攻击类型分析及被攻击网站列表
    tweb_obj_web_num=tweb_obj.values_list("target").annotate(number=Count('target')).order_by('-number')
    # 攻击严重等级饼状图
    tweb_obj_level_num=tweb_obj.values_list("threat_level").annotate(number=Count('threat_level')).order_by("-number")
    level_num=[]
    for x in list(tweb_obj_level_num):
        if x[0]==0:
            level_num.append(["严重",x[1]])
        if x[0]==1:
            level_num.append(["高危",x[1]])
        if x[0]==2:
            level_num.append(["中危",x[1]])
        if x[0]==3:
            level_num.append(["信息",x[1]])

    data = {
        "num_list": num_list,
        "type_num":list(tweb_obj_type_num)[0:10],
        "web_num":list(tweb_obj_web_num)[0:10],
        "level_num":level_num[0:10],
        "all_count":all_count,
    }
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


@auth
def query_threat_level(request):
    data = {}
    web_attack = TWebEvent.objects.all()
    log_attack = TLogAnalysisd.objects.all().filter(event_id=2010)

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计风险等级
    web_threat_level_list = web_attack.filter(**filter_condition).values_list('threat_level').annotate(
        aaa=Count('threat_level'))
    log_threat_level_list = log_attack.filter(**filter_condition).values_list('threat_level').annotate(
        aaa=Count('threat_level'))
    threat_level_dict = {}
    for item in web_threat_level_list:
        threat_level_dict[item[0]] =int(item[1])
    for item in log_threat_level_list:
        threat_level_dict[item[0]] +=int(item[1])
    data['threat_level_dict'] = threat_level_dict
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


@auth
def query_attack_source(request):
    # 0代表世界 1代表中国
    flag = request.POST.get("flag")
    flag = int(flag)
    data = {}
    web_attack = TWebEvent.objects.all()
    log_attack = TLogAnalysisd.objects.all().filter(event_id=2010)

    filter_condition = {}
    result = None
    if not request.session['superuser']:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计attack_source

    web_attrack_source = web_attack.filter(**filter_condition).values_list('attack_source').annotate(Count('attack_source'))
    log_attrack_source = log_attack.filter(**filter_condition).values_list('dstip').annotate(Count('dstip'))

    attrack_source=list(web_attrack_source)+(list(log_attrack_source))
    attrack_source = sorted(attrack_source, key=lambda item: item[1], reverse=True)
    # 统计前10条记录
    attrack_source_dic = {}
    for x in attrack_source[:12]:
        attrack_source_dic[str(x[0])] = x[1]
    attrack_source_dic = sorted(attrack_source_dic.items(), key=lambda item: item[1], reverse=True)

    gi = geoip2.database.Reader('data/geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
    attack_source_map = {}

    for item in attrack_source:
        response = None
        try:
            response = gi.city(item[0])
        except Exception as e:
            continue
        result = []
        try:
            if flag == 1 and response.country.names['zh-CN'] not in ['中国', '香港', '澳门', '台湾']:
                continue
        except Exception as e:
            if flag == 0:
                attack_source_map[item[0]] = [response.location.longitude, response.location.latitude, item[1]]
                continue
        try:
            result.append(response.subdivisions.most_specific.names['zh-CN'])
        except Exception as e:
            pass
        try:
            result.append(response.city.names['zh-CN'])
        except Exception as e:
            pass

        y = item[0] + ' ' + ' '.join(result)
        attack_source_map[y] = [response.location.longitude, response.location.latitude, item[1]]

    data['attrack_source_dic'] = attrack_source_dic
    data['attack_source_map'] = attack_source_map
    # print(attack_source_map)
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


@auth
def query_attack_times(request):
    data = {}
    filter_condition = {}
    if not request.session['superuser']:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计前num天的攻击次数，攻击趋势分析
    num = 30
    dt_s = datetime.now().date() + timedelta(1) # 2018-7-15
    dt_e = (dt_s - timedelta(num))  # 2018-7-08

    num = dt_s-dt_e
    tobj = TWebEvent.objects.all()
    web_tobj = TWebEvent.objects.all()
    log_tobj = TLogAnalysisd.objects.all()
    tobj=web_tobj.union(log_tobj)
    web_time_num = web_tobj.filter(event_time__range=(dt_e, dt_s),**filter_condition).extra(
        select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d')"}) \
        .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')
    log_time_num = log_tobj.filter(event_id=2010,event_time__range=(dt_e, dt_s),**filter_condition).extra(
        select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d')"}) \
        .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')

    log_time_num=list(log_time_num)
    attack_time_dic_list=[]
    for x in web_time_num:
        attack_time_dic_list.append((x['event_time'],x['num']))
    attack_time_dic_list1 = []
    # dt_s = (dt_e - timedelta(num))  # 2018-7-08
    for x in range(num.days):
        time1 = (dt_s - timedelta(num.days - x)).strftime("%Y-%m-%d")
        if attack_time_dic_list and attack_time_dic_list[0][0] == time1:
            attack_time_dic_list1.append([time1, attack_time_dic_list[0][1]])
            attack_time_dic_list.pop(0)
        else:
            attack_time_dic_list1.append([time1, 0])
    for x in attack_time_dic_list1:
        if log_time_num and  x[0]==log_time_num[0]['event_time']:
            x[1]+=log_time_num[0]['num']
            log_time_num.pop(0)

    attack_time_dic_list1.reverse()
    data['attrack_time_dic'] = attack_time_dic_list1
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


@auth
def query_attack_type(request):
    data = {}
    web_attack = TWebEvent.objects.all()
    log_attack = TLogAnalysisd.objects.all().filter(event_id=2010)

    filter_condition = {}
    if not request.session['superuser']:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    # 统计攻击事件
    attack_type = {}
    result = TEventKnowledge.objects.all()
    for x in result:
        attack_type[str(x.event_id)] = x.event_name
    num = 12
    web_attrack_times = web_attack.filter(~Q(event_id__in=[0, 999]), **filter_condition).values_list('event_id').annotate(
        Count('event_id'))
    log_attrack_times = log_attack.filter(~Q(event_id__in=[0, 999]), **filter_condition).values_list('event_id').annotate(
        Count('event_id'))
    attrack_times1=list(web_attrack_times)+list(log_attrack_times)
    attrack_times1 = sorted(attrack_times1, key=lambda item: item[1], reverse=True)
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
    web_attack = TWebEvent.objects.filter(event_id__gt=999)
    web_attack = web_attack.values("agent_id","event_id","event_time","plugin_message","attack_source")
    log_attack = TLogAnalysisd.objects.values("agent_id","event_id","event_time","unused","dstip").filter(event_id=2010)

    filter_condition = {}
    if not request.session['superuser']:
        username = request.session['username']
        result = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in result]
        filter_condition['agent_id__in'] = agent_ids

    attack_type = {}
    result = TEventKnowledge.objects.all()
    for x in result:
        attack_type[str(x.event_id)] = x.event_name

    recent_warning_list = []
    attack=web_attack.union(log_attack)
    # attack=log_attack
    # result = attack.filter(~Q(event_id__in=[0,999]), **filter_condition).order_by('-event_time')
    result = attack.filter(**filter_condition).order_by('-event_time')

    for x in result[:10]:
        x['event_time'] = x['event_time'].strftime("%Y-%m-%d %H:%M:%S")
        x['event_id'] = attack_type[str(x['event_id'])]
        if x['plugin_message']:
            x['plugin_message'] = x['plugin_message'].replace('<', '&lt').replace('>', '&gt')
            x['plugin_message'] = x['plugin_message'].replace('"', '&quot;')

        else:
            x['plugin_message']="SSH远程暴力登录"
        if hasattr(x,u'dstip'):
            x['attack_source']=x['dstip']

        recent_warning_list.append(x)
    recent_warning = {"data": recent_warning_list}

    data['attrack_recent_warning'] = recent_warning
    data = json.dumps(data)

    return HttpResponse(data, content_type='application/json')


def plugins_manage(request):
    id = request.POST.get("id")
    result = TConfig.objects.all().filter(agent_id=id)
    data1 = {}
    for x in result:
        data1 = model_to_dict(x)
        data1['config_time']=data1['config_time'].strftime("%Y-%m-%d %H:%M:%S")
    data = data1
    data = json.dumps(data)


    return HttpResponse(data, content_type='application/json')


def plugins_update(request):

    # ("进入 plugins_update")
    id = request.POST.get('id')
    algo = request.POST.get('algo')
    http = request.POST.get('http')
    glob = request.POST.get('glob')

    plugin = TConfig.objects.get(agent_id=id)
    plugin.algorithm_config = algo
    plugin.httpProtectConfig = http
    plugin.globalConfig = glob
    timeArray = time.localtime()
    otherStyleTime = time.strftime("%Y%m%d-%H%M%S", timeArray)

    plugin.plugin_version = otherStyleTime
    plugin.save()

    data = {"success": "ok"}
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')

def black_white_list(request):
    '''
    黑白名单列表
    :param request:
    :return:
    '''
    agent_id = request.POST.get('agent_id')
    config = TConfig.objects.get(agent_id=agent_id)
    b_w_list=config.config
    black_list=json.loads(b_w_list,encoding="utf-8")['ip.blacklist'].split(",")
    white_list=json.loads(b_w_list,encoding="utf-8")['ip.whitelist'].split(",")
    if "" in black_list:
        black_list.remove("")
    if "" in white_list:
        white_list.remove("")
    data = {"black_list": list(set(black_list)) ,"white_list":list(set(white_list))}
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')


def black_white_list_update(request):

    agent_id = request.POST.get('agent_id')
    white_list = request.POST.get('white_list')
    black_list = request.POST.get('black_list')
    white_list=",".join(eval(white_list))
    black_list=",".join(eval(black_list))
    w_b_list={"ip.blacklist".encode(encoding="utf-8"):black_list.encode(encoding="utf-8"),"ip.whitelist".encode(encoding="utf-8"):white_list.encode(encoding="utf-8")}
    # print (w_b_list)
    config = TConfig.objects.get(agent_id=agent_id)
    config.config_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    config.config=json.dumps(w_b_list)
    config.save()
    data = {}
    data = json.dumps(data)
    return HttpResponse(data, content_type='application/json')

@auth
def view_report(request):
    # 关于攻击时间的过滤
    attack_time_range = request.POST.get("attack_time")
    dt_e = datetime.now().date()  # 2018-7-15
    dt_s = (dt_e - timedelta(30))  # 2018-7-08
    if attack_time_range != "" and attack_time_range != None:
        dt_s = datetime.strptime(attack_time_range.split(" ~ ")[0], "%Y-%m-%d")
        dt_e = datetime.strptime(attack_time_range.split(" ~ ")[1], "%Y-%m-%d")+timedelta(1)

    num = dt_e - dt_s
    attack_time_range = TAttackEvent.objects.filter(event_time__range=(dt_s, dt_e))
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
    attack_level = attack.values_list('threat_level').annotate(number=Count('threat_level'))
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
    tobj=   TWebEvent.objects.all()
    time_num = tobj.filter(event_time__range=(dt_s, dt_e)).extra(
        select={"event_time": "DATE_FORMAT( event_time, '%%Y-%%m-%%d')"}) \
        .values('event_time').annotate(num=Count('event_time')).values('event_time', 'num').order_by('event_time')
    attack_time_dic_list=[]
    for x in time_num:
        attack_time_dic_list.append((x['event_time'],x['num']))
    attack_time_dic_list1 = []
    # dt_s = (dt_e - timedelta(num))  # 2018-7-08
    for x in range(num.days):
        time1 = (dt_e - timedelta(num.days - x)).strftime("%Y-%m-%d")
        if attack_time_dic_list and attack_time_dic_list[0][0] == time1:
            attack_time_dic_list1.append([time1, attack_time_dic_list[0][1]])
            attack_time_dic_list.pop(0)
        else:
            attack_time_dic_list1.append([time1, 0])
    attack_time_dic_list = attack_time_dic_list1


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
        address = ip_to_address(y[0])
        y.append(address)
        attack_server_ip_list.append(y)
    # 事件类型统计
    attack_type = {}
    attack_type_list = []
    result = TEventKnowledge.objects.all()
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



def baseline(request):
    # 基线检查项字典
    baseline_dir={}
    for x in TBaselineKnowledge.objects.all():
        baseline_dir[str(x.check_item_id)]=model_to_dict(x)

    id=request.POST.get("agent_id")
    result = TBaselineCheck.objects.all().filter(agent_id=id).first()
    online=THostAgents.objects.get(agent_id=id).online
    # print ("baseline ",online)
    data={}

    if  result:
        data = model_to_dict(result)
        if data.get('last_check_time',None):
            date_now=datetime.now()
            data['date_now']=date_now.strftime("%Y-%m-%d %H:%M:%S")
            # print (date_now)
            time_span=(date_now-data['last_check_time'])
            # print (time_span)
            # print (time_span.total_seconds())
            if time_span.days < 0:
                data['last_day'] = "1分钟之前"
            elif time_span.days >= 1:
                data['last_day']=str(time_span.days)+"天之前"
            elif time_span.total_seconds()/3600 >= 1:
                data['last_day']=str(int(time_span.total_seconds()/3600))+"小时之前"
            elif time_span.total_seconds()/60 >= 1:
                data['last_day']=str(int(time_span.total_seconds()/60 ))+"分钟之前"
            else:
                data['last_day']="1分钟之前"
        if data['last_check_time']:
            data['last_check_time']=data['last_check_time'].strftime("%Y-%m-%d %H:%M:%S")
        else:
            data['last_check_time'] = ""


        if(data['result']):
            data['result']=json.loads( data['result'])
            # print (data['result'])
            # print (json.dumps(data['result']['system_check']['result'],ensure_ascii=False,encoding='utf-8'))
            # print (json.dumps(baseline_dir,ensure_ascii=False,encoding='utf-8'))


            for x in data['result']['system_check']['result']:
                for y in data['result']['system_check']['result'][x]:
                    try:
                        y['name']=baseline_dir[str(y['id'])]['check_item_name']
                        y['suggest']=baseline_dir[str(y['id'])]['check_suggest']
                        if not y['suggest']:
                            y['suggest']="暂无"
                    except Exception, e:
                        print e

    data['online']=online

    # print (baseline_dir)
    # print (json.dumps(data,ensure_ascii=False,encoding='utf-8'))
    return HttpResponse(json.dumps(data,ensure_ascii=False,encoding='utf-8'), content_type='application/json')

def baseline_check(request):
    id=request.POST.get("agent_id")
    data={}
    result = TBaselineCheck.objects.all().filter(agent_id=id).first()
    if result:
        dt=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        online=THostAgents.objects.get(agent_id=id).online

        if  online==1:
            if (result.check_status==0 or result.check_status==3):
                result.check_status=1
                result.save()
            data = {"success":"ok"}
        if online==0:
            data = {"success":"error"}
        # print (online)
    return HttpResponse(json.dumps(data), content_type='application/json')

def baseline_status(request):
    id=request.POST.get("agent_id")
    result = TBaselineCheck.objects.all().get(agent_id=id)
    data = {}
    data['success']=result.check_status

    return HttpResponse(json.dumps(data), content_type='application/json')

def user_query(request):
    '''
    查询用户
    :param request:
    :return:
    '''
    global SENSOR_TYPE
    # 当前页码数
    page = request.POST.get("page")
    page = int(page)
    username = request.session['username']

    # 每页显示多少个数据
    page_size = 15
    user = TUsers.objects.all().filter(username=username).first()
    if user.superuser==1:
        result=TUsers.objects.all().order_by('-superuser')
        max_size = (result.count() + page_size - 1) / page_size
    else:
        result=[user]
        max_size = 1
    # 最大分页数

    if max_size == 0:
        max_size = 1
    if page > max_size:
        page = max_size
    user_list = []

    for x in result[(page - 1) * page_size:(page) * page_size]:
        y = model_to_dict(x)
        # y = json.dumps(y)
        y['password']=""
        if not y['phone']:
            y['phone']=""
        if not y['email']:
            y['email']=""
        if y['superuser']==1:
            y['superuser']="管理员"
        else:
            y['superuser']="普通用户"
        user_list.append(y)

    data = {
        "is_superuser":user.superuser,
        "user": user_list,
        "max_size": max_size,
        "page": page,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')

def user_query_one(request):
    '''
    查询用户
    :param request:
    :return:
    '''
    global SENSOR_TYPE
    # 当前页码数
    username = request.session['username']

    user = TUsers.objects.all().filter(username=username).first()
    y = model_to_dict(user)
    y['password']=""
    if not y['phone']:
        y['phone']=""
    if not y['email']:
        y['email']=""
    if y['superuser']==1:
        y['superuser']="管理员"
    else:
        y['superuser']="普通用户"


    data = {
        "is_superuser":user.superuser,
        "user": y,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')

def user_update(request):
    '''
    用户更新
    :param request:
    :return:
    '''
    global SENSOR_TYPE
    # 当前页码数
    phone = request.POST.get("phone")
    email = request.POST.get("email")
    username = request.session['username']
    user = TUsers.objects.all().filter(username=username).first()
    user.phone=phone
    user.email=email
    user.save()
    data = {
        "success":"ok",
    }
    return HttpResponse(json.dumps(data), content_type='application/json')

def user_update_pwd(request):
    username = request.session['username']
    old_password = request.POST.get("old_password")
    new_password = request.POST.get("new_password")
    m2 = hashlib.md5()
    m2.update(old_password)
    u = TUsers.objects.filter(username=username).first()
    msg=""
    if u.password == m2.hexdigest():
        new_m2=hashlib.md5()
        new_m2.update(new_password)
        u.password=new_m2.hexdigest()
        u.save()
        msg="修改成功"
    else:
        msg="旧密码错误"
    data = {
        "msg":msg,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')

def user_add(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    obj1=TUsers.objects.all().filter(username=username)
    if obj1.exists():
        msg="用户已经存在"
    else:
        m2 = hashlib.md5()
        m2.update(password)
        password=m2.hexdigest()
        obj=TUsers(username=username,password=password,superuser=0)
        obj.save()
        msg="添加成功"
    data = {
        "msg":msg,
    }
    return HttpResponse(json.dumps(data), content_type='application/json')
