from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect

def auth(func):
    def wrapper(request):
        if request.session.has_key('superuser'):
            return func(request)
        else:
            from django.http import HttpResponse
            return HttpResponse('{"auth": "failed!"}', content_type='application/json')

            #return redirect('/login')
            #return HttpResponseRedirect("/login")

    return wrapper