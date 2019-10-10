### 自动化安装 {#auto}

```
java -jar RaspInstall.jar -install <jboss_root>
```

这里的 &lt;jboss\_root&gt; 不是 webapps 目录，而是 jboss 的根目录。没有错误表示安装成功。安装后，需要重启 jboss 服务器生效。

### 手动安装-Linux

进入到 jboss 安装目录\(绝对路径包含空格将导致启动失败\)，e.g

`/opt/jboss`，将jspAgent目录复制过来

在服务器目录执行如下命令

chmod 777 -R jspAgent

##### 配置 JBoss {#linux-config}

> 如果是 JBoss 4-6 \(非 EAP 版本\)，

打开`bin/run.sh`, 找到任意以`JAVA_OPTS=`为起始的行，e.g

```bash
# Setup JBoss specific properties
JAVA_OPTS="-Dprogram.name=$PROGNAME$JAVA_OPTS"
```

在下面增加`JAVA_OPTS="-javaagent:${JBOSS_HOME}/jspAgent/rasp.jar ${JAVA_OPTS}"`，最终效果如下:

```
# Setup JBoss specific properties
JAVA_OPTS="-Dprogram.name=$PROGNAME$JAVA_OPTS"
JAVA_OPTS="-javaagent:${JBOSS_HOME}/jspAgent/rasp.jar ${JAVA_OPTS}"
```

> 如果是 JBoss EAP，

**standalone模式**

打开`bin/standalone.sh`，找到`# Display our environment`处，在下面添加：

```
JAVA_OPTS="${JAVA_OPTS} -javaagent:${JBOSS_HOME}/jspAgent/rasp.jar"
JAVA_OPTS="$JAVA_OPTS -Djboss.modules.system.pkgs=org.jboss.byteman,org.jboss.logmanager,com.baidu.openrasp"
JAVA_OPTS="$JAVA_OPTS -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
JAVA_OPTS="$JAVA_OPTS -Xbootclasspath/p:${JBOSS_HOME}/modules/org/jboss/logmanager/main/jboss-logmanager-x.x.x.jar"
JAVA_OPTS="$JAVA_OPTS -Xbootclasspath/p:${JBOSS_HOME}/modules/org/jboss/logmanager/log4j/main/jboss-logmanager-log4j-x.x.x.jar"
JAVA_OPTS="$JAVA_OPTS -Xbootclasspath/p:${JBOSS_HOME}/modules/org/apache/log4j/main/log4j-x.x.x.jar"
```

对于jboss-logmanager-x.x.x.jar、jboss-logmanager-log4j-x.x.x.jar和log4j-x.x.x.jar中的`x.x.x`代表当前jboss自己提供的相应的jar包版本，如果提示找不到这些 jar 包，将所有 ${JBOSS\_HOME}/modules/org/jboss/logmanager/log4j/main/ 路径更改为 ${JBOSS\_HOME}/modules/system/layer/base/org/jboss/logmanager/log4j/main/

**domain模式**

_**server-group方式配置rasp**_

如果按照server-group配置rasp，那么此group下面所有的服务器都会安装rasp，打开`domain/configuration/domain.xml`文件，找到`<server-groups>`标签，在需要安装rasp的server-group中找到`<jvm>`标签添加如下配置：

```
<jvm-options>
   <option value="-javaagent:<jboss_root>/jspAgent/rasp.jar"/>
   <option value="-Xbootclasspath/p:<jboss_root>/modules/system/layers/base/org/jboss/logmanager/main/jboss-logmanager-x.x.x.jar"/>
   <option value="-Xbootclasspath/p:<jboss_root>/modules/system/layers/base/org/jboss/logmanager/main/jboss-logmanager-log4j-x.x.x.jar"/>
   <option value="-Xbootclasspath/p:<jboss_root>/modules/system/layers/base/org/jboss/logmanager/main/log4j-x.x.x.jar"/>
</jvm-options>
```

其中`<jboss_root>`为jboss的根目录，jboss-logmanager-x.x.x.jar、jboss-logmanager-log4j-x.x.x.jar和log4j-x.x.x.jar中的`x.x.x`代表当前jboss自己提供的的jar包的版本。

在需要安装rasp的server-group中添加如下配置：

```
<system-properties>
    <property name="jboss.modules.system.pkgs" value="org.jboss.byteman,org.jboss.logmanager,com.baidu.openrasp"/>
    <property name="java.util.logging.manager" value="org.jboss.logmanager.LogManager"/>
</system-properties>
```

_**server方式配置rasp**_

如果只对某个server-group的特定的server安装rasp，打开`domain/configuration/host.xml`文件，找到`<servers>`标签，在需要安装rasp的server中添加如下配置：

```
<system-properties>
    <property name="jboss.modules.system.pkgs" value="org.jboss.byteman,org.jboss.logmanager,com.baidu.openrasp"/>
    <property name="java.util.logging.manager" value="org.jboss.logmanager.LogManager"/>
</system-properties>
<jvm name="default">
    <jvm-options>
           <option value="-javaagent:<jboss_root>/jspAgent/rasp.jar"/>
           <option value="-Xbootclasspath/p:<jboss_root>/modules/system/layers/base/org/jboss/logmanager/main/jboss-logmanager-x.x.x.jar"/>
           <option value="-Xbootclasspath/p:<jboss_root>/modules/system/layers/base/org/jboss/logmanager/main/jboss-logmanager-log4j-x.x.x.jar"/>
           <option value="-Xbootclasspath/p:<jboss_root>/modules/system/layers/base/org/jboss/logmanager/main/log4j-x.x.x.jar"/>
    </jvm-options>
</jvm>
```

其中`<jboss_root>`为jboss的根目录，jboss-logmanager-x.x.x.jar、jboss-logmanager-log4j-x.x.x.jar和log4j-x.x.x.jar中的`x.x.x`代表当前jboss自己提供的的jar包的版本。

### 手动安装-Windows

##### 配置 JBoss {#windows-config}

> 如果使用Jboss 4～6 \(非 EAP 版本\)，则打开`bin\run.bat`;

打开脚本后，找到任意以`set JAVA_OPTS`为起始的行，如：

```
set JAVA_OPTS=%JAVA_OPTS% -Dprogram.name=%PROGNAME%
```

在下面增加`set JAVA_OPTS=-javaagent:%JBOSS_HOME%\jspAgent\rasp.jar %JAVA_OPTS%`：

```
set JAVA_OPTS=%JAVA_OPTS% -Dprogram.name=%PROGNAME%
set JAVA_OPTS=-javaagent:%JBOSS_HOME%\jspAgent\rasp.jar %JAVA_OPTS%
```

> 如果使用Jboss EAP,

**standalone模式**

打开`bin\standalone.bat`找到`第一次`出现`rem Setup JBoss specific properties`处，在下面添加：

```
set "JAVA_OPTS=%JAVA_OPTS% -javaagent:%JBOSS_HOME%\jspAgent\rasp.jar"
set "JAVA_OPTS=%JAVA_OPTS% -Djboss.modules.system.pkgs=org.jboss.byteman,org.jboss.logmanager,com.baidu.openrasp"
set "JAVA_OPTS=%JAVA_OPTS% -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
set "JAVA_OPTS=%JAVA_OPTS% -Xbootclasspath/p:%JBOSS_HOME%\modules\org\jboss\logmanager\main\jboss-logmanager-x.x.x.jar"
set "JAVA_OPTS=%JAVA_OPTS% -Xbootclasspath/p:%JBOSS_HOME%\modules\org\jboss\logmanager\log4j\main\jboss-logmanager-log4j-x.x.x.jar"
set "JAVA_OPTS=%JAVA_OPTS% -Xbootclasspath/p:%JBOSS_HOME%\modules\org\apache\log4j\main\log4j-x.x.x.jar"
```

**domain模式**

方法同 Linux 版本

