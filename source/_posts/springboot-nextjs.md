---
title: Spring Boot + Next.js 端口唯一代码分离方案
date: 2022-10-22
tags:
    - Next.js
    - Spring Boot
categories:
    - 天工开物
---

上周开发报表的时候实现了一个 [Spring Boot](https://spring.io/projects/spring-boot) + [Next.js](https://nextjs.org/docs/getting-started) 前后端代码分离，但是端口唯一的 WebApp 方案。这个方案既能利用好各自的生态，也能避免要起两个 server 占用两个端口的繁琐构建部署逻辑。

本文从选型到实现做一个分享，主要面向熟悉 Spring Boot 技术栈，又想跟进 React 系前端组件化方案的开发者。

<!-- more -->

## 选型对比

基本的目标是要做一个数据展示的网页应用。应用后端负责采集和分析数据，提供 API 接口获取特定报表需要的数据。应用前端需要利用各种 UI 组件库和 Chart 绘图库把从后端取得的数据良好地展示出来。

### Next.js 全栈方案

数据展示是报表系统的一个重要部分，不管后端数据处理得再好，如果没有做好数据可视化的工作，只是简单的把数据记录全部返回，决策人员很难高效的从报表中获取信息。

基于这一点，我们的方案选型需要高度重视前沿前端技术栈的兼容性。比如使用 Next.js 框架搭建报表页面，很自然地就会考虑是否可以直接用一个框架全栈解决问题。

然而，事与愿违。Node.js 的生态比起传统做数据处理的 Java/Python 生态还是非常有限，很多关键的依赖库都是缺失的。我们的主要目标是快速搞定报表系统，而不是为生态添砖加瓦。实际上，我一开始写的是 Golang 应用，后来因为要处理非结构化的 JSON 数据，Golang 没有好的 JSONPath 库，而手动定义层层嵌套的 JSON 结构体又非常折磨，所以我才转向了 Java 生态。Node.js 就更不用说了。

除了生态以外，还有我个人的问题。我接触前端开发不到一年，做数据处理这种非常结构化的后端逻辑，用静态类型带类型系统的 Java 要顺手得多。

个人熟悉程度还带来一个考量点，那就是打包的复杂性。我之所以一开始选择 Golang 实现，也是因为要搞一个 Java 项目其实还是很麻烦的，如果能快糙猛的糊完应用，Golang 还是非常舒服的。Java 的打包对于新人来说或许还很复杂，但是我已经经历过好几个大型项目嵌套模块和 Maven/Gradle 插件开发等等需求的洗礼，基本处理一个 Spring Boot 还是手到擒来。JavaScript 全栈我遇到的第一个问题就是经常需要判断自己的环境是在浏览器还是在 Node.js 上，这两个环境需要的依赖库和能做的事情的假设是不一样的。第二个问题是基于 webpack 的打包体验，我只能说懂得都懂。每个框架和工具都有自己的一套配置逻辑，一个项目配置逻辑的复杂度几乎是依赖项的乘积，重重叠加的。第三个问题是数据分析应用的开发非常依赖类型系统，而有 JavaScript 的基础在，哪怕使用 TypeScript 来开发，各种开发工具支持还是不够。

### Spring Boot 全栈方案

另外一个非常常见的方案是基于 Spring Boot 的方案。如果去掉全栈的限制，我估计 Java 生态当中开发应用和微服务的程序员，超过半数都是基于 Spring Boot 来开发的。

不过，大部分用 Spring Boot 开发的应用或微服务，只是对外提供 API 接口，另有前端开发团队来设计开发页面，调用这些 API 接口获取数据渲染页面。然而我们现在是要一个人搞定整个报表系统，出于康威定律，很自然地会考虑 Spring Boot 的全栈方案。

Spring Boot 的全栈方案其实已经很成熟了。这条技术线往上追溯，能追溯到 JSP/ASP 年代。也就是说，后端应用处理服务逻辑，加上一个模板引擎读取和 HTML 文件格式差不多又有点不一样的文件，通过扩展的方便后端填充数据的语法，在收到请求，生成好数据以后，把数据填入到模板当中，最终生成一个 HTML 页面返回给浏览器。Golang 自带的 web 方案也是这个套路，Python 生态的 Flask + Jinja2 也是这个套路。可以说，这是从后端走向前端的全栈的经典思路。

不过，这个思路会面临一个致命的问题：前端生态目前的前沿技术，依靠 Vue.js 和 React.js 的发展已经生长出一套独立的组件化开发方案，这套方案跟传统模板引擎要整合起来非常的困难。换句话说，现在已经不是用 Spring Boot 框架 + Thymeleaf 模板引擎，再从 CDN 上捞一下 Bootstrap 的 `.min.css` 文件和 `.min.js` 文件就能搞好的年代了。

要想真正用上 Vue.js 或者 React.js 的生产力，一套前端的脚手架是必不可少的。虽然最终方案其实也是一个 Spring Boot 应用加上编译出来的静态前端网页，某种意义上也可以说是 Spring Boot 的全栈方案，但是跟以往搞搞模板，或者搞搞模板加上几个手动挡的 CSS 文件、JS 脚本，还是有很大的差别。

### 前后端分离双进程方案

既然传统的模板 + Spring Boot 应用后端的方式不好走，那么是不是可以考虑就像组织内有团队分工那样，把前后端两个项目分成两个进程，做一个前后端分离的方案呢？

实话说，这个方案对于真的有团队分工，前后端团队是各自领域专家，同时还有人专门负责搞定部署和服务连通性的情况来说，是最佳的解耦方案。然而，做这个报表的只有我一个人，最多加上一两个搭把手的好兄弟。真的去做前后端分离，起两个进程的方案，部署起来其实还是相对麻烦的。

你要给 Node.js 的应用绑一个端口，然后再给 Spring Boot 应用绑一个端口，配置一下前端全栈的应用在访问 API 接口的时候转发到 Spring Boot 应用的端口。另外 Node.js 既然是一个全栈应用，比如你用 Next.js 来开发，那么其实就容易把后端逻辑割裂在两个应用之间，因为前端其实不完全是前端，它有一部分逻辑还是跑在服务端的，这部分前端的内容其实是全栈。从控制复杂性的角度出发，同一个团队或者说同一个人用这样的技术栈还是引入了太多知识负担。

### 最终方案

最终我选择的方案，如同标题和开头所描述的，是一个基于 Spring Boot + Next.js 的，代码分离但是端口唯一的方案。

具体一点说，我会用 Java 生态搞定后端数据处理的工作，基于 Spring Boot 框架完成一个 Web 应用；再仅使用 Next.js 框架前端部分的功能，利用现代化的组件化开发方案做出页面展示逻辑以后，编译出页面对应的一系列静态文件，再由 Spring Boot Web 应用把编译产生的文件作为静态资源提供给浏览器访问。

这样，Next.js 框架开发的页面不包括任何依赖 Node.js 的逻辑，自然也就不需要起一个 Node.js 进程和占用一个额外的端口来暴露服务。这些页面要想拉取数据，只需直接从 `/api/xxx` 路径访问同一个端口上由 Spring Boot Web 应用定义的 Controller 组件暴露出来的 API 端口，就可以实现了。

详细的实现方案请看下一节。

## 方案实现

完整方案实现已发布到 GitHub 平台，可以访问 [tisonkun/springboot-nextjs-demo](https://github.com/tisonkun/springboot-nextjs-demo) 仓库阅读。

### Step 1. 初始化 Spring Boot 项目

本文假设读者熟悉 Spring Boot 技术栈，这一部分就不做过多过程介绍。典型的初始化 Spring Boot 项目的方法包括：

* IntelliJ IDEA 新建项目选择 Spring Initializer Generator 直接创建模板项目。
* 从网站 [start.spring.io](https://start.spring.io/) 基于 Spring Initializer 创建模板项目。
* 安装 [Spring Boot CLI](https://docs.spring.io/spring-boot/docs/current/reference/html/cli.html) 后运行 `spring init` 创建模板项目。

> 今年初调研 r2dbc 的时候我还给 Spring Initializer 提过[一个补丁](https://github.com/spring-io/start.spring.io/commit/51e3920f86c8da483f2adb3d35f79d99766d0d6b)。

这个项目里我们选择使用 Spring 2.7.5 版本，Java 17 + Maven + Jar 打包方式，并且包含以下依赖：

* configuration-processor
* devtools
* lombok
* web

其中 web 是必须的，有了它我们才能启动一个 Spring MVC 服务。其他三个都是提升开发体验的依赖，个人推荐都选上。

出于简洁考虑，我把测试部分删除，Application 入口类重命名成 `DemoApplication` 类。这样，第一步就完成了。

### Step 2. 编写一个 API 接口

简单编写一个产生随机数据的 API 接口。

通常来说，后端返回的数据都是一个封装类转换成的 JSON 对象，这样方便迭代过程中通过增减字段来调整接口语义。哪怕是明确的返回列表的接口，也会再加一层应对可能追加的类似分页等会传输额外元数据的需求。出于简单考虑，而且在这个应用里前后端都是同一个人开发，我们对数据 payload 做一个封装，但是接口本身就直接返回数据封装类的列表了。

首先，定义封装数据的 `DataEntry` 类：

```java
package org.tisonkun.springnext.demo;

public record DataEntry(String payload) { }
```

再简单写一个 Controlller 组件：

```java
package org.tisonkun.springnext.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class DemoController {
    @RequestMapping(method = RequestMethod.GET, path = "/random-data")
    public List<DataEntry> randomData() {
        final var result = new ArrayList<DataEntry>();
        for (int i = 0; i < 42; i++) {
            result.add(new DataEntry(UUID.randomUUID().toString()));
        }
        return result;
    }
}
```

从命令行启动 Spring Boot 应用：

```bash
./mvnw spring-boot:run
```

在另一个 shell 会话中检查 API 接口正常工作：

```bash
curl localhost:8080/api/random-data

# OUTPUT:
# [{"payload": "..."}, ...]
```

### Step 3. 初始化 Next.js 项目

我们在 `src/main/frontend` 目录下初始化 Next.js 项目。这个路径并不是约定的，可以选择任意路径，不过放到 `src/main/frontend` 下是相对常用的做法。

```bash
yarn create next-app --typescript # 交互界面中输入 frontend 作为项目名
```

如前所述，我们使用静态网页生成的技术来生成前端页面。因此，我们需要在 `package.json` 文件当中添加一个 `export` 命令：

```json
{
    "scripts": {
        "export": "next build && next export"
    }
}
```

`next export` 生成的静态页面无法使用 Next.js 依赖 Node.js 运行的相关功能，可以阅读[静态网页导出](https://nextjs.org/docs/advanced-features/static-html-export)文档了解详细内容。对于我们的项目来说，需要在 `next.config.js` 文件中添加一个设置禁用图片优化功能：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true } /* >> 添加这一行 << */
}

module.exports = nextConfig
```

此外，`src/main/frontend/api` 目录代表的 Next.js 提供的 [API Routes](https://nextjs.org/docs/api-routes/introduction) 功能依赖 Node.js 环境，导出后也不可用，可以删掉。

在 `src/main/frontend` 目录下执行 `yarn export` 命令，检查导出功能正确无误。

```bash
yarn export

# OUTPUT:
# ...
# Export successful. Files written to /path/to/demo/src/main/frontend/out
# ✨  Done in 6.38s.
```

### Step 4. 添加导出页面为 Spring Boot 项目静态资源

Spring Boot 项目在默认配置下会自动添加 `classpath:/static/` 路径下的文件作为可以访问的静态资源。

我们通过 `yarn export` 导出的文件存在于 `src/main/frontend/out` 目录下，需要一个构建逻辑来拷贝输出内容。此外，上面我们是手动运行 `yarn export` 命令，可以借助 `frontend-maven-plugin` 把这一前端构建步骤整合到 Maven 的构建步骤当中。

总的来说，添加 `frontend-maven-plugin` 和 `maven-resources-plugin` 的相关配置到 `pom.xml` 文件的插件配置中：

```xml
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>1.12.1</version>

    <configuration>
        <nodeVersion>v18.11.0</nodeVersion>
        <yarnVersion>v1.22.19</yarnVersion>
        <workingDirectory>${frontend.basedir}</workingDirectory>
        <installDirectory>${project.build.directory}</installDirectory>
    </configuration>

    <executions>
        <execution>
            <id>install-frontend-tools</id>
            <goals>
                <goal>install-node-and-yarn</goal>
            </goals>
        </execution>

        <execution>
            <id>yarn-install</id>
            <goals>
                <goal>yarn</goal>
            </goals>
            <configuration>
                <arguments>install</arguments>
            </configuration>
        </execution>

        <execution>
            <id>build-frontend</id>
            <goals>
                <goal>yarn</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <arguments>export</arguments>
            </configuration>
        </execution>
    </executions>
</plugin>
<plugin>
    <artifactId>maven-resources-plugin</artifactId>
    <executions>
        <execution>
            <id>position-react-build</id>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <outputDirectory>${project.build.outputDirectory}/static</outputDirectory>
                <resources>
                    <resource>
                        <directory>${frontend.basedir}/out</directory>
                        <filtering>false</filtering>
                    </resource>
                </resources>
            </configuration>
        </execution>
    </executions>
</plugin>
```

`frontend.basedir` 属性定义在 `pom.xml` 的属性配置中：

```xml
<properties>
    <java.version>17</java.version>
    <frontend.basedir>${project.basedir}/src/main/frontend</frontend.basedir>
</properties>
```

从命令行启动 Spring Boot 应用：

```bash
./mvnw spring-boot:run
```

打开 http://localhost:8080/ 页面，确认导出页面已经被 Spring Boot 应用正确识别为静态资源：

![springboot-nextjs-index](springboot-nextjs-index.png)

### Step 5. 从 Next.js 页面访问 API 接口

接下来，我们实现使用这套技术栈最初也是最终的目的，从 Next.js 页面访问 Spring Boot 后端提供的 API 接口。

为了体现前端 UI 组件化开发的优势，我们在 `src/main/frontend` 目录下执行以下命令，引入 [Material UI](https://mui.com/material-ui/getting-started/overview/) 依赖：

```bash
yarn add @mui/material @emotion/react @emotion/styled
```

然后，根据 Next.js 框架对[创建页面](https://nextjs.org/docs/basic-features/pages)的设计，在 `src/main/frontend/pages` 目录下新建 `my-awesome-page.tsx` 文件。随后，编写页面逻辑访问 Spring Boot 后端提供的 API 接口。最终文件内容如下：

```typescript
import {useEffect, useState} from "react";
import {Alert, Box, Checkbox, CircularProgress, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import styles from "../styles/Home.module.css";
import Head from "next/head";

type DataEntry = { payload: string }
type DataEntryProps = { data: DataEntry[] }

export default function MyAwesomePage() {
    const [data, setData] = useState<DataEntry[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        fetch('/api/random-data')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    }, [])

    const content = renderContent(isLoading, data)

    return <div className={styles.container}>
        <Head>
            <title>My Awesome Page</title>
            <meta name="description" content="Generated by create next app"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
            {content}
        </main>
    </div>
}

function renderContent(isLoading: boolean, data: DataEntry[] | null): JSX.Element {
    if (isLoading) {
        return <Box sx={{display: 'flex'}}><CircularProgress/></Box>
    }

    if (!data) {
        return <Alert severity="error">Error fetching data!</Alert>
    }

    return <CheckboxList data={data}/>
}

function CheckboxList({data}: DataEntryProps) {
    const [checked, setChecked] = useState<DataEntry[]>([]);

    const handleToggle = (entry: DataEntry) => () => {
        const currentIndex = checked.indexOf(entry);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(entry);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
            {data.map((entry) => {
                const labelId = `checkbox-list-secondary-label-${entry.payload}`;
                return (
                    <ListItem
                        key={entry.payload}
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(entry)}
                                checked={checked.indexOf(entry) !== -1}
                                inputProps={{'aria-labelledby': labelId}}
                            />
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemText id={labelId} primary={`Line item ${entry.payload}`}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    )
}
```

可以看到，在 `fetch('/api/random-data')` 一行我们使用 JavaScript 的 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 从后端 API 接口 `/api/random-data` 获取数据，随后使用 Next.js (React.js) 支持的 [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) 语法组件化的开发前端 UI 页面。


从命令行启动 Spring Boot 应用：

```bash
./mvnw spring-boot:run
```

打开 http://localhost:8080/my-awesome-page.html 页面，最终效果如下图所示：

![springboot-nextjs-page](springboot-nextjs-page.png)

页面样式没有针对 Dark Mode 适配配色，如果系统配色选择 Dark Mode 的话，可以把 `src/main/frontend/public` 目录下的 CSS 文件里标记 `@media (prefers-color-scheme: dark)` 的片段删除，以获得和上图相同的渲染结果。

### Bonus. 自动补全 html 扩展名

可能有读者已经发现，我们访问最终效果页面的时候，使用的 URL 是 http://localhost:8080/my-awesome-page.html 而不是 SSR 形态的 Next.js 应用或者 Spring Boot Web 应用常见的不带 `.html` 扩展名的地址。

如果使用 http://localhost:8080/my-awesome-page 尝试访问页面，将会被重定向到 Spring Boot 应用默认的 error 页面：

![springboot-nextjs-error](springboot-nextjs-error.png)

这是为什么呢？

对于 SSR 形态的 Next.js 应用来说，根本就不存在 `my-awesome-page.html` 文件，服务端直接解析 `/my-awesome-page` 路径请求，返回对应的页面内容。如果你用 http://localhost:8080/my-awesome-page.html 访问，甚至会得到一个 404 页面。

对于不带模板引擎 Spring Boot Web 应用来说，默认 `.html` 为 view 的扩展名。当请求最后要返回视图，而视图路径没有扩展名的时候，Spring MVC 的逻辑会加上 `.html` 后缀搜索对应的视图。

然而，在我们项目中访问 `/my-awesome-page.html` 并不是访问一个 Spring MVC 语境下的视图，因为我们根本没有为 `/my-awesome-page` 路径注册 HandleMethod 组件。对比我们访问 API 端口的时候，访问路径是 `/api/random-data` 而不需要任何后缀名，这是因为我们注册了 `DemoController#randomData` 这个处理方法。

实际上，访问 `/my-awesome-page.html` 最终会 fallback 到对静态资源的访问。又因为我们从 `next export` 的导出产物拷贝到默认的静态资源路径 `classpath:/static/` 下的文件，只包括 `my-awesome-page.html` 文件，所以寻找名为 `my-awesome-page` 的文件自然会失败。

当然，就大部分应用场景，告知用户要加上 `.html` 访问也不会是一个大问题，不过这确实不是现在常见的网页访问方式。

Spring Boot 框架极大简化了以往需要大量配置文件或注解的 Spring MVC 开发模式，但是它只是基于原来的配置能力，以约定大于配置的理念，减少了必须手动填写所有配置的负担。这意味着我们仍然能够直接修改高度可配置的 Spring MVC 框架，通过拦截 Servlet 请求处理的过程，来优化访问体验，让用户也可以使用 http://localhost:8080/my-awesome-page 地址来访问我们的页面。

具体而言，我们需要添加这样一个配置类：

```java
package org.tisonkun.springnext.demo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.FilenameUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class DemoWebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
                final var isApiHandle = handler instanceof HandlerMethod;
                final var path = request.getServletPath();
                if (FilenameUtils.getExtension(path).isEmpty() && !"/".equals(path) && !isApiHandle) {
                    request.getRequestDispatcher(path + ".html").forward(request, response);
                    return false;
                }
                return true;
            }
        });
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
    }
}
```

为了使用 `FilenameUtils.getExtension` 方法，需要引入 [commons-io](https://commons.apache.org/proper/commons-io/) 依赖：

```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>
```

当然，读者如果不想引入额外的依赖，也可以自定义方法赖判断。

从命令行启动 Spring Boot 应用：

```bash
./mvnw spring-boot:run
```

输入 http://localhost:8080/my-awesome-page 打开页面，得到和上一步相同的页面渲染结果。
