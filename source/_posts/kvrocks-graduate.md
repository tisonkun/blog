---
title: Apache Kvrocks 毕业随感
date: 2023-06-28
tags:
    - 开源
categories:
    - 夜天之书
---

Apache Kvrocks 是一个分布式 KV 数据库，使⽤ RocksDB 作为底层存储引擎并兼容 Redis 协议，旨在解决 Redis 内存成本⾼以及容量有限的问题，可以作为 Redis 的持久化变体做 drop-in 替换。

Kvrocks 起初是美图内部研发的软件，于 2019 年对外开源并独立运营。2022 年 4 月，Kvrocks 在 Champion 陈亮的推动下进入 ASF 孵化器孵化。在一年的孵化期间，参与者和用户数量翻了两番有余，同时有四名不同的 release manager 各自完成了四个符合 Apache Release 标准的正式版本发布。今年 4 月，Kvrocks 开始发起毕业流程及讨论，并最终于本月走完流程正式毕业。

我在 2022 年初经由姜宁老师提名成为 ASF 正式成员，同时也自动拥有作为孵化器导师参与 mentor 项目的资格。当时正好看到 Kvrocks 的孵化提案，阅读过后认为是个不错的项目，于是自告奋勇成为 mentor 之一。

Kvrocks 是我 mentor 的孵化项目里第一个顺利毕业的。在孵化期间，我实践了自己的开源理念，帮助项目维护者理解 The Apache Way 的理念，也参与了项目本身的开发和发展。应该说，Kvrocks 帮助我验证了很多开源软件及其社群发展的设想。本文从 Kvrocks 孵化历程和我的参与角度出发，介绍 Kvrocks 的社群状况、发展成果和未来方向。

<!-- more -->

## 开源参与的门槛问题

ASF 孵化器的 PMC Chair Justin Mclean 曾经提到，按照 ASF 所有人都是志愿者的社群模型，要求开发者必须实现重大功能或者长期参与才能授予提交者权限（commit bit）是不合适的。因为许多开发者并不全职参与开源软件开发，而在首先假设信任对方的社群理念下，给予提交者权限能够鼓励开发者做出更多贡献。

这两点我深有体会。很多时候，我只在成为了 committer 以后才会有更强的动力付出时间为项目做出更大的贡献。这主要是由于在成为 committer 之前，提交代码和推动问题解决总是需要依赖另一名 committer 实际执行。虽然 ASF 的 committer 邀请模板当中提到，不成为 committer 并不影响开发者参与贡献，但是这里实打实的是有一个效率的差距。

Kvrocks 进入孵化后的第一位 committer [@PragmaTwice](https://github.com/pragmatwice) 就是这样的一个例子。他如今是 Kvrocks Contributor [提交榜单](https://github.com/apache/kvrocks/graphs/contributors)上排名第二的提交者，仅次于从第一天就开始提交代码的项目作者。

我相信，如果他没有提交者权限，那么很多工作其实就会朴素地因为做起来麻烦而不做了。甚至在一开始做完 CMake 构建的重构以后，如果没有适当的激励认可（或者称为“推坑”），可能跟这个项目的缘分也就到此为止。

同样的及时认可开发者参与贡献的作用，也体现在其他 Kvrocks 的 committer 身上。

不过，想把这个实践推而广之会出现两个问题。

第一个是并非门槛越低越好。

尽管有 Perl 6 早期开发阶段向任何参与者发放提交者权限以推坑的实践，但是后来的 Perl 6 也改变了这一策略，其核心解释器和虚拟机项目一直是有一定的 committer 门槛的。

我曾经写过一篇文章《{% post_link maintainer-criterions %}》讨论开源社群提名新的提交者和维护者的标准问题。在最近一次 ASF Members 的讨论中，我是最终简化成这样一段话：

> For the committer bar, I always think of whether the candidate is easy to work with - make decisions with cautious while bravely, know when to ask for help.
>
> For too much new committers, it hurts when their contributions always need to revision especially trivial mistakes. If we elect a new committer while his/her contribution need more attention to avoid merged wrongly quickly, we lose the reason to invite the very person.
> 
> Apache doesn't set up fine-grained permissions so it's extremely important not to approve something you're unsure with.

这也是我作为 Maintainer 的时候推选新人的标准，一言以蔽之就是“敢于做决定，知道何时寻求帮助和谨慎确认”。

第二个问题是，Justin Mclean 观点建立在 ASF 所有参与者都是志愿者的社群模型上，对于企业主导的开源社群，未必适用这样的低门槛策略。由于和 Kvrocks 社群的情况无关，这里不做展开。只是由于国内在宣传开源的时候容易将 ASF 或 Linux 等价于开源的全部，而忽略了它们的历史、定位和假设，这导致一些企业在制定开源策略时做出了错误的判断，这里做一个提醒。

## 软件的产品力与体验

我在《{% post_link oss-community-in-china %}》一文的最后提到了开源社群成功的基础是开源软件的产品力。Kvrocks 孵化期间，面向用户和开发者至少完成了以下工作。

1. 官方网站 https://kvrocks.apache.org/docs/getting-started

{% asset_img website-docs.png %}

尽管 GitHub 自动渲染 README 能够解决一部分项目门户的问题，但是一个软件正式发布最好还是需要一个撑得起门面的官方网站。得益于 Facebook 开源的 Docusaurus 网站框架，今天一个开源项目想要快速搭建起一个技术范儿的官网并非难事。

除了首页经过一位前端兼设计师的修改以外，文档从 Wiki 迁移和翻译，博客页面、社群页面、搜索、Committer Guide 以及用户 Logo 墙，主要是我和项目作者 [@git-hulk](https://github.com/git-hulk) 分工完成的。

这些内容起初参考了我参与的另一个项目 [InLong](https://inlong.apache.org/) 的设计，后来又被我 mentor 的另外两个项目 [StreamPark](https://streampark.apache.org/) 和 [OpenDAL](https://opendal.databend.rs/) 参考，也是一种开源的传承和重用。

目前，Kvrocks 的首页样式风格仍然有改进空间，页面到底需要呈现哪些元素也有待商榷。如果你是视觉设计师或者 NoSQL 经验的产品经理，可以发起讨论帮助 Kvrocks 打造一个更好的首页。

2. 构建体验以及代码重构

起初，Kvrocks 是用 Makefile 构建的，且 rocksdb 以 Git submodule 的形式集成到代码仓库里，同时构建依赖 shell 脚本且其中包括了各种假设。虽然有一个半成品的 CMake 构建集成，但是并不十分可用。

我清楚的知道如果开发者第一时间构建失败，那么他不会有任何动力处理问题，只会觉得你这个软件不行，径直离开。实际上，这就是我成为 Kvrocks mentor 之前第一次接触 Kvrocks 的旅程。于是我试着改善 CMake 的构建集成，并写了一篇《{% post_link how-cmake-works %}》介绍经验。

巧合的是，当时 Twice 正好也在折腾类似的工作，[回复了这篇文章](https://github.com/tisonkun/blog/discussions/16#discussioncomment-2573397)。于是我邀请他帮忙 Review 我修改 Kvrocks CMake 构建的补丁，在交流过程里感受到他对这个问题的见解后建议他直接上手改 Kvrocks 的构建，并承诺我会给他 Review 代码。

于是 Twice 就从改进 CMake 构建切入，逐渐参与到 Kvrocks 的开发当中。而当我看到 Twice 在其他开发者用他修改过的 CMake 构建遇到问题时能积极响应，我就判断他是一个合格的 Committer 候选人：对自己写的代码有责任心，这很难得。

后来，围绕构建和开发体验，我还做了构建脚本从 shell 到 Python 的替换，以及测试从 TCL 到 Golang 的替换。这极大的改进了代码的可维护性，并稳定了许多原先由于不好调试而不稳定的集成测试。

同时，用 Golang 写集成测试引用了上游 go-redis 库（一开始主要是这个库的 README 写了 Kvrocks 兼容，于是我很愉快的拿来用了），过程中和上游作者 [@vmihailenco](https://github.com/vmihailenco) 多有沟通，两个项目都在这个集成当中提升了自己的产品质量。值得一提的是，@vmihailenco 后来还为 Kvrocks 撰写了一篇[博客](https://kvrocks.apache.org/blog/go-redis-kvrocks-opentelemetry)分享了他们的产品中完全可将 Kvrocks 作为 Redis 的 drop-in 的替换，可以说是一个言之有物且经得起验证和推敲的兼容性测试了。

Twice 对开发体验的改进主要是对 C++ 各类工具链的集成，以及最容易产生杠杆效应的 Command Parse/Execute 框架的重构。

前者，与格式化工具、Linter 工具和各类内存/线程测试工具集成后，Kvrocks 在代码风格一致和规避常见编程错误这两点上都取得了显著的提升。

后者，最近 Kvrocks 如火如荼的[对齐 Redis 命令](https://github.com/apache/kvrocks/issues/1512)的工作，就得益于这些重构的前期工作。

除此以外，Twice 还用他丰富的 C++ 经验整体提升了 Kvrocks Codebase 的质量水平。

3. Kvrocks 的部署

众所周知，Redis 是一个单机内存 KV 数据库。Kvrocks 号称分布式 KV 数据库，主要是它实现了完整的集群方案，并提供了对 Redis Cluster API 的兼容。

一旦涉及到集群的部署和运维，其复杂度相比单机系统总是几何级数升高的。为此，Kvrocks 的开发者近期在孵化 [Kvrocks Operator](https://github.com/RocksLabs/kvrocks-operator) 和 [Kvrocks Controller](https://github.com/RocksLabs/kvrocks_controller) 这两个运维部署工具。未来应该也会推到上游 Apache 的 namespace 下。这里有丰富的早期测试和参与开发的机会，欢迎加入。

4. Kvrocks 的名字

这个不是一个被解决的问题，而是一段逸闻。对于国内开发者和知道背景的人来说，Kvrocks 这个名字是很好理解的：基于 RocksDB 实现的 KV 数据库。然而，由于大小写的缘故，对于 Native Speaker 来说，其实 Kvrocks 这个单词到底怎么念并不清楚。

名字的重要性从丰田由一开始日语罗马字直译的 TOYODA 改为更适合英文发言的 TOYOTA 可见一斑。

除了传播效果之外，对于重度参与者来说，这也是他每天要面对的一个短语。一个流畅、易懂、不容易触碰到各种禁区的名字，能够最大程度降低开发者和用户可能遇到的各种奇怪的观感问题，至少不会成为他们为此自豪的阻碍。

## 开源项目的可持续性

最后，聊一聊开源项目的可持续性问题。

ASF 孵化器有一个成熟度模型，在毕业之前，Kvrocks 也比照这该模型做了分点[“答辩”](https://github.com/apache/kvrocks-website/blob/0bc6f3bfe3e208da2a5acb969f33ed4ec5d1b914/maturity.md)。我在[《Apache 成熟度模型》](https://mp.weixin.qq.com/s/5eOcS261iDghYxxjl5-ICw)里也做过分点评注。大体上，ASF 的思路是从用户、开发者和维护者的多样性来考察的。

早在进入孵化器之前，项目维护者和导师要一起完成一份[孵化提案](https://cwiki.apache.org/confluence/display/INCUBATOR/New+Podling+Proposal)，其中就包括一条回顾项目社群的可持续性：

* Orphaned Products
* Inexperience with Open Source
* Homogenous Developers
* Reliance on Salaried Developers

除了社群维度的成员多样性以外，其实实现多样性本身，要回答的是社群成员为何而来的问题。我在《{% post_link value-creation %}》里提出了思考的方式，但是其中的回答也是较为抽象的。以 Kvrocks 为例，我们可以看到一些具体的例子。

我自己通过 mentor 和参与 Kvrocks 项目实践了指导一个开源项目发展的全过程，同时技术上实验了前文讲到的所有设想。对于公司项目，这些设想的落实有重重阻碍，远不是单纯的技术问题；对于自己的小项目，实验的效果其实很难说，毕竟参与人数的基数并不大，很多问题从源头上就不存在（大部分情况下，只需要解决项目作者本人的问题即可）。而指导开源项目的经验，也是我后来能够自信的 champion 两个孵化项目，并且为更多项目提供建议的阅历基础：很多案例和场景我都经历过，知道怎么回事，怎么应对会有什么结果。

项目作者 git-hulk 推动项目进入 ASF 孵化器孵化且毕业。如今，他担任 ASF 顶级项目 Kvrocks 的 PMC chair 角色。不仅是个人履历浓墨重彩的一笔，我想，对于一个项目作者来说，软件得到了全球范围用户的认可和生产使用，没有比这更有成就感的事情了。

Twice 和另一位 Committer @tanruixiang 成为 Kvrocks Committer 的时候都还是在校学生。我想，如果他们未来还在软件行业发展的话，这段经历是非常宝贵的。同时，这也是许多开源布道师向学生描绘的远景的现实版：确实在很多人生产使用的软件上做出了 non-trivial 的改动，你的代码跑在某些组织可能的关键场景里。

其他的提交者们，比如孵化前就已经是 Committer 的 @ShooterIT 和 @ColinChamber 还有进入孵化后成为 Committr 的 @xiaobiaozhao 和 @torwig 等等，都正是在生产环境上使用 Kvrocks 的团队的成员。参与上游，让 Kvrocks 更好，是不需要硬分叉魔改的前提下最优的 upstream first 策略。

当然，除了 Committers 以外，项目还有更多反馈问题的用户和提交补丁或 Review 代码的开发者，他们有各自的动机和在社群当中实现的价值。总的来说，Kvrocks 的可持续性依托于社群成功。

最后再来一次提醒，这是针对 ASF 项目的讨论，且 Kvrocks 中不存在“背后的商业公司”，甚至没有出现 vendor 的身影。对于企业发起或参与开源的情形，可以阅读我写过的其他文章，例如《{% post_link business-source-license %}》和《{% post_link open-source-is-not-business-model %}》。
