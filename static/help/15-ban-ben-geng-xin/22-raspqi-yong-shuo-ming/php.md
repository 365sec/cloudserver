PHP扩展对于服务器和操作系统的支持情况，可查看[兼容性说明-PHP Agent](//13-jian-rong-xing-shuo-ming.html)。

### 自动化安装

`php RaspInstall.php`

其中php为当前使用的php解释器。

### 手动安装

1.确认基本信息

在web目录下，我们建立一个phpinfo.php，并填下如下内容

&lt;?php phpinfo\(\); ?&gt;

查找Loaded Configuration File，确认php配置文件所在的路径。然后通过PHP Version、Architecture、Thread Safety确认对应的php扩展路径。将对应的php扩展复制到ext目录。

手动编辑ini配置文件，添加如下字样

\[secmod\]

extension=php\_secmod\_\[version\]\_\[threadsafe\]\_\[architecture\].dll

;hooks.ignore=

;hooks.callable\_blacklists=system,exec,passthru,proc\_open,shell\_exec,popen,pcntl\_exec,assert

;log.log\_maxburst=1000

;plugin.timeout.millis=100

重启web服务器。

### 验证安装是否成功

访问刚才创建的phpinfo.php，检查secmod模块是否加载成功即可，e.g

