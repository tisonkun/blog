---
title: 开源孪生：商业开源的模式实践
date: 2025-01-15
tags:
    - 开源
    - 开源孪生
    - 商业开源
categories:
    - 夜天之书
---

最近一个多月没有发布新的文章，我把时间大多投入在实践验证自己在多次演讲中都描绘过的开源孪生模式上。

![开源孪生模式](case-study-slice.png)

本文展开介绍上图提及的各个具体实践，并说明这一模式如何可持续发展。

<!-- more -->

## 商业软件无需开源

《大教堂与集市》一书收录了 Eric Raymond 的五篇文章，其中一篇名为《魔法锅》，这可能是关于如何可持续运行开源项目最早的讨论。自然，其中也包括如何在运行开源项目的同时获得商业回报。

尽管《魔法锅》的重点在讨论哪些软件适合开源，并极力澄清大部分关于软件开源的迷思都是不真实的，但是其中也明确提到了软件闭源的合理理由。

4.6 节“闭源的理由”中提到：

> 如果你希望闭源，唯一合理的原因是你想把这个软件卖给别人，或者防止竞争者使用它。

4.8 节“为什么销售价值问题多多”中提到：

> 源码开发使得从软件中直接获取销售价值变得更加困难。

软件服务公司通过私有化部署或云服务提供的商业软件，显然属于企业希望获得软件的销售价值，想要把该软件服务卖给客户，并防止竞争者无偿使用乃至修改后重新发布的情况。

我在{% post_link bsl "过往的文章" %}中多次举例说明尝试直接将开源软件作为商业软件或服务销售，最终必然走向改变协议以至少禁止竞争者使用的结局。在当前鼓励创新，并经由允许创新者独占知识产权给予反馈的商业环境下，这是不可避免的。

因此，在文章开头的模型中，商业软件没有开源（Private and Proprietary）。相反，我们从商业软件中获取回报，支持企业研发团队的运行，并鼓励软件工程师通过多种方式回馈开源共同体。

## 回馈商业软件中的开源依赖

[ScopeDB](https://www.scopedb.io/) 是我当前正在开发的商业数据库。它直接依赖了超过 100 个开源软件库，加上间接依赖，这个数字超过 600 个。从源代码行数来说，ScopeDB 自身的代码量绝对不超过总源代码量的一半，甚至 10% 都不一定能达到。

由于 ScopeDB 的核心设计之一是用对象存储（OSS）代替本地盘，以及关系数据库服务（RDS）作为元数据存储，因此 ScopeDB 的核心依赖包括了统一对象存储的数据访问层 [Apache OpenDAL](https://github.com/apache/opendal) 库，以及查询 RDS 所需的 [SQLx](https://github.com/launchbadge/sqlx) 和 [SeaQuery](https://github.com/SeaQL/sea-query) 库。另外，为了高效处理特定数据类型，ScopeDB 的核心数据模型依赖了 [Jiff](https://github.com/BurntSushi/jiff) 库提供的 `Timestamp` 和 `SignedDuration` 抽象，以及 [ordered-float](https://github.com/reem/rust-ordered-float) 库提供的全序浮点数实现。

一般来说，刚开始将一个开源库对接到商业软件的时候，总会遇到一些适配问题，这就是商业软件研发团队回馈上游最直接的动机。

例如，当我们从提供 `/metrics` 接口以让可观测平台通过拉的方式获取指标，转向主动推送指标到可观测平台时，我们就为 OpenDAL 实现了一个主动推送指标的中间件。

* [feat(layer/otelmetrics): add OtelMetricsLayer](https://github.com/apache/opendal/pull/5524)

我们还向 OpenDAL 贡献了内部用于评估部署环境的性能测试工具：

* [feat(bin/oli): implement oli bench](https://github.com/apache/opendal/pull/5443)

为了更好的集成 Jiff 和 ordered-float 提供的数据类型，我们需要对上游数据类型做相关拓展。对于通用的改进，我们总是会回馈到上游：

* [feat: optionally integrate with num-cmp](https://github.com/reem/rust-ordered-float/pull/155)
* [feat: integrate with derive-visitor](https://github.com/reem/rust-ordered-float/pull/161)
* [feat: implement Hash trait for structs that has implemented PartialEq](https://github.com/BurntSushi/jiff/pull/143)

数据在内存传输时，我们借用了 [Apache Arrow](https://github.com/apache/arrow-rs) 的 Array 抽象，因此在集成的过程中也向上游提出了一些改进：

* [Support cast between Durations + between Durations all numeric types](https://github.com/apache/arrow-rs/pull/6452)
* [feat: add write_bytes for GenericBinaryBuilder](https://github.com/apache/arrow-rs/pull/6652)

而对于特化的需求，在上游不接受或短时间内不考虑的情况下，我们会通过包装类型绕过，或者 fork 后打上特定的补丁。同时也会在上游分享相关代码，以期后续找到并入上游的方式，或者至少惠及其他有相同特化需求的开发者：

* [feat: bootstrap jiff-sqlx development](https://github.com/BurntSushi/jiff/pull/141)
* [feat: add Expr::column](https://github.com/SeaQL/sea-query/pull/852)
* [Return an EnumConverter for GsonConverterFactory#stringConverter](https://github.com/square/retrofit/issues/4278)

除了提供直接的代码补丁，作为多个开源项目的维护者，我深知仅仅是用户反馈，也足以让维护者感受到鼓励，并知道有人正在以特定方式使用自己的软件。因此，在遇到上游库缺少的功能时，即使在 ScopeDB 内部我们已经通过其他方式绕过了需求，我也会在上游报告使用案例：

* [Support Postgres Interval type](https://github.com/SeaQL/sea-query/issues/855)
* [Add Keyword::Default for SimpleExpr](https://github.com/SeaQL/sea-query/issues/850)

或者，虽然上游库提供了相关功能，但是文档不全以至于我花了很长时间才找到解决方案，我也会在上游库的文档中补充相关内容：

* [sqlx::Type for Enum with String repr](https://github.com/launchbadge/sqlx/issues/3630)
* [docs: base url relative join](https://github.com/servo/rust-url/pull/1013)
* [Deep copy a VectorSchemaRoot?](https://github.com/apache/arrow-java/issues/465)
* [How to construct array of list of list and array of list of struct?](https://github.com/apache/arrow-rs/discussions/6631)
* [RustlsConfig to be reloadable](https://github.com/poem-web/poem/issues/893)
* [Type for an Acceptor that maybe TLS or not](https://github.com/poem-web/poem/issues/872)
* [Transform errors when extract parameters](https://github.com/poem-web/poem/issues/814)

即使没有遇到任何问题，如果上游库的实现非常好，我也会向作者分享我们在 ScopeDB 中是如何使用他们的库的：

* [Feedback to upgrade jiff to 0.1.16](https://github.com/BurntSushi/jiff/discussions/174)
* [Showcase how I use this crate to crate a mapping between (secured) business object and serializable dto](https://github.com/Artem-Romanenia/o2o/issues/21)

当然，回馈上游并不是单向的。很多时候，上游的维护者更清楚如何解决具体问题，而作为下游的用户，帮助在实际场景中验证解决方案的可行性，也是对上游维护者的重要帮助。

例如，我们在使用 TestContainers 时遇到了需要复用容器的场景，而上游库并没有提供相关功能。由于对 TestContainers 并不熟悉，我们选择直接依赖底层库实现复用容器的功能，并将相关代码分享到 TestConatiners 上游提出需求。上游社群收到需求反馈后，不久就做出了相应的原型，而我们也基于孪生的开源项目帮助上游测试原型的可行性：

* [Reuse containers](https://github.com/testcontainers/testcontainers-rs/issues/742)

作为 Jiff 库的早期用户，我们也向 Jiff 上游提出了不少功能需求：

* [Allow configure nanosecond's precision](https://github.com/BurntSushi/jiff/issues/92)
* [SignedDuration's Display should use upper case letter](https://github.com/BurntSushi/jiff/issues/190)

通常，完成开源库的集成后，回馈上游的机会也就变少了，除非出现新的需求，或者我们的部分核心功能涵盖了上游的主要演进方向。在后一种情况下，我们会成为上游的主动参与方，或者直接成为上游的维护者。

## 商业软件衍生出开源公共库

除了秉承拿来主义开箱即用的开源库，我们在开发 ScopeDB 的过程中也遇到一些通用的需求，这些需求没有现成的开源软件库可以直接使用。在这种情况下，我们会将 ScopeDB 内部的实现抽象出来，形成一个新的开源库。

[Fastrace](https://github.com/fast/fastrace) 起源自我们团队成员在参与开发 TiKV 期间做的一个 tracing 库。几经辗转，这个库从 TiKV 的组织中独立出来，并成为 ScopeDB 自身可观测性的基石之一。目前，我们团队的成员积极维护 Fastrace 库。

[Logforth](https://github.com/fast/logforth) 起源自开发 ScopeDB 时自身打日志的需求。我们最初使用了 fern 来完成这个功能，但很快发现 fern 一些不合理的设计，没有处理的历史包袱，以及当时超过一年没有维护的情况。因此，我们快速实现了一个满足 ScopeDB 需求且可以方便扩展的日志库，并将其开源。

为了支持数据库系统内部多种定时任务的需求，我们开发了 [Fastimer](https://github.com/fast/fastimer) 库来支持不同的定时任务模式。为了实现数据库用户层面的定时任务，我们还开发了 [Cronexpr](https://github.com/cratesland/cronexpr) 库以支持用户在 `CREATE TASK` 语句中使用 cron 表达式指定任务触发规则。

在这之外，[ScopeDB 的 SDK](https://github.com/scopedb/scopedb-sdk) 也是开源的。显而易见，将 SDK 闭源没有任何好处，因为 SDK 本身并不提供商业价值，而是用于支持 ScopeDB 的用户开发应用程序。这跟 Snowflake 开源其各种语言和版本的 SDK 库，以及 GitHub 虽然没有开源其 Server 实现，但也开源了一系列 SDK 和命令行工具的做法是一致的。

## 一个开源孪生的系统

最后，对于系统工程中耦合在各个实现的部分，我们选择开源一个与 ScopeDB 工程设计大体相同的消息队列系统，来分享我们使用 Rust 语言实现复杂分布式系统的经验。

* [Morax](https://github.com/tisonkun/morax)

如前文所述，在验证 TestContainers 的容器复用功能时，我们的最终目的是让 ScopeDB 工程能够用上。但是，ScopeDB 是闭源的商业软件，我们无法直接让上游开发者访问 ScopeDB 的源码测试验证。此时，Morax 作为孪生的开源系统，就能很好地向上游开发者提供一个源码开放的复现环境：

* [test: try to use testcontainers with reuse](https://github.com/tisonkun/morax/pull/19)

## 总结

本文介绍的所有开源贡献之所以能够持续下去，其根本原因是企业研发团队从商业软件中获得了回报。

为了支持商业软件的发展，回馈其中的开源依赖是理所当然的。对于商业软件中的通用需求，开源这些衍生出来的公共库，既是对开源共同体的回馈，也有助于公共库收获更多反馈，进而提升商业软件的稳定性和可靠性。

开放源代码是软件工程师之间交流分享的最好方式。在开源孪生的模式下，商业软件的开发者既有物质保障，又有动力回馈开源社群。尤其数据处理系统的开发和落地，从来不是一个团队、一家公司就能包揽所有内容。我们会一直积极回馈上游，开源公共库，分享工程实践，以期在交流中共同进步，打造一个高质量的数据处理生态，服务用户不断增长的需求。
