from django.shortcuts import render, redirect

def auth(func):
    def wrapper(request):
        if request.session.has_key('superuser'):
            return func(request)
        else:
            # return HttpResponse('auth failed!', content_type='application/json')
            return redirect('/login')

    return wrapper