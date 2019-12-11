# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class TAssetsPort(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    # agent_id = models.CharField( blank=True, null=True, max_length=255)
    local_addr = models.CharField( blank=True, null=True, max_length=255)
    local_port = models.CharField( blank=True, null=True, max_length=255)
    name = models.CharField(blank=True, null=True, max_length=255)
    path = models.CharField(blank=True, null=True, max_length=255)
    proname = models.CharField(blank=True, null=True, max_length=255)
    pid = models.IntegerField(blank=True, null=True)
    # host = models.ForeignKey(THostAgents,to_field="agent_id")
    class Meta:
        managed = False
        db_table = 't_assets_port'

class TAssetsActiveNetwork(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    local_addr = models.CharField( blank=True, null=True, max_length=255)
    local_port = models.CharField( blank=True, null=True, max_length=255)
    name = models.CharField(blank=True, null=True, max_length=255)
    path = models.CharField(blank=True, null=True, max_length=255)
    proname = models.CharField(blank=True, null=True, max_length=255)
    pid = models.IntegerField(blank=True, null=True)
    remote_addr = models.CharField(blank=True, null=True, max_length=255)
    remote_port = models.CharField(blank=True, null=True, max_length=255)


    class Meta:
        managed = False
        db_table = 't_assets_active_network'

class TAssetsProcess(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    pid = models.IntegerField(blank=True, null=True)
    name = models.CharField(blank=True, null=True, max_length=255)
    command = models.TextField(blank=True, null=True)
    path = models.CharField(blank=True, null=True, max_length=255)
    user = models.CharField(blank=True, null=True, max_length=255)
    level = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_assets_process'


class TAssetsMonitor(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    cpu_used = models.CharField(blank=True, null=True, max_length=255)
    # cpu_num = models.IntegerField(blank=True, null=True)
    memory_total = models.CharField(blank=True, null=True, max_length=255)
    memory_used = models.CharField(blank=True, null=True, max_length=255)
    network_in = models.CharField(blank=True, null=True, max_length=255)
    network_out = models.CharField(blank=True, null=True, max_length=255)
    disk_used = models.TextField(blank=True, null=True)
    disk_write = models.CharField(blank=True, null=True, max_length=255)
    disk_read = models.CharField(blank=True, null=True, max_length=255)
    check_time = models.DateTimeField(blank=True, null=True, max_length=255)

    class Meta:
        managed = False
        db_table = 't_assets_monitor'
