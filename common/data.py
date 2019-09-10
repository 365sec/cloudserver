#coding=utf-8
import os
import time

class appDict(dict):

    def __init__(self):
        dict.__init__(self)

CONF = appDict()
CONF.WIN32_AGENT_URL = 'AgentServiceInstaller-1.3.exe'
CONF.LINUX64_AGENT_URL = 'agent_service_x64-1.4.tar.gz'


