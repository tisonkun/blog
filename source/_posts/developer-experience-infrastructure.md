---
title: 开发者体验的基础设施
date: 2022-10-28
tags:
    - 开发者体验
categories:
    - 夜天之书
---

本文演绎自 Kenneth Auchenberg 的 [Developer Experience Infrastructure (DXI)](https://kenneth.io/post/developer-experience-infrastructure-dxi) 博客。

原文提到，现在大部分号称以开发者优先为理念建设基础设施的公司，对开发者体验的定义和落地都不是最佳实践。原文作者认为，随着业界对开发者体验的重视和发展，将会出现一个新的领域 Developer Experience Infrastructure (DXI) 也就是开发者体验的基础设施。

<!-- more -->

## 什么是开发者体验

原文将开发者体验定义为**开发者与产品或服务的整个交互过程中得到的整体体验**。

开发者体验可以拆分成两个词：开发者和体验。

前者意味着开发者体验是面向开发者的。传统意义上，产品或服务主要服务的是终端用户，即无需掌握软件内涵，直接和终端界面交互的人。强调开发者体验，提供产品或服务的时候考虑同时满足最终用户和开发人员的需求，这将极大改善开发者生产和集成软件的体验。

原文从产品或服务的受众出发，将开发者进一步分成内部（Internal）和外部（External）的开发者。举例来说，某公司内部的流计算平台，主要目的是供公司其他团队的开发者编写流计算任务，同时，这隐含的有平台开发团队的迭代以及调试的需求，这样的平台所关注的开发者体验就是内部的。随后，当公司组织团队将平台能力包装成云服务对外销售时，它所面对的就是海量不同需求的外部开发者。

同为开发者体验，内部开发者和外部开发者的体验有不少共通之处，但是这两者具体的关注点又有所不同。例如，内部开发者通常更需要调试器和负载模拟器等的工具，以快速构建内部业务服务，而外部开发者则更加关注如何将你的产品服务与他所使用的其他技术栈集成起来。

回到对开发者体验的拆词，定义当中对体验一词的详细描述是开发者与平台的整个交互过程。这不仅仅是产品或社群等一个具体的切面，而是一种跨越一系列表面的整体体验。

### 产品体验

* Onboarding

上船体验，判断是否应该尝试这个产品。例如，我正在找一个消息队列的方案，从 [Apache Pulsar 的官方网站](https://pulsar.apache.org/)上看到它是一个云原生分布式的消息平台，再从它对[消息概念的定义](https://pulsar.apache.org/docs/concepts-messaging)判断是否符合我的生产要求。

* Scaffolding

快速搭建项目的能力。前端项目对这一点通常做得很好，大都提供了一键创建样板项目的手段，例如 [Next.js](https://nextjs.org/docs/getting-started) 的 `yarn create next-app` 命令。后端项目当中，Spring Boot 生态的 [Spring Initializer](https://start.spring.io/) 是一个有口皆碑的杀手特性，[Apache Flink](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/dev/configuration/overview) 也基于 Maven Archtype 的功能提供了快速搭建 Flink 应用模板的能力。

* API Design

好的 API 设计通常是正交的、自解释的且符合直觉的。坏的 API 设计要么是一个接口办了好几件事情，用户需要拆开而无法拆开；要么是几个接口办类似的事情，但是又都办得不好，用户用哪个都解决不了自己的问题；要么是缺斤少两，重要用户交互或管控功能没有对外暴露，功能缺失；最糟糕的情况是命名随意，从接口及其参数名称上根本搞不懂这个接口是干啥的。

* 错误信息

这里主要的原则是阅读错误信息应该是[不需要思考](https://www.swyx.io/write-errors-that-don-t-make-me-think-24hg)的，即错误信息应该以开发者理解的语言直白的表达。TiDB 有一个著名的反例：对于一个查询返回 `ERROR 9005 (HY000): Region is unavailable` 提示。这个信息对于大多数用户来说都是不可理解的，总是需要 [DBA 专门解释](https://asktug.com/t/topic/2017/7)。

* UI 的视觉体验和可交互性

UI 控件的选择和反馈是不是符合直觉的，点击和数据加载在视觉反馈上是否及时。典型的正面是 ClickHouse 在执行查询的时候，总是会先反馈预期的查询计划概要，并且实时反馈处理进展。由于分析查询大多是复杂查询，这样的设计不至于让用户在相当的等待处理时间中无法判断到底是查询耗时较长，还是已经卡死。

* Dashboard

Flink 提供了 [Apache Flink Web Dashboard](https://github.com/apache/flink/tree/master/flink-runtime-web) 界面，Pulsar 提供了 [Apache Pulsar Manager](https://github.com/apache/pulsar-manager) 软件。对于应用开发者来说，一个包含关键指标和状态的仪表盘能够极大的提升生产力。

* 可观测性、监控告警和数据指标

典型的是与 Prometheu 或 Grafana 等系统的集成。

* 源代码版本管理、代码搜索、代码评审和合作开发
* CI/CD 和测试

这方面的工具就非常多了，可以说是 DXI 早已落地的一个领域。源代码托管的 GitHub 平台，SourceGraph 代码搜索、Gerrit 或 TeamCity 代码评审、CircleCI 或 Jenkins 的测试、持续集成和持续发布等等。

* 开发者工具：编辑器、命令行工具、实用工具和集成开发环境等

例如，新工具与 VS Code 或 Jetbrains IDE 的插件集成；redis-cli 或 etcdctl 这样设计良好的命令行工具；Pulsar 发布包里 bin 目录下一系列的实用工具。

### 文档体验

* API 参考文档

对于开发者来说，最后一公里就是 API 参考文档或 DSL 语法文档。开发调试 Flink SQL 作业几乎离不开 Flink SQL 的语法文档，尤其需要反复查阅是如何写对窗口。运维 Pulsar 总是需要随时查看命令行工具的使用手册，以及 Admin REST API 的参考文档。利用 pandas 开发数据处理应用的时候，经常需要搜索怎么做某个特定的数据变换。幸运的是，API 文档往往和接口定义和注释紧密结合，同样已经有不少 DXI 可以直接生成 API 参考文档。

* 教程、指南和典型用例

这个无需多言。Spring 生态面对各种需求的海量指南 [Spring Guides](https://spring.io/guides) 就是最佳学习对象。它解决的是软件产品或服务在现实世界里如何真正起作用的问题，比如以书店为例，基于 Spring 生态如何搭起来一个 RESTful 的 Web 应用。对于基础软件比如 Apache ZooKeeper 和 Redis 来说，则会提供类似[分布式选主](https://zookeeper.apache.org/doc/current/recipes.html#sc_leaderElection)和[限流器](https://redis.io/commands/incr/)的典型用例。

* 概念定义和名词解释

Apache Pulsar 的创造者们对消息系统的理解是非常深刻的。因此，在官方网站上有 [Pulsar 对消息系统的建模](https://pulsar.apache.org/docs/concepts-overview)和关键概念的定义和解释。同样，TiDB 架构图对每个组件及其关键概念也各有解释。这样开发者才能触类旁通的阅读其他文档，以及与其他社群成员沟通。

* FAQ 和疑难杂症手册

常见的报错，常见的错误配置，常见的误用，以及如何解决这些问题。此外，还有回答“为什么不做 X 功能”，“跟 Y 软件对比有什么异同”等疑问。

* 版本策略与迁移指南

软件、产品和服务都不会永远维护，实施人员从任一个版本升级/回滚到指定版本是否可行，如果可行路径是什么。对于版本升级，什么时候需要升级，当前版本维护到什么时候。Oracle 发布的 [Oracle Java SE Support Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) 是一个很好的参考。

* README

项目的门面。通常以项目名和 LOGO 开头，随后是项目定位和核心功能，紧接着是演示图例和快速开始的指南，再有就是项目状态和元数据信息，以及一系列参考链接。

* 搜索体验
* 信息架构

这两个点的目的是一致的，即作为文档的读者，我如何从我的诉求出发，快速找到对应文档。如果文档的分级和排列，也就是信息架构设计得足够好，我总是能够快速定位到我的问题的解法。反之，如果站内搜索和文档内容 SEO 足够好，我也可以借助搜索技术从关键词定位到对应的页面。如果这两点都做得不好，就会出现文档写了，但是用户根本找不到，写了等于没写的情况。

### 内容体验

* 博客文章

PingCAP 早期发表了大量关于 TiDB 设计决策和实现路径的文章，对吸引数据库开发者和后续重复利用培训 TiDB 生态的参与者持续发挥复利作用。直到今天，阅读当时的源码阅读博文系列，以及最早的三篇存储、计算、调度的设计文章，还是了解 TiDB 核心架构设计和核心概念的最佳材料。此外，大部分产品博客还会包含新版本、新功能发布的信息，以及使用产品或特定功能实现业务的用户案例。

* 教程、指南和典型用例

这与文档体验是相似的。教程、指南和典型用例不止存在于文档当中，围绕软件产品建立社群的话，社群生产相关内容独立发布也非常常见。典型的是 baeldung 上的各种 JVM 生态教程文，以及国内几大博客平台大量的入门和配置博文。

* Demos and Workshops

Confluent 针对 Confluent Platform 的使用场景制作了一系列的示例程序，存放在 [confluentinc/demo-scene](https://github.com/confluentinc/demo-scene) 仓库中。PingCAP 举办了一系列的 Workshops 向开发者布道如何使用 TiDB 开发现实世界中解决问题的整体方案。

* 短视频和长视频

短视频往往侧重于讲清楚一个用例或者展示一个炫酷的应用，长视频则大多是对功能设计或者行业解决方案的系统论述。

### 社群体验

* 实时交互
    * 在线聊天渠道，例如 Slack 和 Discord 等。
    * 线上线下聚会、产品或行业的主题大会等。
    * 社交媒体的宣传和回应，例如 Twitter 和 HackerNews 等。
* 异步交互
    * 用户和开发者论坛
    * 产品或服务的期刊杂志
    * 年度总结或调查

原文罗列的社群体验主要关注的是渠道建设和渠道运营的角度，参考了 [The Radiating Circles of DX Architecture](https://dx.tips/circles) 一文。

## 持续增长的开发者体验需求

如今已经是软件行业发展的第五六十个年头了，单纯提供一组 API 而不做任何额外投入，这样的产品策略是没有竞争力的。软件技术发展迅速，但是需求更是日新月异。绝大部分开发者和企业系统集成商，面对的都是花样繁多的需求。某种程度上说，软件开发的需求是异构的，而不是同构的。这就要求技术公司在其产品和平台上考虑全面的开发者体验。

原文以开发一个气象数据服务为例，罗列了当前提供这样一个服务所需关注的开发者体验要素：

* 文档和内容，介绍气象数据采集和处理的领域特定知识，使得开发者和用户能够有基本的通用语言来描述和对齐问题。
* 良好的错误信息和 API 语义，避免前文提到的那些负面体验。
* API 参考文档。如前所述，这是开发者编写应用的最后一公里。
* SDK 开发套件，比如多语言访问数据服务的接口，以及基于基础 API 的领域特定接口封装。
* 基本的 API 架构能力。例如鉴权、流量控制和应用日志等等。
* 调试工具。比如请求的 trace 记录和分析等。
* 交互式集成。在线教学环境，这一点许多前端项目与 CodeSandbox 集成的很好。
* Dashboard 界面，用于管控、运维和监控等等。
* Webhooks 或云上消息队列，提供订阅变更数据的能力。
* 社群和生态的参与，包括举办活动、会议、教学材料和集成案例等等。
* 反馈循环系统，将用户和开发者的体验反馈交付到产品团队，并持续检验产品团队采取策略的效果。
* 平台特定的开发工具。例如命令行工具，编辑器集成和 NoCode 平台的集成等。

日益复杂的开发者体验需求，使得包括 [Netlify](https://www.netlify.com/blog/2021/01/06/developer-experience-at-netlify/) 和 [Vercel](https://leerob.io/blog/dx) 在内的面向开发者的企业，将他们原本的开发者关系（DevRel）团队重新定位成开发者体验团队，以关注开发者体验的整个旅程，而非聚焦在面向开发者的营销和布道上。

原文作者观察到，某些企业已经开始组建开发者体验部门，这个部门作为公司的核心能力中心之一，横向整合工程师团队和市场团队的能力，以全面提升公司产品和服务的整体开发者体验。

这种变迁体现在开发者布道师逐渐需要参与到某种类似于开发者体验工程的工作当中。这就像市场部门从传统的对外宣发，转向用户增长工程。好的开发者体验需要同时关注开发者参与带来的输入，以及开发者布道带来的输出。

对于这种职能的变迁，原文作者认为关注对外宣发的开发者关系团队难以很好的胜任全面的开发者体验工作。他在推特上有[系列推文](https://twitter.com/auchenberg/status/1495559802973392896)讨论开发者体验部门的组织定位问题。

如果开发者体验工作做得不好，企业将会付出什么代价呢？通常来说，这意味着巨大的机会成本。

现代企业的业务发展离不开软件及其开发者。开发者是业务发展的效率倍增器。开发者能够发挥出多少生产力，与组织创造多少收入、有多大的能力推出新功能和利用新机会息息相关。

[2018 年 Strip 的一份报告](https://stripe.com/newsroom/stories/developer-coefficient)估计，提升软件开发者的生产力将在十年间对全球 GDP 产生 3 万亿美元的影响。通过提升开发者体验，改善开发者构建效率，整体的开发效率可能有 31.6% 的提升。

报告当中的效率主要通过单位时间生产价值来衡量。开发者为了完成工作，经常需要理解所使用的产品如何帮助他达成目的。前文提到的四种类型的体验有助于缩短这一过程的时间。然而，现实情况是，尽管开发者的用工成本不低，但是他们常常很难得到必要的工具、文档、指南和示例代码的支持，很难无感知的完成集成。

好的开发者体验让这个流程异常丝滑。例如我就曾经对比过 Cockroach Cloud 让我在两分钟内就完成申请账号、创建集群和连接集群运行基本查询的工作，而 TiDB Cloud 上来就想收集我的个人信息，有一个对开发人员来说深感不适而且算得上很长的表单，别说完成前面的一系列流程了，就连注册的意愿也烟消云散。Spring 生态是另一个例子，依靠丰富的教程、指南和强大的社群生态，几乎所有开发者遇到的问题都可以 Google 到答案，很少让开发者陷入 troubleshooting 的鬼打墙状态里。

构建这样丝滑的开发者体验，要求的是构建者高超的技艺和辛勤的工作。这或许也是一本重要的领域书籍命名为[《社群运营的艺术》](https://book.douban.com/subject/26976995/)的原因。

然而，上面罗列的开发者体验分点和气象数据服务案例中的清单项目，对于大多数公司来说都难以实现。对于这些企业而言，提供顶级的开发者体验需要大量投入，而它们既没有建立建设开发者体验需要的专业知识，也没有意愿投入资源以改变现状。

最终的结果就是大多数公司在推出公司内部的解决方案的时候，提供的内外部开发者体验都是不理想的。随着时间的推移，这些解决方案逐渐演变成大泥球式的技术债，严重影响了开发者的效率。以我个人的经历而言，几乎每家大公司都有这样谁也不愿意维护的系统，每个维护的人都坚持不过三个月就转岗或者离职。这对于公司决策层来说经常是不可见的成本。

从另一个行业发展的角度观察，尽管云基础设施的兴起帮助企业快速交付新功能 API 以及面向开发者的服务，但是云的赋能不能覆盖开发者体验的部分。也就是说，借助云服务的能力，并不能够自然而然地做好开发者体验。

这就引出了对开发者体验的基础设施的需求：我们需要一种新的、可扩展方式来思考开发者体验。

## 开发者体验的基础设施的出现

原文对开发者体验的基础设施的定义如下：

**开发者体验的基础设施（DXI）是一个新兴的基础设施分类，从底下的内核技术到顶上的开发者终端，其位置处于 API 和云基础设施之上。任何企业都可以通过将构建开发者体验的细节和复杂性转移到这一基础设施的组件及其服务之上，来轻松地提供世界级的开发者体验。**

DXI 按照前文讲述的分类方式，提供构成完整的开发者体验的基础组件，以此降低了构建面向开发者的产品的门槛。通过降低这些门槛，DXI 有可能从根本上改变企业交付面向开发者的产品的方式。因为选择 DXI 的公司能够以最低的投资提供最好的开发者体验，以接触到最广泛的开发者群体，这就扩大了公司的潜在市场规模。

下图是原文引用的 DXI 全景图。这张图显然是不完全的，同时也有许多新兴的提供 DXI 能力的公司不断出现。

![Developer Experience Infrastructure market map](dxi-map.png)

## 开发者体验的基础设施的未来

传统企业大多在企业内部解决开发者体验的需求，包括文档、UI 设计和实现、SDK 开发等等。但是随着开发者体验的需求的发展，这种状况正在发生变化。

不少企业已经意识到，如今软件产品或服务想要成功销售出去，需要大量投资在提供良好的开发者体验。为了提升这一投资的转化率，决策者们已经开始使用或购买新兴的 DXI 服务以取代内部开发的解决方案。

例如，Bytebase 在其博客文章[《一家全球化初创公司背后的 30+ SaaS 服务和成本》](https://mp.weixin.qq.com/s/eC9wvYladWevRZp8gc6a8Q)当中罗列的服务，就有相当部分属于 DXI 领域。

原文进一步提到，DXI 领域正处于起步阶段：有几家种子轮的公司，少数 A 轮的公司，以及几家 D 轮的公司，目前还未出现明显的领军企业。原文作者相信，整个 DXI 领域仍然有无人进入的处女地垂直领域，因为构建最佳开发者体验的竞争不是一个零和游戏。如同现实世界的软件需求是多样异构的一样，开发者体验的需求以及对于基础设施的开发，仍然需要更多的人才、更多的工具和更多开发者体验团队的投入。

开发者体验的需求持续增长，对应的 DXI 的需求也会越来越明显和急切。这与过去十几年间数据系统和云服务的发展轨迹相似：一开始，企业在内部构建一次性解决方案。随着这种方式越来越无法跟上企业日益增长的数据处理和分析的需求，企业开始转向专门的基础设施提供商提供的服务。

回到国内的情况，由于工程师红利尚存，许多企业仍然会选择内部构建数据分析技术栈，更不用说对开发者体验的需求还没有被行业和市场充分理解。哪怕这些需求发展到非常复杂和重要，由于基础设施关注到的是最大公因数，对于需求极度复杂的超级企业，或者开发者体验对核心产品成功及其重要，需要大量定制化的场景，总会有公司需要在内部构建开发者体验工程，而不是依赖基础设施。

然而，DXI 的发展和使用能够为开发者体验领域提供一个行业基线，我们将看到新一代的公司使用 DXI 作为基线，并持续创新。这一愿景就像是今天的云服务市场：今天，新兴企业默认的选择就是云原生的技术和技术栈。但是只要看到十年前，这种提法还是相当的不成熟。十年前的云服务市场就是 DXI 的现状。

过去十年间，公司的决策者不断自我提问，如果云服务能够提供更实惠的价格和更好的体验，为什么要维护一套内部的数据中心。如今，公司的高管也开始将这个问题抛给公司内部的开发者体验工作。这就是开发者体验的基础设施未来的机会。

## 原文参考材料与致谢

* [The Developer Coefficient](https://stripe.com/files/reports/the-developer-coefficient.pdf), Stripe, September 2018
* [Tyler Jewell](https://substack.com/profile/15568990-tyler-jewell) of Dell's, [Developer-led landscape](https://tylerjewell.substack.com/p/the-developer-led-landscape-20-08-28).
* [Patrick Salyer](https://www.forbes.com/sites/patricksalyer/) of Mayfield's [API Stack](https://www.forbes.com/sites/patricksalyer/2021/05/04/api-stack-the-billion-dollar-opportunities-redefining-infrastructure-services--platforms/?sh=3a4123fc43f9).
* Jerry Chen & Corinne Riley of Greylock, [Cloud Challenges](https://greylock.com/greymatter/funding-the-cloud-challengers/).
* McKinsey's [Why your IT organization should prioritize developer experience](https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/tech-forward/why-your-it-organization-should-prioritize-developer-experience).
* Postman's [API Platform landscape](https://blog.postman.com/2022-api-platform-landscape-trends-and-challenges/).
* [Jean Yang](https://twitter.com/jeanqasaur)'s [The Case for Developer Experience](https://future.a16z.com/the-case-for-developer-experience/).

Thanks to @astasiaMyers, @chris_trag, @dalmaer, @friism, @ericsimons40, @nickBruun, @mortenjust, @mxstbr, @ow, @swyx, @zachtratar for providing feedback on early drafts of this post.
