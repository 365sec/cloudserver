
from django.http import HttpResponse, response, StreamingHttpResponse
from django.shortcuts import render

from django.http import FileResponse
from common.data import CONF
def app(request):
    return render(request, 'app.html', {})