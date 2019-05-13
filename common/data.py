#coding=utf-8
import os
import time

class appDict(dict):

    def __init__(self):
        dict.__init__(self)

CONF = appDict()
CONF.AGENT_SERVER = '10.38.39.12:29002'
CONF.CLOUD_SERVER = '10.38.39.65:8081'
CONF.JAVA_PACKAGE_URL = 'java_agent_1.0.zip'
CONF.IIS_PACKAGE_URL = 'iis_agent_1.12.zip'


