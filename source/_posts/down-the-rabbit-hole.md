---
title: 掉进兔子洞：开源作为生活方式
date: 2026-06-30
tags:
    - 开源
categories:
    - 夜天之书
---

本文成型于今年我在国内几所高校所做分享的同名 PPT 材料，主要以时间为线索介绍了我从接触开源世界到开源成为生活的一部分，或者叫“如呼吸般自然”的过程。

内容包括但不限于：我是如何接触开源软件并参与到开源社群协作的，如何在开源社群中成长，开源工作的可持续性，还有当下不可避免谈到生成式人工智能如何改变了开源的典型模式。

<!-- more -->

## 从课堂作业到开源世界：我的开源启蒙

因为是面向学生的实践课，我不免要从自己在校期间的第一个 PR 讲起。

![https://github.com/gzc/CLRS/pull/50](first-contribution.png)

我第一个提交的 Pull Request 是在 2016 年往上面这个《算法导论》题解仓库推的新解法。没什么特别的，不过现在回过头来看，可能从一开始，我就没有把公开合作当成一种遥不可及的事情。对我来说，读到别人共享的好代码，而我正好有一个有价值的修改意见，直接一个 PR 过去跟对方一起探讨，非常自然。

我接触编程的时间很晚，几乎可算到大学开始念计算机系之后才开始体系化的学习。因此大学期间，除了课程题解带给我参与 GitHub 项目的契机，还有一个自然的理由，就是所有程序员都会遇上的问题：谁是最好的编程语言？

我在 2017 年初大二学期的时候集中 Hello World 了当时能找到的所有编程语言。大多数编程语言的社群都有些“大教堂”的味道：要么像 C/C++ 那样有一个对新人来说门槛高如登天的委员会；要么像 Java 一样代码评审走一套复古邮件列表流程；现代化一些的，也不过是类似 Go 那样放在 GitHub 上，但是实际参与完全由 Google 对应的团队说了算；至于某些小众语言，则完全找不到社群在哪。

但是，机缘巧合之下，我接触到了当时刚发布不久的 Perl 6 语言的社群。试用这门语言的过程中，我读到了由社群成员维护的[非官方语言指南](https://raku.guide/zh/)。

我在阅读这份指南的时候，发现了其中文翻译行文有些不流畅的地方，秉承给《算法导论》提改进建议的习惯，也因为该指南网站放了网站源码的 GitHub 链接，我就直接边读边改，给这份指南做了若干次订正。

![第一次接触 Perl 6 的生态](perl6-guide-translation.png)

P.S. 可以看到我一开始是用翻译的“信达雅”给 PR 起的标题，2022 年有次准备演讲时回顾黑历史，觉得实在是太羞耻了，偷偷把 PR 标题改成没那么中二的。

![一边走读一边订正的过程](perl6-guide-translation-all.png)

这种经验形成了我做开源工作一个很重要的启蒙：尽管当时我并不知道这种形态的开放协作称为“开源协同”，甚至这些文档仓库算不上代码仓库，但是我却不需证明的接受了“看到有改进空间的项目，就可以到 GitHub 上提 PR 编辑”的模式。后来我在推特上也提到，对我来说，整个开源生态就是一个巨大的 editable codebase 的样子，如果你觉得它不够好，你就可以改善它。这理所应当。

![https://x.com/tison1096/status/2009786726991220819](tweet-20260110.png)

细心的朋友可能已经发现，上面 PR 的时间线，除了 2017 年 4 月扎堆发了几个以外，最后一次出现在同年 10 月。这是因为到了大三学期，我选修了一门编译原理课程，附带需要解决一个编译实习的大作业。

当时课程老师推荐的技术方案是用 Flex + Bison 实现编译器前端，全程 C 语言实现后端数据流分析等功能。

我对 C 语言没啥意见，毕竟当时上机考试都是写的 C/C++ 代码，此前也用 C++ 搞定过一些相对逻辑复杂的大作业，不至于写不了一个简易的编译器。

但是，我当时确实看不懂 Makefile 是怎么工作的，也不了解链接是怎么回事。所以对于需要把现成的 Flex + Bison 方案集成进来，链接成最终二进制产物的流程，有点两眼一抹黑。要是放到现在，恐怕只要问一下 AI 就能得到想要的答案，但在当时确实还需要自己搜索资料，慢慢理解这里面的设定。

这个时候，我想起来上半年接触过的 Perl 6 语言有一个开箱即用的 Grammar 能力，可以实现编译器前端。

![Perl 6 的杀手级特性](perl6-grammars.png)

现在看来，Perl 6 Grammar 的设计跟 [ANTLR 3](https://github.com/antlr/antlr3) 是类似的，在 Perl 5 的生态里也有 [`Regexp::Grammars`](https://metacpan.org/pod/Regexp::Grammars) 做过先驱探索。对于当时的我来说，这就是一个不用额外下载依赖，甚至不用编译，单文件执行就能解决需求的最佳方案。

于是我向课程教授打了个报告，用 Perl 6 实现了编译实习课作业。现在这个简易编译器和对应的课程报告还可以在 GitHub 上找到。

![https://github.com/tisonkun/MiniC](minic-report.png)

当然，课程作业毕竟只是自己的事情。要跟开源扯上关系，就还得说回前面提到的我有走读文档并做修改的习惯。

我在调研使用 Perl 6 期间，不仅重读了一遍之前贡献过的非官方文档，还走读了一遍官方维护的文档站。老规矩，在这个过程里，我开始就自己读的时候不流畅的地方开始 PR 改进。

![https://github.com/Raku/doc/pull/1590](perl6-doc-first-pr.png)

我在 Perl 6 的第一个 PR 很简单，就是文档里有两行过时的信息，顺手删掉了。随后我又提交了几个并不复杂的小优化补丁。没成想才过了不到十天，一共我也就被合并了五个补丁，Perl 6 团队就给我发了提交权限（Commit Bit）。

![https://github.com/Raku/doc/pull/1612](perl6-doc-invitation.png)

这让我一下来了兴致。众所周知，你要提交 PR 等待维护者的 Review 后合并，跟你自己有写权限，可以在自己有信心的时候直接 commit 修改，这个 coding 体验跟成就感是天差地别的。从现在的角度看，我当时就像一个被给予了 Full Access 的 DeepSeek V4 Flash 模型代理。

从结果来看，2017 年我在 Perl 6 组织下一共提交了 200 个左右的补丁。其中大部分在文档仓库上，但是也有两位数的给测试套件 Roast 和中间语言 NQP 提的补丁。

![2017 年的 GitHub 活跃图](contribution-graph-2017.png)

某种意义上说，这构成我的开源启蒙：开源参与没有门槛，任何人都可以贡献自己的力量。你应该尽可能去相信别人，并给予他们能够自行迭代收获反馈的权限。

对于这种给予权限的安全考量在每个时代都会被反复提及，有些是真实的风险，但是我这里有一个具体的例子可以反驳掉其中大部分的担忧。我在 NQP 项目上，几乎出于个人偏好全面翻修过 Java 后端。当时的 Perl 6 Pumpking 认为这个改动不太合适，也就把这个几千行的 diff 的 PR 给 revert 了。

![https://github.com/Raku/nqp/pull/507](perl6-revert.png)

大家，记住我们用了 Git 做项目代码的分布式版本管理，就意味着每个人都有一份完整的本地克隆。只要面向公众发布的权限在受信任的群体当中，开发过程是可以给开发者更多自主权的。

P.S. 再次想到这就很像是 DeepSeek V4 Flash 模型能力不足搞出了一个规模巨大但不甚合理的方案，然后靠 human-in-the-loop 手动纠偏。

P.P.S. 写作本文时很欣慰的看到，在我的 PR 被 Revert 掉两年后，有人继承了我的遗志，把相同动机的改动成功推进去了。很多时候开源工作就是这样的，N 年前的射出的子弹正中眉心。下面我还会介绍若干相似的例子。

最后一个 Perl 6 社群带给我的开源启蒙，就是他们重度使用 IRC 这个上古聊天室技术做即时通信。毕竟 Perl 是上个世纪形成的社群，Perl 的作者 Larry Wall 可以说是“开源”概念提出和推广的一种重要倡导者，我在 Perl 社群里观察并学习了不少 Open-source Hacker 的黑话和惯用词。以及，由于参与 Perl 6 社群导致我想了解 Perl 5 社群，顺带学习了如何订阅邮件列表和在邮件列表上交流，成为下一个阶段我在 Apache 开源社群参与的一个重要伏笔。

![我在 Perl 6 IRC 频道上同 Larry Wall 热切交流（迫真）](perl6-irc.png)

P.S. Larry Wall 的 ID @TimToady 来源于 Perl 的名梗 "There's more than one way to do it (TMTOWTDI)" 即“实现目标的方法不止一种”。我在上面聊天截图时用 @wander 的 ID 跟他交流的时候是不知道这个 ID 就是 Larry Wall 的，是后来有次聊天室的群友跟我说“要不你问问 Larry 呢”，我说“原来 Larry 在吗”，老哥把 TimToady at 出来了，我才知道还有这回事。

## 巧合造就的开源之路：可持续开源工作

时光荏苒。编译实习大作业结束以后，我逐渐失去需要用 Perl 6 的场景，于是从 2018 年起，我慢慢不在 Perl 6 的项目仓库上活跃。但是即使后来 Perl 6 改名成 Raku 语言，GitHub 组织多次迁移，每次我也还能被赋予新组织的 Team Member 权限。时至今日，我还是有 Raku 文档项目的写权限。这也算是某种 Merit Never Expires 的早期启蒙了。

![2018 年的 GitHub 活跃图](contribution-graph-2018.png)

可以看到，2018 年初学期结束后，我在 GitHub 上的开源参与有一段空窗期，直到 4 月份才被重新激活。细看参与的项目可以发现，我就是在这个时候开始，参与到 Apache Flink 项目当中去的，这也是我开始跟 Apache 开源社群结缘的契机。

P.S. 但是这其实不是我第一次给 Apache 项目做贡献了。根据考古发现，我最早给 Apache 项目提 PR 可以追溯到 2017 年给 Apache Weex (Incubating) 修过的文档链接格式错误问题。但是后来 Weex 项目是难以为继中止了。这个阿里巴巴捐赠给 Apache 软件基金会的项目当年还是有一点声量的，不过如今的开发者应该是没人知道了。

本节我先不讨论我如何在开源社群中成长，而是按照时间线梳理我从找实习工作开始，如何因为一系列巧合走上可持续开源工作的不归路。

找实习工作的时候，我没有刻意找跟开源相关的工作。应该说，我当时都不知道“开源”这个概念，只是发现 GitHub 上有些人公开发布代码和文档，然后我在用，用的不爽的部分可以自己上手改，而且人家还真让你改，感觉挺爽的而已。

但是其实也是历史的进程或说时代的因素，在 2018 年找实习的档口，很容易就找到大厂里 fork 开源项目搞二次开发的团队，就跟现在找实习，很难找到不以某种形式跟 AI 挂钩的团队一样。

于是在那个时候，我情理之中的发现了在校内论坛发布招聘贴的阿里巴巴 BLINK 团队。

![北大未名的“人贩子”贴](intern-post.png)

P.S. 这个不是当时忽悠到我的原贴，是跟我同期加入阿里巴巴的师兄后来发的帖子，但是味道都是这个味道。该说不说，去年宋辛童师兄领衔 [Apache Flink 2.0](https://flink.apache.org/2025/03/24/apache-flink-2.0.0-a-new-era-of-real-time-data-processing/) 的发布，也算是新一代话事人了。

比较神奇的经历是，我面试实习岗位正好是新年前，中间隔了一个新年假期，回来以后还遇上二面面试官休年假，整个面试流程前后加起来竟然将近半年。

这个巧合现在看来很有意义。因为在这半年的时间里，我没有快速进入到公司二次开发开源项目的节奏和惯性当中。我在完全没有“经受公司荼毒”的情况下，又知道自己未来将要做的工作与一个开源项目相关，于是根据我从 Perl 6 社群当中学到的经验，订阅 Apache Flink 的邮件列表，开始围观他们讨论需求和技术设计，并在接下来的一段时间里逐渐参与到 Flink 的开发工作当中。

中间过程略过不表，具体的开源参与故事和经验我放在下一节讨论。总之，2019 年我毕业之后，因为在 Apache Flink 社群有过相关工作的原因，来到了腾讯参与内部基于 Flink 的流计算平台的开发。所以对我来说，从实习到就业，开源相关的经验和能力，能够帮助我取得一份报酬还不错的工作，这是理所当然的。

从一开始，我的经历就告诉我开源工作至少可以保证个人收入无忧，从而持续参与。甚至在这段时间里，我完全不知道不跟开源上游紧密合作的企业内部开发要怎么做。

随后，我在腾讯开始了打工人的日常生活。我给自己定下一个小目标：先成为 Apache Flink 的 Committer 再考虑工作能怎么调整。

原本我估计这个目标需要大概一年左右的持续参与，也就是至少到 2020 年底，甚至 2021 年初才能实现。但是现实就是计划赶不上变化，我在毕业后工作的第三个月的一天早上，一觉醒来就收到了邀请我成为 Flink Committer 的邮件。

![](flink-invitation.png)

当时我还紧张的请教早先就是 Flink Committer 的师兄：怎么还有这种邮件啊，这得怎么回。可以看到，当时的我还是激动的心、颤抖的手，Dear PMC Memebrs 开头的小年轻。现在，我已经变成只会 Hi 打头的老登了。

Anyway 情况有变，我不得不按照之前的计划开始考虑工作调整的事情。同样具体细节略过不提，结果就是我到了拼多多开始写纯粹内部的业务系统了。这部分的故事是付费内容，想听的朋友可以线下找我聊（bushi）。

总之，两张图揭示开源与工作的辩证统一关系：

![2019 年的 GitHub 活跃图](contribution-graph-2019.png)

![2020 年的 GitHub 活跃图](contribution-graph-2020.png)

可以看到，2019 年我还是活跃在 GitHub 上的“开源开发者”，2020 年 5 月前后加入拼多多以后，整个开源贡献几乎清零。某种程度上，对于大部分工作打从一开始就是做内部/商业系统的开发者来说，贡献开源项目，确实很需要一个契机。

我在加入拼多多以后也并不是就完全跟开源绝缘了。实际上，即使经受了经典 11-11-6 的上班模式，我还是利用下班后的业余时间阅读开源项目代码，并尽己所能的做出贡献。

此前我在 Flink 有一个跟集群高可用相关的开发工作，里面牵扯到跟另外两个 Apache 项目 Curator 以及 ZooKeeper 的交互。其中，Curator 是 ZooKeeper 的客户端高级接口封装库。我给 ZooKeeper 和 Curator 后来都写过相当一些代码，毕竟分布式共识和一致性也是某种有趣的智力游戏。

结果就是，我在 2020 年 7 月份的时候成为了 Curator 的 PMC 成员。

![](curator-invitation.png)

顺带一提，我在 2023 年成为 ZooKeeper 的 Committer 并在 2024 年成为其 PMC 成员。

话说回来，原本我是打算在拼多多至少先工作个 2-3 年好好赚钱的。但是因为一些付费内容的原因，我在 2021 年必须 rebase 到广州，而拼多多在广州没有我能去的部门，于是我不得不再考虑换衣服工作。

这个时候，我其实还是没有刻意去找开源相关的工作，当然客观上来说，我当时已经是 Flink Committer + Curator PMC 成员，找工作的时候用这个 Title 去匹配和 Argue 工资也顺理成章。

这里我放一张 PPT 的原片：

![](contribution-graph-2021.png)

众所周知，TiDB 背后的公司 PingCAP 在 2020 年收获了一笔不菲的融资，这甚至可以说直接带动了国内 (Data) Infra 融资的热潮。无论如何，拼多多开的工资还是非常不低的，而当时 PingCAP 在广州给我开的工资能够让我觉得相当满意，不得不说很有实力。反观另外一家，由于本文会公开发布因此不方便透露姓名的，知名本土企业，给的钱实在是不够看。所以最终就是原片标题写的，“巧合：广州可选的工作，商业开源的工资最高”。

所以也不用问我为什么一直做开源相关的工作，在开源的好时代，它确实能带来不错的收入。

从上面 2021 年我的 GitHub 活跃图可以看出来，从这一年开始，我的年均 Contribution 就稳定在 2000 个以上，这基本上就是 365 天里日常的工作都在 GitHub 上可见了。

不过，众所不周知的是，我加入 PingCAP 一开始，其实参与开发的是当时还处于闭源状态的 TiFlash 分析引擎。然而，我在 TiFlash 项目上一共就写过[两个补丁](https://github.com/pingcap/tiflash/commits?author=tisonkun)，然后就因为一个很难用文字解释的原因，也可以说是某种巧合，转职到了 PingCAP 开发者社群的工作上。由此，我正式开启了为期数年的开发者关系/社群运营/市场营销工作。

在 PingCAP 工作期间，我主要牵头完成了 [TiDB Development Guide](https://pingcap.github.io/tidb-dev-guide/) 的修订，以及包括 [TiDB#26022](https://github.com/pingcap/tidb/issues/26022) 在内的一系列适合社群合作的开发工作。结果就是，TiDB 项目的活跃贡献者在 2021 年 9 月到达了一个高峰，超过 200 人。

![](tidb-monthly-contributors.png)

后来，我去了一家基于 Apache Pulsar 做消息队列解决方案的公司 StreamNative 做社群运营工作。期间，我与另外几位文档工程师合作，全面整改了 Pulsar 官方网站的内容结构，并全面改造了文档开发的工作流程，还跟欧洲几位不在 StreamNative 供职的工程师一起，完成了 Pulsar 官方网站的视觉改版。

感谢 `node_modules` 和过往不合理的每个 Patch 版本都要复制一遍的旧文档的馈赠，我在这份工作里给 GitHub 各种虚荣指标造出了不少奇观。比如我在 GitHub 上一共删除过 2400w 行以上的“代码”，其中很大一部分贡献就来自这里。此外，Contribution 图上异常冲高到单日 1000 次的 issue-closed 活动，就来源于 2022 年底我去 Squash 了 apache/pulsar 仓库的海量遗留的问题报告。

![](ossinsight-tisonkun.png)

总而言之，在这几段工作经历里，我深刻的理解到任何数字指标只要成为 KPI 就能实现，但是实现的过程和结果，往往与预期的并不完全一致。上面这些指标说白了都只是虚荣指标，某种适合短平快分享的奇观，对实际社群发展的价值，主要是体现在过程中人与人的连接，以及开发流程的改善和制度的建设。不然，单就关闭 Issue 的动作来说，搞一个 stale bot 批量关也能达到同样的效果，但是 stale bot 却经常误杀导致[真实的贡献者受到伤害](https://lists.apache.org/thread/0woo9h53t109qsmtxsfqlcxzr16n5mn0)。

最后，这几段开源工作还持续为我提供了远程工作的机会。从 2021 年下半年开始，我就再没去过 office 坐班。关于这段围绕开源/开发者关系的远程工作的体验，我写过好几篇文章介绍，早年也录制过一个经典播客。这里只放链接，不再赘述。

* [大厂离职我选择了 Remote](https://www.xiaoyuzhoufm.com/episode/616fe7d03180b2a2789e7e23)
* [开发者关系的指标与价值](https://mp.weixin.qq.com/s/5nBMk_TZM0JEkxBCZ73QLA)

这段时间，虽然我本职工作不再是软件工程师，但我还是保持了相当程度对编程的热爱和投入。其中包括前面提到的我在 2024 年成为 ZooKeeper 的 PMC 成员，也包括在 TiDB 和 Apache Pulsar 社群当中，我发起的项目里，我自己也都会参与进去提供参考实现并参与代码评审。

应该说，从职业初期接触到 Data Infra 这个领域之后，我就发觉这是一个经久不衰的行业。哪怕在今天 AI 替代掉了垂直软件品类，但是业务系统的形态仍然是前端 + 一个后台服务 + 数据持久化的系统。只要数据还有持久化的需求，就总有如何高效地写入和查询的需求，这就是某种形态的数据库产品。

因此，我在 2024 年下半年遇到一个能实现自己长期以来创造一个好的数据系统的机会的时候，就不得不听从内心的召唤，开始了目前这段实现和推广 [ScopeDB](https://www.scopedb.io/) 的旅程了。关于 ScopeDB 的缘起以其 ScopeDB 相关工作与开源的关系，我放到后面《商业开源的边界和模式选择》一节里展开。本节就到这里戛然而止吧。

## 如何在开源社群中成长，以及应对暗面

DAYJOB 的部分暂且放一边，我们回到开源部分的故事上来。

我的开源启蒙在前面章节介绍 Perl 6 社群参与的时候提到过，其中最重要的两个认识，分别是：

1. 开源参与没有门槛，任何人都可以贡献自己的力量。
2. 整个开源生态就是一个 editable codebase 的样子，如果你觉得它不够好，你就可以改善它。

不过，刚刚毕业并从 Perl 6 社群里淡出的我当时还不能总结出这样的要点。对于当时的我来说，只是隐隐约约的觉得 GitHub 是一个大家公开分享代码的地方，如果发现问题就可以上手改进。真正把开源工作带进工程化阶段的，还得是因为实习的契机逐渐参与到 Apache Flink 开发的过程。

如前所述，得益于我在 Perl 社群掌握的订阅邮件列表的经验，我顺利地在知道未来工作与 Flink 相关后快速订阅了 Flink 的用户列表和开发列表。

我依稀记得 2018 年初，正好是 Flink 分布式系统底座重构，从直接基于 Akka 设计到增加一层抽象的阶段，这一时期的核心设计是 [FLIP-6](https://cwiki.apache.org/confluence/x/xRDiAw) 提案。刚开始我当然不了解这些背景，可以说虽然订阅了邮件列表，但是完全听不懂他们在说什么。

![邮件列表上的讨论如同天书](flink-mailing-lists.png)

但是没关系，即使看不懂具体的技术讨论，只要我挂在邮件列表上感受开发者们讨论的范围，我就已经在同步这个社群的工作方式。我从中学到的三个关键点，也有些刻板印象的是：

1. 最重要的，发送任何邮件都该尽量以 Thanks … 开头。这有点“伸手不打笑脸人”的意思，但我长期观察下来，在对话当中，尤其是沟通有时差，双方看不到面部表情和肢体语言的时候，保持语言上的与人和善，并点出和感谢对方做得符合自己期待的地方，确实是一个行之有效的润滑剂，能够促进对话以相对冷静和合作的方式进行。
2. 最刻板印象的，Flink 的根源是德国某大学的科研项目，2018 年的 Flink 团队还是以德国人为主导的，他们是真的完美符合严谨、认真，一板一眼这个刻板印象。这部分有其好处，就是我在这个过程里强化了开源社群以代码说话，以方案说话的价值观，而不是华丽的词藻吹捧方案，或者拉帮结派搞舆论造势。
3. 最实用的，Flink 的 Design Review 和 Code Review 同样严谨且有条理。我在其中学习到了很多代码协作和评审的技能，也深刻领悟了写技术设计不应该上来就讲实现和细节取舍，而是应该先讲清楚为什么要做这件事情。也就是说，梳理现状，分析问题，阐明动机，是一份设计文档上来先要回答的问题。可选的补充 Goals/Non-Goals 部分确定提案边界。只有确定要做的事情，讨论具体怎么做才有意义，而且实际上具体的实现会不断迭代，过早讨论细节只是一种瀑布流程，只会有反效果。

当然，这些经验我也不是光靠看邮件列表就能看出来的，更多地还是后来的实践和总结，但是应该说在暗中观察期间，光是看其他人讨论问题的遣词造句跟形式，我就对这几点有个模糊的概念。

接下来关键的一步，就是无论如何做点什么，完成对开源参与的祛魅。这一点，我是得益于之前 Perl 6 开源启蒙时的经验，看到 Flink README 文档里我读完以后有卡点的地方，直接一个 PR 上去开始改进。

![https://github.com/apache/flink/pull/5924](flink-first-pr.png)

直到今天，我也时常会用 trivial PR 投石问路，看看某个开源项目实际的维护/治理形态如何，项目成员是什么精神面貌，有没有奇怪的流程和神人，乃至说压根儿就没人在看 PR 等等。

Anyway 一旦完成了第一次协作，这个具体的开源项目对你而言就不在神秘。这其实也是一种双向的，心理学上的登门槛效应：你自己会觉得有一就有二，既然上一个 PR 被合并了，证明参与贡献是可能的；项目维护者也藉由此对你建立起了初步印象，如果叠加上 PR 沟通过程较为愉快，往往后续你再提交补丁，维护者心里把你加进了白名单，你能得到及时 Review 的概率也会随之上升。

进一步地，我还掌握了在 Flink 邮件列表上提出问题的方法，也开始积极回答其他人提出的我知道答案的问题。回过头来看，这些对我成为 Flink Committer 应当都是有帮助的。毕竟大部分人“搞开源”就只管写代码，上游不合并就吐槽，也从来没有管过其他人在社群里遇到什么难题。

后来我知道这些工作有一个共同的“开源协同”的名字之后，我才猛然发现，自己在这个过程里居然有些无师自通地走完了 Linux Foundation 建议的[参与开源的最佳实践](https://www.linuxfoundation.org/resources/open-source-guides/participating-in-open-source-communities)：

1. Join the community. 找到社群在哪，加入进去。对应这里的订阅邮件列表。
2. Lurk first. 暗中观察，了解社区文化。
3. Understand the governance. 了解项目治理机制，也就是谁说了算，要做某种类型的贡献得谁支持。
4. Start small. 从小处着手，完成祛魅。

当然，这只是一个开始。要在开源社群当中持续成长，完成登门槛的步骤以后，比较重要的一步就是找到一个愿意带你参与的导师（Mentor）。

这个 Mentor 有点像是工作上带你入门的师傅。虽然没有强制力约束他要对你负责，但是他有足够多的经验能够告诉你如何在一个开源项目里做成某件事情，某个模块/设计的历史沿革是怎么样的，如何跟特定的某个人合作，当前有哪些问题是哪些人所关注的，优先级如何，等等。这些信息通常很难记录成文档，或者哪怕有些记录在某个犄角旮旯的文档上面，不仅内容可能过期，更重要的是，你不知道那个犄角旮旯里存在对你有帮助的文档。

我在 Apache Flink 社群当中遇到的 Mentor 应该算 [Till Rohrmann](https://github.com/tillrohrmann) 老哥。说是“应该”，因为并没有明确他成为我的 Mentor 的仪式或对话。实际上，只是因为我在阿里巴巴的实习工作跟 flink-runtime 相关，而 Till 正好是重点关注 flink-runtime 的 PMC 成员，所以我们交集多一些。但是客观来说，他起到了我在 Flink 项目里 Mentor 角色的作用。

我在 Apache Flink 早期参与有两个主要的内容。其一是零散地把在阿里巴巴实习工作里修复的并发问题，那些上游同样存在的部分，backport 给上游。其二就是跟 Till 一起完成了前文提到的 FLIP-6 提案的收尾工作：把所有遗留代码和测试，要么删掉，要么迁移到 FLIP-6 提案的新架构上。

![https://issues.apache.org/jira/browse/FLINK-10392](flink-10392.png)

这部分工作其实也算比较 trivial 的工作，类似于我后来在 TiDB 搞过的测试迁移，从一个 fork 的框架迁移到 IDE 集成更完善的 testify 上一样。但是它的好处就是带我走读完了整个 flink-runtime 大大小小的模块，在迁移测试的过程中总要理解原先的测试测了什么，顺带着就了解了原先的模块承担了什么职责。这也为我后来自己撰写 Flink 改进提案，以及参与到 Flink on YARN 和 Flink on Kubernetes 的系列工作打下了坚实的基础。

在这之后就是成为 Flink Committer 并完成一系列 Non-trival 贡献的事情，这些都是太具体的工作，我仅做简单罗列，不做展开。

[FLIP-73: Introducing Executors for job submission](https://cwiki.apache.org/confluence/x/kQ-ABw) 和 [FLIP-74: Flink JobClient API](https://cwiki.apache.org/confluence/x/tw-ABw) 是我主笔写的两个提案。这个时候，我的合作者已经不常是 Till 了，而是 Aljoscha 和 Kostas 两兄弟。他们现在一个去了 Materialize 做流数据库（最近好像又改定位了，AI 时代不带点 AI 不行），另一个去了 Snowflake 做内部系统：所以一直以来我都感觉，业内来来往往都是熟人。

另外值得一提的是 [FLIP-85: Flink Application Mode](https://cwiki.apache.org/confluence/x/dgwZC) 提案。这是 Flink on Kubernetes 的重要基础，细节我也不做展开。有趣的是当时我在腾讯内部做了一个实现，在社群里提了一个方案。另外有一家美国公司的老哥，针对相同的需求也提了一个方案。阿里巴巴的同事，发现这是一个重要的决策，当然我想他们当时内部应该也有一个实现，于是也提出了自己的方案。最后合计来合计去，其实大头设计都差不多，最后胳膊拧不过大腿，由上面提到的 Aljoscha 出面，带着 Kostas 整合几个方案，以阿里巴巴的方案为基础做了实现。在这个过程里，我主要做的是提案反馈和评审的工作，以及 PR 提出后 Review 的工作，因为 argue 到最后真的有点累了，不想再提一个 PR 被人追着评论几十条折腾。与其这样，不如做那个评论别人几十条的人😈

现在我们可以讨论开源社群当中一些典型的暗面了。

以参与者的身份来看，主要比较大的失落来自于 PR 不被接受，或者 Issue 无人在意。

前者典型的案例是 [FLINK-10052](https://issues.apache.org/jira/browse/FLINK-10052) 导致 Flink 的高可用模块在特定情形下失效。这个问题在 2018 年的时候提出，2019 年我就跟另一位国内开发者把问题修了，结果因为涉及到高可用模块的改动，除了 Till 以外其他 PMC 成员也不想贸然合并，而 Till 有很多其他事情要忙。

这个 Issue 虽然已经引起了不少开源用户的抱怨，但是因为没有 Ververica 的客户抱怨过，所以 Flink 社群里要合并这个 PR 有相当的难度。在这段时间里，大部分公司选择的解法是内部二次开发，然后把我做好的 patch 手动 apply 到内部版本上去。

这个过程里，我响应其他 Reviewer 的要求反复 rebase 和解释一些分布式并发竞态条件的细节，但是说实话 Till 不看，其他人让我干这干那的纯粹是浪费时间。我解释了半天还是听不懂，不敢合。而我一开始在 Flink 社群里是小卡拉米，对这种有关正确性的问题确实不太敢自己独立合并，后来不搞 Flink 了，更没有独断专行合并的必要。

这个事情拖到 2021 年，我实在觉得太倒霉了，就主动把 opened PR 关掉，留了个笑脸给大家。

![https://github.com/apache/flink/pull/15675](flink-10052.png)

这次 Till 跑出来了，说你再信我一次吧，只要你再 rebase 一下，我就会 review 然后努力合并。我说我信你个鬼，以前你又不是没说过你要尽力 review 推合并，你做到了吗？！

![https://github.com/apache/flink/pull/15675](flink-10052-cont.png)

呃，这次确实是真的。我后来搞清楚了，因为阿里巴巴有客户抱怨了，而且正好 Flink 1.14 要发版，所以他们赶在发版前，用不到一个月的时间就加速合并了 FLINK-10052 的解决方案。当然，Till 还是把我的 commit 原封不动的摘过去再做一些重构调整，保留了我解决这个方案的痕迹，因此也无可厚非了。

![https://github.com/apache/flink/pull/16801](flink-10052-final.png)

这我就不由得想起有一次，Flink 的第一任 PMC Chair Stephan Ewen 到北京演讲的时候，我就问过他，说咱们说归说供应商中立，每个人都是独立开发者的身份参与，但我就总觉得你们德国人自己看自己的 PR 就是要快一点，这是不是真的？

Stephan 也是实诚，当场回答说那我们自然是 Follow 这个供应商中立的说法啦，但是确实有时候看 PR 遇到什么不解的地方，或者具体技术讨论有分歧，两个同事就坐在一起聊一聊搞定了，这个效率有所不同也不难理解。

那，确实。

说回 Issue 无人在意。开源软件毕竟是没有维保的：已经是所有源代码提供给任何人自由使用、修改和分发了，用户合情合理地没有权利让作者为他的使用场景负责。

于是我们看到，要想自己提的 Issue 能够被解决，首先你得找得到作者，其次他得还管这个项目，然后你的问题还得作者认可，或者是个广泛存在的问题，最后得有人提供补丁，加上作者 Review 才有可能合并到上游，然后还得等发版才能比较方便的使用。

当然，开源软件本身允许你自由修改和分发修改后的版本，所以实在不行你就自己改了自行编译使用，也是可以的。甚至是 fork 一个新版本尝试替代原来的项目。这些都是开源协议赋予任何开发者的权利。

但是我们总不会想着所有软件都自己开发自己维护，实际也很难维护得过来。于是又回到了上面提到的需要引起注意并与人成功协作的流程上，让对解决这个问题感兴趣的人好好维护他所开源的软件。

我这有个经典的好结局的例子，是我于 2018 年继续寻求最好的编程语言期间，试用了 Groovy 语言，过程中发现 `groovysh` 明明是个命令行程序，每次打开却总要给我弹个窗，让我感觉既不舒服，又有些危险。我在 Apache Groovy 的 JIRA 看板上提出了问题，但是或许因为像我这样纠结这种细节的人并不多，于是这个 Issue 四年间都无人在意。

![https://issues.apache.org/jira/browse/GROOVY-8668](groovysh.png)

直到 2022 年我又想比较看看最好的编程语言该长啥样，回顾到这个问题。此时我已经是比较有实力的开发者了，一眼就能看出来问题是啥怎么解决，于是抬手解决。Groovy 的新任话事人 Paul King 也在一周内光速合并，并在 Groovy 4.0.7 版本上发布。

后来 2024 年 CommunityOverCode Asia 期间，Paul King 来到杭州参会演讲，我还跟他聊起过这个事情。不过他肯定是不记得这件对他来说的小事了，只是谈起来确实非常有趣。

至于经典的坏结局的例子我就不用举了，直接看我现在还 open 的 Issue 和 PR 里就有好多。解决方法也比较简单，要么是影响不大摆了算了，或者在下游勉强绕过，或者不行就自己 fork 一份出来搞吧。比如我开始开发 ScopeDB 之后，面对 Rust 生态缺胳膊少腿的现状，对于不少上游实质死亡或者不知道定位到哪里去的项目，都不得不 fork 或者参考其实现维护一个自己的版本以供 ScopeDB 所需。

对于维护者来说，主要比较大的失落就在于得不到正反馈，甚至因为影响到正常收入而难以为继。

关于后者，上一节写到“可持续开源工作”时我已有暗示，其实我的开源参与很大程度上是跟 DAYJOB 有机结合的，先保证自己的收入，再参与开源建设，比较有利于身心健康。

我在去年个人 10 万元赞助 CommunityOverCode Asia 大会的回顾文章[《我的开源观》](https://mp.weixin.qq.com/s/s-MBmCq9Jw0RGuO8wdbtuw)里提到过：经济基础决定开源是否可持续。参与开源的人，一定以某种形式先满足了个人生存的需求。

对于前者，只能说有些项目就是比较低调的，比如我在 GitHub 的 fast 组织上维护了一个 Rust 的日志库实现、并发编程的原语库，一系列小的工具库等等。大部分时候就是没有前沿话题作品来的反馈多。但是只要产生了自己满意的效果，能够被自己真正用起来，这就是有价值的。

另一方面，有些开发者或许可以学习 Apache OpenDAL 的原作者 @Xuanwo 的做法，在各类社交媒体上主动宣传 OpenDAL 的定位和价值，看到任何一个有可能用上 OpenDAL 的场景、用户或项目，都主动上去推销。当然，你可能会收获很多冷落，甚至得到一些负面的反馈，但是这是什么也不做的时候本就如此的现状。相反，你可以关注到那些被你的热情和项目价值所打动的人群，他们是真的会用起来，并且提供真实的反馈。我想这就是对于开源开发者来说最好的回报了。

至于项目影响力变大以后，有时会遇到一些神人的恶评。这就要搬出 Vue.js 作者的尤雨溪拉黑挑衅者的案例以作参考了。

![https://github.com/vuejs/pinia/discussions/1322](vuejs.png)

写得非常经典，以至于我忍不住做一个简单的翻译引用：

> 嘿，没有人强迫你用这个库，你也不需要为使用它付费。作为一个用户，你至少应该以一种互相尊重的态度进行有建设性的交流，但是你没有。源代码当中的复杂类型是为了给日常使用提供更好的提示，这是一个显而易见的折衷取舍。你把你自己在 TypeScript 上的挫败感发泄到库作者身上，而库作者却在免费地生产开源软件并试图为你提供帮助。你是一个典型的开源软件“搭便车”者，请你滚蛋并且再也不要使用这个库。
>
> P.S. 你已经被所有 vuejs 组织下的项目永久拉黑，请不要再试图回复。实际上，我相信你可以停止使用开源软件并且从头开始写所有东西，这会对你更好！

最后，推荐同在 Vue.js 社群的开源开发者 @antfu 的一篇文章[《开源的心理建设》](https://antfu.me/posts/mental-health-oss-zh)，作为本节的结尾。

## 成为 Apache 软件基金会董事

Generally 讨论完开源社群的成长话题之后，我必然要拐回到 Apache 软件基金会（ASF）的工作上来，毕竟这是我在开源领域里目前参与程度最深的一部分工作。

说是工作，首先要破除的一个误会就是，ASF 作为一个慈善机构/非营利组织，大抵有志愿者组成。所有正式成员都是志愿者，包括董事会成员。因此虽然我是 ASF 全球九个董事之一，但我仍然是一名志愿者，并不从基金会领薪水。

ASF 支付薪酬的部分都是合同工。比如维护 ASF 各类基础设施的 Infra 团队，主要维护 GitHub 组织的设置，CI 环境，上古的 SVN 服务器，以及各类网站的后台主机环境，这下 SysAdmin 一脉相承了。另一部分是前两年新成立的 Tooling 团队，由志愿者 Dave Fisher 担任 Tooling VP 带领一个 Paid 的合同工团队交付基金会运转需要的各类新工具。

P.S. 我会专门强调这一点是因为，去年成员大会投票选出新成员之后，有位国内的开源开发者以为 ASF 正式成员要集中办公，是劳动关系，所以不敢接受也不敢问。我也是有点难绷住😅

话说回来，我从 2018 年参与 Apache Flink 项目接触 ASF 至今，现在是：

* 董事会成员
* 品牌商标委员会成员
* 14 个顶级项目的项目管理委员会（PMC）成员
* 孵化器导师，指导了十余个开源项目在 ASF 的孵化，其中 7 个已经顺利毕业成为顶级项目

![](tison-at-apache.png)

如前所述，我在 ASF 早期的参与，可见的结果是 2019 年成为 Flink 的 Committer 以及 2020 年成为 Curator 的 PMC 成员。在那之后，由于工作变更，要么是写拼多多的内部系统，要么是做 TiDB 相关的社群发展，跟 ASF 没有太直接的关系。

但是，由于 DAYJOB 总还是围绕 Data Infra 展开，而 ASF 是众望所归的大数据项目聚集地，我还是时不时会关注 ASF 的项目，参与讨论并做些贡献。

不过，更为重要的恐怕是在我逐渐理解自己所做的工作都可以归类到“开源”这个分类之后，从 2020 年开始，陆陆续续的开始撰写发布一系列跟开源相关的主题文章，也会在 ApacheCon 等开源主题会议上做演讲分享。

总之，在 2022 年初 ASF 再次开成员大会的时候，同年当选新一届 ASF 董事会成员的姜宁老师提名我成为 ASF 正式成员。由于成员大会是在每年三月初固定国内凌晨四点开始的，所以对我来说这又是一次“一觉醒来”的体验。

![](asf-invitation.png)

P.S. 可以看到，如前文所述，我已经变成一个 Hi 开头的老登了。

成为 ASF 正式成员以后，几乎就拥有参与任何基金会内部活动的权利了，因为 ASF 的最高权力机构就是成员大会，董事会相当于成员大会选举出来的常务委员会。

其中一个重要的权利，就是任何 ASF 的正式成员，都可以通过自我提名的方式，成为 ASF 孵化器的 PMC 成员，通称孵化器导师（Mentor）。

我起初其实没有太在意这件事情，但是一个巧合又加速了我参与 ASF 工作的深度。正好在我成为 ASF 正式成员的同年，而且正好在我完成正式成员登记的所有流程之后，一个源自国内的开源项目 Kvrocks 计划捐赠到 ASF 进行孵化。

当时我正好在做跟存储系统相关的工作，甚至就在一两个月前还调研过 Kvrocks 这个项目，这时偶然发现它要进孵化器，正好我还有权利申请成为孵化器导师，于是我就开始走申请流程，并询问 Kvrocks 项目是否还需要更多导师：我可以帮忙！

Kvrocks 团队和发起提案的 Champion 非常爽快地接受了我的自荐，于是我就成为了 Kvrocks 孵化期间的导师。这也是我第一个参与孵化的项目。

具体孵化的过程就不做详细展开了，我有一篇[《Apache Kvrocks 毕业随感》](https://mp.weixin.qq.com/s/iX7keSM81qeiV35x0Y1MQQ)的文章在 Kvrocks 毕业的几乎同时记录了当时的想法。

这里比较值得一提的是，我在担任 Kvrocks 孵化期的导师的时候，为项目找到了下一任 PMC Chair 的合适人选。这个过程也充满了有趣的巧合。

起初，我作为 Kvrocks 的导师，并不是那种只动嘴不动手的人设，而是直接上手开始改 Kvrocks 的代码，并且非常经典的从 Kvrocks 的构建系统开始改起。毕竟，如果项目代码 Clone 下来 Build 不明白，自然也就没有后续了。

在这个过程里，我学习了一系列 Makefile / CMake 的知识，把构建系统优化的工作解决了一半。剩下的一半我觉得有点繁琐，就暂时搁置，并把已经完成的工作，结合我当时学习的经验，发布成一篇[《CMake 是怎么工作的？》](https://www.tisonkun.org/2022/04/15/how-cmake-works)的文章。

在这篇文章的评论区，我诱捕到了当时正给 oneflow 改造过 CMake 构建方案的 @PragmaTwice 二老师。

![](cmake-build.png)

现在看来，当时的我已经相对熟练的掌握了俗称“推坑”的技巧，某种意义上这也要追溯到 Perl 6 时期启蒙的逢人就发 Commit Bit 的零门槛参与文化。总之，我联系了二老师，忽悠他上手改 Kvrocks 的构建系统。然后，基于这个登门槛效应，跟他推荐起用 Kvrocks 作为接触 Data Infra 的一个契机。

这里忽略几千字的详细过程。总而言之，二老师日渐沉迷在 Kvrocks 项目里不能自拔。如今已经是 Kvrocks #1 的开发者，且在几年前就接替项目原作者 @hulk 成为 Kvrocks 新任的 PMC Chair 了。

![](kvrocks-contrib.png)

再后来，我作为孵化器导师还牵头孵化过 StreamPark 等一系列项目，这里不做展开，仅罗列部分项目毕业时的博文以供好奇的读者阅读。

* [Apache OpenDAL 毕业随感](https://mp.weixin.qq.com/s/35DDpKnJjqhUIa2IIa5lyw)
* [孵化六年，一夕毕业：Apache Teaclave 的最速传说](https://mp.weixin.qq.com/s/bileAPpSwid6uVIjRe8IcA)
* [Apache Fory 从 Apache 基金会毕业，正式成为顶级项目](https://mp.weixin.qq.com/s/q9K7sHAo3oSrNyDsoSp4dA)
* [从 Apache 顶级项目到创业征程：一个开源人的坚守与突围](https://mp.weixin.qq.com/s/LQjBLqWqBe7qQ2QB6Vz9Cg)

当然，作为开源世界的暗面，我牵头孵化的项目里也有失败退休的。这就是源自蚂蚁的 Apache HoareDB (Incubating) 项目，前身是蚂蚁集团的 CeresDB 项目。

在 2023 年底，我答应帮助牵头蚂蚁集团的两个项目 CeresDB 和 Fury 进入到 ASF 孵化。应该说，我对于[大厂开源的项目](https://mp.weixin.qq.com/s/KLh6kP9IpyyV-AP58rp7Gg)一直是存在顾虑的。但是万事总得试试才知道深浅，我当时评估这两个项目还算可靠的原因在于：

* Fury 作者杨朝坤对这个项目很有热情。这种模式我看过好几遍，StreamPark 和 OpenDAL 都是这个模式下成功的。
* CeresDB 在蚂蚁内部广泛使用，无论如何，这个项目都不会像前面提到过孵化失败的 Weex 项目一样，因为缺乏内部支持而后继乏力。

事实证明，我前一个判断是正确的，而后一个判断需要修正。

Fury 后来因为一些来自基金会的品牌商标上的顾虑，改名为 Apache Fory 顺利毕业。而 CeresDB 的改名则是蚂蚁集团从一开始就有意保留，不愿已经建立起来的潜在商业品牌转移到 ASF 当中。

当时，ASF 的孵化器导师当中就有人提出过顾虑，说这往往代表这某种失败模式。但是，对孵化项目来说，总归还有毕业成为顶级项目的大考作为底线，几番协商也就接受 CeresDB 的代码以 HoareDB 的新名字进入孵化器孵化了。

我对 CeresDB 在蚂蚁内部的使用会长期存在的判断没错，但是有两个点出了问题。第一个是 CeresDB 的第一作者当时已经离职搞另一个项目去了，留守在蚂蚁集团内部的 CeresDB 团队其实对这个项目也没什么感情，拿一份工资打打工而已。

因此在公司内部出现质疑项目成员参与开源投入的经历和对应有什么产出的声音之后，其实整个 HoraeDB 项目的发展就举步维艰了：公司不支持，我们搞不了。实际上，公司没有明确支持，甚至只要不是明确反对，由于项目是自己的作品，项目作者自己就能持之以恒的搞下去的，比比皆是。

后来，这个做年度计划时好歹还会考虑一下 HoraeDB 发展的团队因为某些原因整体离开了蚂蚁集团。虽然我对 CeresDB 在蚂蚁集团内部由于已经大规模使用，总有人维护的判断仍然成立，但是新接手的团队并没有兴趣搞这个开源的分支。

于是我在今年年初的时候，推动 HoareDB 投票退休算了。实际上，新团队的人并不是项目的 PMC 成员，以 ASF 供应商中立的立场而言，他们在项目里没有什么贡献，也就没有对应的身份。

讲了一个开源世界的暗面，我们转过头来看看光明的一面。我在 PPT 里专门放了一页：

![](best-mentorship.png)

2022 年 @Xuanwo 在 DatafuseLabs 工作时开发了 OpenDAL 项目，这是一个能集成访问任意存储后端的通用 Rust 数据访问层。同年 8 月的时候，他找到我问能不能推到 ASF 孵化器孵化。当时我看这个项目只有 4 个开发者，其中漩涡的 commit 占了 95% 以上。以 ASF 要求多样性和供应商中立的原则，恐怕还是需要一段时间的发展。于是我跟漩涡对着 ASF 孵化器提案的模板梳理了孵化前的准备工作，然后漩涡就回去吭哧吭哧开发新功能跟找用户了。

时间来到 2023 年春节前后，我感觉 OpenDAL 持续发展了小半年还很有冲劲，确实参与的人员和使用的企业/团队也在增长，于是趁着春节假期跟漩涡一起冲了一把孵化提案，并在年后顺利把 OpenDAL 推进了 ASF 孵化器。

然后就是正常的项目发展，我也不赘述了。具体的过程和感悟可以在[《Apache OpenDAL 毕业随感》](https://mp.weixin.qq.com/s/35DDpKnJjqhUIa2IIa5lyw)里看到。目前，OpenDAL 已经是一个有 39 名 Committer 且总下载量突破一千万次的，Rust 生态下要访问任何存储系统，尤其是云对象存储，绕不过去的默认选项了。

![](opendal-downloads.png)

这里值得专门提一下的是，漩涡在开发 OpenDAL 之前，其实在青云工作的时候还做过另外一个叫 BeyondStorage 的项目，但是最终以失败告终。漩涡对比这两个相似的项目，一个成功一个失败，写过一篇叫 [BeyondStorage: Why We Failed](https://xuanwo.io/2023/01-beyond-storage-why-we-failed/) 的文章，值得一读。

![](beyondstorage.png)

总而言之，成为 ASF 正式成员之后，最让我印象深刻的事情，就是我作为孵化器导师带领的这些具体的项目，所以我在外面放 ASF 相关的 Title 的时候，总是在 ASF 董事之后加上“孵化器导师”。我也欢迎任何对启动一个开源项目有想法，或者就在计划将项目推到 ASF 孵化的朋友随时与我交流，看看如何帮助你的开源项目取得更大的成功。

对于成为 ASF 董事的部分，我反而没有特别想在这里详细展开，在高校做同名分享的时候，其实也没有展开。毕竟这部分的受众相对特定，所以我想只在这里贴一个去年首次当选 ASF 董事以后的[采访稿链接](https://mp.weixin.qq.com/s/rvUeJSQnPe66KatcuMwR5A)，有兴趣的读者可以自行跳转阅读，其中内容有部分与本文有重叠。

本节最后，给今年 8 月 7-9 日将在北京举办的，一年一度的 ASF 大会 CommunityOverCode Asia 做个广告。欢迎大家届时到北京市海淀区中关村国家自主创新示范区见面。

![https://asia.communityovercode.org](cocasia.png)

## 商业开源的边界和模式选择

我从 2021 年到 PingCAP 供职开始，就主动或被动的一直在思考商业开源应该怎么进行，或者说开源与商业应该是怎么样的关系。

六年间，我也写过许多博客文章讨论这个问题，在不同会议上做过分享，与现场嘉宾和听众有过激烈的探讨。本文不会展开这些论证的过程，仅把我过往的文章做个引用，并说明目前我在 ScopeDB 上的工作采用了怎样的模式。

* [企业开源的软件协议模型实践](https://mp.weixin.qq.com/s/iSR1sryhmp_wQxf5cvrxOA)
* [企业实践开源的动机](https://mp.weixin.qq.com/s/NYC_beiBvsxCjkocA1FUZA)
* [开源不是商业模式](https://mp.weixin.qq.com/s/VIKlKIthvYaHaBl6ALqtSA)
* [商业源码协议为何得到 HashiCorp 等企业的垂青？](https://mp.weixin.qq.com/s/hYfw7HoBr-cm8cxyQIXLgw)
* [我应该将产品开源吗？](https://mp.weixin.qq.com/s/e_9P4npQpjM2vItQAPOSWw)

其中基本观察有三个要点：

1. 商业和开源之间没有必然的联系。
2. 开发者只有在保证生存的前提下，才有可能参与开源工作。
3. 基于开源的商业可以是一种开源社群可持续运营的模式。

至于商业开源的具体做法，则有四个总结：

1. [Leverage] 商业软件应该灵活利用现有开源软件。
2. [Open] 商业软件的开发套件（SDK）没必要闭源；商业软件对集成应该是开放的。
3. [Free] 商业软件应该提供用户免费试用的方法。
4. [Contributing Back] 对于开发商业软件过程中使用或依赖的开源软件，如有修改应该回馈上游。

ScopeDB 做到了上面这四点。

首先，ScopeDB 使用 Apache OpenDAL 来访问 S3 等对象存储，并将对象存储服务作为用户数据的主要存储。我是 OpenDAL 孵化期导师，也是长期活跃的 PMC 成员。其他 ScopeDB 的同事也在 OpenDAL 项目上积极反馈问题，提交解法。

![https://github.com/apache/opendal/issues/6645](opendal-fixbug.png)

甚至如果我们发现 Rust 的标准库有可以改进的地方，也会直接一个 PR 过去修改。因为 ScopeDB 使用的是 nightly Rust toolchain 编译，且我会定期评估升级各类依赖，所以这些提交到 Rust 主分支上的贡献，ScopeDB 是能利用上的。

![](rust-contrib.png)

再有，ScopeDB 的自观测是基于 OpenTelemetry 协议完成的。我在集成 Otel 的过程中发现了 opentelemetry-rust 实现的各种小问题，都在上游直接提 PR 改进了。后来在做 Logforth 跟 Otel 的集成和日志结构设计的时候，还反推改进了一波 Otel 上游的标准文档。

总而言之，凭借在 OpenTelemetry 社群的贡献，我在 2025 年底 Otel 管理委员会换届时收到了一张选票，也就是有权投票选举新一届管理委员会成员。

![](opentelemetry-vote.png)

当然，为了避免夸大的嫌疑，我必须解释一下，获得这张选票的门槛不算太高，只要你在过去一年里，在 otel 相关组织下的仓库有过 20 个以上的贡献，就有资格投票。全球总共大概 700 人。完整的流程和人员名单可以在[这个讨论串](https://github.com/open-telemetry/community/issues/3001)上追溯查证。

至于集成开放，ScopeDB 的 SDK 都是开源的，这个没什么好说，闭源毫无意义。除了各语言 SDK 之外，ScopeDB 还开源了其他集成工具：

* [scopeql](https://github.com/scopedb/scopeql) 是 ScopeDB 的命令行工具
* [telescope](https://github.com/scopedb/telescope) 是将 ScopeDB 作为存储后端的 OpenTelemetry Collector 实现

此外，对于并非 ScopeDB 独有的需求，而是 Rust 生态共通的基础库，这部分项目我们目前是跟其他开源开发者一起，在 GitHub 的 [fast](https://github.com/fast/) 组织上共同开源开发。

比如，比 `tokio-rs/traing` 快 10-100 倍的 [Fastrace](https://github.com/fast/fastrace) 库。ScopeDB 用于 tracing instrument 的场景。项目作者 Andy 写过一篇介绍我们的实践的[博文](https://fast.github.io/blog/fastrace-a-modern-approach-to-distributed-tracing-in-rust)。

Rust 生态缺失的多功能日志库 [Logforth](https://github.com/fast/logforth) 库。ScopeDB 用于输出日志到 Otel 后端、终端和写日志文件等组合场景。我写过一篇[文章](https://mp.weixin.qq.com/s/9LQaqfKH8mESd_SR95c4CQ)介绍。

各种类型的并发原语 [MEA](https://github.com/fast/mea) 库。ScopeDB 在服务启停等各类并发同步场景里都有使用。同样我也写过[文章](https://mp.weixin.qq.com/s/4Dh3uMnTb49IK5G_P4McaQ)介绍。

其他还有相当一些，这里做一个简单的部分罗列：

* [StackSafe: Taming Recursion in Rust Without Stack Overflow](https://fast.github.io/blog/stacksafe-taming-recursion-in-rust-without-stack-overflow/)
* [Stop Forwarding Errors, Start Designing Them](https://fast.github.io/blog/stop-forwarding-errors-start-designing-them/)
* [macroweave](https://github.com/fast/macroweave) provides procedural macros for generating repeated Rust code from compact, table-driven inputs.
* [BSize](https://github.com/fast/bsize) provides multiple semantic wrappers and utilities for byte size representations.
* [cronexpr](https://github.com/fast/cronexpr) parses and drives crontab expressions.

最后，ScopeDB 的云服务正在 Beta 测试，我们会通过云服务的某种 Free Trial 提供用户免费试用。欢迎 DM 联系我参与测试。

当然，还有一个不能回避总会被问到的问题，那就是 ScopeDB 本身会不会开源。对此，我想先援引《大教堂与集市》书中《魔法锅》一章的两个片段做出说明。

4.6 节“闭源的理由”中提到：

> 如果你希望闭源，唯一合理的原因是你想把这个软件卖给别人，或者防止竞争者使用它。

4.8 节“为什么销售价值问题多多”中提到：

> 源码开放使得从软件中直接获取销售价值变得更加困难。

我们目前主要的商业模式是提供基于 ScopeDB 的云数据服务，因此在短期内，ScopeDB 没有开源的计划。当然我曾经开玩笑的说过，ScopeDB 作为公司的资产，只要任何人全资收购，就可以按照你的意愿将它开源了。

不过不开玩笑的说，目前 ScopeDB 的查询语言 ScopeQL 的 Lexer 已经是开源的了，这个就是 ScopeDB 内核也同样依赖的一部分。在我们长期的技术规划里，完整的 Parser 都应该开源，以方便生态为 ScopeQL 做集成。另外，如果未来行有余力，我们可能也会开源一个简化版本的 ScopeDB 以演示我们主要的设计理念，也可作为教学目的使用。

## 生成式人工智能带来的机会和挑战

这部分的内容日新月异，我在高校讲课的时候也只是以一个 Codex App 工作的截图做引子，让现场的学生分享自己 Agentic Coding 的经历然后再做交流。

最近一段时间，我实打实地几乎完全依赖 LLM AI 开发了几个完整的软件，包括上面提到的 macroweave 等。ScopeDB 开源的 Otel Collector telescope 基本也是 AI 生成的，并且已经在 [raft.build](https://raft.build/) 等客户的生产环境实际部署使用了。

具体的 Agentic Coding 实践和经验，或许再过一段时间，我把 ScopeDB Platform 调教清楚，也就能仔细总结出来了。

目前，我只放两个今年以来做过的关于 Agentic Coding 的讨论的文章链接：

* [现在有了 Vibe Coding 生产代码，开源协作还有意义吗？](https://mp.weixin.qq.com/s/FiGQtiee6l-VGc1anQnHwg)
* [Agentic Coding 的边界](https://mp.weixin.qq.com/s/x_FUUG4wBUqYs1H5DUtpgQ)

其中关于生成式人工智能对开源生态带来的变化，我年初在 ASF 成员列表上发过一封邮件，这里做全文引用，其中的论点目前看起来还是有效的。

My recent experience with Agentic Coding has shifted how I view open source and software engineering. Here are a few takeaways.

ABOUT THE TREND
1. Lowering the barrier for contributions.
Agentic Coding lowers the bar for open-source participation: it helps with chatting to understand design/implementation and speeds up writing patches through code generation.

2. Encouraging lightweight forks.
Previously, one reason to stay upstream was the challenge of maintaining a fork. Now, that's changing. You can refine open-source software into a modified version that fits your exact needs—moving from "generic software" to "one software for one requirement." (Read my last post as an example.)

3. Communities foster consensus and trust.
Nevertheless, collaboration remains key. I recently migrated from our in-house sketches to Apache DataSketches by founding and contributing to the datasketches-rust project. Ultimately, I can't maintain all the code I need. I trust the DataSketches PMC, whose members are seasoned researchers and passionate developers in this field.

ABOUT CODING
1. Agentic Coding will significantly extend the base of "developers," similar to how frontend development attracted a large number of new developers.

2. These new developers will rediscover software engineering principles—TDD, Domain-Driven Design, modularization, and refactoring. Just as frontend developers reinvented these concepts, the new players will likely do the same.

3. If Agentic Coding can reduce the burden of applying these principles, our industry will improve significantly. Even as I learn more principles and trade-offs, the effort required to apply them often forces me to skip them. In this sense, Agentic Coding tools (Codex, Cursor, etc.) are next-generation IDEs.

4. However, current code LLMs are optimized for end-user software (full-stack, CRUD, middle-level visualization). While I can easily "vibe" with coding for websites, their corpus for infrastructure software—databases, OS, low-level networking, and concurrency—is lacking. They struggle to move forward without heavy prompting and existing local patterns.

5. The main development loop—where humans define the questions and solution frameworks—remains. Unless next-level LLMs can subvert the spreading image of "AI Slop," the foundation of open-source collaboration will endure.

Finally, human life still depends on software. That software must be verifiable and trustworthy, and a solid open-source community (The ASF, for sure) is one of the best ways to achieve that.

## 后记

掉进兔子洞（Down the rabbit hole）当然是出自《爱丽丝梦游仙境》的一个隐喻，意指不经意间进入了一个全新的天地。

我的开源经历充满了各种巧合，如果没有这些巧合，很难说我会在开源工作上投入如此多的时间。但是这些巧合又是发生在一个并非巧合的大背景下：开源逐渐吞噬软件世界，以至于十四五规划首次将“开源”加入进去，并且在十五五规划延续，“推进开源体系建设，完善开源运行机制”。

前面提到的“广州可选的工作，商业开源的工资最高”，大厂和初创公司，都有提供跟开源标签相关的工作，也是这个时代背景下的必然。

如今，参与开源社群已经成为我生活中如呼吸般自然的一部分，我想提升整个软件行业的理想，应该也能在开源共同体的不断发展当中一起实现吧。

P.S. 当然，兔子洞也有可能指的是著名虚拟歌姬的一首歌。
