---
title: Web API 简介
date: 2023-04-24
tags:
    - API
categories:
    - 夜天之书
---

Application Programming Interface (API) 即应用程序接口。顾名思义，它是开发者访问应用程序的接口。

例如，你可以通过以下命令查询 GitHub 上特定代码仓库的元数据信息：

```shell
curl https://api.github.com/repos/apache/pulsar
```

GitHub 会返回以下信息：

```json
{
  "id": 62117812,
  "name": "pulsar",
  "full_name": "apache/pulsar",
  "private": false,
  "size": 185304,
  "stargazers_count": 12577,
  "watchers_count": 12577,
  "language": "Java",
  "visibility": "public",
  "forks": 3269,
  "open_issues": 1197,
  "watchers": 12577,
  "default_branch": "master",
  // ...
}
```

<!-- more -->

从提供 API 的开发者的角度看，API 解决了一个常见的问题：如何将自己的代码开放给其他开发者去使用，以及如何让他们基于自己的代码进行创新。

现代软件开发的过程并非开发者完全从头编写每一行代码。相反，行业当中已经有相当数量的成熟应用提供公开服务。这些服务涵盖支付、通信、授权和身份认证等领域。在构建一个新软件时，软件工程师的工作就是使用这些 API 来组合新产品。重用他人的代码可以大大节省自己的时间，并且可以避免部分重复造轮子的操作。此外，使用业内约定俗成的公开服务，能够降低用户使用和其他应用集成的门槛。

## Web API 的范畴

广义上的 API 包括太多内容，几乎只要是能够调用另一段代码的方法，都在 API 的范畴之内。甚至稍加琢磨，说不定能出一个 API 版本的阵营九宫格。

把范围缩小到 Web API 上来，这样的应用程序接口只会被调用方经由网络访问，这同时也意味着其访问方式是独立于特定编程语言的。

![Orbit API 实例](orbit-api-users.png)

例如，在上面的 API 实例中，右上角展示的访问该 API 的方式，基本是一个语言无关的 HTTP 请求，而使用各个语言通用的 HTTP client 库，就可以对这一 API 进行集成。

经常与狭义的 Web API 相混淆的，是 Software Development Kit (SDK) 即软件开发工具包。例如，GitHub 在语言无关的 REST API 的基础上，还提供了不同语言的 Octokit SDK 库：

* [octokit.js](https://github.com/octokit/octokit.js)
* [octokit.net](https://github.com/octokit/octokit.net)
* [octokit.rb](https://github.com/octokit/octokit.rb)

通常，SDK 是 Web API 的精简抽象层。它们与特定编程语言的习惯和范式集成，帮助开发者略过原始的 Web API 调用细节利用接口。同时，与特定语言的集成使得开发者能够使用强类型系统和集成开发工具来调试应用程序。

不过，SDK 也有如果跟开发者常用的语言不符合，就很难发挥作用，以及如果不能保证和 API 提供的功能的同步，就会让开发者不得不 fallback 到 API 接口上的问题。例如，OpenDAL 在经过一段时间使用后，从 AWS S3 SDK 切换到[纯粹 HTTP client 访问](https://github.com/apache/incubator-opendal/pull/152)。

![say goodbye to aws-s3-sdk](opendal-replace-aws-s3-sdk.png)

## Web API 的范式

狭义上的 Web API 支持客户端通过 HTTP 协议访问，而且通常请求和回复都是纯文本，尤其是 JSON 格式的纯文本。

[gRPC](https://grpc.io/) 和 [Apache Thrift](https://thrift.apache.org/) 虽然也可以定义语言无关的应用程序接口，使用 HTTP 协议通信，但是由于其内容通常是不可读的字节流，且在当前的生态支持下几乎总是需要通过 SDK 来访问特定服务接口，所以并不属于典型的 Web API 范式。

### REST API

REST API 是典型的 Web API 范式，甚至当提起 API 这个概念的时候，直觉的反应就是一组 REST API 定义。

REST API 定义了一系列可以访问的资源，并使用标准的 HTTP 方法来表示针对这些资源的创建（Create）、读取（Read）、更新（Update）和删除（Delete），即 CRUD 事务。

例如，[GitHub REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28) 将用户、组织、仓库、Issue 和 Pull Request 等等都表示为资源。以 Pull Request 为例，以下是不同操作在 HTTP 方法上的映射：

| 操作   | HTTP 方法 | URL (/pulls)              | URL (/pulls/{pull_number}) |
| ------ | --------- | ------------------------- | -------------------------- |
| Create | POST      | 创建一个新的 Pull Request | 不支持                     |
| Read   | GET       | 列出所有 Pull Requests    | 查询指定 Pull Request      |
| Update | PATCH     | 未实现                    | 更新指定 Pull Request 状态 |

当然，还有很多的操作并不能够映射成 REST API 原教旨概念下的资源。这个时候的处理方式，要么是把操作写进请求字段里，要么是把操作视为一种资源，要么是把操作写到 URL 中间。

GitHub 提供的[更新仓库的 API](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository) 支持传入 archive 参数代表把仓库归档。

![github-rest-api-archive](github-rest-api-archive.png)

GitHub 的 Pull Request API 有一个 [merge](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#merge-a-pull-request) “资源”来表示合并一个 Pull Request 的请求。

![github-rest-api-merge](github-rest-api-merge.png)

GitHub 提供了一个[通用的查找接口](https://docs.github.com/en/rest/search?apiVersion=2022-11-28)来查询不同的资源，其请求采用 `GET /search/code?q=:query` 的形式指定查询的资源和模式。

![github-rest-api-search](github-rest-api-search.png)

### GraphQL

不同于上面介绍的 REST API 及其超越原教旨资源定义的范式，Facebook 开发了 [GraphQL](https://graphql.org/) 查询语言。实现上，它也是对外暴露一个 HTTP 端点，例如 GitHub 的 GraphQL 端点可以通过以下方式访问：

```shell
curl -H "Authorization: bearer TOKEN" https://api.github.com/graphql
```

通过这个端点，GraphQL 把实际的查询或修改操作都收纳到了请求字段里，即以 `query` 或 `mutation` 为最外层定义的一个层级结构。

我不想在这里介绍太多 GraphQL 的例子，因为它真的非常难用，而且开发生态奇差无比，除非迫不得已，否则当今的开发者应该没有使用 GraphQL 的理由。而这个迫不得已的理由就是 GitHub 对外暴露的 API 的一部分，只能使用 GraphQL 访问，或者使用 GraphQL 访问有巨大的优势。

这个巨大的优势就是 GraphQL 允许用户在一个请求当中做嵌套查询和跨资源获取数据，同时指定需要返回哪些字段。这样，一个用户视角的综合需求可以通过一次请求完成，同时跨网络传输的字节尽可能的少。只要你试过用 GitHub REST API 查询数据，你就会知道那些常用的端点它会返回多少你永远不会使用的字段数据。

![REST API 可能返回大量用不上的字段](github-rest-api-result.png)

### 事件驱动型 API 范式

上面介绍的都是请求响应式的 Web API 范式，即客户端主动发起一个请求，服务器响应处理后返回结果，一次调用结束。

许多情况下，客户端程序会希望服务器在特定事件发生时主动向推送一个通知，或者保持一个全双工的连接，长时间地实时交互数据。

这些场景统称为事件驱动型 API 范式。相比于 REST API 及其扩展形式，它们的用例不够普遍，因此生态也较为薄弱，但是仍然比 GraphQL 要好上不少。

WebHook 是一种轻量级的事件驱动型 API 范式，用户注册一个 WebHook 回调的 URL 地址以及回调规则，服务器在发生匹配上规则的事件时，调用 WebHook URL 并发送事件内容。[GitHub WebHook](https://docs.github.com/en/webhooks-and-events/webhooks/about-webhooks) 以及其上的 [GitHub Apps](https://docs.github.com/en/apps) 就是在这个范式下工作的。

跟程序设计范式里通过 callback 组织控制流通常比 fallthrough 的控制流更难理解一样，理解 WebHook 的调用过程需要绕一个弯。GitHub Apps 在此基础上还要走一个多次 callback 的鉴权逻辑，过程就更加复杂。这里不做展开，可以跳转上面的链接自行尝试理解。

WebSocket 是一种全双工通信的 Web API 范式。客户端发送请求到服务端，建立起一个长连接，客户端和服务器可以同时发送和接收消息。

专注数据展示的低代码框架 [Streamlit](https://streamlit.io/) 就使用 WebSocket 来维持客户端和服务器的链接，既支持客户端请求新的数据和改变渲染逻辑，又支持服务器主动刷新数据结果并推送到客户端。

然而，WebSocket 对网络的稳定性有比较强的要求，如果链接中断，客户端需要重新启动并再次建立起长链接。如果你尝试在 Heroku 或 Google App Engine 这样 IP 经常漂移的环境部署 Streamlit 的实例，你就会发现服务经常卡死以至于几乎不可用。

最后一种事件驱动型 API 范式可以算作请求响应式 API 的扩展。HTTP Streaming 支持服务器对单个请求分批次响应无限程度的数据。

ChatGPT 底层的 OpenAI API 就[支持 HTTP Streaming](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb) 的 API 范式，这也是你在网页端能够看到 ChatGPT 源源不断地返回结果，而不需要等待服务器计算出完整的响应，再一次性返回整个答复的技术原理。

![openai-streaming](openai-streaming.png)

## Web API 的体验

上面的举例过程中，无论是 Orbit 直接在网页端就可以尝试的文档，还是 GitHub 详尽的 REST API 解释和可复制粘贴的代码片段，再到 OpenAI 以 Jupyter Notebook 展示的使用案例，这些优秀的 Web API 提供商的实践说明了一件事：API 的使用体验至关重要。

构建可扩展、设计良好的 API 是一个良好的开始，这表示你对自己提供的应用程序系统有深入的理解和工程能力。但是，“只要构建好 API 用户就自然会使用”，这样的想法显然太过理想化。

开发者使用 API 的体验由许多部分构成，API 设计良好只是其中产品体验的一部分，针对不同层次的开发者，相应的文档内容体验和社群体验都需要投入建设。这个完整的构建开发者生态的工作被定义为开发者关系。

在专门讨论如何设计 Web API 的[《Web API 设计》](https://book.douban.com/subject/30327034/)一书中，专门花了三个章节讨论这个问题。[《开发者关系：方法与实践》](https://book.douban.com/subject/36337667/)则是专门讨论开发者关系工作的有益补充。我此前发布的《{% post_link developer-experience-infrastructure %}》也值得一读。

这里需要单独拿出来稍作展开的，是围绕 API 的设计、测试和发布构建的一系列 API 平台。API 平台是开发者体验基础设施的一环，它的出现是 API 的价值的反映，同时也代表了业界对 API 的设计跟整个生命周期认识的一个基准线。

其中最有名的当属在 2021 年融资 2.25 亿美元的 [Postman](https://www.postman.com/) 公司。它最基本的功能是帮助开发者调试应用开发时需要访问的一众 API 并保存测试结果。进一步地，Postman 对常见的请求参数构造做了集成，帮助开发者更快速全面地测试 API 的可用性。最后，Postman 面向 API 的设计者推出了一系列辅助设计和管理 API 的功能。

![Postman 的主页案例](postman-demo.png)

此外，Orbit 提供的可以在线交互调试的 API 文档页面也不是自研的，而是 [readme.com](https://readme.com/) 的产品。它在交付一整个 API 文档站的基础上，支持用户在线交互调试，并在后台记录这些交互数据，以帮助 API 的设计者得到用户真实的使用反馈。

最后，在这些商业支持的集成平台之外，类似 [curl](https://curl.se/) / [httpie](https://httpie.io/) / [jq](https://stedolan.github.io/jq/) 这样的开源命令行工具，以及 [Swagger](https://swagger.io/) 这样的开放 Web API 定义标准和套件，也是 Web API 如此繁荣的重要生态支柱。
