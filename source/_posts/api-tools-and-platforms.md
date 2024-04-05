---
title: Web API 的开发工具和平台
date: 2023-05-17
tags:
    - API
categories:
    - 夜天之书
---

上一篇文章《{% post_link what-is-api %}》的落脚点是 Web API 的体验。

Web API 作为许多软件的第一道门面，提升其体验的努力从来没有停止过。今天，围绕 Web API 的开发体验和使用体验，已经成长出一个庞大的软件生态。本文以常用的 Web API 开发工具和平台为切入点，介绍当前 Web API 的开发者基础设施。

<!-- more -->

## 终端工具

最初的 Web API 开发者显然是黑客，而黑客们的开发工具大多是终端工具，也就是不依靠图形化界面，而是以纯文本来交互的工具。

### GNU wget

早期广外流传的 Web API 工具非 [GNU wget](https://www.gnu.org/software/wget/) 莫属。今天，你仍然可以在许多软件的官方网站上看到形如 `wget ...` 的下载安装指南。

![GH Archive 网站提供了 wget 的下载指南](gharchive-wget.png)

通过 `man wget` 可以查看其使用手册，共约 2000 行。wget 作为初代 Web API 工具，提供的是基础的下载网络资源的功能。随着网络技术的迭代，它会引入一系列新的参数来支持新的功能，但是整体还是偏向于简单，并且新参数的引入很有时代特色：后来的工具，往往能对早先的技术探索作扬弃和合并，但是一路跟进技术发展的工具，尤其是大众工具，常常因为需要保持向后兼容而不能移除跟进早期探索的不完美实现。

![wget 的手册](man-wget.png)

wget 支持的功能可以这么分类：

1. 最基本的从一个指定的 URL 下载内容。
2. 定义下载内容存放到具体路径的系列参数。
3. DNS 和代理解析的支持。
4. 下载的重试和超时参数。
5. 指定 HTTP 的各种具体参数，包括 Cookie 和 Header 等等。
6. HTTPS (SSL/TLS) 相关的支持。

这也是后续所有 Web API 工具和平台的基本功能集必须包含的能力。

### curl

如果说 wget 有一个后继者，那一定就是 [curl](https://curl.se/) 了。

![许多软件提供基于 curl 的下载命令](rustup-curl.png)

wget 只支持 HTTP(S) 和 FTP 两种协议，而 curl 作为 Web API 开发的瑞士军刀，支持的网络通信协议就非常多了：

> curl is a tool for transferring data from or to a server. It supports these protocols: DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP, WS and WSS. The command is designed to work without user interaction.

curl 的参考手册有 6000 余行，是 wget 的三倍。这都显示出 curl 的特点：大而全的功能。curl 对常见操作都做了专门的易用性优化，例如：

1. 不同的 HTTP method 通过 `-X` 指定，例如常用的 `-X POST` 等。
2. 传入数据通过 `-d` 指定，并支持 `-d @filename` 从文件获取传入数据的方式。
3. HTTP header 通过 `-H` 指定，比如 GitHub 请求时常用的鉴权信息就是以 `-H "Authorization: ..."` 的方式传入的，同样还有 `-H "Accept: application/json"` 指定数据编码信息。

把短参数交给常见操作的命名，可以看出 curl 是对开发者体验下过一番功夫的。

此外，curl 兼顾了终端用户和脚本的需求，即同时提供正交的参数设计和面向终端用户优化的聚合参数。

* `-X` 和 `-H` 这样的通用参数，适合脚本批量生成结构化的 curl 命令。
* `-e` 和 `-A` 这样的聚合参数，适合用户用更短的字符表达常用的操作。

由于 curl 设计当中的正交性和对多样功能的支持，Postman 提供了把请求导出为 curl 的功能。ReadMe 提供的页面内，从命令行提交 Web API 请求的也是一个 curl 命令。

### jq

[jq](https://stedolan.github.io/jq/) 是一个非常年轻的命令行工具，专门用来分析 JSON 数据。从 2012 年开始开发，十年间已经获得 2.5 万个 star 的成绩。由于其广泛使用，甚至在 GitHub Actions 的官方 Runner 中都预装了这个软件。

![jq star history](star-history-jq.png)

作为一个专门的 JSON 数据分析工具，它在 Web API 的开发工具中占据一席之地的原因，是目前几乎所有返回复杂结果的 Web API 都采用 JSON 的格式编码数据。

jq 最基本的使用方式是 `curl ... | jq` 也就是先用 curl 拉取数据，然后丢进 jq 处理器解析。哪怕什么参数都不带，jq 默认格式化 JSON 数据，也能极大提升一个长行返回结果的接口的体验，而 jq 默认将结果染色，也能极大改善阅读 API 返回结果的体验。

![sample-full-jq](sample-full-jq.png)

除此以外，最常用的方法就是选择 JSON 文本的部分属性，筛选出感兴趣的内容。这在 REST API 总是无差别的返回大量内容的情况下尤为有用。

![sample-transform-jq](sample-transform-jq.png)

### HTTPie

[HTTPie](https://httpie.io/) 是 Web API 工具中从终端走向 Web UI 的一个尝试。

它在功能集上和 curl 没有太大的区别，但是在参数的设计上进一步简化了常见场景的交互方式。HTTPie 的基本命令如下：

```shell
http [METHOD] URL [REQUEST_ITEM ...]
```

其中 METHOD 指的是 GET / POST / PUT / DELETE 这样的 HTTP 方法。如果命令不传递任何输入数据，则默认用 GET 方法发送请求，否则默认用 POST 方法发送请求。

为了进一步简化 Headers 和输入数据的体验，HTTPie 对 REQUEST_ITEM 做了一定的编码约定：

```
REQUEST_ITEM
    Optional key-value pairs to be included in the request. The separator used
    determines the type:

    ':' HTTP headers:

        Referer:https://httpie.io  Cookie:foo=bar  User-Agent:bacon/1.0

    '==' URL parameters to be appended to the request URI:

        search==httpie

    '=' Data fields to be serialized into a JSON object (with --json, -j)
        or form data (with --form, -f):

        name=HTTPie  language=Python  description='CLI HTTP client'

    ':=' Non-string JSON data fields (only with --json, -j):

        awesome:=true  amount:=42  colors:='["red", "green", "blue"]'

    '@' Form file fields (only with --form or --multipart):

        cv@~/Documents/CV.pdf
        cv@'~/Documents/CV.pdf;type=application/pdf'

    '=@' A data field like '=', but takes a file path and embeds its content:

        essay=@Documents/essay.txt

    ':=@' A raw JSON field like ':=', but takes a file path and embeds its content:

        package:=@./package.json

    You can use a backslash to escape a colliding separator in the field name:

        field-name-with\:colon=value
```

此外，为了简化本地测试的键入内容，`http :<port>/path` 意味着向 `localhost:<port>/path` 发送请求。

最后，HTTPie 的输出默认就是以最佳阅读效果为目标上色的。

![sample-full-httpie](sample-full-httpie.png)

可以看到，HTTPie 有很多专门为 Web API 开发者定制设计的特性，这也对得起它的定位：

> HTTPie: modern, user-friendly command-line HTTP client for the API era.
>
> HTTPie (pronounced aitch-tee-tee-pie) is a command-line HTTP client. Its goal is to make CLI interaction with web services as human-friendly as possible. HTTPie is designed for testing, debugging, and generally interacting with APIs & HTTP servers. The http & https commands allow for creating and sending arbitrary HTTP requests. They use simple and natural syntax and provide formatted and colorized output.

当然，跟 curl 对比起来，这样追求 human-friendly 的工具，自然也就不太适合机器或脚本自动生成规整的命令。

HTTPie 的团队提供了一个简易的 [Web UI 工作台](https://httpie.io/app)。

![webui-httpie](webui-httpie.png)

这个平台后端应该复用了 HTTPie Web 客户端的代码，但是跟命令行参数的解析应该就没什么关系了。这种通过 Web UI 填入参数和查看结果的做法，跟 Postman 的设计是高度一致的，适合不喜欢终端交互，更喜欢跟图形界面打交道的人。同时，Web UI 缓存用户数据的能力，也比命令行自己管理输入输出要省事儿不少。

## Web API 平台

HTTPie 做 Web UI 是顺应 API 时代的潮流，在这个潮流下，大量的 Web API 平台应运而生。它们或者关注在 Web API 的设计，或者关注在开发和协作，或者关注在测试和自动化，或者关注在文档化。

除了测试和自动化大多是和通用框架结合，只是提供一些增强的构建块和测试断言，我认为没什么专门讲的价值，其余的几个主题本节各取一个代表介绍。

### Swagger

严格来说，Swagger 是一个完整的 Web API 开发框架，不仅有 OpenAPI 标准定义 Web API 的接口协议，还有一整套工具生成代码、文档和在线调试。

但是 Swagger 最大的特色还是它的 OpenAPI 标准，即按照 REST API 的资源定义来描述当前 URL 下各个资源路径支持何种操作，传入参数和传出结果的类型和约束的一套标准。

例如，定义一个获取宠物信息的简单 REST 资源对应的 OpenAPI 配置片段如下：

```yml
paths:
  /pet:
    put:
      tags:
        - pet
      summary: Update an existing pet
      description: Update an existing pet by Id
      operationId: updatePet
      requestBody:
        description: Update an existent pet in the store
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
        required: true
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '405':
          description: Validation exception
```

这些定义就像 Kubernetes Operator 领域里的 CRD 那样，通常都不是人写的，而是使用 [swagger-core](https://github.com/swagger-api/swagger-core/wiki) 一类的库先用某种程序设计语言写出 REST API 的定义和实现，再转成 OpenAPI 的定义。而后，如果要提供其他语言的客户端或服务端实现，再从 OpenAPI 标准的定义里生成对应的 stub 代码。

![平台化开发、测试和自动文档化](platform-swagger.png)

OpenAPI 的生态非常繁荣，只要把 Web API 导出成 OpenAPI 的格式，基本就可以轻易地接入其他工具和平台做文档化、自动化测试和代码生成。

### Postman

[Postman](https://www.postman.com/) 可以说是 API 开发和协同平台最有名的创新团队，目前 API 平台商业化的龙头。HTTPie 的 Web UI 基本是 Postman 的一个极简青春版。

Postman 最基本的功能是帮助开发者调试应用开发时需要访问的一众 API 并保存测试结果。进一步地，Postman 对常见的请求参数构造做了集成，帮助开发者更快速全面地测试 API 的可用性。最后，Postman 面向 API 的设计者推出了一系列辅助设计和管理 API 的功能。

![Postman 的主页案例](postman-demo.png)

Postman 的功能非常简单，但是它充当了连接开发者和服务提供方的重要桥梁。

在 Postman 上，你可以立即开始测试业务流程中对 Slack API 或者 Twitter API 的请求。国内的竞品 Apifox 抓住了这个重点，通过 [API Hub](https://apifox.com/apihub/) 提供了企业微信 API 和钉钉 API 等等业务实际依赖的服务的在线调试界面。

![webui-apifox](webui-apifox.png)

### ReadMe

[ReadMe](https://readme.com/) 这个讨巧的域名对应的 API 平台服务专注于 API 文档及其用户旅程反馈。

上面提到的 Swagger 和 Postman 其实都提供了发布 API 文档和在线调试的能力，相较之下，ReadMe 提出的核心理念是：

> Behind every API call is an API user. So why do your docs treat them all the same?

因此，它关注的不是 API 的开发，而是已有 API 并发布以后，用户实际在 API Doc 页面上调试的路径和正负反馈。

![ReadMe 后台数据](platform-readme.png)

## API 开发的基础设施的意义

从面向黑客的命令行工具到 Web UI 开发设计平台，再到面向用户的 API 文档、测试和交流平台，Web API 的体验优化从提升开发者体验开始，最终惠及终端用户。

虽然 Web API 的体验最终是由用户定义的，但是开发 Web API 并改善其各方面体验的，是开发 API 的工程师。因此，提升他们的开发体验，改良他们手中的工具和开发平台，恰恰是优化用户体验的前提条件。

这跟手工艺者的工作变革是一致的：如果没有优良的机器和流水线，固然还会有少数能工巧匠能够做出高质量的工艺品，但是行业的平均水平和普通顾客能负担的产品整体质量是不足的。只有把最佳实践基础设施化，提高整个行业的基线，才能促进行业整体的进步。

开发 Web API 的工程师只有利用工具和平台节省在重复的实现和测试上的时间，才能有更多精力考虑如何设计出好的应用接口。软件应用之间通过好的接口集成组装，才有可能做出更加丰富的终端应用，最后改善终端用户的体验。
