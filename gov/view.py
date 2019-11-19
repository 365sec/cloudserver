import json
import time

from django.http import HttpResponse, response, StreamingHttpResponse
from django.shortcuts import render
from settings import *
from t.models import agents
from django.http import FileResponse

def agent_click(request):
    java_agent_download_url = "http://" + CLOUD_SERVER + "/download?filepath=static/package/" + DOWNLOAD_LIST['java_agent']
    iis_agent_download_url = "http://" + CLOUD_SERVER + "/download?filepath=static/package/" + DOWNLOAD_LIST['iis_agent']
    req_data=request.POST
    data={}
    data["wget"]=""
    data["guid"]=""
    data["download_url"]=""
    if req_data['agent']=='java':
        data['agent_server'] = AGENT_SERVER
        data["wget"]= java_agent_download_url
        data["guid"]=""
        data["download_url"]= java_agent_download_url
    elif req_data['agent']=='iis':
        data['agent_server'] = AGENT_SERVER
        data["wget"]=iis_agent_download_url
        data["guid"]=""
        data["download_url"]=iis_agent_download_url

    return HttpResponse(json.dumps(data),content_type='application/json')

def agent_download(request):
    print ("agent_download")
    if request.method == 'GET':
        FilePath = request.GET['filepath']
        FileName = str(FilePath).split('/')[-1]
        '''
        response = StreamingHttpResponse(file_iterator(FilePath))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename=%s' % FileName
        '''
        file = open(FilePath, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename=%s' % FileName

        return response
        # print FilePath
    else:
        return HttpResponse('method must be get')


def file_iterator(file_name, chunk_size=1024):
    with open(file_name) as f:
        while True:
            c = f.read(chunk_size)
            if c:
                yield c
            else:
                break