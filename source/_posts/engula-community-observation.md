---
title: Engula 开源共同体观察报告
date: 2021-12-05
tags:
    - Engula
    - 开源
---

Contributor 参与开源共同体的过程一定会问两个问题，第一个是我能为你做什么，第二个是我该怎么做到它。本文以观察报告的形式总结了我在参与 [Engula](https://engula.io/) 开源共同体期间的体会，以及 Engula 现有的部分切入点，可以作为想要参与的同学的参考。

Engula 的设计目标是一个弹性、自适应、可扩展、平台无关的 serverless 存储引擎。基于 Engula 可以实现高可靠且高性价比的数据处理逻辑，例如数据库。Engula 从今年八月份开始以开源协同的方式发起，所有代码以 Apache 2.0 协议授权，使用 Rust 语言开发。

<!-- more -->

“好的软件作品，往往源自开发者的个人需要。”这句话对于 Engula 而言也是成立的。因为看到了云原生时代单机系统演进为集群系统的趋势，深感于云数据库等数据处理逻辑在新时代下重复实现存储引擎的冗余，Engula 将存储系统的基本功能模块化后就云环境做了针对性设计，从而支持后来的开发者在实现云环境的数据处理逻辑时，能够有开箱即用的存储系统功能，例如共识、复制、缓存、压缩等等，以及针对不同功能的不同资源配置。

今年十月份，Engula 发布了[概念验证报告](https://engula.io/posts/demo-1)。目前概念验证阶段已经结束，共同体成员正在主分支上以发布第一个原型版本为目标快速迭代。

## Engula 开源共同体的沟通

讨论具体的项目内容之前，我想先介绍一下 Engula 开源共同体的沟通手段。这样，在讲到具体的参与切入点的时候，你也能知道应该以什么方式与其他成员沟通。

目前，Engula 所有正式的讨论和开发都发生在 GitHub 上。[项目代码](https://github.com/engula/engula)不用说当然托管在 GitHub 的代码仓库里。工作项以 issue 记录，代码评审基于 pull request 来做。

值得一提的是，Engula 主仓库开启了 GitHub Discussion 功能。这是一个进行开放式讨论或者提问解答的小型论坛，取代了其他开源项目常见的邮件列表或者 Discourse 论坛的功能。类似于 Apache 孵化项目一开始只有一个 dev 邮件列表，目前 Engula 的 Discussion 论坛也只有开放讨论形式的 General 目录和问答形式的 Q&A 目录。虽然 General 目录下的讨论主题很泛化，比如 Journal 或 Cache 等，但是我认为这些并不起到目录的作用。也就是说，如果你有关于 Journal 的问题要问，或者灵感要分享，不是一定要在那个主题下回复，而是完全可以另起一个主题来讨论。实际上，我更倾向于类似邮件列表体验的大量简短且能收敛的讨论，而不是一个大而全什么都聊的主题。后者很容易丧失焦点并且难以输出价值。

另外，作为非正式沟通和即时通讯需要的补充，Engula 共同体创建了 [Zulip 聊天室](https://engula.zulipchat.com/)。这跟 Rust 共同体的选型是一样的，并且由于是开源项目，Zulip Cloud 提供了免费的支持保存所有聊天记录的标准服务。需要注意的是，正式的讨论和开发仍然需要记录在 GitHub 上，其他所有渠道的讨论都是辅助性的。关注共同体运营的同学可以看看[有关即时通讯工具选型的讨论](https://github.com/engula/engula/discussions/141)，后续我也会针对开源共同体的沟通发布一篇文章。

## Engula v0.2

“早发布，常发布，倾听用户的反馈。”这是开源软件开发的最有效方式。对于 Engula 这样新发起的项目来说，发布第一个可用版本，将允许参与者在一个最小可行的基础上持续开发。否则所有设计都不过是思想实验，拿不出可行的软件，参与者的热情也将被消磨殆尽。

由于 Engula 在概念验证阶段使用了 0.1 的版本号，因此目前正在开发的第一个原型是 v0.2 版本。该版本的开发在 [RoadMap v0.2](https://github.com/engula/engula/issues/57) 上追踪，预计将于今年十二月底发布。下面具体介绍目前的进展。

### 存储引擎内核

v0.2 版本计划包含的主要内容就是存储引擎内核，包括底层的 Journal 和 Storage 抽象，这两者的上层封装 Kernel 抽象，以及存储引擎的用户接口 Engine 抽象。

在过去的一个半月里，共同体成员针对这些抽象做了不少讨论和原型设计。目前，这些实现正在朝着一个可发布的状态迭代，包括基于内存的实现，基于本地文件的实现，以及基于 gRPC 协议的实现。项目的发起人 @huachaohuang 正在总结之前的讨论，沉淀出反应 v0.2 设计的设计文档。相关的主题和工作项如下。

* [Roadmap v0.2](https://github.com/engula/engula/issues/57)
* [Roadmap v0.2 - Journal](https://github.com/engula/engula/issues/65)
* [Discussion: Journal](https://github.com/engula/engula/discussions/70)
* [Roadmap v0.2 - Storage](https://github.com/engula/engula/issues/68)
* [Roadmap v0.2 - Kernel](https://github.com/engula/engula/issues/145)
* [Roadmap v0.2 - Engine](https://github.com/engula/engula/issues/73)
* [Discussion: API](https://github.com/engula/engula/discussions/55)
* [docs: rewrite the design document](https://github.com/engula/engula/pull/132)

主题讨论是开放式的，工作项则是相对确定的。欢迎熟悉存储引擎开发的同学参与到讨论中来，review 抽象的设计。对于上面工作项里具体的待实现内容，也欢迎想要参与 Engula 的同学一起开发。

### 软件开发流程

项目发起之初，我们就开始讨论[如何高效地开发 Engula 项目](https://github.com/engula/engula/discussions/32)。对于正在朝着第一个发布版本努力的 Engula 来说，我们并不需要复杂高端的开发流程，而是适合当下需要的简洁有效的手段。

目前有一个[关于版本发布的工作项](https://github.com/engula/engula/issues/144)正待解决，我先引用之前的讨论回复了[开源项目发布的整体关注点](https://github.com/engula/engula/discussions/32#discussioncomment-1561701)和 [v0.2 版本的极简发布策略](https://github.com/engula/engula/discussions/32#discussioncomment-1561991)。如果你有相关的项目发布经验，也欢迎参与到这个工作项当中来，一起发布 v0.2 版本。我想在版本发布之后，会总结一个版本发布手册，也确保任何人都能够从代码仓库开始复现发布产物。

项目开发所需要的持续集成流水线已经基于 GitHub Actions 搭建起来了。对于托管在 GitHub 上的开源项目来说，这是一个非常方便的持续集成实现。有时间我会展开讲讲相关的知识和最佳实践。持续集成的另一面是如何在本地进行验证，我在[这个议题](https://github.com/engula/engula/issues/150)下有相关的回复。如果你有高效的开发实践，欢迎加入分享。

### 命令行工具

上面提到，Engula v0.2 发布将是一个可用版本。它设计上提供两种使用方式，一种是作为三方库内嵌使用，这类似于 RocksDB 的用法，另一种则是作为服务提供，用户使用客户端与存储服务交互。

对于后一种使用方式，Engula 需要提供命令行工具以简化部署、启停、基础交互等操作。最基础的，需要有一个二进制文件来启动基于 gRPC 协议的 Engula 服务。进一步的，类似 CockroachDB 或 Docker 的命令行工具，优雅的实现支持不同操作一行命令完成。

目前，Engula 使用 [clap-rs](https://github.com/clap-rs/clap) 库来封装自己的命令行工具。设计哲学方面则参考自 [Command Line Interface Guidelines](https://clig.dev/) 文档。欢迎 CLI 爱好者一起讨论 Engula 的需要，打造一个让人爱不释手的命令行工具。

### 集群服务部署

原本的 v0.2 版本计划中，包括实现 Engula 部署到集群环境中的功能。但是基于开发周期的考虑，第一个原型版本只要在本地环境可以使用就应该发布。所以集群服务部署的内容被延迟到下一个开发周期当中实现和交付。v0.2 版本仍然会交付直接在本地环境启动 Engula 服务的能力，但是集群部署或者说与云环境集成的部署能力，将不会包含在 v0.2 版本当中。

关于集群服务部署的话题，前几天有参与者问我有什么相关材料可以学习，我在这里也做一个回答。目前看来，Engula 服务在集群上部署的时候，直接打交道的应该 Kubernetes 或者 YARN 一类的集群管理系统，而不是重新实现一遍 Kubernetes 直接跟物理机或容器打交道。

在此前提下，我能想到的两种实现集群服务部署的方向，一个是实现资源申请和调度的抽象，另一个是在主要支持 Kubernetes 平台部署的前提下，利用 Operator 等平台提供的机制进行部署。我倾向于后者。

前者实际上是为 Engula 服务实现了一套自己的集群管理逻辑，把 Kubernetes 或 YARN 当成资源提供方，申请到资源后转换成自己的资源抽象，并实现调度和部署。这样做的好处是有一层抽象隔开了 Engula 资源管理逻辑和不同的集群环境，实质是一个双层资源调度，能够提供额外的定制空间。缺点是设计实现极其复杂，并且为了用上底层集群环境的功能，实际上做到最后会变成底层集群环境接口的超集。如果做成简单的抽象，则会损失很多底层集群环境本来能够提供的能力。

后者基于 Kubernetes Operator 的能力，把 Engula 服务作为定制资源调度起来。这种设计下，Engula 存储引擎内核对集群服务部署是无感知的，完全由 Operator 来决定最终的 Engula 服务的拓扑结构。资源管理和集群管理都由 Operator 切面来完成，而 Engula 存储引擎内核的各个模块则像运行在多个物理机上一样，通过发现服务相互连接和通信。

关于 Kubernetes Operator 的相关材料，推荐阅读以下内容。

* [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
* [What is a Kubernetes operator?](https://www.redhat.com/en/topics/containers/what-is-a-kubernetes-operator)
* [CNCF Operator White Paper](https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md)

同时，虽然倾向于不实现另外一套集群管理逻辑，但是无论如何集群服务部署要跟集群管理系统打交道，Engula 服务层面也会有应用集群的管理逻辑。推荐阅读以下材料掌握一些基础知识。

* [Cluster Specification](https://doc.akka.io/docs/akka/current/typed/cluster-concepts.html)
* [Cluster Architecture](https://kubernetes.io/docs/concepts/architecture/)
* [Resource Localization in YARN: Deep Dive](https://blog.cloudera.com/resource-localization-in-yarn-deep-dive/)

## Engula 开源共同体的发展

开源共同体的核心是开源软件，因此它的发展肯定也离不开软件本身的演进。这一点在上面已经讨论了不少。针对围绕软件形成的共同体的运行，我之前做过一个 [The Engula Community Project](https://github.com/tisonkun/engula.github.io/blob/85350e76644a7d28049dfc7cb32e2dad03f84abf/docs/posts/community-project.md) 的提案，里面有我对打造一个新的开源共同体的思考，欢迎阅读。

由于这个提案本身不是一种硬性的承诺，其中的提议也需要共同体成员认可和实际执行才有效，所以我不再计划把它发布到 Engula 的网站上，而是针对每一个关键的提议，以 contributor 文档或共识的方式逐个落实到 Engula 开源共同体当中。

我希望 Engula 能够成为发源于本土的优秀开源共同体，不仅作为一个 serverless 存储引擎创造技术价值，也是开源协同模式下健壮成长的标杆。
