### 自动化安装 {#auto}

```
java -jar RaspInstall.jar -install <jetty_root>
```

这里的 &lt;jetty\_root&gt; 不是 webapps 目录，而是 jetty的根目录。没有错误表示安装成功。安装后，需要重启 jetty服务器生效。

### 手动安装

进入jetty目录，将jspAgent目录复制过来。

##### 配置 Jetty {#any-config}

这里假设`rasp`目录释放到了`/opt/jetty/rasp/`。

修改 java 启动参数，增加 -javaagent 参数（注意将`-jar`放在命令最末尾\):

```
java -javaagent:/opt/jetty/jspAgent/rasp.jar -jar start.jar
```

**需要注意的是**，对于Windows服务器，请修正`-javaagent`参数，比如

```
-javaagent:D:\jetty\jspAgent\rasp.jar
```



