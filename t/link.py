from django.shortcuts import render

def overview(request):
    return render(request, 'overview.html', {})

def attack(request):
    return render(request, 'attack.html', {})

def manage(request):
    return render(request, 'manage.html', {})

def countreport(request):
    return render(request, 'countreport.html', {})

def agent_download(request):
    return render(request, 'download.html', {})

def agent_detail(request):
    return render(request, 'agent_detail.html', {})

def manage_detail(request):
    return render(request, 'manage_detail.html', {})
