---
title: 开源码力圆桌文字稿
date: 2022-12-05
tags:
    - 开源
categories:
    - 夜天之书
---

本文整理自第七届中国开源年会[开源码力圆桌：十字路口，代码是我们永恒的信仰](https://www.bilibili.com/video/BV19M41167bG)上我的发言。

<!-- more -->

### Q: 得知自己上榜中国开源码力榜时是什么心情？

[中国开源码力榜](https://opensource.win/)上[我的主要贡献](https://opensource.win/tisonkun/)主要在 TiDB 和 TiKV 项目群上，统计了 2021 年全年的开源参与。

上榜是意料之中，因为我在 2021 年基本都在 PingCAP 工作，参与 TiDB 和 TiKV 开源社群是工作的一部分。再加上我的工作内容不是交付若干个大功能，而是提升社群效能。

这些工作相对来说是一系列工程和文档上的小优化，综合起来达到改善开发者体验的目的，而不是几个 commit 完成一个功能。为了提供高质量的社群基础设施，我大范围的探索了其他开源社群的做法，同时还用出了不少效率工具的改良点，这些改良点后来我都 contribute back 了。

另外，去年除了中国开源码力榜，还有部分 DAO 活动或者在线调研项目会筛选高活跃度的 GitHub 平台上的开发者作为目标。我也从这些渠道知道了自己去年大概提交了两千多个变更。所以，在开源码力榜以计数的方式排行的背景下，不上榜才是比较奇怪的。

真的看到自己上榜以后的心情，就像前面 [@juzhiyuan](https://github.com/juzhiyuan) 提到的那样，更多的是发现其他同样上榜的熟面孔，相互借着这个由头聊开来：“你也在啊？”“你最近在做什么呢？”

### Q: 分享一下与开源结缘的过程，现在都在参与哪些社群主要的建设？

我是从 2017 年开始接触开源世界的，也就是大学期间。

最初的参与是无意识的，也就是我不知道自己是在参与“开源”社群。

当时接触到的项目是 Perl 6 编程语言，现在已经改名叫 [Raku](https://www.raku.org/) 了。这是 Perl 编程语言的作者 Larry Wall 在二十年前发动大半个 Perl 社群开发的一个完全重写的语言版本，不过正式发布要到 2015 年，这也导致 Perl 社群因为事实上的分裂和主要生产力出走逐渐式微。

我在它发布后两年也就是 2017 年开始接触到这个项目。起因是每个开发者都必然经历的一个阶段，就是寻找世界上最好的编程语言。有趣的是，大部分编程语言的编译器或解释器都是开源的，也会存在一个对应的开源社群，所以只要你想参与，很容易就可以参与进去。

我最早是作为一个用户，在使用的过程中读到了一系列 Perl 6 社群的文档，其中不太准确的地方我就顺手修复了。我的几乎第一个 GitHub 提交就是修改 [Perl 6 非官方入门文档的翻译](https://github.com/hankache/rakuguide/pull/143)。这个过程很顺利，24 小时以内我就收到了回复并且成功合并了修改。

再一次接触 Perl 6 社群就要到五个月后了。对于最好的编程语言的追求大多是一阵风，早晚会发现只有最适合的编程语言，而没有所有方面都最好的编程语言。幸运地是，我在五个月后的新学期开始做编译原理的实习课题的时候，发现 Perl 6 原生支持的 [Grammar](https://docs.raku.org/language/grammars) 功能比起课程老师推荐的 lex + yacc 套件写起来要舒服得多。于是我重新开始阅读 Perl 6 的文档，用它来实现我的课程作业。

如果你现在去读 [Raku 的文档](https://docs.raku.org/)，你会发现一半以上的页面都有我修改的痕迹，每个文档页右上角的编辑图标，也是我那段时间添加上去的。

Perl 6 社群的风格，很大程度受到创始人 Larry Wall 宽容且谦逊的态度的影响，在另一位阶段性的领导者 Audrey Tang 激进的“向所有人发放 commit 权限”社群策略的主导下，我刚在 Perl 6 社群出现，提出一个问题和补丁，就得到了 commit 权限。现在回过头看，我后续对[文档的全面改进](https://github.com/raku/doc/commits?author=tisonkun)、[测试套件的优化](https://github.com/raku/roast/commits?author=tisonkun)，直到[修改解释器](https://github.com/raku/nqp/commits?author=tisonkun)，很大程度上是这些及时快速的反馈的衍生成果。

我的开源理念也深受这种理念的影响，在不同场合，我都反复强调应对 contribution 最基本的一项工作就是做到及时响应。

下一个阶段就到了我实习和工作的时期了。

我在 2018 年找实习的时候，巧合地看到了阿里巴巴基于 Apache Flink 开发的 BLINK 项目的团队招募实习生的公告，顺利进入其中实习以后，因为实习生并没有繁重的工作任务，所以我大量的时间都用在了参与 Flink 社群，跟德国的创始人还有其他社群成员交流，还有社群工作的参与上。

这段经历现在回看，在我刚开始参加工作和领到第一份工资的时候，它就是与开源相关的。所以对于我来说，能够通过参与开源软件开发赚钱，是一件理所当然的事情。

毕业以后我到了腾讯工作，但是工作内容仍然是基于 Flink 开发实时计算平台。当时的工作导师施晓罡博士非常支持我把工作当中对 Flink 内核的改动推回上游社群，我因此做了几个 notable 的功能，也修复了一系列并发缺陷。在此过程中，我在知乎上发布了一系列[流计算的技术文章](https://zhuanlan.zhihu.com/p/102607983)和主编了 [Flink 的中文周报](https://www.zhihu.com/column/c_1145046163400032256)，在当时和后来一段时间里帮助了不少参与 Flink 社群的新成员。

因为这些参与贡献，我在 2019 年的 9 月份，经由密切合作的 Flink 社群的 PMC 成员 Till Rohrmann 推荐，成为了 Flink 项目 Committer 群体的一员。

实际成为 committer 的过程说来也好玩。因为我并不是社群维护者或者说主要参与公司特意培养的开发者，所以并没有一种按部就班成为 committer 甚至在提名内部投票阶段就已经知道结果的体验。对我来说，就是某天早上起来查收邮件的时候，发现一封邀请我成为 Flink Committer 的邮件，于是欣然接受，根据流程指引提交 iCLA 走流程创建账号身份。这个过程同样也适用于我在 2020 年中，成为 Apache Curator 的 PMC 成员，和 2022 年初经由姜宁老师推荐，成为 Apache 基金会正式成员的经历。

最近的一个角色转换，是在 2021 年初我加入 PingCAP 以后，从研发的工作岗位切换到社群建设的职责。

随着开源生态日渐繁荣，技术服务公司越来越青睐参与或发起开源社群，来夯实技术基础和提高技术影响力。如何做好开源社群的建设，提升开发者体验，就是一个迫在眉睫的问题。

我从内核开发转向社群建设，在 TiDB 和 TiKV 社群当中发起了覆盖沟通渠道、工程效能、开发文档和治理架构等一系列主题的提案，做中学积累了相当的经验。随后，将这些经验经过整理和优化之后，应用到我指导 Apache 孵化器项目 [Kvrocks](https://kvrocks.apache.org/) 和 [StreamPark](https://streampark.apache.org/) 上，应用到我为 [Apache Pulsar](https://pulsar.apache.org/) 社群提升效能的一系列工作上，落实催化社群成员沟通，丰富开源生态和实现知名度与用户采用增长。

这就是我与开源结缘大致的一个经历。

### Q: 大学生参与开源会有什么挑战？如何吸引年轻的开发者参与贡献开源？

正好，我这里有鲜活的例子。Kvrocks 进入 Apache 孵化器以后不到半年的时间里，我们发展了两位新 committer 和一位新的 PMC 成员，其中有两人是大学生。

[@PragmaTwice](https://github.com/pragmatwice) 从有一次我撰文提到 CMake 构建最佳实践，偶然邀请他优化 Kvrocks 的构建开始，逐渐发挥他在 C++ 领域高超的技术水平，全面提升 Kvrocks 的软件质量和工程效率。同时，他还表现出对社群发展的关注并且积极引导新成员参与。因此，他很快就成为 Kvrocks PMC 的一员。

[@tanruixiang](https://github.com/tanruixiang) 从我发布的测试迁移工作切入接触 Kvrocks 项目。他同时还参与了 MariaDB 的 GSoC 项目，对数据库方向很感兴趣。Kvrocks 是一个 Redis 协议兼容的 NoSQL 系统，顺理成章地，他把自己对数据库和 Redis 的理解投入到 Kvrocks 的改良了。因为他的代码水平不错，基本不需要怎么修改就可以直接合并，所以 Kvrocks PMC 也就理所应当地授予他 committer 头衔。

其实，对于学生或者年轻的开发者来说，选择一个有受众基础的开源项目，很大的一个好处就是你的技术方案能够得到社群用户的验证。这是在学校实验室或者公司实习都很难获得的体验。因为内部软件往往只有少数甚至一两个场景，拥有大量假设且许多极端情况不会发生的环境下编程，对技术的提升是有副作用的。

比如，Kvrocks 在百度、携程、美图和许多海外公司都有使用，一旦你的技术方案有考虑不周的地方，数量庞大的用户群体有更大的几率遇到问题，上来反馈问题。少数情况下，你的修改解决了用户的燃眉之急，他们会表达感谢。正反馈和负反馈，对于一个工程师的成长都大有裨益。

另外是在社群当中和他人协同，能够从高水平的开发者身上学习经验。Kvrocks 的新 committer 里有一个在乌克兰的公司工作，他们公司使用 kvrocks 作为 Redis 的持久化替代，并且激进的升级到了 C++ 20 和 RocksDB 7.x 版本。因为 Kvrocks 上游非常开放，所以他们跟其他社群成员通力合作，前后花了两三个月的时间，验证和测试了新版本的兼容性，消除潜在的回退风险以后再上游完成了版本升级。

把自己的改动推回上游，不仅仅是满足自己的业务需要。我曾经跟一位参与了 ZooKeeper、BookKeeper 和 Pulsar 等多个开源项目的工程师交流，他告诉我说他从其他社群成员和用户那里知道，自己参与贡献的项目，甚至就是自己做出来的功能，真的跑在了 Facebook 和微信这样的超级应用上，支撑数以亿计的用户的日常请求，他感到非常自豪。

这也让我想起来我在提交了 [FLINK-10052](https://issues.apache.org/jira/browse/FLINK-10052) 修复之后，四五年间主动联系我的对他有所帮助的用户就不下十个。同样，当我解决了 [Pulsar 一个长年的打包分发问题](https://github.com/apache/pulsar/pull/16320)以后，一位用户直接给我发了一封感谢邮件，说解决了他在公司总要专门处理的一个头疼的问题。

大学生参与开源还有一个独特的优势，那就是很多基础软件都是开源的。

比如，几乎所有编程语言的解释器或编译器都是开源的，操作系统里 Linux 和一系列 BSD 系统都是开源的，数据库有 PostgreSQL 和 MySQL 这样的翘楚，整个网络技术栈都是从 [RFC](https://www.rfc-editor.org/rfc-index.html) 里发展出来的。

计算机系的学生在校期间学习的就是这些基础知识，相比起已经工作的开发者有更多的时间 focus 在基础领域上。如果学生能够利用好开源社群提供的知识和平台，那么他一定能够获得可观的竞争优势。

对于刚参加工作的开发者来说，切入开源世界的点最好是从自己工作相关的技术出发。现在，几乎没有一个产品不包含开源依赖。前面鲁飞和赵博士提到他们都是从使用 Swoole 和 Docsify 开始，逐渐深入参与。同样，对于一个使用 Spring 全家桶开发微服务的程序员来说，理解 Spring MVC 的工作原理，在阅读代码的过程中修复一些明显的问题。在业务开发过程中发现上游缺失的集成、定制功能，向上游回馈，都是很好的参与方式。

比如我在使用 Spring Initializer 初始化项目框架的时候，就发现了 [R2DBC PostgreSQL 在高版本集成有问题的缺陷](https://github.com/spring-io/start.spring.io/pull/882)，顺手修了就是对开源社群的贡献。修复过程也能学习工业级 Java 项目的模块化方案，对于年轻的开发者来说都是宝贵的经验。

### Q: 如何理解开源社群中的代码贡献和非代码贡献，以及开源文化对于推动本土开源发展的作用？

我不会以代码共享和非代码共享来分类开源参与。如果一定要从这个角度切入的话，我想一种更好的分类方式是社群是否有一个核心开源软件（群）。

比如，[freeCodeCamp](https://www.freecodecamp.org/) 和 [Datawhale](https://github.com/datawhalechina) 这样的非典型开源学习组织，它们没有自己核心的项目，而是主要提供一系列内容开放的教程，其中包括一些代码示例或者样例软件。这样类型的组织会更接近我理解的“非代码”式的开源组织。

但是，这类社群的成员仍然在做分享代码的动作。如果你追溯到自由软件运动和开源运动的起源，你就会发现代码分享是一个非常 primary 的理念。Apache Web Server 群组成立之初，就是一个小团体内部分享 NCSA HTTPd 的补丁。Brian Behlendorf 把这些补丁整合起来，基于邮件群组构建了最早的 Apache 工作组，多年以后才正式成立 Apache 软件基金会。

另一类开源社群自然就是有核心开源软件的社群，比如 Apache APISIX 和 Apache Pulsar 等等。围绕核心开源软件，社群成员会制作用户文档、官方网站和持续集成乃至发布的流水线。

在开源的世界里，很少有细致的工作划分，而是一种接近 DevOps 或者 DevSecOps 的 All-in-One 式的工作哲学。虽然也有 Kubernetes 那样详细到文件目录粒度的权限模型，但是从 Linux 到 Apache 等绝大部分开源软件，维护者的概念是宽泛的。

每个维护者可能有自己专注的领域，但是他实际上被鼓励进行任何形式的参与贡献，社群成员也是如此。比如，一名 Pulsar 社群的开发者可能因为开发内核功能水平优秀而被授予 committer 头衔，这时，他就同时有了文档、网站和 CI 流水线的提交权限。

在一个高度工程化的项目里，代码和非代码不会区分得特别清楚：一切都是文本。对于用户触达和用户体验，功能正确高效的实现，跟文档的完整性以及官网的搜索引擎优化都是重要的。

讨论开源文化，前面我提到的代码分享所代表的分享精神可能是最值得一提的。其实，分享代码对于分享者本人可以说是有“坏处”的。

工程学科的发展，一开始是师徒传承，每个门派都有自己的绝学，彼此之间死死保守秘密。可能两个门派掌握的知识联系起来能够促成整个行业的发展，但是这在当时的文化下是不可能的。这类桥段在金庸的武侠小说里经常出现，往往主角就是融合了多个门派的长处才发挥出超人的能力。

再往后是工业革命，带来了行业沙龙的文化。这是一种俱乐部式的行业交流会议，入会通常有很高的门槛。行业沙龙一定程度促进了同行交流，但是受限于物理通讯能力，往往只在当地发挥作用。

互联网的出现将这种局面又往前演进了一大步。开发软件的黑客能够全球范围的相互交流分享代码片段直至成品软件。这种分享是反垄断的，对于单个开发者而言，他失去了独占部分知识垄断收费的可能，但是整个行业的发展却得到了长远的裨益。从第一台电子计算机诞生至今不到一百年，信息技术已经彻底改变了每一个人的生活。

最早、最大范围的分享自己掌握的独到知识的人，在礼物文化的环境下，能够收获巨大的名声。虽然失去了垄断收费的机会，但是这些名声与行业的发展，却切实能够帮助黑客生存：世界将会以你期望的方式被重塑。
