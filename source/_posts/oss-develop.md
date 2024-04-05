---
title: 中国不缺好的开源开发者
date: 2023-09-16
tags:
    - 开源
categories:
    - 夜天之书
---

过去数年，我从参与 Perl 6 和 Apache Flink 等项目出发，逐步进入到开源的世界当中。我在 2019 年成为 Apache Flink Committer，2020 年成为 Apache Curator 的 PMC 成员，2021 年全力投入 TiDB 社群的建设，2022 年成为 Apache 软件基金会（ASF）的正式成员和孵化器导师并接连帮助三个开源项目加入孵化器孵化，2023 年成为 Apache ZooKeeper Committer 和 Apache Pulsar PMC 成员。

在这个过程里，我持续接触到了风格各不相同的开源社群和开源开发者，并逐渐认识到中国开发者是开源运动的中坚力量之一：中国不缺好的开源开发者。

然而，当下大部分人讨论和评价中国开源的现状时，往往会认为中国开源距离全球主流水平仍有较大差距。[《中国信息化周报》撰文](https://mp.weixin.qq.com/s/V6OGrBJsF1bdl5oEtjjkRQ)提到，中国开源“整体呈现‘散似满天星’之势，还未形成‘聚似一团火’的强大合力”。

立足现状，我想以一个普通的开源开发者的视角，分享我所遇见的高水平中国开源开发者的形象，进而讨论从开发者个人出发，为建设好中国开源做贡献的几个可能的探索方向。

<!-- more -->

## 中国开源开发者气象

中国开源开发者人数众多，且覆盖面极广。发展到今天，几乎任何主流开源软件领域都能看到中国人的身影。我虽然在开源生态中多少积累了若干年的经验，但是熟悉的领域也算不上宽泛，所以下面举出的例子，多少会局限在特定的领域里。

不过，我也不打算罗列不同领域中只听说过名字的顶级开发者，而将从学生参与开源、开源社群建设和基于开源盈利三个类别来介绍我所熟悉的中国开源开发者。

### 学生参与开源

毫无疑问，学生是开源的未来、开源的希望。

在 [GSoC](https://summerofcode.withgoogle.com/) 和[开源之夏](https://summer-ospp.ac.cn/)等活动的宣传、鼓励和引导下，在一线开源开发者走进校园布道的影响下，同时也在校园 KOL 的示范作用和实打实的求职优势的吸引下，越来越多的中国学生以各种各样的方式参与到开源社群中来，做出贡献，锻炼自己。

例如，清华大学的研究生宋子阳 [@SzyWilliam](https://github.com/SzyWilliam) 就在去年底[受邀加入 Apache Ratis 社群的 Committer 队伍](https://lists.apache.org/thread/dghlnbwq1lt8h7kmdfy9tj5h7xp0dz9k)。

Apache Ratis 是一个 Java 构建的 Raft 共识算法实现，被应用在 Apache Ozone 和 Apache IoTDB 等多个项目当中。宋子阳是清华大学 IoTDB 研发团队的一员，从开发 IoTDB 新的共识模块的实际需求出发，为 Ratis 实现了一系列生产实用的重要功能：

* [Support linearizable read from followers (Read Index)](https://issues.apache.org/jira/browse/RATIS-1557)
* [Support leader lease](https://issues.apache.org/jira/browse/RATIS-1864)
* [Support Read-After-Write consistency](https://issues.apache.org/jira/browse/RATIS-1882)

这跟我从给 Flink 改进高可用模块出发，为依赖项 ZooKeeper 和 Curator 反而做了不少工作，并先后成为这两个项目的 Committer 的经历有些类似，说明要想在开源世界里做出有效的贡献，立足于实际需求是一个重要前提。此外，贴近理论、算法和正确性的工作，在校学生做起来是有优势的。

[@PragmaTwice](https://github.com/PragmaTwice) 在 2022 年成为 [Apache Kvrocks 的 PMC 成员](https://lists.apache.org/thread/06jctl2xlkc762f2hygkmpwtc1hobt80)。彼时，他是一个在校研究生；现在，他是 Kvrocks Contributor [提交榜单](https://github.com/apache/kvrocks/graphs/contributors)上排名第二的提交者，仅次于从第一天就开始提交代码的项目作者。

Twice 在 Kvrocks 的具体工作可以参考我在[《Apache Kvrocks 毕业随感》](https://mp.weixin.qq.com/s/iX7keSM81qeiV35x0Y1MQQ)的介绍。在文中介绍的代码贡献之外，他还积极参与社群建设的工作：

* [Call for actions: participate in Kvrocks 2023 Roadmap!](https://github.com/apache/kvrocks/discussions/1308)
* [Introduce a more formal release procedure](https://github.com/apache/kvrocks/discussions/1540)
* [Add the preparation section in create-a-release.md](https://github.com/apache/kvrocks-website/pull/155)

同时，他也能够发现社群当中的活跃成员，帮助活跃成员在社群当中做出更大的贡献。

@SzyWilliam 和 @PragmaTwice 的故事让我相信，只要有价值明确的项目和合理的引导，中国学生参与开源是可以做出重要代码贡献甚至成为社群领导者的。

不止参与成熟的开源项目，学生创造的开源项目的例子也很有一些：

* 目前就读于 CMU 的校园 KOL [@skyzh](https://github.com/skyzh) 出于教学目的编写了 [type-exercise-in-rust](https://github.com/skyzh/type-exercise-in-rust) 和 [RisingLight](https://github.com/risinglightdb/risinglight) 等多个项目，给 Rust 生态和数据库领域的入门教学创造了公共价值。
* 目前同样就读于 CMU 的校园 KOL [@ice1000](https://github.com/ice1000) 在中科院 PLCT 实验室的支持下创造了 [Aya](https://www.aya-prover.org/) 形式化数学编程语言。

### 开源社群建设

开源社群建设的中坚力量是各个项目的维护者。健康发展的开源社群离不开维护者们的默默付出和及时响应，这几乎是判断一个开源项目到底是真的建设起了一个社群，还是仅公开源码的一个重要标准。

![512 ""](netty-maintainer.png)

上图中提到两个项目，Apache SkyWalking 的作者吴晟 [@wu-sheng](https://github.com/wu-sheng) 就是一名中国工程师。他创造的 SkyWalking 应用监控系统享誉海内外，被大量生产系统应用集成。

从核心可观测平台及应用探针出发，SkyWalking 生态基于自身需求开发了 SkyWalking Eyes 软件许可证分析工具，SkyWalking Infra E2E 集成测试框架，以及 BanyanDB 可观测数据数据库。虽然不到操作系统那么底层，但是这也体现出高创造力的开源系统作为某种“根社区”带动其他需求开发的特性。

吴晟本人于 2021 年成为 ASF 的第一位来自中国的董事，并且在不同平台上为[#中国开源](https://twitter.com/hashtag/中国开源)发声：

* [《对话吴晟：真正伤害开源的是开发者本身》](https://my.oschina.net/u/4489239/blog/5047833)
* [《开源没有黑魔法，两年后泡沫将会破灭》](https://www.infoq.cn/article/v0wqth2ubqwayxg08b7t)

近期，吴晟因为[指出计划加入 ASF 孵化器的 OzHera 提案的问题](https://lists.apache.org/thread/zpc40l2n2qyfd3639hdj1mjf0vwcl63o)再次引起了关于开源项目好坏标准的讨论。在此之前，他已经是 APISIX/DolphinScheduler/ECharts/OpenDAL/Pekko/ShardingSphere 等多个项目的导师。可以说，他为中国开源项目的发展投入了很大的心血。

另一位新晋的活跃开源社区维护者是 OpenDAL 的作者 [@Xuanwo](https://github.com/Xuanwo) 漩涡。

他曾经经历过在青云发起运作 [BeyondStoragde 项目的失败](https://xuanwo.io/2023/01-beyond-storage-why-we-failed/)，也遇到过[参与开源社群的种种问题](https://xuanwo.io/reports/2023-24/)。在 2021 年年底加入 DatafuseLabs 之后，他将 BeyondStorage 项目的理念跟 Databend 数据仓库对数据存储访问的需求相结合，创造了统一数据访问层 OpenDAL 库。

漩涡是一个非常外向的开源开发者，且有市场工作的相关经验。OpenDAL 满足了一众 Rust 写作的新项目简化数据访问逻辑开发的需求，独立运作后不久，就在 Databend 之外被 GreptimeDB 和 RisingWave 等项目采用。同时，漩涡主动出击，将 OpenDAL 推销到 Mozilla 的 sccache 项目里；基于 Python 绑定，将 OpenDAL 推销到一众 AI 项目当中解决它们访问存储在不同系统上的模型的需求。

在 2023 年我作为 Champion 将 OpenDAL 带到 ASF 孵化器之后，OpenDAL 发展更盛。漩涡回复 OpenDAL 社群消息的时效和吴晟相似。在他的活跃下，从年初 OpenDAL 进入孵化至今半年，Contributor 数量从 37 人增长到 122 人，Committer 数量从 4 人发展到 11 人，还迎来了第一位新的 PPMC 成员。应该说，漩涡主导维护下的 OpenDAL 社群，长期保持活跃，也一直再激励和提名新成员，但是绝对数量上又没有降低门槛大放水。这保证了整个项目按照立项愿景前进，同时又真正地在开源共同体当中发展广泛合作。

项目作者之外，如何找到能够承担项目维护工作的志同道合之人，是项目可持续的重要一环。

NexT 是 Hexo 博客框架下使用率极高的主题，我的个人博客也是基于 Hexo + NexT 的解决方案来搭建的。NexT 项目作者大约从 2020 年起就[不再维护项目](https://github.com/theme-next/hexo-theme-next/graphs/contributors)，转而由中国开发者 [@stevenjoezhang](https://github.com/stevenjoezhang) 维护。

Apache ZooKeeper 是业内使用范围最广，也是最稳定的分布式共识系统；Apache Curator 是 ZooKeeper 的客户端库，相当于 Guava 之于 Java 的定位。前者于 2008 年开源，后者于 2011 年开源，迄今均十年有余。它们最初的作者也早已将重心转移到其他软件项目的开发。

今天，这两个项目里最活跃的开发者是从创造 [ZooKeeper Rust 客户端](https://github.com/kezhuw/zookeeper-client-rust) 出发，发现了上游 Curator 和 ZooKeeper 的一系列问题并着手解决的中国工程师 [@kezhuw](https://github.com/kezhuw)。

@kezhuw 曾经不止一次提到他对开源声誉的看重，我想这也是他为什么对每一个 patch 都如此用心并且对自己参与开发的模块具有强大责任心的理由。也是因为这个原因，我才在去年将他提名为 Apache Curator 的 PMC 成员。因为我相信他符合我对 [Maintainer](https://mp.weixin.qq.com/s/y8ewE2bIF3wa2hmQJvLu5g) 的期待：富有责任心，勇于做出决定，知道何时寻求帮助。

### 基于开源盈利

上面介绍的中国开源开发者，无论是学生还是参加工作的工程师，大多不直接从开源项目中盈利。也就是说，他们在参与开源社群之外有其他的谋生手段。这就从根本上规避了由于“全职”维护开源项目而缺乏经济来源带来的一系列问题。

不过，基于开源盈利仍然是可能的。如果能够有人基于开源软件走通了可复制的盈利模式，确实能够对开源生态整体可获得的投入和可持续性带来正面激励。

当然，在今天的中国市场上，基于开源软件实现大规模盈利的案例仍未出现，但是这并不代表没有人在探索。

国内目前能走通的模式是小团队甚至一个人，做出一个解决应用痛点的开源软件，通过提供服务和交付赚钱，虽然可能客户完全不在乎你是不是开源软件。

XXL-JOB 由大众点评的工程师许雪里 [@xuxueli](https://github.com/xuxueli) 开发，部署在成百上千家公司的应用环境上，在中国软件市场当前成熟度的背景下成功成为一个解决实际问题的分布式任务调度平台。该软件基本由作者单人维护，依靠个人捐赠和企业赞助获取支持存续。

飞致云（FIT2CLOUD）把这个模式用企业化的方式运作。JumpServer 和 Halo 都是贴近终端用户，解决特定具体问题的软件。飞致云并不自己从头研发这些软件，而是跟市场上已经有足够多用户群体的软件合作，采用收购 + 雇佣维护支持的方式，把个人开源开发者的支持交付盈利模式用公司的平台规模化并摊薄成本。

此外还有研发开源软件创业的模式。

这一方式最极端的是完全从头开发一个系统，例如前青云工程师 [@BohuTANG](https://github.com/BohuTANG) 创造的 [Databend](https://github.com/datafuselabs/databend) 数据仓库。@BohuTANG 曾经是 MySQL 的一个著名分支 TokuDB 的核心维护者，也是深度了解 ClickHouse 并参与贡献的开发者。Databend 起源于 @BohuTANG 用 Rust 写一个 ClickHouse 的想法，但是在后来的发展过程中，其核心技术几乎完全换了一遍。软件开发不可能不借鉴现有系统，以 Databend 的实际情况而言，这就是完全从头开发的项目。

与之相比稍有基础的是基于成功内部实践再造开源项目。例如，GreptimeDB 的创始人庄晓丹 [@killme2008](https://github.com/killme2008) 曾经创造过 SOFAJRaft 等知名开源软件。在蚂蚁集团工作的后期，他负责了蚂蚁集团智能监控的设计开发工作，并基于这段工作经验创造了 [GreptimeDB](https://github.com/GreptimeTeam/greptimedb) 项目。

接着是基于成熟开源软件打造商业产品的模式。其实上面提到的飞致云也可算入这一类别，不过这里与之区别的是基于开源软件创造新的产品并反馈上游，而不就是开源软件一模一样的产品，只是额外提供交付和服务。

例如，郭斯杰 [@sijie](https://github.com/sijie) 是 Apache BookKeeper 的 PMC Chair 和 Apache Pulsar 的 PMC 成员，Matteo Merli [@merlimat](https://github.com/merlimat) 是 Apache Pulsar 的 PMC Chair 和 Apache BookKeeper 的PMC 成员。他们分别作为 StreamNative 公司的 CEO 和 CTO 运作基于 BookKeeper 和 Pulsar 的[云原生消息队列和数据流平台](https://streamnative.io/)。

当然，这个组合并不那么“纯粹”地是中国人组成团队，但是中国开源事业的未来肯定是要跟世界接轨的。

上面这些例子里，Databend 和 GreptimeDB 其实还在非常早期的初创阶段，并没能实现盈利；StreamNative 虽然有营收，但是也并未上市；飞致云已经运作进十年，多次融资，经营状态良好，不过也还未上市。个人开发者通过提供支持或打造个人品牌获得资助的方式有人走通，但是并不能大规模复制。

## 中国开源发展的困难

承接上文，我用反过来的顺序讨论中国开源发展的困难和解决这些困难可能的探索方向。

### 商业探索与可持续

目前中国市场或中国团队基于开源盈利的模式探索、进展和困难，上一段已经穿插的讲了一些。我在过往文章当中也多次讨论过企业开源的策略和基于开源的商业模式：

* [《企业开源的软件协议模型实践》](https://mp.weixin.qq.com/s/iSR1sryhmp_wQxf5cvrxOA)
* [《企业实践开源的动机》](https://mp.weixin.qq.com/s/NYC_beiBvsxCjkocA1FUZA)
* [《商业源码协议为何得到 HashiCorp 等企业的垂青？》](https://mp.weixin.qq.com/s/hYfw7HoBr-cm8cxyQIXLgw)
* [《企业如何实践开源协同》](https://mp.weixin.qq.com/s/d5pwuMOUKYdO30REVL73Mw)
* [《开源不是商业模式》](https://mp.weixin.qq.com/s/VIKlKIthvYaHaBl6ALqtSA)
* [《诱导转向的伪开源战略》](https://mp.weixin.qq.com/s/HsgoUoBzsyXSmDfV00DlgQ)
* [《免费增值的商业模式》](https://mp.weixin.qq.com/s/2BayiBGrlOmA-BJ2NoqMKw)

在这里，我不在重复之前讲过的内容，仅就基于开源盈利这个主题分享几个观点。

**第一个，商业和开源之间没有必然联系。**

首先，开源软件的可持续并不一定要商业化。上面例子里有大量的志愿者撑起来的项目，它们要么是因为离终端应用太远很难找到商业产品化盈利模式，要么是因为用的人太少本身就是同好项目。前者例如 Apache Maven 等研发基础设施，后者例如 Linux 生态里海量面向黑客的自由软件。不用商业化，开源软件也可以活得很好，且这是 MongoDB 和 Elastic 炒作“开源商业模式”之前的常态。因此，那些爱管闲事整天怀疑开源软件“不赚钱”就活不下去的人，可以歇一歇了。

其次，开源并不是一种商业模式，也不直接带来商业优势。这在上面链接的《开源不是商业模式》里已经讨论过了。在过去的几年里，这主要是一个市场炒作的集中方向，通过营造一种“开源了就赢了”的集体幻觉来制造泡沫。如今热度减退，我们应该理性的认识到软件开源不能带来直接的商业优势。

当然，即使不能带来直接商业优势，软件开源于企业还是有价值的，同样可以参考上面链接的几篇文章了解企业开源的动机和可选的策略。

**第二个，开发者只有在保证生存的前提下，才有可能参与开源社群。**

这一点主要是澄清把开源当做一种哲学、宗教或信念来宣传带来的影响。当然，有人愿意这么做，这无可厚非，但是这并不是开发者参与开源社群主要的动机。

欧洲和北美的开源开发者主要参与动机是工作需要或个人需要，即他们的工作依赖了某个开源软件或日常生活使用了某个开源软件，遇到问题向上游反馈或提供补丁。前者例如一众大数据项目来自用户企业的参与者，具体点比如字节跳动参与 Apache Calcite 的李本超 [@libenchao](https://github.com/libenchao) 同学；后者比如我在使用上面提到的 NexT 和 Linux 上的输入法 Fctix 遇到的问题，都会到上游社群的反馈，能修的我就提个补丁。

国内跟上面这个画像目前还有出入的主要原因是缺少上游优先（Upstream First）理念的宣传和成功案例的鼓舞。尤其是因为英文水平不行，其实真想到上游去反馈一个什么问题，很多时候说不清楚，或者一门心思强调我很急、我老板在催我等等问题，导致与上游沟通不畅。不过这个状况在越来越多开发者走通了沟通方式，并主动出来分享经验，传帮带后来的开发者之后，目前是在逐渐改善的。当然，整体情况仍然处于非常糟糕的处境，尤其是对成长于 Oracle / MicroSoft 时代的企业中层技术领导的科普缺失，导致在解决具体上游协同的问题之前，整个方向都被直接否定；或者企业上层制定了开源策略，执行到这一层就不知所措无法推进。

国内参与开源项目的主要动机要论相似，应该说和印度开源开发者最为相似：求名。

通常，中国和印度的开源开发者热衷于寻找知名开源项目，套磁询问有没有可以贡献的内容。不管自己用不用得上吧，反正是搞完就是个 badge 可以挂在包括简历上的各个地方。往往这些开发者也更急切地想知道如何成为 Committer 或维护者，最好有一个量化的制度，按照解题的方式有付出就有回报。

这个问题展开还有很多细节，但是总的来说，无论是工作需要和简历求职需要都导向开发者参与开源是保证生存的一部分，而“只是为了好玩”的开源玩家往往有着其他收入支持生存。

例如，Linux 的作者 Linus 曾坦言每年从 Linux Foundation 接受 90 余万美元作为解决他维护 Linux 后顾之忧的资金；吴晟维护 SkyWalking 一半是公司 Tetrate 对 SkyWalking 的需求，一半是在有公司支付工资以后，出于对自己项目的责任心付出时间处理 SkyWalking 社群的消息；漩涡维护 OpenDAL 实际上也是有 DatafuseLabs 公司的需求在支撑，而他通过完成这些需求维持工资收入，这使得他能将业余时间投入到社群的其他需求和创新中，而不是首先全力找工作维生。

试图投入全部做开源项目开发和维护的人，很有可能遇到 [core.js 作者的困境](https://github.com/zloirock/core-js/blob/06b4703d6393d58b7885437ab268ddda4103f174/docs/zh_CN/2023-02-14-so-whats-next.md)。这位作者最后解决问题的方式是写文章陈述自己遇到的困难，并以此赢得维持其生活的捐赠。

**第三个，基于开源的商业可以是一种开源社群可持续模式。**

上一点提到，不少开源开发者参与上游社群的动机是工作需要，这其实隐含了为什么我们要讲开源与商业结合的理由。

如今，资本体系是主流社会运作的基本规律，要想让中国开源进入主流社会的循环分工，阐释和发展商业当中的开源成分就非常重要。

例如，红帽是第一个出圈的“开源商业公司”。它的成功和持续的商业投入，实际上为许多开源开发者创造了岗位。例如，红帽资助了 Debezium 等一众开源软件的开发，自身提供了这些开源软件交付运维的全套支持和咨询服务。

例如，Aiven 是一家开源软件的发行版开发商，它的员工积极参与到 Apache Kafka 等上游的技术讨论，并将其技术方案和实现公开，以求和上游共同发展。

例如，Upstash 提供了 Redis 和 Kafka 的全球可用的托管服务，它曾经资助了许多 Redis 和 Kafka 的多语言客户端，以寻求合作帮助其用户能够将任何语言写成的应用连接到 Upstash 提供的 Redis 或 Kafka 服务上。

例如，Snowflake 是大家耳熟能详的商业数据仓库公司，其核心代码并不开源。但是，它的云上方案重度依赖 Apple 开源的 FoundationDB 系统，因此它雇佣了许多 FoundationDB 的开发者。在今天的 [FoundationDB 提交榜单](https://github.com/apple/foundationdb/graphs/contributors)上，可以看到大量 Snowflake 的员工参与贡献（以 `sfc-gh-` 开头的账号就是）。

商业软件公司是直接可理解的基于开源的商业产品的所有者，但是上面我提到阐释商业当中的开源成分也非常重要。因为无论公司主营业务为何，只要它的主营业务核心链路上重度依赖开源软件，它就可能是为开源付费的企业。

例如，Apple 对制造数据的实时分析的需求产生了对 Apache Flink 的需求，进而招募了 Flink Streaming API 的两位作者，并开发且开源了 Flink Kubernetes Operator 项目，为 Flink 在云原生环境下的部署使用做出了巨大贡献。

例如，腾讯业务生产环境上越来越多的 Java 应用产生的对 JDK 定制化的需求，使得腾讯招募了 OpenJDK 的 Committer 杨晓峰开发出腾讯的 Kona JDK 发行版。

### 项目与社群的发展

应当说，结合商业是目前中国开源刚起步探索的方向，阐释商业当中的开源成分的意义和现状甚至还没有得到太多重视。

与之相比，目前确实已经有一批中国开源开发者创造了一系列项目，解决了自己或企业的特定问题。但是，这些项目普遍遇到的一个问题就是如何围绕开源软件建立起一个繁荣的社群。

社群建设其实包括好几个方面的问题。首先是要搞清楚自己创造的开源软件解决了哪些人的问题，进而大致可以建立起一个什么规模和风格的社群；然后是具体社群建设和经营过程中，如何与开发者建立联系，如何获取信任，以及如何进行协同等问题。

同样，这些问题我在过往文章中也都有讨论：

* [《共同创造价值》](https://mp.weixin.qq.com/s/XjlmOrHcc2ZO-5lCrZBoHg)
* [《Maintainer 的标准》](https://mp.weixin.qq.com/s/y8ewE2bIF3wa2hmQJvLu5g)
* [《Apache 成熟度模型》](https://mp.weixin.qq.com/s/5eOcS261iDghYxxjl5-ICw)
* [《高效参与开源的秘诀》](https://mp.weixin.qq.com/s/9aERt1faSxyD_WBpdnI8iw)
* [《The PostgreSQL Community》](https://mp.weixin.qq.com/s/M43TJVxb6CykPI8MiFS55w)
* [《The ZeroMQ Community》](https://mp.weixin.qq.com/s/kf3amPr8ssSsPEZHKi7Bmw)
* [《开源社区的治理模型应当因地制宜》](https://mp.weixin.qq.com/s/POhfL4zrrmUHZUWGNWQbpw)

海外关于社群建设有两份非常值得参考的材料：

* [Open Source Guides](https://opensource.guide/)
* [Producing Open Source Software](https://producingoss.com/en/producingoss.html)

我在今年的 ApacheCon Asia 2023 上做了一个名为[《社群长青：开源社群如何可持续发展》](https://www.bilibili.com/video/BV17u4y1r7ei)的主题演讲，也是因为看到在中国开源大跨步式地从一无所有直接进入到发起创造项目的阶段，这个过程里从国外吸取的经验大多是如何参与到现有的开源社群，反而缺少帮助开源软件的作者建立起一个社群的知识。

开源社群建设的内涵太过丰富，我在这里如果展开恐怕收不住。只简单讲一点，有任何其他问题可以加入我的知识星球〖夜天之书〗提问交流。

![256 ""](zsxq.jpeg)

这一点就是加入基金会对开源项目的帮助。

我在《社群长青》主题演讲中也提到加入 ASF 孵化器能够帮助项目可持续发展。这是因为 ASF 作为慈善组织，其目的就是制造服务于公共利益的开源软件，所以整个 ASF 投入了很大的精力讨论社群的基本原则和构成要素、社群如何成功，并搭建了一套社群运作的基础设施。

> The Apache Software Foundation (ASF) exists to provide software for the public good. We believe in the power of community over code, known as The Apache Way. Thousands of people around the world contribute to ASF open source projects every day.

在合规与品牌保护之外，ASF 对于中国开源项目最有价值的参考材料有以下这些：

* [HOW THE ASF WORKS](https://apache.org/foundation/how-it-works/)
* [The Apache Incubator Cookbook](https://incubator.apache.org/cookbook/)
* [The Apache Way](https://www.apache.org/theapacheway/index.html)

Apache 的工作方式和理念并不一定适合每一个项目，例如知名的开源软件 Zipkin 和 MyBatis 都曾经是 ASF 项目，从 ASF 归档并更名运作后仍然健康。但是，总的来说 ASF 在过去的几年间对中国开源项目的发展尤其是国际化发展还是起了相当大的作用的。

这不仅得益于 ASF 二十多年来积累的[社群发展经验](https://community.apache.org/)，也有许多早年就参与 ASF 项目的开源领路人作为导师提供帮助，并且在国内基于 ASF 的经验宣传开源理念和成功案例。

在过去的几年里，ASF 价值观的核心理念社群重于代码（Community Over Code）深入人心。ASF 对项目开放沟通、国际化运作和合规的要求，培养了一批熟悉相关问题的开源开发者，这些人薪火相传，最终达到目前能够成规模地面向学生、面向企业决策者输出知识和方案的状态。

这里就引出一个问题：毕竟 ASF 是建立在美国的基金会，中国是否需要建立一个自己的基金会，打造一套孵化机制呢？

我认为这个需求是有的。

在目前的形势下，依赖一个建立在美国的基金会推动开源项目及其社群的发展，在充分利用国内资源和国内落地转化的环节总会遇到一些阻碍。所以，客观来说，中国需要一个可行的孵化机制，以及按照这个机制运行的成功的项目，并且实现这个“把大象装进冰箱里”的问题的要点是明确的：

1. 参与孵化的项目是否有价值。缺少独特价值的项目杠杆太短，而且做出来了也很难说事儿。
2. 规则是否执行到位，背后是基金会或组织是否有核心理念。否则项目很多有自己的想法，最后跑偏了也就无从谈起“孵化机制”，都是自己把自己孵出来，而不是机制。

中国官方的基金会面临的一大问题是缺少有公认价值的项目。

诚然，ASF 和 LF 的项目质量也参差不齐，甚至可以说半数以上的项目都“没有显著的价值”（注意，这不意味着没有价值）。但是，ASF 立足于曾经席卷全球的 Apache Web Server 项目，后来成为 Java 生态必不可少的成分，更在大数据时代成为绝大多数开源大数据项目的孵化基地，这是 ASF 的项目价值为它奠定的国际地位。LF 立足于全球第一的开源操作系统 Linux 社群，后来又争取到了全球第一的容器编排系统 Kubernetes 加入成立 CNCF 子基金会，并在最近吸纳了 Istio 作为成员项目，LF 由此制作了一系列技术白皮书，这是它的项目价值为它奠定的国际地位。

中国官方的基金会缺少这种经过考验的开源项目，甚至是先有基金会，再来找项目加入。对于成功的开源项目来说，这样的基金会完全是一个外来机构，加入它的意义非常模糊，除非是动用某些力量直接摊派任务，否则极少有开源项目想要主动加入这些基金会。

相比之下，加入 ASF 是认同它的开源理念，希望得到孵化过程的指导和利用 ASF 提供的开发基础设施，ASF 的品牌在许多其他社群是一个可靠的背书，这对于开发者来说有明确的价值；加入 LF 或 CNCF 是希望得到基金会的市场营销资源，由于 LF 是商业联盟，加入 LF 总是以企业身份参与的，这对于企业来说有明确的价值。

中国官方的基金会建立的逻辑主要是十四五规划提到了要“支持数字技术开源社区等创新联合体发展，完善开源知识产权和法律体系，鼓励企业开放软件源代码、硬件设计和应用服务”，说白了就是为了开源而开源。这自然很难说是有核心理念，也就无法讨论核心理念的好坏，进而往适合中国发展的方向去迭代。

中国民间的联合开源社群面临的一大问题是缺少核心理念。

中国民间是无法建立开源基金会的，这使得一些有能力搭建基金会组织的团队往往也在中国开源生态之外完成这项工作，例如 [OpenRetry 基金会](https://openresty.org/en/about.html)和 [Alluxio 基金会](https://github.com/Alluxio/alluxio/wiki/Alluxio-Project-Management-Committee-(PMC))。

中国民间的开源组织往往以联合开源社群出现，即几个开源项目放在同一个新取的组织名字下面运作。这些组织的项目或多或少还是有用户和开发者的，具备持续发展的基本条件。但是它们的核心团队往往没有能力定义出该组织的核心理念，基本是照搬 ASF 的开源理念，或者把听说过的开源理念做一通缝合。由于不存在理念或者对理念仅仅是简单的船货崇拜，这些组织无法落实和迭代自己的核心理念，落入到上面提到的“项目都是自己把自己孵出来”，跟机制没有关系。

甚至，这些开源组织或其项目会把进入到 ASF 孵化作为发展目标，这就更无从谈起中国的孵化机制了。

### 开源世界的领路人

最后，落到点亮中国开源的星星之火的话题上。

应当看到，即使面对挑战和存在不足，今天的中国开源相比起若干年前的状况仍然有了长足的进步。这种进步从根本上说就是中国开源“散似满天星”的形势，即越来越多的人了解开源、参与开源，投入到开源软件的开发和创造中来。

这种变化，与第一代中国开源开发者作为领路人是分不开的。

上一段谈到 ASF 的开源经验在国内传播和实践的时候，就已经提到了领路人的作用。吴晟作为 ASF 第一个来自中国的董事，指导过不少于六个中国开源项目的孵化。姜宁作为 ASF 第二个来自中国的董事，也是第一个连任至今的董事，指导过不少于十个中国开源项目的孵化。曾经帮助过中国项目在 ASF 和 LF/CNCF 孵化的开源领路人还要更多。

同时，姜宁老师还是我成为 ASF Member 的提名人。在他的帮助下，我才更深刻地接触到 ASF 的运行机制和项目孵化机制，并参与或发起了三个中国项目的孵化。

此外，虽然我们总要走出一条适合自己的道路，但是理解开源是如何走到今天这个局面对开展工作也大有裨益。这就要求有人能够把英文的开源资料翻译成中文。

姜宁和刘天栋（Ted）参与的 ALC Beijing 为翻译 ASF 社群建设材料做了许多工作，例如：

* [Apache 孵化器指南](https://github.com/alc-beijing/translation/blob/master/apache/incubator/cookbook-zh.md)
* [新孵化项目提案](https://github.com/alc-beijing/translation/blob/master/apache/incubator/Apache%E9%A1%B9%E7%9B%AE%E6%AF%95%E4%B8%9A%E6%8C%87%E5%8D%97.md)

Ted 还在开源雨林组织里翻译了一系列开源世界正在发生的重大事件的文件：

* [《拯救开源：网络韧性法案即将带来的悲剧》](https://mp.weixin.qq.com/s/_WOrj6_CcISR5q9IkcydFA)
* [《ASF 法律委员会发布贡献者生成式 AI 指南》](https://mp.weixin.qq.com/s/qEt_VVRJe5T7iGJfUfRFlw)
* [《ASF 生成式工具指南》](https://mp.weixin.qq.com/s/AEO9FAeS4KN_xdyaJS7HpQ)
* [《日内瓦开源高峰会》](https://mp.weixin.qq.com/s/Z0ZkhHJZfWk0tFMO29AJhQ)

开放原子开源基金会的“源译识”项目翻译了著名开源律师 Heather Meeker 的著作[《商业开源：开源软件许可实用指南（第三版）》](https://atomgit.com/OpenAtomFoundation/translation/blob/4b2f8b76790c6a85a6e0dd9d486c8f660c4fcf60/专业书籍翻译/商业开源%20开源软件许可实用指南%20第三版%20刘伟%20译%20电子版.pdf)。华东师范大学和同济大学联合成立的 X-LAB 开放实验室翻译了 GitHub 前高管写作的[《开放式协作：开源软件的生产与维护》](https://github.com/X-lab2017/WIP-feedback)。

此外，当然还有翻译了《大教堂与集市》和一系列开源软件协议的卫 Sir 以及他的公众号〖卫sir说〗。

在这几年，我花费了大量的时间发现优秀的中国开源开发者和中国开源项目，帮助他们在开源共同体当中发挥更大的价值并取得更瞩目的成就。

最近一次，是上周我鼓励在美团深度使用 ZooKeeper 的工程师 [@zhaohaidao](https://github.com/zhaohaidao) 将我们讨论的一个问题及其解法提交到上游。

[ZOOKEEPER-4743: Jump from -2 to 0 when zookeeper increments znode dataVersion](https://github.com/apache/zookeeper/pull/2064)

对于很多开发者来说，ZooKeeper 是距离自己非常远的一个开源项目。尽管可能自己的业务核心链路上就依赖 ZooKeeper 正常运转提供全局配置读写、主节点选举以及全局计数器，但是发生问题以后往往也是绕过了事或者纯粹当做黑盒重启并祈祷。这其实是我前面提到的“缺少上游优先（Upstream First）理念的宣传和成功案例的鼓舞”以及英文能力没有在相关环境下锻炼的一个体现。

在我之前，ZooKeeper 有海外华人 [@hanm](https://github.com/hanm) 和 [@lvfangmin](https://github.com/lvfangmin) 参与，也有身在北京的工程师 [@maoling](https://github.com/maoling) 参与。我在 @maoling 和意大利开发者 @eolivelli 的帮助下参与到 ZooKeeper 社群，并随后帮助了 @kezhuw 和 [@horizonzy](https://github.com/horizonzy) 提交 ZooKeeper 的补丁。

从我的经验出发，很多开发者只要成功合并了第一个 non-trivial 的补丁（即不是修改拼写错误或坏链接等跟项目实现逻辑无关的修改），通常就能完成对开源参与的祛魅，理解开源协同的大致流程，建立起信心，逐渐走向常态化 contribute 的状态。长此以往，最终会像我在前几个月的感慨一样，发现自己给开源软件提交补丁和参与社群讨论已经如呼吸般自然。
