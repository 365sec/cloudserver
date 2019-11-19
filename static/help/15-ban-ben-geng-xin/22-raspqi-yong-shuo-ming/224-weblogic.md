### 自动化安装 {#auto}

```
java -jar RaspInstall.jar -install <weblogic_root>
```

这里的 &lt;weblogic\_root&gt; 不是 webapps 目录，而是 weblogic的根目录。没有错误表示安装成功。安装后，需要重启 Weblogic 服务器生效。

### 手动安装-Linux {#manual-window}

**配置weblogic的config.xml文件**

找到`<weblogic-home>/user_projects/domains/base_domain/config`目录，打开`config.xml`文件,定位到需要安装rasp的`<server>/<server-start>/<arguments>`标签，在`<arguments>`标签内添加如下配置:

```
-javaagent:<agent_directory_full_path>/jspAgent/rasp.jar
```

重启安装rasp的server，服务器生效

### 手动安装-Windows {#manual-window}

#### 配置 WebLogic

> 非集群模式

打开`bin/startWebLogic.cmd`, 找到`set JAVA_OPTIONS=%SAVE_JAVA_OPTIONS%"`这一行，在下面增加:

```
set JAVA_OPTIONS=-javaagent:%DOMAIN_HOME%\jspAgent\rasp.jar %JAVA_OPTIONS%
```

> 集群模式

同Linux的集群模式

