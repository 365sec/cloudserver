# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class agents(models.Model):

    agent_id=models.CharField(max_length=50,db_column='agent_id',primary_key=True)
    sensor_type_id=models.CharField(max_length=50,db_column='sensor_type_id',blank=False)
    os=models.CharField(max_length=255,db_column='os',blank=False)
    host_name=models.CharField(max_length=255,db_column='host_name',blank=False)
    version=models.CharField(max_length=255,db_column='version',blank=False)
    language=models.CharField(max_length=255,db_column='language',blank=False)
    server_type=models.CharField(max_length=255,db_column='server_type',blank=False)
    server_version=models.CharField(max_length=255,db_column='server_version',blank=False)
    register_ip=models.CharField(max_length=255,db_column='register_ip',blank=False)
    remote_ip = models.CharField(max_length=255, db_column='remote_ip', blank=False)
    online=models.IntegerField(db_column='online',blank=False)
    disabled=models.IntegerField(db_column='disabled',blank=False)

class attack_event(models.Model):

    event_issue_id=models.CharField(max_length=100,db_column='event_issue_id',primary_key=True)
    agent_id=models.CharField(max_length=100,db_column='agent_id',blank=True)
    event_type=models.CharField(max_length=100,db_column='event_type',blank=True)
    event_time=models.DateTimeField(db_column='event_time',blank=True)
    server_hostname=models.CharField(max_length=200,db_column='server_hostname',blank=False)
    event_id=models.IntegerField(db_column='event_id',blank=True)
    #event=models.ForeignKey('event_knowledge',to_field='event_id',default=1,on_delete=models.CASCADE)

    attack_type=models.CharField(max_length=100,db_column='attack_type',blank=False)
    attack_params=models.TextField(db_column='attack_params',blank=False)
    stack_trace=models.TextField(db_column='stack_trace',blank=False)
    plugin_name=models.CharField(max_length=100,db_column= 'plugin_name',blank=False)
    plugin_message=models.CharField(max_length=4000,db_column='plugin_message',blank=False)
    plugin_confidence=models.IntegerField(db_column='plugin_confidence',blank=False)
    intercept_state=models.CharField(max_length=255,db_column='intercept_state',blank=False)
    request_id=models.CharField(max_length=100,db_column='request_id',blank=False)
    attack_source=models.CharField(max_length=100,db_column='attack_source',blank=False)
    target=models.CharField(max_length=1000,db_column='target',blank=False)
    server_ip=models.CharField(max_length=100,db_column='server_ip',blank=False)
    server_type=models.CharField(max_length=100,db_column='server_type',blank=False)
    server_version=models.CharField(max_length=100,db_column='server_version',blank=False)
    url=models.CharField(max_length=500,db_column='url',blank=False)
    body=models.TextField(db_column='body',blank=False)
    path=models.CharField(max_length=500,db_column='path',blank=False)
    user_agent=models.CharField(max_length=200,db_column='user_agent',blank=False)
    referer=models.CharField(max_length=200,db_column='referer',blank=True)
    threat_level=models.IntegerField(db_column='threat_level',blank=False)
    method=models.CharField(max_length=50,db_column='method',blank=False)
    system_user=models.CharField(max_length=100,db_column='system_user',blank=True)
    process_path=models.CharField(max_length=500,db_column='process_path',blank=True)


class event_knowledge(models.Model):
    event_id=models.IntegerField(db_column="event_id",primary_key=True)
    event_type=models.IntegerField(db_column="event_type",blank=False)
    event_name=models.CharField(max_length=500,db_column="event_name",blank=False)
    event_description=models.IntegerField(db_column="event_description",blank=True)
    event_advice=models.TextField(db_column="event_advice",blank=True)

class plugins(models.Model):
    agent_id=models.CharField(db_column="agent_id",max_length=255,primary_key=True,)
    plugin_version=models.CharField(db_column="plugin_version",blank=False,max_length=255)
    plugin_name=models.CharField(db_column="plugin_name",max_length=255,blank=True)
    globalConfig=models.TextField(db_column="globalConfig",blank=True)
    httpProtectConfig=models.TextField(db_column="httpProtectConfig",blank=True)
    algorithm_config=models.TextField(db_column="algorithm_config",blank=True)
    plugin_template=models.TextField(db_column="plugin_template",blank=True)