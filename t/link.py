#coding: utf-8
import json
import time

from django.http import HttpResponse, response, StreamingHttpResponse
from django.shortcuts import render

from django.http import FileResponse
from common.data import CONF
from common.common import file_iterator
from t.models import THostAgents

"""

def agent_click(request):
    java_agent_download_url = "http://" + CONF.CLOUD_SERVER + "/download?filepath=static/download/" + CONF.JAVA_PACKAGE_URL
    iis_agent_download_url = "http://" + CONF.CLOUD_SERVER + "/download?filepath=static/package/" + CONF.IIS_PACKAGE_URL
    req_data=request.POST
    data={}
    data["wget"]=""
    data["guid"]=""
    data["download_url"]=""
    if req_data['agent']=='java':
        data['agent_server'] = CONF.AGENT_SERVER
        data["wget"]= java_agent_download_url
        data["guid"]=""
        data["download_url"]= java_agent_download_url
    elif req_data['agent']=='iis':
        data['agent_server'] = CONF.AGENT_SERVER
        data["wget"]=iis_agent_download_url
        data["guid"]=""
        data["download_url"]=iis_agent_download_url

    return HttpResponse(json.dumps(data),content_type='application/json')
"""

def download(request):
    print ("agent_download")
    if request.method == 'GET':
        FilePath = request.GET['filepath']
        FileName = str(FilePath).split('/')[-1]
        file = open(FilePath, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename=%s' % FileName

        return response
    else:
        return HttpResponse('method must be get')

def overview(request):
    return render(request, 'overview.html')

def attack(request):
    return render(request, 'attack.html')

# def agent(request):
#     return render(request, 'agent.html')

def countreport(request):
    return render(request, 'countreport.html')

def agent_download(request):
    win32_agent_download = "/static/download/" + CONF.WIN32_AGENT_URL
    linux64_agent_download = "http://" + request.get_host() + "/static/download/" + CONF.LINUX64_AGENT_URL
    win32_help="win32_help"
    linux_help="linux_help"
    help="help"
    context = {'win32_download_url': win32_agent_download,
               "linux64_download_url":linux64_agent_download,
               "win32_help":win32_help,
               "linux_help":linux_help,
               "help":help,
               }
    return render(request, 'download.html', context)

def win32_help(request):
    return render(request, 'help/win32_help.html', {})

def linux_help(request):
    return render(request, 'help/linux_help.html', {})

def help(request):
    return render(request, 'help/help.html', {})

def server_manage_detail(request):

    return render(request, 'server_manage_detail.html', {})

def website_manage_detail(request):
    return render(request, 'website_manage_detail.html', {})

def manage(request):
    return render(request, 'manage.html', {})

def user(request):
    return render(request, 'user.html', {})

def doc(request):
    print 'doc'
    return render(request, '_book/index.html', {})