# -*- coding: utf-8 -*-
from __future__ import unicode_literals

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

def stack_trace_query(request):
    # 当前页码数

    event=event_knowledge.objects.get(event_id=1000).event_name

    page=request.POST.get("page")
    page=int(page)

    result= attack_event.objects.all().order_by('-event_time')

    max_lenth=attack_event.objects.count()
    # 每页显示多少个数据
    page_size=10
    # 最大分页数
    max_size = (attack_event.objects.count() + page_size - 1) / page_size
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
        stack_list.append(y)

    data={
        "stack":stack_list,
       "max_size":max_size,
        "page":page,
    }

    data=json.dumps(data)
    return HttpResponse(data,content_type='application/json')



def overview_query(request):
    data={}

    attrack_ua=attack_event.objects.values_list('user_agent').annotate(Count('user_agent'))
    attrack_ua_dic={}
    for x in attrack_ua[:10]:
        if len(x[0])>20:

            #temp=x[0][:10]+'...'+x[0][-10:]
            temp=x[0]
        attrack_ua_dic[str(temp) ]=x[1]
    attrack_ua_dic=sorted(attrack_ua_dic.items(),key=lambda item:item[1], reverse=True)
    # for x in attrack_ua_dic:
    #     print (x)


    attrack_source=attack_event.objects.values_list('attack_source').annotate(Count('attack_source'))
    #近十天的数据字典
    attrack_source_dic={}
    for x in attrack_source[:10]:
        attrack_source_dic[str( x[0])]=x[1]

    attrack_source_dic=sorted(attrack_source_dic.items(),key=lambda item:item[1], reverse=True)
    for x in attrack_source_dic:
        print (x)


    #天数
    num=10
    dt_s= datetime.now().date()  # 2018-7-15
    dt_e = (dt_s- timedelta(num))  # 2018-7-08
    attrack_time=attack_event.objects.filter(event_time__range=[dt_e,dt_s])

    attrack_time_dic=OrderedDict()
    end_data=datetime.now().date()
    for x in range(num):
        start_time=(end_data-timedelta(1))
        attrack_time_dic[str(end_data)]=attrack_time.filter(event_time__range=[start_time,end_data]).count()
        end_data=(end_data-timedelta(1))
    attrack_time_dic_list=[]
    for x in attrack_time_dic:
        attrack_time_dic_list.append([x,attrack_time_dic[x]])

    # for x in attrack_time_dic:
    #     print (x)
    #     print (attrack_time_dic[x])



    #攻击类型及次数
    attack_type={}
    result=event_knowledge.objects.all()

    for x in result:
        attack_type[str(x.event_id)]=x.event_name

    #获得各种类型一共攻击了多少次
    attrack_times=attack_event.objects.values_list('event_id').annotate(Count('event_id'))

    attack_type1={}
    for x in attrack_times:
        if x[0]==0:
            continue
        name = attack_type[str(x[0])]
        attack_type1[name]=x[1]
    attack_type1=sorted(attack_type1.items(),key=lambda item:item[1], reverse=True)

    #最近警告内容

    recent_warning_list=[]
    result= attack_event.objects.all().order_by('-event_time')

    for x in result[:5]:
        if x.event_id==0:
            continue
        x.event_time=x.event_time.strftime("%Y-%m-%d %H:%M:%S")
        x.event_id=attack_type[str(x.event_id)]
        temp=model_to_dict(x)
        recent_warning_list.append(temp)

    recent_warning={"data":recent_warning_list}


    data['attrack_ua_dic']=attrack_ua_dic
    data['attrack_source_dic']=attrack_source_dic
    data['attrack_time_dic']=attrack_time_dic_list
    data['attrack_type_times']=attack_type1
    data['attrack_recent_warning']=recent_warning
    data=json.dumps(data)
    return HttpResponse(data,content_type='application/json')
