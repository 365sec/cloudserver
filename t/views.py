# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import time
from collections import OrderedDict
from datetime import timedelta, datetime
from django.db.models import Max, Avg, F, Q, Count
from django.http import HttpResponse
from django.shortcuts import render
from django.forms.models import model_to_dict
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json
import math

# Create your views here.
from pymysql.constants.FIELD_TYPE import JSON

from t.models import agents
from t.models import attack_event
from t.models import event_knowledge

SENSOR_TYPE = {'10001':'Java Rasp探针','10002':'PHP Rasp探针', '20001':'IIS探针'}
INTERCEPT_STATUS = {'block':'拦截', 'log':'记录'}
THREAT_LEVEL = {0:'严重',1:'高危',2:'中危',3:'低危'}
def agent_query(request):
    global SENSOR_TYPE
    # 当前页码数
    page=request.POST.get("page")
    page=int(page)
    result= agents.objects.all()
    # 每页显示多少个数据
    page_size=10
    # 最大分页数
    max_size=(agents.objects.count()+page_size-1)/page_size
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

def sttack_trace_query(request):
    # 当前页码数

    #print (request.POST)

    page=request.POST.get("page")
    page=int(page)


    result= attack_event.objects.all().order_by('-event_time')
    #关于攻击类型的过滤
    attack_type=request.POST.get("attack_type")
    event_dic={}
    event_div_arr=[]
    for x in event_knowledge.objects.all():
        event_div_arr.append(x.event_name)
        event_dic[x.event_name]=x.event_id
    if attack_type!="" and attack_type!=None:
        #print (attack_type)
        #print (event_dic[attack_type])
        result=result.filter(event_id= event_dic[attack_type])
    #关于报警消息的过滤
    attack_msg=request.POST.get("attack_msg")

    if attack_msg!="" and attack_msg!=None:
        result= result.filter(plugin_message__icontains=attack_msg)
    #关于攻击时间的过滤

    attack_time=request.POST.get("attack_time")
    if attack_time!="" and attack_time!=None:
        start_time=attack_time.split(" ~ ")[0]
        end_time=attack_time.split(" ~ ")[1]
        result=result.filter(event_time__range=[start_time,end_time])

    max_lenth=result.count()
    # 每页显示多少个数据
    page_size=10
    # 最大分页数
    max_size = (result.count() + page_size - 1) / page_size
    if max_size==0:
        max_size=1
    if page>max_size:
        page=max_size
    stack_list=[]
    for x in result[(page-1)*page_size:(page)*page_size]:
        y=model_to_dict(x)
        y['event_time']=y['event_time'].strftime("%Y-%m-%d %H:%M:%S")
        y['intercept_state'] = INTERCEPT_STATUS.get(y['intercept_state'], '')
        y['threat_level'] = THREAT_LEVEL.get(y['threat_level'], '')
        try:
            y['attack_type']=event_knowledge.objects.get(event_id=y['event_id']).event_name
        except Exception, e:
            y['attack_type'] = ''
        y['plugin_message'] = y['plugin_message'].replace('<', '&lt').replace('>', '&gt')
        y['url'] = y['url'].replace('<', '&lt').replace('>', '&gt')
        y['body'] = y['body'].replace('<', '&lt').replace('>', '&gt')
        y['plugin_message'] = y['plugin_message'].replace('"', '&quot;')

        stack_list.append(y)

    data={
        "stack":stack_list,
       "max_size":max_size,
        "page":page,
        "attack_type":event_div_arr
    }

    data=json.dumps(data)
    return HttpResponse(data,content_type='application/json')



def overview_query(request):
    start1=time.clock()
    data={}
    attack=attack_event.objects
    end1=time.clock()

    attrack_ua=attack.values_list('user_agent').annotate( aaa=Count('user_agent'))

    end1=time.clock()
    attrack_ua_dic1=sorted(attrack_ua,key=lambda item:item[1], reverse=True)
    attrack_ua_dic={}
    end1=time.clock()
    for x in attrack_ua_dic1[:10]:
        if len(x[0])>20:
            temp=x[0]
        attrack_ua_dic[str(temp) ]=x[1]
    attrack_ua_dic=sorted(attrack_ua_dic.items(),key=lambda item:item[1], reverse=True)
    end1=time.clock()

    attrack_source=attack.values_list('attack_source').annotate(Count('attack_source'))
    attrack_source=sorted(attrack_source,key=lambda item:item[1], reverse=True)
    end1=time.clock()
    #test= attack.values_list('event_id')
    #test1=test.annotate(Count('attack_source'))
    #test2=test.annotate(Count('event_id'))
    # for x in test1:
    #     print x

    #近十天的数据字典
    attrack_source_dic={}
    for x in attrack_source[:10]:
        attrack_source_dic[str( x[0])]=x[1]

    attrack_source_dic=sorted(attrack_source_dic.items(),key=lambda item:item[1], reverse=True)
    # for x in attrack_source_dic:
    #     print (x)

    end1=time.clock()
    end1=time.clock()

    #天数
    num=10
    dt_s= datetime.now().date()  # 2018-7-15
    dt_e = (dt_s- timedelta(num))  # 2018-7-08
    attrack_time=attack.filter(event_time__range=[dt_e+timedelta(1),dt_s+timedelta(1)])
    end1=time.clock()
    attrack_time_dic=OrderedDict()
    end_data=datetime.now().date()
    for x in range(num):
        start_time=(end_data-timedelta(1))
        attrack_time_dic[str(end_data)]=attrack_time.filter(event_time__range=[start_time+timedelta(1),end_data+timedelta(1)]).count()
        end_data=(end_data-timedelta(1))
    attrack_time_dic_list=[]
    end1=time.clock()
    for x in attrack_time_dic:

        attrack_time_dic_list.append([x,attrack_time_dic[x]])

    # for x in attrack_time_dic:
    #     print (x)
    #     print (attrack_time_dic[x])

   # test=attack_event.objects.values_list('event_id','attack_source').annotate(Count('event_id'),Count('attack_source'))
    end1=time.clock()

    #攻击类型及次数
    attack_type={}
    result=event_knowledge.objects.all()

    for x in result:
        attack_type[str(x.event_id)]=x.event_name

    #获得各种类型一共攻击了多少次
    attrack_times=attack.values_list('event_id').annotate(Count('event_id'))
    attrack_times1=sorted(attrack_times,key=lambda item:item[1], reverse=True)
    attack_type1={}
    for x in attrack_times1:
        if x[0]==0:
            continue
        name = attack_type[str(x[0])]
        attack_type1[name]=x[1]
    attack_type1=sorted(attack_type1.items(),key=lambda item:item[1], reverse=True)

    #最近警告内容


    recent_warning_list=[]
    result= attack.order_by('-event_time')

    for x in result[:5]:
        if x.event_id==0:
            continue
        x.event_time=x.event_time.strftime("%Y-%m-%d %H:%M:%S")
        x.event_id=attack_type[str(x.event_id)]
        x.plugin_message = x.plugin_message.replace('<', '&lt').replace('>', '&gt')
        x.plugin_message = x.plugin_message.replace('"', '&quot;')
        print x
        temp=model_to_dict(x)

        recent_warning_list.append(temp)

    recent_warning={"data":recent_warning_list}


    data['attrack_ua_dic']=attrack_ua_dic
    data['attrack_source_dic']=attrack_source_dic
    data['attrack_time_dic']=attrack_time_dic_list
    data['attrack_type_times']=attack_type1
    data['attrack_recent_warning']=recent_warning
    data=json.dumps(data)
    end1=time.clock()
    return HttpResponse(data,content_type='application/json')
