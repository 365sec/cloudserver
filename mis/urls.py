#coding: utf-8

from django.conf.urls import url
from django.contrib import admin
from t import views
from t import link
from t import login

urlpatterns = [
    url(r'^data_count$', views.view_report),
    url(r'^agent/query/$', views.agent_query),
    url(r'^server_agent/query/$', views.server_agent_query),# 查询服务agent
    url(r'^web_agent/query/$', views.web_agent_query),    #查询网络agent
    url(r'^attack/query/$', views.attack_event_query),   #过滤
    url(r'^attack/query_detail_data/$', views.query_detail_data),#根据ID查询相应表的单条数据
    url(r'^attack/query_source/$', views.attack_query_source),
    url(r'^attack/server_trend/$', views.server_attack_trend),#服务安全事件
    url(r'^attack/web_trend/$', views.web_attack_trend),      #网站安全事件
    url(r'^attack/web_event/$', views.query_web_event_by_app_id),
    url(r'^attack/change_status/$', views.change_status),  #改变事件是否状态 是否呗处理
    url(r'^query_threat_level$', views.query_threat_level),
    url(r'^query_attack_source$', views.query_attack_source),
    url(r'^query_attack_times$', views.query_attack_times),
    url(r'^query_attack_type$', views.query_attack_type),
    url(r'^query_attack_warn', views.query_attack_warn),
    url(r'^plugins$', views.plugins_manage),      #防御策略查询
    url(r'^plugins_update$', views.plugins_update),# 防御策略更新
    url(r'^black_white_list$', views.black_white_list),  #黑白名单查询
    url(r'^black_white_lis_update$', views.black_white_list_update),#黑白名单更新
    url(r'^add_host$', views.add_host),
    url(r'^login$', login.login),
    url(r'^logout$', login.loginout),
    url(r'^index$', login.index),
    url(r'^download$', link.download),
    url(r'^agentClick$', link.agent_click),
    url(r'^overview$', link.overview),
    url(r'^attack$', link.attack),
    # url(r'^agent$', link.agent),
    url(r'^countreport$', link.countreport),
    url(r'^agent_download$', link.agent_download),
    # url(r'^agent_detail$', link.agent_detail),
    url(r'^server_manage_detail$', link.server_manage_detail),
    url(r'^website_manage_detail$', link.website_manage_detail),

    url(r'^manage$', link.manage),
    url(r'', login.index),
]

