"""gov URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from t import views

from . import view


urlpatterns = [
    url(r'^agent/query/$', views.agent_query),
    url(r'^attack/query/$', views.attack_event_query),
    url(r'^attack/query_source/$', views.attack_query_source),
    url(r'^download$', view.agent_download),
    url(r'^agentClick$', view.agent_click),
    url(r'^query_threat_level$', views.query_threat_level),
    url(r'^query_attack_source$', views.query_attack_source),
    url(r'^query_attack_times$', views.query_attack_times),
    url(r'^query_attack_type$', views.query_attack_type),
    url(r'^query_attack_warn', views.query_attack_warn),
    url(r'^plugins$', views.plugins_manage),
    url(r'^plugins_update$', views.plugins_update),
    url(r'^add_host$', views.add_host),
    url(r'^login$', views.login),
    url(r'^logout$', views.loginout),
    url(r'^index$', views.index),
    url(r'', views.index),
]
