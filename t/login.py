# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render, redirect
from django.contrib import admin
from django.views.decorators.http import require_http_methods
import time
import json
import hashlib
from t.models import TUsers

AGENT_ID = None

def refresh_agent_id():
    global AGENT_ID
    AGENT_ID = hashlib.md5(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))).hexdigest()[8:-8]
    print (AGENT_ID)

def get_agent_id():
    global AGENT_ID
    return AGENT_ID

@require_http_methods(['GET'])
def index(request):
    is_login = request.session.get('is_login', False)
    if is_login:
        context = {}
        context['agent_id'] = AGENT_ID
        context['login_username'] = request.session['username']
        return render(request, 'index.html', context)
    else:
        return redirect('/login')

@require_http_methods(['GET', 'POST'])
def login(request):
    msg={"msg":"账户密码错误"}
    if request.method == 'GET':
        return render(request, 'login.html', {})
    elif request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        m2 = hashlib.md5()
        m2.update(password)
        u = TUsers.objects.filter(username=username).first()
        if not u:

            return render(request, 'login.html', msg)
        if u.password == m2.hexdigest():
            request.session['username'] = username
            request.session['superuser'] = u.superuser
            request.session['is_login'] = True
            #request.session.set_expiry(1800)
            return redirect('/index')
    return render(request, 'login.html', msg)


def loginout(request):
    request.session.clear()
    return redirect('/login')


refresh_agent_id()