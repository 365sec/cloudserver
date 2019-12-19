#coding: utf-8

from django.conf.urls import url
from django.contrib import admin

from django.views import static
from django.conf import settings
from t import views
from t import link
from t import login
from assets import  assets_link
from assets import views as assets_view

urlpatterns = [

    url(r'^static/(?P<path>.*)$', static.serve,
        {'document_root': settings.STATIC_ROOT}, name='static'),

    url(r'^data_count$', views.view_report),# 统计信息界面展示
    # url(r'^agent/query/$', views.agent_query),#查询agent事件
    url(r'^server_agent/query/$', views.server_agent_query),# 查询服务agent
    url(r'^server_agent/del/$', views.agent_del),# 删除服务agent
    url(r'^web_agent/query/$', views.web_agent_query),    #查询网络agent
    url(r'^attack/init/$', views.attack_event_init),   #过滤agent事件
    url(r'^attack/query/$', views.attack_event_query),   #过滤agent事件
    url(r'^attack/query_detail_data/$', views.query_detail_data),#根据ID查询相应表的单条数据
    url(r'^attack/query_source/$', views.attack_query_source),#追踪溯源查询
    url(r'^attack/server_trend/$', views.server_attack_trend),#服务安全分析
    url(r'^attack/web_trend/$', views.web_attack_trend),      #网站安全事件
    url(r'^attack/web_event/$', views.query_web_event_by_app_id),# 查询某个服务上面的所有网站
    url(r'^attack/web_remark/$', views.change_web_event_remark),# 修改网站管理里面的标签 remark
    url(r'^attack/web_event_agent/$', views.query_web_agent_by_agent_id),# 查询某个agent上面所有的网站agent
    url(r'^attack/change_status/$', views.change_status),  #改变事件是否状态 是否被处理
    url(r'^query_threat_level$', views.query_threat_level),#查询攻击等级数目
    url(r'^query_attack_source$', views.query_attack_source),#查询攻击源
    url(r'^query_attack_times$', views.query_attack_times),#查询攻击时间分布
    url(r'^query_attack_type$', views.query_attack_type),#查询攻击类型
    url(r'^query_attack_warn', views.query_attack_warn),#查询攻击方法
    url(r'^plugins$', views.plugins_manage),      #防御策略查询
    url(r'^plugins_update$', views.plugins_update),# 防御策略更新
    url(r'^black_white_list$', views.black_white_list),  #黑白名单查询
    url(r'^black_white_lis_update$', views.black_white_list_update),#黑白名单更新
    url(r'^baseline$', views.baseline),#安全基线扫描展示
    url(r'^baseline_check$', views.baseline_check),#执行安全基线扫描
    url(r'^baseline_status$', views.baseline_status),#查看基线检查的状态
    url(r'^add_host$', views.add_host),#添加主机
    url(r'^get_host_agent_id$', views.get_host_agent_id),#获得当前用户注册主机的agent_id
    url(r'^user/query/$', views.user_query),#管理员查询
    url(r'^user/query_one/$', views.user_query_one),#个人信息查询
    url(r'^user/user_update/$', views.user_update),#个人更新
    url(r'^user/user_update_pwd/$', views.user_update_pwd),#个人密码修改
    url(r'^user/user_add/$', views.user_add),#添加用户
    url(r'^login$', login.login),
    url(r'^logout$', login.loginout),
    url(r'^index$', login.index),
    ############################ 分组URL ##################################
    # url(r'^group_add/$', views.group_add),# 组增加
    # url(r'^group_del/$', views.group_del),# 组删除
    # url(r'^group_query/$', views.group_query),# 组查询
    # url(r'^group_update/$', views.group_update),# 组更新
    # url(r'^agent_update_group/$', views.agent_update_group),# agent更新组名



    ############################ 资产清点URL ###############################

    url(r'^assets/query_network$', assets_view.assets_query_network),
    url(r'^assets/query_monitor_info_last$', assets_view.assets_monitor_info_last),#监控信息
    url(r'^assets/query_monitor_info_query$', assets_view.assets_monitor_info_query),
    url(r'^assets/query_process$', assets_view.assets_process_query),
    url(r'^assets/query_process_num$', assets_view.assets_process_query_num),#查询每个进程有多少个主机拥有
    url(r'^assets/query_process_chart$', assets_view.assets_process_chart),
    url(r'^assets/query_port$', assets_view.assets_port_query),
    url(r'^assets/query_port_num$', assets_view.assets_port_query_num),
    url(r'^assets/query_port_chart$', assets_view.assets_port_chart),

    #######################################################################
    url(r'^download$', link.download),
    #url(r'^agentClick$', link.agent_click),
    url(r'^overview$', link.overview),
    url(r'^attack$', link.attack),
    # url(r'^agent$', link.agent),
    url(r'^countreport$', link.countreport),
    url(r'^agent_download$', link.agent_download),
    url(r'^win32_help$', link.win32_help),
    url(r'^linux_help$', link.linux_help),
    url(r'^help$', link.help),
    # url(r'^agent_detail$', link.agent_detail),
    url(r'^server_manage_detail$', link.server_manage_detail),
    url(r'^website_manage_detail$', link.website_manage_detail),
    url(r'^manage$', link.manage),
    url(r'^user$', link.user),


    url(r'^_book/doc', link.doc),
    ############################ 资产清点link ###############################
    url(r'^app', assets_link.app),
    url(r'^process', assets_link.process),
    url(r'^netconnecting', assets_link.netconnecting),
    url(r'^port', assets_link.port),

    #######################################################################
    url(r'^//', login.index),

    url(r'', login.index),


]

