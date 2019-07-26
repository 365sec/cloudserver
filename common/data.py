#coding=utf-8
import os
import time

class appDict(dict):

    def __init__(self):
        dict.__init__(self)

CONF = appDict()
CONF.WIN32_AGENT_URL = 'AgentServiceInstaller.exe'
CONF.LINUX_AGENT_URL = ''


