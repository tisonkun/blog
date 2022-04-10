---
title: 开源社群需要什么代码贡献？
date: 2022-04-10 13:54:06
tags:
    - 开源
    - 开源社群
categories:
    - 夜天之书
---

几天前 [@Xuanwo](https://github.com/Xuanwo) 的一篇文章[《开源运营当论迹不论心》](https://xuanwo.io/reports/2022-13/)讨论了 [TDengine 代码灭虫计划](https://web.archive.org/web/20220403062947/https://mp.weixin.qq.com/s/mssWF5AoUG-vt-b5_QMtRA)活动中不尊重开源协同的规律，只是通过市场运营手段强行把开发者推进来的误区。

本文从这个例子出发，进一步举例讨论开源社群需要什么样的代码贡献。

<!-- more -->

## 代码贡献应该拒绝形式主义

TDengine 这一活动最大的问题，在于它违反了软件开发的常识。

1. 可以通过 linter 彻底解决的问题，反而“养寇自重”以不断在主分支产生风格问题以“等待解决”。
2. 可以随手解决的问题，例如 fix typo 等，反而专门建立 issue 甚至做成活动找“外部”成员来做。

我在不同场合都坚持这样一个观点，开源协同的目的是生产高质量的软件。源代码开放带来的软件自由不提，我们运营一个开发者社群，是为了共同创造出解决实际问题的软件，跨越不同公司、组织和国籍的边界，在整个行业的范围内协同开发者做好一个软件。

TDengine 的做法反其道而行之，目的很明显都指向 issue 数量和 contributor 的数量，而不是一个更好的软件。开源软件不会因为参与的人变多就自动变好，为了追求数量刷出来的 issue 甚至降低了开发效率。

[《社区运营的艺术》](https://book.douban.com/subject/26976995/)反复提到，必须时刻防范形式主义。形式主义不仅让社群运转变得低效，并且会让关注问题解决，努力参与其中的成员感到挫败，因为他们不能以最优的解决方案处理问题，或者眼看着社群无意义的消耗却无能为力。

同样是处理 Linter 的问题，TiDB 的做法就正常得多。

[Make some linters really happy](https://github.com/pingcap/tidb/issues/22979) 这个 issue 首先引入了 golangci-lint 工具，然后由于工作量较大，分拆成不同的子任务欢迎其他参与者共同完成。

不过，TiDB 也有过形式主义的问题。为了显得“开放”，没有协调开发工作流，而是一次性地发布每个季度的工作计划，随后置之不理。这样的操作是没有意义的。

例如 [Call For Participation: SIG-Planner 2020/Q1 Plan](https://github.com/pingcap/tidb/issues/14609) 这个两年前的 issue 至今仍然没有解决，且不知道其中的子问题解了没解。

TiDB 2.4k 个 open issue 当中，有相当部分是各种“开放”运动创建的，事后就成了孤儿。这样试图激活代码贡献的手段，一而再再而三的烂尾，最终消磨了所有参与者的耐心。

## 代码贡献应该源自实际需求

软件总是被它的使用者定义的。闭门造车做的功能和优化很容易脱离实际，飘在天上。开发开源软件，讲清楚软件是怎么用的是很重要的。因为软件本身就是为了解决问题，优化和功能如果不能更好的解决问题，或者甚至不知道问题是什么，那就变成空中楼阁，华而不实了。代码贡献除了避免形式主义，还应该源自实际需求。

比如，Apache BookKeeper 提案并实现了基于 etcd 的元数据管理，是因为 etcd 真的被广泛使用了，并且在云端部署环境下，很有可能有一个现成的 etcd 服务。集成 etcd 能够服务这类用户的场景，并且可能减少额外部署一套 ZooKeeper 集群的开销。

比如，Apache ZooKeeper 讨论过 Watches 不能够看到所有事件，而是单次触发的语义是否需要改进。Ted Dunning 给了一个非常经典的回应。

> [If you want to see all events, use Kafka.](https://lists.apache.org/thread/fz9bkndvbntfjwxm952clh9vky3nwyd5)

这个回应也得到了项目作者 Patrick Hunt 的认可。每个软件都有自己的定位，解决它所要解决的问题。用户永远不可能在一个软件当中解决所有问题，适当的组合不同的软件形成解决方案，是应用工程师的本职。对于开源社群来说，这也意味着它总是不能期待解决所有问题，而应该创造出可组合的基础构建块，并积极地和其他社群联合。如果你想解决所有的问题，那么结果往往是每个问题都解决得不好。

对于新功能的需求，通常首先应该讨论背景和动机，也就是谁为什么需要这样的能力，并且最好有实际的用户，比如提议人自己。我参与设计实现的 [FLIP-85 Flink Application Mode](https://cwiki.apache.org/confluence/display/FLINK/FLIP-85+Flink+Application+Mode) 就立足于当时几家公司内部 Flink 作业部署运维的实际需求，功能实现之后，马上就可以测试投产。

对于缺陷修复，首先应该复现问题，确认问题有效之后定位问题再进行修复。如果问题无效，也就不需要提交代码修复了。例如无法复现、设计就是如此或使用方式有误，只需要分别回应 issue 后关闭。如果是有效而严重的问题，一般会由核心成员直接上手解决。例如 [Log4Shell](https://en.wikipedia.org/wiki/Log4Shell) 和 [SpringShell](https://www.microsoft.com/security/blog/2022/04/04/springshell-rce-vulnerability-guidance-for-protecting-against-and-detecting-cve-2022-22965/) 这样的情况，是不可能公开发布等待新的开发者出现并解决的。

即使是不严重的问题，一般来说相应模块的处理人也可以自己解决。对于不算困难的问题，如果社群活跃成员较多，且有新成员需要锻炼，可以推送到对应群体邀请解决。当然，由于是实际的缺陷修复问题，不会阻塞等待其他人，一旦自己有时间，或者发布日期将近，也就自己做掉了。如果其他人尝试解决但是不能如期完成，也应该友善说明并接手。

如果确认的软件缺陷没人主动解决，并且没有同类问题持续出现，那么说明这个问题可能不是一个真实存在问题。SkyWalking 的创始人吴晟在 Twitter 上提到“我们在 SkyWalking 信奉，没有人贡献的特性等于没用的特性”。同样，没有人修复的问题很可能就是不需要修复的问题。

对于重构，首先要问的是必要性。代码总是有不止有种方法写成，同义转换对于软件核心价值的开发没有直接意义。

一种有意义的重构是模块专家主导的重构。实际上，任何一个开发者在开发一个软件的时候，心里都会有一个认识模型。不同人的认识模型是不一样的。对于一个多人参与开发的软件来说，一个人读到另一块代码怎么看怎么不舒服，以至于不能很好的开发新功能或者修复缺陷的情况是很常见的。这也是软件开发人员交接之后，往往后继者会先把原来的代码进行一次重构的原因。只有符合核心开发者的认识模型，软件开发效率才能提升。反过来说，如果提交重构的补丁作者并没有深入参与该模块开发的需要，那么他的重构理由就很难独立成立，因为真正在开发这块代码的人很可能不喜欢这样的重构。这其实也是开源社群 Earn Authority by Contribution 的一个佐证。

另外一种有意义的重构是解决实际问题的重构。例如我在 TiDB 当中发起的 [Tracking issue for restructure tests](https://github.com/pingcap/tidb/issues/26022) 测试框架重构的主要出发点，就是目前的[测试框架无法与 GoLand 集成](https://internals.tidb.io/t/topic/141)，本地运行测试代价太大，导致开发者倾向于不写测试或者只写简单的测试，而缺乏测试覆盖率的软件，很难有信心合并代码变更，因为谁也说不准只是编译通过的补丁会不会引入额外的问题。

开源软件的开发过程当中，从一个框架迁移到另一个框架，往往能够产生大量的工作。例如 TiDB 的执行引擎换到基于 Chunk 的执行框架，就产生了数十名新的参与者。

* [十分钟成为 Contributor 系列 | 助力 TiDB 表达式计算性能提升 10 倍](https://pingcap.com/zh/blog/10mins-become-contributor-of-tidb-20190916)
* [十分钟成为 Contributor 系列 | TiDB 向量化表达式活动第二弹](https://pingcap.com/zh/blog/10mins-become-tidb-contributor-20190930)

同样的，测试框架从 pingcap/check 迁移到 testify 也产生了数十名新的开发者。其中有的人从这里切入到 TiDB 社群，为 TiDB 站台；有的人重新回到了 TiDB 社群，再度找到自己的兴趣点。

确实，这样的活动未必能够有很好的“留存率”。但是开发者社群为什么要追求留存率呢？我在参与多个开源软件开发的过程当中总结到的是，如果我对这个软件非常满意，没有遇到什么需要解决的问题，那么我不会需要刻意去创造需求解决需求。维持一个开源社群，固然需要核心成员和资深开发者的长期投入也即留存，但是能够为软件解决某个特定问题的人，即使他只解决了这个问题就再也不出现了，难道创造的价值就会被消失吗？

例如，Apache Flink DataStream API 的核心作者 [Gyula Fora](https://github.com/gyfora) 在 2014-2015 年完成这项工作后，六年间几乎销声匿迹。最近被 Apple 招募之后，在新的需求和开源领域影响力的驱动下，又开始了 [Flink Kubernetes Operator](https://github.com/apache/flink-kubernetes-operator) 的密集开发。他所做的代码贡献，出自于自己的需求，也契合 Flink 社群中用户的需要，因为这样的原因提交的代码贡献，才能避免形式主义和为做而做的误区，直面需求并解决需求。

开源社群的参与者来来往往，作为项目维护者在维护项目期间，只要保证项目整体前进即可，不用太过关心某一个人为什么来了又为什么走了。而且，软件开发从来不相信人月神话，不是人数越多，就越能开发出好的软件。换个角度说，即使是 Apache 软件基金会的顶级项目，[Committer 数量超过 100 个的也不过 6 个项目](https://projects.apache.org/projects.html?number)。对于现在动辄号称自己数百名开发者，上千名开发者的开源社群来说，核心成员占比极低，不是很正常吗？

我在发起或参与这样的活动的时候，只关注活动所绑定的这个开发任务，在活动的形式下是不是被高效地解决。至于活动结束后参与者能否找到与社群的共同利益，留下来共同成长，这至少不是活动本身所能完成的任务。

不过，以实际需求为出发点的活动，因为与参与者一同实际解决问题的经历，确实有可能为开源社群引入新鲜血液。

@Xuanwo 就是从 CNCF Community Bridge 活动参与到 TiKV 社群当中的，他为 TiKV 实现了 Enum 等多个算子的下推，并且至今仍然关注 TiKV 社群。

近期开源的 RisingWave 流数据库的存储引擎的主要开发者之一 @skyzh 也是通过 CNCF Community Bridge 参与到 TiKV 社群的。他在 TiKV 主力开发了 AgateDB 这个基于 LSM Tree 的存储引擎，虽然这个项目 TiKV 后来没有继续下去，但是在 RisingWave 的存储引擎当中延续了它的精神。@skyzh 最近发布的[用 Rust 做类型体操](https://github.com/skyzh/type-exercise-in-rust)系列，我想也跟为 TiKV Coprocessor 设计 RPN 表达式有关。

Apache SkyWalking 通过 GSoC 的活动吸引到了 [@fgksgf](https://github.com/fgksgf) 的参与，并在完成相关工作后顺利成为了 Apache SkyWalking Committers 的一员。他强大的带货能力把 Apache SkyWalking Eyes 带到了 TiDB 项目里，也是因为这个原因我才知道了这个项目并且进一步大规模宣传 Apache SkyWalking Eyes 在自动化检查 License Header 的优质体验。最近又看到他[主导发布了 Apache SkyWalking CLI 0.10.0](https://lists.apache.org/thread/lf1nvnw5ks97f8s47m2dgttssb7nq6rz) 的消息，很为他高兴。

其实，本不需要这篇文章来讲一个浅显的道理，**开源协同的目的是生产高质量的软件**。为了这个目的产生的代码贡献，才是开源社群需要的代码贡献。让社群成员切身体会到自己在参与制造一个伟大的软件，才是维持社群吸引力的不二法门。
