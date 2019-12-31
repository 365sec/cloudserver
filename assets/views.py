# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime
import math
import json
import re

import geoip2
from django.db.models import Q
from django.utils.timezone import now, timedelta
from django.db.models.aggregates import Count
from django.db import connection

from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render

from assets.models import TAssetsPort
from assets.models import TAssetsActiveNetwork
from assets.models import TAssetsProcess
from assets.models import TAssetsMonitor
from t.models import THostAgents


def ip_to_address(ip):
    # 将ip转换成对应的中文地点

    str = ip.split(".")[0]
    y = ''
    if str == "172" or str == "192" or str == "10":
        y = "局域网"
    elif str == "127" or str == "" or str == "::1":
        y = ""
    else:
        result = []
        try:
            gi = geoip2.database.Reader('data/geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
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
    return y



# strftime("%Y-%m-%d %H:%M:%S")

def get_host_name_dir():
    hostname_dir={}
    rows_to_search=[]
    for x in THostAgents.objects.all().values_list("agent_id","host_name","internal_ip","extranet_ip","os"):
        try:
            if x[2]=="" or x[2] == None:
                hostname_dir[str(x[0])]=[x[1],x[3],x[4]]
            else:
                hostname_dir[str(x[0])]=[x[1],x[2],x[4]]
            rows_to_search.append(x[0])
        except Exception as e:
            print(e)
            print("没有找到 host_agent",str(x[0]))

    Q_filter=Q()
    for value in rows_to_search:
        Q_filter|=Q(**{"{}__iregex".format("agent_id"):value})
    return hostname_dir,Q_filter



# 资产查询活动网络信息
def assets_query_network(request):

    page = request.POST.get("page")
    netconnecting_host =request.POST.get("netconnecting_host")
    netconnecting_name =request.POST.get("netconnecting_name")
    netconnecting_port =request.POST.get("netconnecting_port")
    netconnecting_remote_addr =request.POST.get("netconnecting_remote_addr")
    netconnecting_remote_port =request.POST.get("netconnecting_remote_port")


    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsActiveNetwork.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsActiveNetwork.objects.all().filter(**filter_condition).filter(Q_filter)

    # obj = TAssetsActiveNetwork.objects.all()#.filter(Q_filter)
    obj=obj.filter(agent_id=netconnecting_host) if netconnecting_host and netconnecting_host!="" else obj
    obj=obj.filter(proname__icontains=netconnecting_name) if netconnecting_name and netconnecting_name!="" else obj
    obj=obj.filter(local_port=netconnecting_port) if netconnecting_port and netconnecting_port!="" else obj
    obj=obj.filter(remote_addr=netconnecting_remote_addr) if netconnecting_remote_addr and netconnecting_remote_addr!="" else obj
    obj=obj.filter(remote_port=netconnecting_remote_port) if netconnecting_remote_port and netconnecting_remote_port!="" else obj


    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 10  # 每页显示数目
    # max_size = math.ceil(obj.count() / num)    # 最大分页数
    max_size = int( math.ceil(float(len(obj))  / num))    # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1
    y = []
    for x in obj[page * num:(page + 1) * num]:
        temp=model_to_dict(x)
        temp['host_name']=hostname_dir[temp['agent_id']][0]
        temp['host_ip']=hostname_dir[temp['agent_id']][1]
        temp['os'] = hostname_dir[temp['agent_id']][2]
        try :
            addr=ip_to_address(temp['remote_addr'])

            if addr:
                #temp['remote_addr']=temp['remote_addr']
                temp['remote_location'] = addr
            else:
                temp['remote_location'] = ''

        except Exception as e:
            print(e)
        # print(common.ip_to_address(temp['remote_addr']))
        y.append(temp)

    data = {}
    data['data'] = y
    data['hostname'] = hostname_dir
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size
    # assets_query_network_chart(request)
    return HttpResponse(json.dumps(data), content_type='application/json')


def assets_query_network_chart(request):

    obj=TAssetsActiveNetwork.objects.all()#.filter(Q_filter)
    obj = obj.values_list("remote_addr","remote_port").annotate(number=Count("remote_addr")).order_by("-number")

    for x in obj:
        print(x)
    y = []

    data = {}
    data['data'] = y

    data['msg'] = "success"

    return HttpResponse(json.dumps(data), content_type='application/json')


def assets_monitor_info_last(request):
    agent_id=request.POST.get("agent_id")
    info = TAssetsMonitor.objects.all().filter(agent_id=agent_id).last()
    # online = THostAgents.objects.all().filter(agent_id=agent_id).last()

    if not info:
        data = {}
        data['msg'] = "没有找到agent_id"
        data['code'] = 404
        data['data'] = {}
        return HttpResponse(json.dumps(data), content_type='application/json')
    # print(info)
    # print(model_to_dict(info))
    info=model_to_dict(info)

    if info['check_time']:
        info['check_time']= info['check_time'].strftime("%Y-%m-%d %H:%M:%S")
        info['disk_used']= json.loads(info['disk_used'])
        data = {}
        data['msg'] = "success"
        data['code'] = 200
        data['data'] = info
    else:
        data = {}
        data['msg'] = "error"
        data['code'] = 404
        data['data'] = {}
    return HttpResponse(json.dumps(data), content_type='application/json')


def assets_monitor_info_query(request):
    agent_id=request.POST.get("agent_id")
    query_type=request.POST.get("type")
    query_time=request.POST.get("time")
    now = datetime.datetime.now()
    data = {}
    if query_type not in ["cpu","network","disk"]:
        data['msg'] = "error"
        data['code'] = 400
        return HttpResponse(json.dumps(data), content_type='application/json')

    info = TAssetsMonitor.objects.all().filter(agent_id=agent_id)
    date=now + timedelta(days=-1)
    info=info.filter(check_time__gte=date)

    result_list=[]
    for temp in info:
        y=model_to_dict(temp)
        y['check_time']=y['check_time'].strftime("%Y-%m-%d %H:%M:%S")
        result_list.append(y)
    # info['check_time']= info['check_time'].strftime("%Y-%m-%d %H:%M:%S")

    data['msg'] = "success"
    data['code'] = 200
    data['data'] = result_list

    return HttpResponse(json.dumps(data), content_type='application/json')

def assets_process_query(request):

    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsProcess.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsProcess.objects.all().filter(**filter_condition).filter(Q_filter)

    # obj = TAssetsProcess.objects.all()#.filter(Q_filter)
    page = request.POST.get("page")
    process_host = request.POST.get("process_host")
    process_name = request.POST.get("process_name")
    process_command = request.POST.get("process_command")
    process_user = request.POST.get("process_user")
    process_level = request.POST.get("process_level")
    if process_host and  process_host!="":
        obj=obj.filter(agent_id=process_host)
    if process_name and  process_name!="":
        obj=obj.filter(name=process_name)
    if process_command and  process_command!="":
        obj=obj.filter(command__icontains=process_command)
    if process_user and  process_user!="":
        obj=obj.filter(user__icontains=process_user)
    if process_level and  process_level!="":
        obj=obj.filter(level=process_level)

    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 15  # 每页显示数目
    max_size = int( math.ceil(float(len(obj))  / num))    # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1


    y = []
    # print(hostname_dir)
    for x in obj[page * num:(page + 1) * num]:
        temp = model_to_dict(x)
        temp['level'] = "是" if temp['level'] == 1 else "否"
        temp['host_name']=hostname_dir[temp['agent_id']][0]
        temp['host_ip']=hostname_dir[temp['agent_id']][1]
        temp['os']=hostname_dir[temp['agent_id']][2]
        # print(temp)
        y.append(temp)
    data = {}
    data['data'] = y
    data['code'] = 200
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size
    data['hostname'] = hostname_dir

    return HttpResponse(json.dumps(data), content_type='application/json')


def assets_process_query_num(request):

    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsProcess.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsProcess.objects.all().filter(**filter_condition).filter(Q_filter)
    # obj = TAssetsProcess.objects#.filter(Q_filter)
    page = request.POST.get("page")
    process_host = request.POST.get("process_host")
    process_name = request.POST.get("process_name")
    process_command = request.POST.get("process_command")
    process_user = request.POST.get("process_user")
    process_level = request.POST.get("process_level")
    if process_host and  process_host!="":
        obj=obj.filter(agent_id=process_host)
    if process_name and  process_name!="":
        obj=obj.filter(name__icontains=process_name)
    if process_command and  process_command!="":
        obj=obj.filter(command__icontains=process_command)
    if process_user and  process_user!="":
        obj=obj.filter(user__icontains=process_user)
    if process_level and  process_level!="":
        obj=obj.filter(level=process_level)
    # process_list=[]
    # process_list=obj.values_list("name").annotate(number=Count("name")).order_by("-number")
    # sql='SELECT name,  COUNT(DISTINCT name,agent_id) as num FROM t_assets_process GROUP BY name '
    process_list=obj.values_list("name").annotate(number=Count("agent_id",distinct=True))
    # print (process_list.query)
    # print (aaa)
    # cursor=connection.cursor()
    # cursor.execute(sql)
    # raw_all=cursor.fetchall()
    # print (raw_all)
    # aaa=aaa.annotate(number=Count("agent_id")).distinct()
    process_list=list(process_list)
    process_list = sorted(process_list, key=lambda item: item[1], reverse=True)
    # print(process_list)
    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 15  # 每页显示数目

    max_size = int( math.ceil(float(len(process_list))  / num))     # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1


    y = []
    # print(hostname_dir)
    for x in process_list[page * num:(page + 1) * num]:
        y.append(x)
    data = {}
    # data['data'] = y
    data['process_list'] = y
    data['code'] = 200
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size
    data['hostname'] = hostname_dir

    return HttpResponse(json.dumps(data), content_type='application/json')

def assets_process_chart(request):


    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsProcess.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsProcess.objects.all().filter(**filter_condition).filter(Q_filter)
    # obj = TAssetsProcess.objects.all()#.filter(Q_filter)
    process_num=obj.values_list("name").annotate(number=Count("name")).order_by("-number")
    agent_process_num=obj.values_list("agent_id").annotate(number=Count("name",distinct=True)).order_by("-number")

    # print(process_num.query)
    # print(agent_process_num.query)
    agent_process_num_list=[]
    for x in list(agent_process_num)[0:10]:
        x=list(x)
        x[0]=hostname_dir[x[0]][0]+"("+hostname_dir[x[0]][1]+")"
        agent_process_num_list.append(x)
    data = {}
    data['data'] = {}
    data['code'] = 200
    data['msg'] = "success"
    data['data']['process_num']=list(process_num[0:10])
    data['data']['agent_process_num']=agent_process_num_list


    return HttpResponse(json.dumps(data), content_type='application/json')

def assets_port_query(request):



    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsPort.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsPort.objects.all().filter(**filter_condition).filter(Q_filter)
    # obj = TAssetsPort.objects.all()#.filter(Q_filter)
    page = request.POST.get("page")
    port_host = request.POST.get("port_host")
    port_local_port = request.POST.get("port_local_port")
    port_proname = request.POST.get("port_proname")
    # print(request.POST)
    if port_host and  port_host!="":
        obj=obj.filter(agent_id=port_host)
    if port_local_port and  port_local_port!="":
        obj=obj.filter(local_port=port_local_port)
    if port_proname and  port_proname!="":
        obj=obj.filter(proname__icontains=port_proname)

    # print(obj.filter(host__online=1))
    # test = THostAgents.objects.get(agent_id='0b0207d25523f8ff').tassetsport_set.all();
    # print(test.query)
    # print(obj.query)
    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 10  # 每页显示数目

    max_size = int( math.ceil(float(len(obj)) / num))     # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1


    y = []
    for x in obj[page * num:(page + 1) * num]:
        temp = model_to_dict(x)
        temp['host_name']=hostname_dir[temp['agent_id']][0]
        temp['host_ip']=hostname_dir[temp['agent_id']][1]
        temp['process_name']=temp['proname']
        temp['os'] = hostname_dir[temp['agent_id']][2]
        y.append(temp)
    data = {}
    data['data'] = y
    data['code'] = 200
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size
    data['hostname'] = hostname_dir

    return HttpResponse(json.dumps(data), content_type='application/json')


def assets_port_query_num(request):

    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsPort.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsPort.objects.all().filter(**filter_condition).filter(Q_filter)

    # obj = TAssetsPort.objects.all()#.filter(Q_filter)
    page = request.POST.get("page")
    port_host = request.POST.get("port_host")
    port_proname = request.POST.get("port_proname")
    port_local_port = request.POST.get("port_local_port")
    # print(request.POST)

    if port_host and  port_host!="":
        obj=obj.filter(agent_id=port_host)
    if port_proname and  port_proname!="":
        obj=obj.filter(proname__icontains=port_proname)
    if port_local_port and  port_local_port!="":
        obj=obj.filter(local_port=port_local_port)

    # process_list=[]
    # process_list=obj.values_list("name").annotate(number=Count("name")).order_by("-number")
    # sql='SELECT name,  COUNT(DISTINCT name,agent_id) as num FROM t_assets_process GROUP BY name '
    port_list=obj.values_list("local_port").annotate(number=Count("agent_id",distinct=True))
    # print (aaa.query)
    # print (aaa)
    # cursor=connection.cursor()
    # cursor.execute(sql)
    # raw_all=cursor.fetchall()
    # print (raw_all)
    # aaa=aaa.annotate(number=Count("agent_id")).distinct()
    port_list=list(port_list)
    port_list = sorted(port_list, key=lambda item: item[1], reverse=True)
    # print(process_list)
    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 15  # 每页显示数目

    max_size = int( math.ceil(float(len(port_list))  / num))     # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1


    y = []
    # print(hostname_dir)
    for x in port_list[page * num:(page + 1) * num]:
        y.append(x)
    data = {}
    # data['data'] = y
    data['port_list'] = y
    data['code'] = 200
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size
    data['hostname'] = hostname_dir

    return HttpResponse(json.dumps(data), content_type='application/json')

def assets_port_chart(request):

    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir,Q_filter=get_host_name_dir()
    if request.session['superuser']:
        obj = TAssetsPort.objects.all().filter(Q_filter)
    else:
        username = request.session['username']
        filter_condition = {}
        obj = THostAgents.objects.filter(own_user=username)
        agent_ids = [x.agent_id for x in obj]
        filter_condition['agent_id__in'] = agent_ids
        obj = TAssetsPort.objects.all().filter(**filter_condition).filter(Q_filter)

    # obj = TAssetsPort.objects.all()#.filter(Q_filter)
    port_num=obj.values_list("local_port").annotate(number=Count("local_port")).order_by("-number")
    agent_port_num=obj.values_list("agent_id").annotate(number=Count("local_port",distinct=True)).order_by("-number")
    # process_list=obj.values_list("name").annotate(number=Count("agent_id",distinct=True))
    # print(agent_port_num.query)
    # for x in agent_port_num:
    #     print(x)
    agent_port_num_list=[]
    for x in list(agent_port_num)[0:10]:
        x=list(x)
        x[0]=hostname_dir[x[0]][0]+"("+hostname_dir[x[0]][1]+")"
        agent_port_num_list.append(x)
    data = {}
    data['data'] = {}
    data['code'] = 200
    data['msg'] = "success"
    data['data']['port_num']=list(port_num[0:10])
    data['data']['agent_port_num']=agent_port_num_list
    # data['page'] = page
    # data['max_size'] = max_size
    # data['hostname'] = hostname_dir

    return HttpResponse(json.dumps(data), content_type='application/json')

