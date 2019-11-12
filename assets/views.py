# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime
import math
import json
import re
from django.utils.timezone import now, timedelta

from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render
from assets.models import TAssets
from assets.models import TAssetsPort
from assets.models import TAssetsActiveNetwork
from assets.models import TAssetsProcess
from assets.models import TAssetsMonitor



# strftime("%Y-%m-%d %H:%M:%S")
from t.models import THostAgents


def app_query(request):
    aaa = TAssets.objects.all()
    for x in aaa:
        print(x.active_network)
        # print(model_to_dict(x))
    print(request.POST.get("page"))
    data = {}
    data['msg'] = "666"

    return HttpResponse(json.dumps(data), content_type='application/json')


# 资产查询活动网络信息
def assets_query_network(request):
    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir={}
    for x in THostAgents.objects.all().values_list("agent_id","host_name","internal_ip","extranet_ip"):
        if x[2]=="" or x[2] == None:
            hostname_dir[str(x[0])]=[x[1],x[3]]
        else:
            hostname_dir[str(x[0])]=[x[1],x[2]]

    obj = TAssetsActiveNetwork.objects.all()

    page = request.POST.get("page")
    page = int(page) if page else 0

    if page < 0:
        page = 0
    num = 10  # 每页显示数目
    # max_size = math.ceil(obj.count() / num)    # 最大分页数
    max_size = int( math.ceil(len(obj) / num))    # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1
    y = []
    for x in obj[page * num:(page + 1) * num]:
        temp=model_to_dict(x)
        temp['host_name']=hostname_dir[temp['agent_id']][0]
        temp['host_ip']=hostname_dir[temp['agent_id']][1]
        y.append(temp)

    data = {}
    data['data'] = y
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size

    return HttpResponse(json.dumps(data), content_type='application/json')





def assets_monitor_info_last(request):
    agent_id=request.POST.get("agent_id")
    info = TAssetsMonitor.objects.all().filter(agent_id=agent_id).last()
    print(model_to_dict(info))
    info=model_to_dict(info)
    info['check_time']= info['check_time'].strftime("%Y-%m-%d %H:%M:%S")
    data = {}
    data['msg'] = "success"
    data['code'] = 200
    data['data'] = info

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
    obj = TAssetsProcess.objects.all()
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

    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 10  # 每页显示数目

    max_size = int( math.ceil(len(obj) / num))    # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1

    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir={}
    for x in THostAgents.objects.all().values_list("agent_id","host_name","internal_ip","extranet_ip"):
        if x[2]=="" or x[2] == None:
            hostname_dir[str(x[0])]=[x[1],x[3]]
        else:
            hostname_dir[str(x[0])]=[x[1],x[2]]
    y = []
    # print(hostname_dir)
    for x in obj[page * num:(page + 1) * num]:
        temp = model_to_dict(x)
        temp['level'] = "管理员" if temp['level'] == 1 else ""
        temp['host_name']=hostname_dir[temp['agent_id']][0]
        temp['host_ip']=hostname_dir[temp['agent_id']][1]
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

def assets_port_query(request):
    obj = TAssetsPort.objects.all()
    page = request.POST.get("page")
    port_host = request.POST.get("port_host")

    if port_host and  port_host!="":
        obj=obj.filter(agent_id=port_host)

    page = int(page) if page else 0
    if page < 0:
        page = 0
    num = 10  # 每页显示数目

    max_size = int( math.ceil(len(obj) / num))    # 最大分页数
    if max_size == 0:
        max_size = 1
    if page > max_size - 1:
        page = max_size - 1

    #获得agent_id 跟主机名称 ip 的dir
    hostname_dir={}
    for x in THostAgents.objects.all().values_list("agent_id","host_name","internal_ip","extranet_ip"):
        if x[2]=="" or x[2] == None:
            hostname_dir[str(x[0])]=[x[1],x[3]]
        else:
            hostname_dir[str(x[0])]=[x[1],x[2]]
    y = []
    print(hostname_dir)
    for x in obj[page * num:(page + 1) * num]:
        temp = model_to_dict(x)
        temp['host_name']=hostname_dir[temp['agent_id']][0]
        temp['host_ip']=hostname_dir[temp['agent_id']][1]
        temp['process_name']=temp['proname']
        y.append(temp)
    data = {}
    data['data'] = y
    data['code'] = 200
    data['msg'] = "success"
    data['page'] = page
    data['max_size'] = max_size
    data['hostname'] = hostname_dir

    return HttpResponse(json.dumps(data), content_type='application/json')