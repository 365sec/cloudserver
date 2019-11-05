# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class TAlgorithmConfig(models.Model):
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    default_action = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 't_algorithm_config'


class TBaselineCheck(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    check_status = models.IntegerField()
    result = models.TextField(blank=True, null=True)
    progress = models.CharField(max_length=255, blank=True, null=True)
    last_check_time = models.DateTimeField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_baseline_check'

class TBaselineKnowledge(models.Model):
    check_item_id = models.CharField(primary_key=True, max_length=255)
    check_item_name = models.CharField(max_length=255, blank=True, null=True)
    check_item_level = models.IntegerField()
    check_classfly = models.CharField(max_length=255, blank=True, null=True)
    check_descript = models.TextField( blank=True, null=True)
    check_suggest = models.TextField( blank=True, null=True)
    os = models.IntegerField()

    class Meta:
        managed = False
        db_table = 't_baseline_knowledge'

class TConfig(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=255)
    plugin_version = models.CharField(max_length=255)
    plugin_name = models.CharField(max_length=255, blank=True, null=True)
    # globalconfig = models.TextField(db_column='globalConfig', blank=True, null=True)  # Field name made lowercase.
    # httpprotectconfig = models.TextField(db_column='httpProtectConfig', blank=True, null=True)  # Field name made lowercase.
    globalConfig = models.TextField( blank=True, null=True)  # Field name made lowercase.
    httpProtectConfig = models.TextField( blank=True, null=True)  # Field name made lowercase.
    algorithm_config = models.TextField(blank=True, null=True)
    plugin_template = models.TextField(blank=True, null=True)
    config_time = models.DateTimeField(blank=True, null=True)
    config = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_config'


class TEventKnowledge(models.Model):
    event_id = models.IntegerField(primary_key=True)
    event_type = models.IntegerField()
    event_name = models.CharField(max_length=500)
    event_description = models.TextField(blank=True, null=True)
    event_advice = models.TextField(blank=True, null=True)
    allow_search = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_event_knowledge'





class THostAgents(models.Model):
    agent_id = models.CharField(primary_key=True, max_length=100)
    version = models.CharField(max_length=255, blank=True, null=True)
    host_name = models.CharField(max_length=255, blank=True, null=True)
    os = models.CharField(max_length=1000, blank=True, null=True)
    os_full = models.CharField(max_length=1000, blank=True, null=True)
    internal_ip = models.CharField(max_length=255, blank=True, null=True)
    extranet_ip = models.CharField(max_length=255, blank=True, null=True)
    cpu = models.CharField(max_length=255, blank=True, null=True)
    memory = models.CharField(max_length=255, blank=True, null=True)
    last_hearbeat = models.DateTimeField(blank=True, null=True)
    online = models.IntegerField(blank=True, null=True)
    remark = models.CharField(max_length=1000, blank=True, null=True)
    own_user = models.CharField(max_length=255, blank=True, null=True)
    disabled = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_host_agents'


class TLogAnalysisd(models.Model):
    event_issue_id = models.CharField(primary_key=True, max_length=100)
    agent_id = models.CharField(max_length=100, blank=True, null=True)
    event_category = models.CharField(max_length=50)
    event_time = models.DateTimeField(blank=True, null=True)
    event_id = models.IntegerField(blank=True, null=True)
    event_name = models.CharField(max_length=255, blank=True, null=True)
    host_name = models.CharField(max_length=255, blank=True, null=True)
    system_user = models.CharField(max_length=255, blank=True, null=True)
    srcip = models.CharField(max_length=255, blank=True, null=True)
    srcport = models.CharField(max_length=255, blank=True, null=True)
    srcuser = models.CharField(max_length=255, blank=True, null=True)
    dstip = models.CharField(max_length=255, blank=True, null=True)
    dstport = models.CharField(max_length=255, blank=True, null=True)
    dstuser = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    full_log = models.TextField(blank=True, null=True)
    comment = models.CharField(max_length=255, blank=True, null=True)
    sidid = models.IntegerField(blank=True, null=True)
    group = models.CharField(max_length=255, blank=True, null=True)
    cve = models.CharField(max_length=255, blank=True, null=True)
    info = models.CharField(max_length=255, blank=True, null=True)
    decoder = models.CharField(max_length=255, blank=True, null=True)
    decoder_parent = models.CharField(max_length=255, blank=True, null=True)
    action = models.CharField(max_length=255, blank=True, null=True)
    protocol = models.CharField(max_length=255, blank=True, null=True)
    process_name = models.CharField(max_length=255, blank=True, null=True)
    status = models.PositiveIntegerField(blank=True, null=True)
    unused = models.CharField(max_length=255, blank=True, null=True)
    threat_level = models.IntegerField( blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_log_analysisd'

class TFileIntegrity(models.Model):
    event_issue_id = models.CharField(primary_key=True, max_length=100)
    agent_id = models.CharField(max_length=100, blank=True, null=True)
    event_category = models.CharField(max_length=50)
    event_time = models.DateTimeField(blank=True, null=True)
    event_id = models.IntegerField(blank=True, null=True)
    event_name = models.CharField(max_length=255, blank=True, null=True)
    host_name = models.CharField(max_length=255, blank=True, null=True)
    system_user = models.CharField(max_length=255, blank=True, null=True)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    md5_before = models.CharField(max_length=255, blank=True, null=True)
    md5_after = models.CharField(max_length=255, blank=True, null=True)
    sha1_before = models.CharField(max_length=255, blank=True, null=True)
    sha1_after = models.CharField(max_length=255, blank=True, null=True)
    owner_before = models.CharField(max_length=255, blank=True, null=True)
    owner_after = models.CharField(max_length=255, blank=True, null=True)
    full_log = models.CharField(max_length=4000, blank=True, null=True)
    unused = models.CharField(max_length=255, blank=True, null=True)
    status = models.PositiveIntegerField(blank=True, null=True)
    operator_type = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_file_integrity'


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


class TWebAgents(models.Model):
    app_id = models.CharField(primary_key=True, max_length=100)
    agent_id = models.CharField(max_length=50, blank=True, null=True)
    rasp_home = models.CharField(max_length=255, blank=True, null=True)
    sensor_type_id = models.CharField(max_length=50, blank=True, null=True)
    version = models.CharField(max_length=255, blank=True, null=True)
    language = models.CharField(max_length=255, blank=True, null=True)
    server_type = models.CharField(max_length=255, blank=True, null=True)
    server_version = models.CharField(max_length=255, blank=True, null=True)
    remote_ip = models.CharField(max_length=255, blank=True, null=True)
    register_ip = models.CharField(max_length=255, blank=True, null=True)
    online = models.PositiveIntegerField(blank=True, null=True)
    disabled = models.PositiveIntegerField(blank=True, null=True)
    remark = models.CharField(max_length=1000, blank=True, null=True)
    owner = models.CharField(max_length=255, blank=True, null=True)
    last_heartbeat = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_web_agents'

class TUsers(models.Model):
    username = models.CharField(primary_key=True, max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    superuser = models.IntegerField()

    class Meta:
        managed = False
        db_table = 't_users'

class TChart(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    event_type = models.CharField(max_length=255)
    chart_android = models.TextField( blank=True, null=True)
    chart_ios = models.TextField( blank=True, null=True)


    class Meta:
        managed = False
        db_table = 't_chart'


class TWebEvent(models.Model):
    event_issue_id = models.CharField(primary_key=True, max_length=100)
    agent_id = models.CharField(max_length=100)
    event_category = models.CharField(max_length=50)
    event_time = models.DateTimeField()
    server_hostname = models.CharField(max_length=200, blank=True, null=True)
    event_id = models.IntegerField()
    event_name = models.CharField(max_length=100, blank=True, null=True)
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
    path = models.CharField(max_length=500, blank=True, null=True)
    user_agent = models.CharField(max_length=200, blank=True, null=True)
    referer = models.CharField(max_length=200, blank=True, null=True)
    threat_level = models.IntegerField()
    method = models.CharField(max_length=50, blank=True, null=True)
    system_user = models.CharField(max_length=100, blank=True, null=True)
    process_path = models.CharField(max_length=500)
    attack_type = models.CharField(max_length=255, blank=True, null=True)
    status = models.PositiveIntegerField(blank=True, null=True)
    app_id = models.CharField(max_length=255)
    unused = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_web_event'


