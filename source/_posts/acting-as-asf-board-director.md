---
title: 担任 ASF 董事会成员及技术创业
date:
tags:
    - 开源
    - ScopeDB
categories:
    - 夜天之书
---

本文整理自[《对话 tison - 新晋国际开源基金会董事，95 后创业者》](https://www.xiaoyuzhoufm.com/episode/67e16859dd11f9c8c1d127a4)，但是内容是按照原来设计的问题列表介绍我今年的新关注点，与播客节目实际聊天的内容不完全一致。以下是问题列表：

- [你从什么时候开始想“我要成为一个程序员”这件事情？](#你从什么时候开始想我要成为一个程序员这件事情)
- [你参与的第一个开源项目是什么？](#你参与的第一个开源项目是什么)
- [你对哪一类型的技术更感兴趣？](#你对哪一类型的技术更感兴趣)
- [怎么会想到去做 ASF 孵化器导师的，这件事情是不是很耗费精力？](#怎么会想到去做-asf-孵化器导师的这件事情是不是很耗费精力)
- [如何成为 ASF 董事会成员？](#如何成为-asf-董事会成员)
- [中国人获得董事会席位是实力的体现，还是多元化吉祥物？](#中国人获得董事会席位是实力的体现还是多元化吉祥物)
- [ASF 对中国开发者与中国项目的态度是怎么样的？](#asf-对中国开发者与中国项目的态度是怎么样的)
- [中国人在 ASF 能发挥实际的影响力吗？](#中国人在-asf-能发挥实际的影响力吗)
- [你现在的初创企业 ScopeDB 是做什么的？](#你现在的初创企业-scopedb-是做什么的)
- [为什么 ScopeDB 不是开源的？](#为什么-scopedb-不是开源的)
- [如何看开源在软件创业中的作用？](#如何看开源在软件创业中的作用)
- [Position Statements by Zili Chen (@tison)](#position-statements-by-zili-chen-tison)

<!-- more -->

## 你从什么时候开始想“我要成为一个程序员”这件事情？

我可能从来没有想过这件事情，也很少把自己定位成一个“程序员”，更多的时候还是关注软件创作本身，而不是单纯作为一个身份或者职业。

从经历上说，我是高中的时候，偶然看见校友获得了 ACM 竞赛银牌，才意识到有程序设计这样一个特定的门类。随后碰巧家里有几本 Delphi 程序设计的书，我爸会写 Delphin 程序，就教我写一些。我发现写代码的体验很好，基本你写什么逻辑，程序就执行什么逻辑，有一种强烈的 under controll 的正反馈。于是就计划去读计算机专业，实际也是这么走的，就花了越来越多的时间在编程上。

## 你参与的第一个开源项目是什么？

从广义的公开平台参与贡献来说，我第一个提交的 Pull Request 是 2016 年补充某个《算法导论》题解仓库的内容：

![我的第一次 Pull Request 提交](first-pr.png)

至于说深入参与的第一个开源项目，那应该是现在改名叫 Raku 的，当时还叫 Perl 6 的编程语言生态。2017 年，由于我上的编译实习课需要设计实现一个简易 C 编译器，而我不太会也不想用 flex + bison 的方案，经过一轮搜索，我找到了内置类似 ANTLR 3 的语法解析器的 Perl 6 语言。于是我向授课老师打了个报告，用 Perl 6 实现了编译实习课作业。

![Perl 6 写作的 MiniC 编译器](minic.png)

在这个过程里，我需要阅读 Perl 6 的文档来了解一些具体逻辑的表达方法。我发现了 Perl 6 的文档有一些不太准确或有缺失的地方，于是就边读边提交 PR 修改文档。Perl 6 社群奉行一种极端的低门槛参与策略，几乎在我开始参与的第一时间，就收到了团队发送的成员邀请。除了核心编译解释器 Rakudo 不能直接 Push Commit 以外，包括文档仓库、测试仓库跟其他官方库的仓库，我都获得了直接 Push Commit 的权限。Perl 6 社群的理念部分受到“信任安那其”的影响，鼓励每个人都参与到项目中来。由于不良的参与者提交的 Commit 可以被 Revert 或者极端情况下可由其他成员的本地分支覆盖，且一旦开始 Bad Manner 显然就会进入黑名单，信用破产，因此这一体系至今运作良好。（当然，网络匿名和 Avatar 为代表的背景下，如果是大红大紫的项目，应用这种策略恐怕要面对层出不穷的社会工程攻击。）

总之，我在文档、测试和自举的编译解释器限制集 NQP 上都有所参与贡献，现在运行的版本跟网站上也还有我当时参与留下的痕迹。在参与 Perl 6 的过程中，我第一次在邮件列表和 IRC 上与不同地区时区的人合作，这是对我开源协同的一个重要启蒙。

不过，在编译实习课程结束以后，我开始进入实习阶段，个人兴趣也有所转移，所以后来逐渐就不怎么参与 Perl 6 的社群了。

![我在 Perl 6 的参与贡献](raku.png)

工作当中我参与的第一个开源社群自然是 Apache Flink 项目社群。机缘巧合之下，我在寻找实习机会的时候找到了当时阿里巴巴的 Flink 团队，阿里巴巴的 Flink 团队一直是上游 Apache Flink 项目的核心贡献团体。出于一些偶然，我的面试流程花了很长时间才走完。于是在进入到公司实习的状态，被同事跟公司环境“荼毒”之前，我既然知道未来可能要接触跟 Apache Flink 相关的工作，就开始循着其官方网站的介绍，订阅邮件列表，从开源社群的角度了解他们正在做的事情。

当时又凑巧是 Flink 的 Runtime 从直接依赖 Akka 的抽象转到自身定义一套抽象的过程（FLIP-6），我趴在邮件列表上看了几个月，看他们讨论 FLIP-6 要如何实现，但实话说，有点看不懂。运气好的是，在他们搞完了 FLIP-6 的新逻辑设计之后，出现了旧逻辑需要移除，旧测试需要迁移的需求（FLINK-10392）。我于是尝试从这里上手，完成了大约其中 50% 即 70 个相关 Issue 的工作。这是 2018 年下半年的事情。

后来，我在进入阿里巴巴实习之后，实际处理了一些并发 BUG 的排查和修复，也参与了内部 Flink 分支从一个很旧的版本 rebase 到 Flink 1.5 上的过程。毕业以后加入腾讯继续做基于 Flink 的流处理平台，设计实现了若干个 Flink 的功能特性，也以此为契机参与了 Apache ZooKeeper 和 Apache Curator 社群，最后在 2019 年成为了 Apache Flink 的提交者（Committer），2020 年成为了 Apache Curator 的项目管理委员会（PMC）成员，2024 年成为了 Apache ZooKeeper 的 PMC 成员。

## 你对哪一类型的技术更感兴趣？

干一行爱一行吧。从上面的经历也可以看出来，我主要涉足的领域是编程语言和分布式数据系统。近期开发 ScopeDB 的过程中，发现了 Rust 生态缺少一些公共基础库，而使用 Cargo 发布一个库到 crates.io 的门槛又非常低，所以我还会编写和参与维护一些 Rust 的公共基础库。

有一件事我印象深刻，是在阿里巴巴拿转正 Offer 的一次对话中，部门主管问我说，我是希望完全投入到流计算系统的开发，还是根据需要愿意灵活调整角色。我当时的回答是，现在我在写 Flink 相关的代码，所以我会把时间投入到流计算领域的学习实践当中，但是如果有其他工作需要，只要是有实际需求驱动的，应该都可以去做。

实际也是如此，如果没有现实的需求驱动，无论是个人的、企业的还是社会的，那么做一件事情的热情很快就会消退。我后来再没找到 Perl 6 的使用场景，了解了更多程序设计理念以后，也对改进 Perl 6 提不起劲，于是就很少再参与。当我从阿里巴巴和腾讯离开以后，Flink 这样的复杂系统，个人生活当中根本用不上，开发可玩性也不如 ZooKeeper 和 Curator 这样 Scope 明确的软件，也就逐渐找不到参与 Flink 的动力，还有所需的时间精力了。

## 怎么会想到去做 ASF 孵化器导师的，这件事情是不是很耗费精力？

我在 2022 年经由姜宁老师提名，经过投票成为 ASF 的基金会成员。成为 ASF 成员之后，我可以直接申请成为 ASF 孵化器导师（Incubator Mentor），所以我就申请了。

当时，我在调研存储系统实现的时候了解到了 Kvrocks 项目，而 Kvrocks 的维护者们在同一时间正巧在申请进入 ASF 孵化器，我于是联系上他们，表达了自己也想作为 Mentor 帮助孵化的意愿。这就是我第一次实践作为孵化器导师的故事。

后来，有了孵化 Kvrocks 的经历，越来越多的项目来找我帮助孵化，包括 StreamPark 和 OpenDAL 等等。我也帮助他们完成进入孵化器的流程，了解 ASF 的文化和工作方式，以及最后毕业成为顶级项目。

孵化器导师的主要职责就是为项目提供指导、答疑解惑，并在项目偏离 ASF 文化和理念的时候提供帮助。孵化器导师可以全力投入项目孵化，比如我在第一个指导孵化的项目 Kvrocks 上就花了很多时间。由于日常工作有相关性跟个人兴趣，我也重度参与了 OpenDAL 的孵化发展。孵化器导师也可以只完成主要职责，甚至在一个项目有多名导师（一般要求是三名及以上，保证发布投票时有足够多的人关注），可能部分导师只是偶尔参与孵化项目的讨论。

## 如何成为 ASF 董事会成员？

Apache 软件基金会（ASF）每年大约三月初的时候会举办一次成员大会（Member Meeting），由全体活跃成员投票选出新的基金会成员和新一届董事会。

所以，成为董事会成员的第一步是成为 ASF 的成员，这需要其他成员的提名，并在年度大会上获得投票通过。然后在下一年的大会上，所有成员可以提名新的董事会成员，由全体活跃成员投票选出新一届董事会。

关于投票运作的细节，我写了一篇文章《{% post_link vote-works %}》来介绍。

## 中国人获得董事会席位是实力的体现，还是多元化吉祥物？

根据上面对 ASF 董事会成员产生流程的大致介绍，首先可以得出的结论是，董事会不会专门根据国别来设置席位，而是所有成员一视同仁的经过提名和投票阶段选举出新一届董事会。

我个人会将当选董事会成员看做是一种**认可**，即其他成员认可你对 ASF 的参与贡献，也认可你作为董事会成员代表成员作出决定的能力。我在投票阶段获得了不少来自中国的成员的支持，还有许多在其他项目中合作过的成员的支持。投票本身是匿名的，但是在投票之前，提名和附议是公开的，所以我能知道有哪些成员会支持我。

董事会的职责是代表章程上的最高权力机构成员大会的意志，来管理和运营基金会的日常事务，包括审阅所有顶级项目的季度报告、表决孵化项目的毕业申请、审议年度预算和其他业务提案等等，实际上是繁琐的日常事务为主。董事会自成立之初就一直由九个人组成，往年一般会有十二三个候选人，今年稍微多一些，有近二十人参与竞选。

这部分内容，国内第一位 ASF 董事吴晟老师在此前接受采访时也有介绍过相关的背景。我也会在本文最后附上我竞选时的宣言。

## ASF 对中国开发者与中国项目的态度是怎么样的？

如前所述，基金会的章程和实际运作中不区分国别，所以 ASF 作为一个实体不存在对待“中国开发者”、“中国项目”的态度。

从实际运作情况来看，ASF 的理念是创造服务公众利益的开源软件（The ASF exists to provide software for the public good）。绝大部分成员在日常交流中更关注如何提升开源软件开发和发布的效率，如何维护和发展开源社群以支持软件项目的可持续发展，很少关注国别和地域的问题。

ASF 整体是一个开放包容，允许并支持、鼓励任何人参与的环境。某种程度上，有不少参与者将其认为是开源开发者的一个“乌托邦”。这跟基金会的慈善组织性质也有一定关系。实际上，ASF 非常注重自己的品牌形象，相当部分成员都认为，ASF 应当全力维持自己 **provide software for the public good** 的定位，并认为这是基金会得以存续的根本。

## 中国人在 ASF 能发挥实际的影响力吗？

可以，并且这是正在发生的事实。

许多流行的 ASF 顶级项目都有中国人的重度参与。目前长期在 ASF 的 GitHub 组织下显示的 6 个最流行的项目当中，Apache Dubbo 和 Apache ECharts 可以认为是所谓“源自中国”的项目，Apache Spark 和 Apache Kafka 显然有中国开发者的重度参与，Apache Superset 和 Apache Airflow 当中，也不乏中国开发者的身影。

近些年来，“源自中国”的项目逐渐增多，仅过去一年大约就有 5 个这样的项目毕业成为 ASF 顶级项目。某种意义上，中国有多少个项目在 ASF 当中，或者基金会中有多少个中国成员，这并不重要。我们在基金会当中也更少谈及项目的国别背景。但是从中国开发者的角度来看，这是一个好的趋势：中国有越来越多的人参与或发起开源项目，ASF 也越来越认可中国的贡献。

应该说，ASF 的愿景和文化不一定适用于每一个开源项目，不是符合 The Apache Way 的就是好开源，好的开源项目也不一定完全符合 The Apache Way 的描述。开源有非常多的种类和文化，而如果你认可 ASF 的文化，ASF 的门槛并不高，发挥影响力也是顺其自然的。

## 你现在的初创企业 ScopeDB 是做什么的？

ScopeDB 是一个直接架设在对象存储等云服务上的数据库，以充分利用云上的弹性资源和低成本存储，并实现完全独立的负载隔离。我们已经成功用 ScopeDB 解决了客户存储和分析 PB 级日志和指标数据的需求。

关于 ScopeDB 的具体介绍，可以参阅相关博文：

* [Introducing ScopeDB: Manage Data in Petabytes for An Observability Platform](https://www.scopedb.io/blog/manage-observability-data-in-petabytes)
* [Why Not SQL: The Origin of ScopeQL](https://www.scopedb.io/blog/scopeql-origins)

## 为什么 ScopeDB 不是开源的？

关于理论上的讨论，我写了一篇[《我应该将产品开源吗？》](https://mp.weixin.qq.com/s/e_9P4npQpjM2vItQAPOSWw)做详细讨论。

这里我可以从一个基本问题开始，即“为什么要写特定的代码”。我写开源代码的时候，大多是因为创作的快乐，或者遇到了一个实际问题要解决。比如我参与过的绝大多数开源项目，都是日常工作或者个人使用时遇到问题向上游反馈的结果。除此以外，对于某些我持续参与，而且维护起来不太费劲的项目，我可能会长期关注并参与维护，典型的是 Apache ZooKeeper 和 Apache Curator 等。

但是，我也离开了许多曾经参与过的开源项目，主要是一些复杂的分布式数据系统，如果你没有一个明确的日常工作关系，是很难维持参与的，因为你创作的代码对自己的日常生活没有什么帮助，而且出了问题，还要被甩锅。这些复杂的开源系统，个人又用不上，参与起来就很难有动力。比如我曾经出于工作原因参与过的 Apache Flink / TiDB 等等项目，在我离开相关团队以后，既没有参与的动力，其社群运行的方式也不容易接纳业余爱好者。当然，Apache ZooKeeper 和 Apache Curator 也属于这个范畴，但是首先它们没有强势的 vendor 对代码提交者提出各种要求，其次如今项目基本也进入维护状态，大部分用户对它们的期待比较稳定，维护起来比较轻松。

所以话说回来，我们创造 ScopeDB 的核心原因就是商业需求，直白点说，没钱我们是不会做这件事情的。而且完成数据库的开发有海量的设计实现工作和细节打磨工作要做，我们做这些事情的动机是明确的商业动机。所以开源并不在我们的考虑范围之内。

开源运动不同于自由软件运动的一点就在于，其促进者们认可开源软件和专业软件共生，这也是当前市场经济的社会模式下一个合适的折衷。创造 ScopeDB 的过程中，我们也充分拥抱现有的开源软件，加速我们的技术创新，并将我们在开发过程中遇到的问题逐一反馈到上游。同时，我们也积极地将 ScopeDB 开发过程中，仅供内部使用的工具，或适合抽成公共库的模块，以开源形式公开发布。这一部分，我也写了一篇文章[《开源孪生：商业开源的模式实践》](https://mp.weixin.qq.com/s/Ciwnm8ngZtAEeJgC2ZGOBA)来介绍具体的内容。

## 如何看开源在软件创业中的作用？

这部分内容我在[《我应该将产品开源吗？》](https://mp.weixin.qq.com/s/e_9P4npQpjM2vItQAPOSWw)当中《如何调用软件研发当中的开源要素》一节有具体介绍，最基本的就是使用现成的开源软件，并在意识到使用了开源软件的基础上主动甄别和主动回馈。更进一步，对于不贡献销售价值的内部软件，或适合拆成公共库的模块，或围绕商业服务产生的工具，可以开源开发。

## Position Statements by Zili Chen (@tison)

I've been a member of the Apache Software Foundation for three years. It is my honor to accept the nomination to be a Board member.

For those who don't know me, I fell down the ASF world in 2018, during a day job using Apache Flink in production. I was impressed by the community's passion and how people can collaborate globally to deliver high-quality open-source software. Since then, I have been actively contributing to Apache Flink and became a committer in 2019. In the past years, I also contributed to Apache Curator, Apache ZooKeeper, Apache Pulsar, Apache Inlong, and became a PMC member of these projects.

I became an ASF member in 2022 [1]. Starting in 2022, I have been acting as an Incubator Mentor and helping podlings to adapt to the ASF Way. So far, I helped four podlings become TLPs (Kvrocks, OpenDAL, Answer, and StreamPark), and there are four more under incubation (HoraeDB, Fury, GraphAr, and Iggy). According to the experience gained from these podlings, I pushed the new trademark and branding terms of the Maturity Model [2] and the new consensus on incubator name conventions [3]. I also helped the trademark committee to spot and resolve the trademark issues and later became a member of the committee.

[1] https://whimsy.apache.org/roster/committer/tison
[2] https://github.com/apache/comdev-site/pull/199
[3] https://github.com/apache/incubator/pull/127

Besides being involved in specific projects, I participated in ASF-wide activities. I gave a keynote at CommunityOverCode Asia 2023, participated in a keynote panel at CommunityOverCode Asia 2024, and gave two topics in CommunityOverCode NA 2024. As a part of the conference committee, I co-chaired the community track for two years. I'm going to co-chair the Rust track this year and sponsor the conference personally.

Last but not least, I have a personal blog (in Chinese) [4] where I share my thoughts on open-source software, especially how to collaborate with others and sustain oneself.

[4] https://www.tisonkun.org/archives/

So, I believe and witness that the ASF is a place where open-source contributors can grow and collaborate. I like it and I'm willing to help in its sustainability and growth.

I am Zili Chen, often known as @tison. I have three primary goals to serve as a member of the Board.

1. Spread the ASF way and the impression of the ASF in China and more. During last year's conference in both Asia and NA, people still asked questions like "If I donate the project to the ASF, must I use JIRA?" or "Are ASF projects always released slowly?" We have evolved a lot in the past years (integrated with the GitHub platform, the undergoing ATR platform, etc.), and I believe we should let more people know about it.

2. Bring a perspective of the East especially Chinese to the Foundation. For example, In recent years, more and more acts around software development and distribution have been released. They can affect the way we collaborate (contribute and consume) in the open-source world. I'd provide the Board with a perspective on how we read these acts so that we can work out a good response.

3. Extend the ASF's influence in the open-source world. There are always many open-source developers who are creating day by day. If we can extend the ASF's interests to the technical domains they focus on and attract those people, we can make the ASF a more vibrant place. I've seen the rise of Rust developments bringing new ideas to existing communities like Apache Iceberg, Apache Arrow, and Apache Paimon, as well as creating new communities like Apache OpenDAL and Apache Iggy (incubating). I'd help and foster these initiatives, and keep the ASF a place to produce high-quality & trusted open-source software.
