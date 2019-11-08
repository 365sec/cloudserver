# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render
from assets.models import  TAssets
from assets.models import  TAssetsPort

# strftime("%Y-%m-%d %H:%M:%S")
def app_query(request):
    aaa=TAssets.objects.all()
    for x in aaa:
        print(x.active_network)
        # print(model_to_dict(x))
    print(request.POST.get("page"))
    data={}
    data['msg']="666"

    return  HttpResponse(json.dumps(data), content_type='application/json')

def assets_query_port(request):
    obj=TAssetsPort.objects.all()
    page=request.POST.get("page")
    if not page:
        page = 0
    else:
        page = int(page)
    y=[]
    num = 10  #每页显示数目
    for x in obj[page*num:(page+1)*num]:
        y.append(model_to_dict(x))
    data={}
    data['data']=y
    data['msg']="success"

    return  HttpResponse(json.dumps(data), content_type='application/json')