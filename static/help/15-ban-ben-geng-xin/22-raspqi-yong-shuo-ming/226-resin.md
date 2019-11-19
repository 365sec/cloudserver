### 自动化安装 {#auto}

```
java -jar RaspInstall.jar -install <resion_root>
```

这里的 &lt;resion\_root&gt; 不是 webapps 目录，而是 resin的根目录。没有错误表示安装成功。安装后，需要重启 resin服务器生效。

### 手动安装

进入resin目录，将jspAgent目录复制过来。

##### 配置 Resin {#manual-config}

> 如果是 resin 3，

打开`conf/resin.conf`, 找到`<server-default>`下面的`<jvm-arg>`起始行，e.g

```
<jvm-arg>-Xmx256m</jvm-arg>
<jvm-arg>-Xss1m</jvm-arg>
<jvm-arg>-Xdebug</jvm-arg>
<jvm-arg>-Dcom.sun.management.jmxremote</jvm-arg>
```

在下面增加:

```
<jvm-arg>-javaagent:/opt/resin/jspAgent/rasp.jar</jvm-arg>
```

> 如果是 resin 4，

打开`conf/cluster-default.xml`, 找到`<server-default>`下面的`<jvm-arg-line>`起始行，e.g

```
<jvm-arg-line>${jvm_args}</jvm-arg-line>
<jvm-mode>${jvm_mode}</jvm-mode>
```

在下面增加:

```
<jvm-arg>-javaagent:/opt/resin/jspAgent/rasp.jar</jvm-arg>
```



