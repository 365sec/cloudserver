#coding: utf-8
import os
import geoip2

def readConfig(filename):
    try:
        f = open(filename, "r")
        content = f.read()
        f.close()
        return content
    except Exception as e:
        print(e)

def ip_to_address(ip):
    # 将ip转换成对应的中文地点

    str = ip.split(".")[0]
    y = ''
    if str == "172" or str == "192" or str == "10":
        y = "局域网"
    elif str == "127" or str == "" or str == "::1":
        y = "本机"
    else:
        result = []
        try:
            gi = geoip2.database.Reader('data/geoip/GeoLite2-City.mmdb', locales=['zh-CN'])
            response = gi.city(ip)
        except Exception as e:
            pass
        try:
            result.append(response.country.names['zh-CN'])
        except Exception as e:
            pass
        try:
            result.append(response.subdivisions.most_specific.names['zh-CN'])
        except Exception as e:
            pass
        try:
            result.append(response.city.names['zh-CN'])
        except Exception as e:
            pass

        y = '-'.join(result)
    # print(ip)
    # print(y)
    return y

def file_iterator(file_name, chunk_size=1024):
    with open(file_name) as f:
        while True:
            c = f.read(chunk_size)
            if c:
                yield c
            else:
                break