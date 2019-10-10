# -*- coding: utf-8 -*-
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 't(5+*we*z8dad2o^p*5)csn^5+@kt^xjk7sz=#an!9c-te66gd'

DEBUG = False

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    't',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mis.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mis.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases


DATABASES = {
    # 'default': {
    #     'ENGINE':'django.db.backends.mysql',
    #     'NAME':'gov_defence',
    #     'USER':'root',
    #     'PASSWORD':'12345',
    #     'HOST':'172.16.39.65',
    #     'PORT':'3306',
    #     'CONN_MAX_AGE':6
    # }
    # 'default': {
    #     'ENGINE':'django.db.backends.mysql',
    #     'NAME':'gov_defence',
    #     'USER':'grxa',
    #     'PASSWORD':'GRXA@1410g20db',
    #     'HOST':'172.16.31.135',
    #     'PORT':'3306',
    #     'CONN_MAX_AGE':6
    # }
    'default': {
        'ENGINE':'django_mysqlpool.backends.mysqlpool',
        'NAME':'gov_defence',
        'USER':'grxa',
        'PASSWORD':'GRXA@1410g20db',
        'HOST':'172.16.31.135',
        'PORT':'3306',
        'CONN_MAX_AGE':6
    }

    # 'default': {
    #     'ENGINE':'django.db.backends.mysql',
    #     'NAME':'gov_defence',
    #     'USER':'jinkai',
    #     'PASSWORD':'`1q`1q`1Q',
    #     'HOST':'49.235.152.172',
    #     'PORT':'3306',
    #     'CONN_MAX_AGE':6
    #
    # }

}

# DATABASES = {
#     'default': {
#         'ENGINE':'django.db.backends.mysql',
#         'NAME':'gov_defence',
#         'USER':'grxa',
#         'PASSWORD':'GRXA@1410g20db',
#         'HOST':'172.16.31.135',
#         'PORT':'3306',
#         'CONN_MAX_AGE':6
#     }
# }

MYSQLPOOL_ARGUMENTS = {
    'pool_size': 5,
    'max_overflow':-1,
    'timeout':2
}

MYSQLPOOL_BACKEND = 'QueuePool'
MYSQLPOOL_TIMEOUT=100

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

SESSION_ENGINE = 'django.contrib.sessions.backends.file'
SESSION_FILE_PATH = None

SESSION_COOKIE_NAME="session_id"  # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串
SESSION_COOKIE_PATH="/"  # Session的cookie保存的路径
SESSION_COOKIE_DOMAIN = None  # Session的cookie保存的域名
SESSION_COOKIE_SECURE = False  # 是否Https传输cookie
SESSION_COOKIE_HTTPONLY = True  # 是否Session的cookie只支持http传输
SESSION_COOKIE_AGE = 1800  # Session的cookie失效日期（2周） 默认1209600秒
#SESSION_EXPIRE_AT_BROWSER_CLOSE =True  # 是否关闭浏览器使得Session过期

#如果你设置了session的过期时间 30分钟后，这个参数是False30分钟过后，session准时失效
#如果设置 True，在30分钟期间有请求服务端，就不会过期！（为什么逛一晚上淘宝，也不会登出，但是不浏览器不刷新了就会自动登出）
SESSION_SAVE_EVERY_REQUEST = True

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = False

STATIC_URL = '/static/'
STATIC_ROOT = 'static'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR,'static'),

]
ALLOWED_HOSTS = ['*']
