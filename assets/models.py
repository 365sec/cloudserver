# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class TAssets(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    port = models.TextField( blank=True, null=True)
    process = models.TextField( blank=True, null=True)
    service = models.TextField(blank=True, null=True)
    active_network = models.TextField(blank=True, null=True)
    update_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_assets'

class TAssetsPort(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    local_addr = models.CharField( blank=True, null=True, max_length=255)
    local_port = models.CharField( blank=True, null=True, max_length=255)
    name = models.CharField(blank=True, null=True, max_length=255)
    path = models.CharField(blank=True, null=True, max_length=255)
    pid = models.IntegerField(blank=True, null=True)
    remote_addr = models.CharField(blank=True, null=True, max_length=255)
    remote_port = models.CharField(blank=True, null=True, max_length=255)

    class Meta:
        managed = False
        db_table = 't_assets_port'
