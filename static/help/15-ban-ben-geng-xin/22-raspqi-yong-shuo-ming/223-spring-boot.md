### 手动安装

##### 配置启动参数 {#auto-config}

假设`spring_boot_folder`目录为`/opt/spring-boot/`。

修改 SpringBoot 启动参数，增加`-javaagent`绝对路径参数（注意将`-jar`放到命令最末尾），e.g

> 如果JDK版本为6-8，那么启动参数如下配置

```
java -javaagent:"/opt/spring-boot/jspAgent/rasp.jar" -jar springboot.jar
```

> 如果JDK版本为11，那么启动参数如下配置

```
java --add-opens java.base/jdk.internal.loader=ALL-UNNAMED -javaagent:"/opt/spring-boot/jspAgent/rasp.jar" -jar springboot.jar
```





