
from django.http import HttpResponse, response, StreamingHttpResponse
from django.shortcuts import render

from django.http import FileResponse
from common.data import CONF
def app(request):
    return render(request, 'app.html', {})
def process(request):
    return render(request, 'process.html', {})
def netconnecting(request):
    return render(request, 'netconnecting.html', {})
def port(request):
    return render(request, 'port.html', {})