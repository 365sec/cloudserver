import re

scan_dic = [{
    'name':'Hydra',
    'url': 'http://sectools.org/tool/hydra/',
    'regex': '(?:\(hydra\))'
}, {
    'name':'VirtualBlueness',
    'url': 'http://virtualblueness.net/nasl.html',
    'regex': '(?:\.nasl)'
}, {
    'name':'Absinthe',
    'message': 'https://sourceforge.net/projects/absinthe/',
    'regex': '(?:absinthe)'
}, {
    'name':'Arachni',
    'message': 'http://www.arachni-scanner.com/',
    'regex': '(?:arachni)'
}, {
    'name':'Bilbo',
    'message': 'http://www.crossley-nilsen.com/Linux/Bilbo_-_Nessus_WEB/bilbo_-_nessus_web.html',
    'regex': '(?:bilbo)'
}, {
    'name':'BFAC',
    'message': 'https://github.com/mazen160/bfac',
    'regex': '(?:BFAC)'
}, {
    'name':'Brutus',
    'message': 'http://sectools.org/tool/brutus/',
    'regex': '(?:(brutus|brutus))'
}, {
    'name':'Bsqlbf',
    'message': 'https://www.notsosecure.com/bsqlbf-v2-blind-sql-injection-brute-forcer/',
    'regex': '(?:bsqlbf)'
}, {
    'name':'Cgichk',
    'message': 'http://freecode.com/projects/cgichk',
    'regex': '(?:cgichk)'
}, {
    'name':'Cisco-torch',
    'message': 'https://sourceforge.net/projects/cisco-torch/',
    'regex': '(?:cisco-torch)'
}, {
    'name':'Commix',
    'message': 'https://github.com/stasinopoulos/commix',
    'regex': '(?:commix)'
}, {
    'name':'Core-project',
    'message': 'MS FrontPage vuln scanner',
    'regex': '(?:core-project\/1\.0)'
}, {
    'name':'N-Stalker',
    'message': 'http://www.nstalker.com/',
    'regex': '(?:n-stealth)'
}, {
    'name':'Nessus',
    'message': 'http://www.tenable.com/products/nessus-vulnerability-scanner',
    'regex': '(?:nessus)'
}, {
    'name':'Netsparker',
    'message': 'https://www.netsparker.com/web-vulnerability-scanner/',
    'regex': '(?:netsparker)'
}, {
    'name':'Nikto',
    'message': 'https://cirt.net/Nikto2',
    'regex': '(?:nikto)'
}, {
    'name':'Nmap',
    'message': 'https://nmap.org/',
    'regex': '(?:nmap)'
}, {
    'name':'Openvas',
    'message': 'http://www.openvas.org/',
    'regex': '(?:openvas)'
}, {
    'name':'Pangolin',
    'message': 'http://www.vealtel.com/software/nosec/pangolin/',
    'regex': '(?:pangolin)'
}, {
    'name':'Sqlmap',
    'message': 'http://sqlmap.org/',
    'regex': '(?:sqlmap)'
}, {
    'name':'Vega',
    'message': 'https://subgraph.com/vega/',
    'regex': '(?:vega)'
}, {
    'name':'Webinspect',
    'message': 'http://www8.hp.com/us/en/software-solutions/webinspect-dynamic-analysis-dast/',
    'regex': '(?:webinspect)'
}, {
    'name':'W3af',
    'message': 'http://w3af.org/',
    'regex': '(?:(w3af\.sf\.net|w3af\.org))'
}, {
    'name':'Whatweb',
    'message': 'https://www.morningstarsecurity.com/research/whatweb',
    'regex': '(?:whatweb)'
}
]

def get_scan(scan):
    for x in scan_dic:
        regex= x['regex']
        matchObj=re.findall(regex,scan,re.I)
        if  matchObj:
            return x['name']


if __name__ == '__main__':

    str1='Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 w3af.org (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'

    print(get_scan(str1))
