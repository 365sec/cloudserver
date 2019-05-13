#coding: utf-8

from django.conf.urls import url
from django.contrib import admin
from t import views
from t import link
from t import login

urlpatterns = [
    url(r'^data_count$', views.view_report),
    url(r'^agent/query/$', views.agent_query),
    url(r'^attack/query/$', views.attack_event_query),
    url(r'^attack/query_source/$', views.attack_query_source),
    url(r'^query_threat_level$', views.query_threat_level),
    url(r'^query_attack_source$', views.query_attack_source),
    url(r'^query_attack_times$', views.query_attack_times),
    url(r'^query_attack_type$', views.query_attack_type),
    url(r'^query_attack_warn', views.query_attack_warn),
    url(r'^plugins$', views.plugins_manage),
    url(r'^plugins_update$', views.plugins_update),
    url(r'^add_host$', views.add_host),
    url(r'^login$', login.login),
    url(r'^logout$', login.loginout),
    url(r'^index$', login.index),
    url(r'^download$', link.download),
    url(r'^agentClick$', link.agent_click),
    url(r'^overview$', link.overview),
    url(r'^attack$', link.attack),
    url(r'^agent$', link.agent),
    url(r'^countreport$', link.countreport),
    url(r'^agent_download$', link.agent_download),
    url(r'^agent_detail$', link.agent_detail),
    url(r'^manage_detail$', link.manage_detail),
    url(r'^manage$', link.manage),
    url(r'', login.index),
]

