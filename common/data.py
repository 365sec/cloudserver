#coding=utf-8
import os
import time

class appDict(dict):

    def __init__(self):
        dict.__init__(self)

CONF = appDict()
CONF.WIN32_AGENT_URL = 'AgentServiceInstaller-1.4.3.exe'
CONF.LINUX64_AGENT_URL = 'agent_service_64bit-1.6.3.tar.gz'


