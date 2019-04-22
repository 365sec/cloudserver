from django.shortcuts import render

def overview(request):
    return render(request, 'overview.html', {})

def attack(request):
    return render(request, 'attack.html', {})

def agent(request):
    return render(request, 'agent.html', {})

def countreport(request):
    return render(request, 'countreport.html', {})

def agent_download(request):
    return render(request, 'download.html', {})

