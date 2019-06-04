# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class TAgents(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=50)
    sensor_type_id = models.CharField(max_length=50, blank=True, null=True)
    os = models.CharField(max_length=255, blank=True, null=True)
    host_name = models.CharField(max_length=255, blank=True, null=True)
    version = models.CharField(max_length=255, blank=True, null=True)
    rasp_home = models.CharField(max_length=255, blank=True, null=True)
    language = models.CharField(max_length=255, blank=True, null=True)
    server_type = models.CharField(max_length=255, blank=True, null=True)
    server_version = models.CharField(max_length=255, blank=True, null=True)
    remote_ip = models.CharField(max_length=255, blank=True, null=True)
    register_ip = models.CharField(max_length=255, blank=True, null=True)
    online = models.PositiveIntegerField(blank=True, null=True)
    disabled = models.PositiveIntegerField(blank=True, null=True)
    remark = models.CharField(max_length=1000, blank=True, null=True)
    owner = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_agents'


class TAlgorithmConfig(models.Model):
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    default_action = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 't_algorithm_config'


class TAttackEvent(models.Model):
    event_issue_id = models.CharField(primary_key=True, max_length=100)
    agent_id = models.CharField(max_length=100)
    event_type = models.CharField(max_length=50)
    event_time = models.DateTimeField()
    server_hostname = models.CharField(max_length=200, blank=True, null=True)
    event_id = models.IntegerField()
    attack_type = models.CharField(max_length=100, blank=True, null=True)
    attack_params = models.TextField(blank=True, null=True)
    stack_trace = models.TextField(blank=True, null=True)
    plugin_name = models.CharField(max_length=100, blank=True, null=True)
    plugin_message = models.CharField(max_length=4000, blank=True, null=True)
    plugin_confidence = models.IntegerField(blank=True, null=True)
    intercept_state = models.CharField(max_length=255, blank=True, null=True)
    request_id = models.CharField(max_length=100, blank=True, null=True)
    attack_source = models.CharField(max_length=100, blank=True, null=True)
    target_port = models.IntegerField(blank=True, null=True)
    target = models.CharField(max_length=1000, blank=True, null=True)
    server_ip = models.CharField(max_length=100, blank=True, null=True)
    server_type = models.CharField(max_length=100, blank=True, null=True)
    server_version = models.CharField(max_length=100, blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    path = models.CharField(max_length=1000, blank=True, null=True)
    user_agent = models.CharField(max_length=1000, blank=True, null=True)
    referer = models.CharField(max_length=1000, blank=True, null=True)
    threat_level = models.IntegerField()
    method = models.CharField(max_length=50, blank=True, null=True)
    system_user = models.CharField(max_length=100, blank=True, null=True)
    process_path = models.CharField(max_length=500)

    class Meta:
        managed = False
        db_table = 't_attack_event'


class TEventKnowledge(models.Model):
    event_id = models.IntegerField(primary_key=True)
    event_type = models.IntegerField()
    event_name = models.CharField(max_length=500)
    event_description = models.TextField(blank=True, null=True)
    event_advice = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_event_knowledge'


class THostAgent(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=100)
    version = models.CharField(max_length=255)
    host_name = models.CharField(max_length=255)
    os = models.CharField(max_length=1000)
    os_full = models.CharField(max_length=1000)
    internal_ip = models.CharField(max_length=255, blank=True, null=True)
    extranet_ip = models.CharField(max_length=255, blank=True, null=True)
    cpu = models.CharField(max_length=255, blank=True, null=True)
    memory = models.CharField(max_length=255, blank=True, null=True)
    last_hearbeat = models.DateTimeField(blank=True, null=True)
    online = models.IntegerField(blank=True, null=True)
    remark = models.CharField(max_length=1000, blank=True, null=True)
    own_user = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_host_agent'


class TPlugins(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    plugin_version = models.CharField(max_length=255)
    plugin_name = models.CharField(max_length=255, blank=True, null=True)
    globalconfig = models.TextField(db_column='globalConfig', blank=True, null=True)  # Field name made lowercase.
    httpprotectconfig = models.TextField(db_column='httpProtectConfig', blank=True, null=True)  # Field name made lowercase.
    algorithm_config = models.TextField(blank=True, null=True)
    plugin_template = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_plugins'


class TSecurityPolicyEvent(models.Model):
    event_id = models.CharField(primary_key=True, max_length=100)
    event_type = models.CharField(max_length=50)
    event_time = models.DateTimeField()
    policy_id = models.IntegerField()
    server_hostname = models.CharField(max_length=200, blank=True, null=True)
    server_nic = models.CharField(max_length=100, blank=True, null=True)
    server_type = models.CharField(max_length=100, blank=True, null=True)
    server_version = models.CharField(max_length=100, blank=True, null=True)
    message = models.CharField(max_length=4000, blank=True, null=True)
    params = models.TextField(blank=True, null=True)
    stack_trace = models.TextField(blank=True, null=True)
    threat_level = models.IntegerField()

    class Meta:
        managed = False
        db_table = 't_security_policy_event'


class TUsers(models.Model):
    username = models.CharField(primary_key=True, max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    superuser = models.IntegerField()

    class Meta:
        managed = False
        db_table = 't_users'