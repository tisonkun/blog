---
title: 生成版本信息正确解析的 POM 文件
date: 2022-12-12 13:23:17
tags:
    - Java
    - Maven
    - 软件构建
categories:
    - 天工开物
---

> 本文成文于 2019 年。最近 [Apache StreamPark (Incubating)](https://streampark.apache.org/) 项目要做第一个 Apache 版本的发布，遇到了类似的发布多 Scala 支持版本时如何正确生成对应 POM 文件，又尽可能复用流水线的问题。由于过往发布记录都被删除，故重新发布。

近日在阅读 FLINK 代码时发现 FLINK 有一个 `force-shading` 模块，关于这个模块的作用注释在其使用点 `maven-shade-plugin` 的配置中是这样写的

> 现在这个模块已经移动到 flink-shaded 仓库下，详见 [pom.xml](https://github.com/apache/flink-shaded/blob/release-16.1/flink-shaded-force-shading/pom.xml) 文件。

```xml
<artifactSet>
  <includes>
    <!-- Unfortunately, the next line is necessary for now to force the execution
         of the Shade plugin upon all sub modules. This will generate effective poms,
         i.e. poms which do not contain properties which are derived from this root pom.
         In particular, the Scala version properties are defined in the root pom and without
         shading, the root pom would have to be Scala suffixed and thereby all other modules.
         -->
    <include>org.apache.flink:force-shading</include>
  </includes>
</artifactSet>
```

从注释中我们可以看到 `force-shading` 的作用是强制触发 `maven-shade-plugin` 的执行，并且提到了这样会生成所谓的 effective pom 文件。这究竟是怎么一回事呢？我们先从一个实例中理解这个问题。

<!-- more -->

先创建一个任意 MAVEN 工程，将它的 pom.xml 文件中 `dependencies` 替换为以下内容。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>moe.tison</groupId>
    <artifactId>eden_${scala.binary.version}</artifactId>
    <version>0.1-SNAPSHOT</version>

    <properties>
        <scala.binary.version>2.12</scala.binary.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>force-shading</artifactId>
            <version>1.8.1</version>
        </dependency>
        <dependency>
            <groupId>com.typesafe.akka</groupId>
            <artifactId>akka-actor_${scala.binary.version}</artifactId>
            <version>2.5.24</version>
        </dependency>
    </dependencies>
</project>
```

这里省略了可以配置 `scala.binary.version` 属性的 `profile` 部分，我们的意图是根据不同的 profile 来打出适应不同 Scala 版本的 jar 包，这一点可以在 `mvn clean install -P<profile-name>` 里指定。但是我们看一下在默认 profile 下发出来的 pom 文件的内容。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>moe.tison</groupId>
    <artifactId>eden_${scala.binary.version}</artifactId>
    <version>0.1-SNAPSHOT</version>

    <properties>
        <scala.binary.version>2.12</scala.binary.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>force-shading</artifactId>
            <version>1.8.1</version>
        </dependency>
        <dependency>
            <groupId>com.typesafe.akka</groupId>
            <artifactId>akka-actor_${scala.binary.version}</artifactId>
            <version>2.5.24</version>
        </dependency>
    </dependencies>
</project>
```

可以看到，`${scala.binary.version}` 的部分并没有被解析。这是因为 MAVEN install 的策略是直接复制工程对象的 pom file 字段对应的文件，在这里它直接复制了项目下的 pom.xml 文件。

这样会有什么问题呢？基于简单的复制策略 MAVEN 并不会解析 pom 文件中的 properties，这会导致我们基于不同的 profile 打出来的包的项目描述 pom 文件都是一样的。即使我们分别为 Scala 2.11 和 2.12 版本打了两个不同的 jar 包，由于 `${scala.binary.version}` 未解析，在下游应用中引用的使用属性永远是以 `<scala.binary.version>2.12</scala.binary.version>` 为准，也就丧失了原本分开打包兼容不同版本的初衷了。

明白了问题以后，我们来看一下 `force-shading` 是怎么解决这个问题的。

我们先往 pom.xml 中添加一个 `artifactSet` `exclude` 所有依赖的 `maven-shade-plugin`

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-shade-plugin</artifactId>
      <version>3.0.0</version>
      <executions>
        <execution>
          <id>shade-eden</id>
          <phase>package</phase>
          <goals>
            <goal>shade</goal>
          </goals>
          <configuration>
            <artifactSet>
              <excludes>
                <exclude>org.apache.flink:force-shading</exclude>
                <exclude>com.typesafe.akka:akka-actor_*</exclude>
              </excludes>
            </artifactSet>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

可以看到打出来的 jar 包的 pom 文件依旧不解析相关的属性。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>moe.tison</groupId>
    <artifactId>eden_${scala.binary.version}</artifactId>
    <version>0.1-SNAPSHOT</version>

    <properties>
        <scala.binary.version>2.12</scala.binary.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>force-shading</artifactId>
            <version>1.8.1</version>
        </dependency>
        <dependency>
            <groupId>com.typesafe.akka</groupId>
            <artifactId>akka-actor_${scala.binary.version}</artifactId>
            <version>2.5.24</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.0.0</version>
                <executions>
                    <execution>
                        <id>shade-eden</id>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <artifactSet>
                                <excludes>
                                    <exclude>org.apache.flink:force-shading</exclude>
                                    <exclude>com.typesafe.akka:akka-actor_*</exclude>
                                </excludes>
                            </artifactSet>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

我们试着把 `force-shading` 像 FLINK 那样 `inlcude` 到最终的 uber-jar 中。

```xml
<artifactSet>
  <includes>
    <include>org.apache.flink:force-shading</include>
  </includes>
</artifactSet>
```

可以看到这次打出来的 jar 包中的 pom 文件已经解析了 properties

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>moe.tison</groupId>
  <artifactId>eden_2.12</artifactId>
  <version>0.1-SNAPSHOT</version>
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.0.0</version>
        <executions>
          <execution>
            <id>shade-eden</id>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <artifactSet>
                <includes>
                  <include>org.apache.flink:force-shading</include>
                </includes>
              </artifactSet>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
  <dependencies>
    <dependency>
      <groupId>com.typesafe.akka</groupId>
      <artifactId>akka-actor_2.12</artifactId>
      <version>2.5.24</version>
      <scope>compile</scope>
    </dependency>
  </dependencies>
  <properties>
    <scala.binary.version>2.12</scala.binary.version>
  </properties>
</project>
```

这样，在不同的 profile 下，MAVEN 会把 properties 的使用点全部替换成运行时的值，打出来的包即依赖运行时的值，这个值可以由 profile 指定，就达到了我们打不同的兼容包的需求了。

那么，为什么使用 `force-shading` 就能达到这样的效果呢？

我们看到 MAVEN install 的时候的一行日志。

```
[INFO] Installing /path/to/eden/dependency-reduced-pom.xml to /home/user/.m2/repository/moe/tison/eden_2.12/0.1-SNAPSHOT/eden_2.12-0.1-SNAPSHOT.pom
```

可以看到我们是把 `dependency-reduced-pom.xml` 作为最终安装时复制的 pom file 来使用的，这个文件由 `maven-shade-plugin` 在对比模块原有依赖和经过 shade 之后的依赖有区别是解析产生，即 FLINK 中注释提到的 effective pom，它会在运行时基于依赖 diff 产生，由于运行时的 properties 本就是被设定的值，因此它巧合的就完成了这个解析 properties 的任务。

这里，依赖的 diff 由 pom.xml 中依赖 `force-shading` 而在 uber-jar 中打入 `force-shading` 因此不含这个依赖来达到。由于这个 diff 出现在 `flink-parent` 中，所有的子模块都会经历这个过程，所以所有子模块都使用了 effective pom 作为最终的 pom 文件。由于 `force-shading` 本身是一个空模块，只是为了触发 `maven-shade-plugin`，因此打入 uber-jar 中也不会有问题。

此外还有一点值得一提，即 `maven-shade-plugin` 在不指定 `artifactSet` 或 `artifactSet/includes` 为空时，默认是将所有依赖打入 uber-jar，即不选=全选。`force-shading` 的 `include` 恰巧避免了这一出乎意料的情况的发生，保证 shade 时所有的 `inlcude` 和 `exclude` 都显式声明，客观上也减少了潜在的难以分析的漏洞。

关于 FLINK 和 SPARK 使用 `force-shading` 手段的讨论：

* [[FLINK-3565] FlinkKafkaConsumer does not work with Scala 2.11](https://issues.apache.org/jira/browse/FLINK-3565)
* [[SPARK-3812] Adapt maven build to publish effective pom.](https://issues.apache.org/jira/browse/SPARK-3812)

关于 MAVEN 安装时不解析 properties 的讨论：

* [[MNG-2971] Variables are not replaced into installed pom file](https://issues.apache.org/jira/browse/MNG-2971)
* [[MNG-4639] Be able to profile a maven build](https://issues.apache.org/jira/browse/MNG-4639)
