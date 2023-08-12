---
title: 商业源码协议为何得到 HashiCorp 等企业的垂青？
date: 2023-08-12
tags:
    - 开源
    - 开源协议
    - 商业开源
categories:
    - 夜天之书
---

当地时间 8 月 10 日，知名开源软件公司 HashiCorp 发布[一则公告](https://www.hashicorp.com/blog/hashicorp-adopts-business-source-license)，称其原先在 [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/) 下发布的 Terraform、Consul 和 Vault 等多款软件，将在未来的版本中改为使用商业源码协议，即 [Business Source License 1.1](https://mariadb.com/bsl11/) 来发布。

此前，已有其他知名开源软件公司也改用或从一开始就使用商业源码协议许可其源码公开的软件。

* MariaDB 公司的产品 [MaxScale](https://mariadb.com/projects-using-bsl-11) 数据库代理；
* CockroachLabs 公司的产品 [CockroachDB](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/) 数据库；
* Lightbend 公司的产品 [Akka](https://www.lightbend.com/blog/why-we-are-changing-the-license-for-akka) 框架；
* Materialize 公司的产品 [Materialize](https://github.com/MaterializeInc/materialize/blob/937a0983c0bda4e2cf86b36c51f8123a3e236f9e/LICENSE) 流数据库；
* Outline 公司的产品 [Outline](https://github.com/outline/outline/blob/f4e499250842f7b7b4e77ff0826b8069e5c6d371/LICENSE) 知识库。

本文首先介绍商业源码协议的由来和内容，进而以剖析选择该协议的公司和软件的方式讨论其作用。最后，从企业开源的动机和利益权衡出发，讨论为何 HashiCorp 等一众所谓开源软件公司，最终都走向带有商业保护条款的源码公开协议。

<!-- more -->

## 什么是商业源码协议

商业源码协议是 Business Source License 的逐词翻译，常被简称为 BSL 协议或 BuSL 协议，当前版本是 1.1 版本。

在此前的文章中，我基本使用 BSL 1.1 来指代当前版本的商业源码协议。但是，在 Linux 基金会推动的 [SPDX 标准](https://spdx.org/licenses/BUSL-1.1.html)里，商业源码协议以 BUSL-1.1 作为标识符。这是因为 BSL 被用来指代 [Boost Software License 1.0](https://spdx.org/licenses/BSL-1.0.html) 这个更早出现的协议：它是一个类似 MIT License 的协议。因此下文及以后的文章里，我会尽量用 BuSL 1.1 来指代商业源码协议。

BuSL 1.1 是 MariaDB 公司为其产品 MaxScale 数据库代理量身定制的带有商业保护条款的源码公开协议。该协议实际使用时必然带有以下两个特点：

第一，协议授权接收方复制、修改、衍生和重新分发被许可软件的权利，但是只能在非生产环境下使用该软件。许可方可能在附加使用条款中允许其他受限的生产环境使用条款。

由于 BuSL 1.1 不授权接收方即下游用户或开发者使用不同协议分发的权利，因此上述生产环境使用的限制将传递到所有直接或间接的下游。

第二，协议约定一个不超过四年的期限。在该期限过后，接收方将获得许可方指定的变更协议授予的权限，同时第一点中的条款终止。变更协议必须与 GPL 2.0 或更高版本兼容。

把这段协议文本翻译成人话，意思就是软件以 BuSL 1.1 协议发布后，在最多四年的期限后会“变成”以新协议发布。这个新协议必须是跟 GPL 兼容的协议，兼容方向是 GPL 许可的软件能够跟该协议许可的软件集成后以 GPL 发布。再直白点说，所有 Permissive 开源协议和 Copyleft 开源协议里选一个。

所以，BuSL 1.1 协议，比起同类型的 [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license) (ELv2) 协议拿来即用，更像是一个协议模板。要想使用 BuSL 1.1 协议，需要决定是否约定一个小于四年的协议变更期限，以及是否在附加使用条款中允许客户在其他特定生产环境使用。

当然，BuSL 1.1 协议在许可方契约一节里也约定了任何自称 BuSL 1.1 的填完空的具体协议，只能细化这两处，且不能与一开始就授予的复制、修改、衍生和重新分发等权利相冲突。

显然，BuSL 1.1 协议并不是开源协议，因为它限制生产环境的使用，而这不满足[开源定义](https://opensource.org/definition/)当中的第六条“不得歧视特定领域的使用”。BuSL 1.1 在其协议文本说明中也直接地说明了这点，同时提供了两份分别对于下游用户和许可方的常见问题解答：

* [Frequently Asked Questions](https://mariadb.com/bsl-faq-mariadb/)
* [Adopting and Developing BSL Software](https://mariadb.com/bsl-faq-adopting/)

下面，我们从具体的应用案例出发，分析 BuSL 1.1 的使用方式及其作用。

## 商业源码协议的应用案例

### MaxScale

首先看到的是协议诞生之地，MariaDB 的 MaxScale 数据库代理。毫不意外的是它约定了最长的四年变更期限，并以 GPL 2.0 or later 作为变更协议。这部分没有太多讨论必要，主要看它对生产环境使用的条款：

> You may use the Licensed Work when your application uses the Licensed Work with a total of less than three server instances in production.

简言之，可以在生产环境使用，但是单个应用不能部署超过三个节点。

这其实就是限制了大规模集群的场景，允许个人用户和小企业用起来，做产品反馈和帮助传播。对于需要维护大集群的用户，通常也是更有实力付费的用户，限制其使用，促使它们谈判商业合同付费购买使用许可。

### CockroachDB

CockroachLabs 起初使用 Apache License 2.0 (ALv2) 来许可自己的数据库。随后开发出一套所谓的 [CockroachDB Community License Agreement](https://github.com/cockroachdb/cockroach/blob/7da4ef5af83c38680c536e7c18a9db61274b9d25/licenses/CCL.txt) 来发布一些高级功能和插件，以图促使高级用户付费。

稍微展开一下这个 Community License Agreement 对下一节讨论协议采用动机有帮助，因为这个模式是在 ELv2 和 BuSL 1.1 出现之前开源商业公司追加商业保护条款的常见做法。

这个协议很长，所以对开发者极不友好。去掉所有套话，其中最关键的条款是第四条“费用”和第五条“试用协议”。简言之，开发者通过申请，每个自然年最多可以试用 30 天企业版，除此以外的使用统统要付钱。

所以这其实是一个很典型的商业协议，甚至没有跟源码公开协议、开源协议放在一起讨论的价值。只是因为它是一家开源商业公司 CockroachLabs 创造，且在相当一段时间内被其他开源商业公司使用，所以做一个解释。同时它的名字 Community License Agreement 也非常的令人费解：这就是一个商业软件协议，跟 Community 没有任何关系。

回到正题，CockroachLabs 在实行 ALv2 + Community License Agreement 几年后，发现仍然无法达成商业目标，于是干脆把原先用 ALv2 许可的核心部分也改用 BuSL 1.1 协议来许可。

CockroachDB 选择的变更期限是三年半，变更协议是此前使用的 ALv2 协议。同样这个不需要展开，主要看它对生产环境使用的条款：

> You may make use of the Licensed Work, provided that you may not use the Licensed Work for a Database Service.
> 
> A "Database Service" is a commercial offering that allows third parties (other than your employees and contractors) to access the functionality of the Licensed Work by creating tables whose schemas are controlled by such third parties.

可以看到，和 MaxScale 不同的是，CockroachDB 不限制一般意义上的集群使用，只是限制下游使用 CockroachDB 提供数据库服务。CockroachLabs 本身以提供数据库服务盈利，所以这可以认为是一个禁止竞争的条款。

这个条款的写法是我比较喜欢的，因为它把数据库服务定义得非常清楚：当你的应用基于 CockroachDB 搭建时，你不能支持外部用户创建他们自定义结构的表。

从一个工程师的角度来看，这意味着内部使用 CockroachDB 是可行的，只要整个领域模型仅内部可见。例如，作为一家电商公司，我可以用 CockroadDB 存储操作我的用户数据和交易数据，因为用户表和交易表都是我内部定义的，外部用户并不知道这些定义，也无法自定义表。同样，我可以把 CockroachDB 用来存任何其他事务数据，用来支持搜索引擎，这都没有问题。

### Redpanda

Redpanda 公司在 2020 年开始许可自己的代码，全面复刻了 CockroachLabs 的策略：仿照 CockroachLabs 的 Community License Agreement 如法炮制了一个 [Redpanda 版本](https://github.com/redpanda-data/redpanda/blob/682a7731ac0e9717757f8c00b48b80c7cf8cc50d/licenses/rcl.md)，同时使用 BuSL 1.1 许可核心代码。

不出意料，Redpanda 选择了四年的“保护期”，指定变更协议为 ALv2 协议，其生产环境使用的条款如下：

> You may make use of the Licensed Work, provided that you may not use the Licensed Work for a Streaming or Queuing Service. A "Streaming or Queueing Service" is a commercial offering that allows third parties (other than your employees and individual contractors) to access the functionality of the Licensed Work by performing an action directly or indirectly that causes the creation of a topic in the Licensed Work. For clarity, a Streaming or Queuing Service would include providers of infrastructure services, such as cloud services, hosting services, data center services and similarly situated third parties (including affiliates of such entities) that would offer the Licensed Work in connection with a broader service offering to customers or subscribers of such of such third party’s core services.

内容很长，一句话就是你不能允许外部用户创建主题。Redpanda 是 Kafka 的平替，这里所说的主题也就是 Kafka 或者消息队列领域里的主题。

这个限制和 CockroachDB 基本类似，也就是允许用户内部使用，但是斩断了向外部用户提供消息队列功能的可能。毕竟我是一个消息队列服务的用户，我肯定是要自己先创建主题，再往其中生产消费消息的。内部使用基本不受影响，因为内部使用属于雇员或合同工创建主题的例外范畴。举个例子，你还是可以用 Redpanda 作为内部数据同步的管道。

### Materialize

Materialize 公司打从一开始就用 BuSL 1.1 来许可自家的流数据库。在同样的四年“保护期”和 ALv2 作为变更协议以外，其生产环境使用的条款为：

> Within a single installation of Materialize, you may create one compute cluster with one single-process replica for any purpose and you may concurrently use multiple such installations, subject to each of the following conditions:
> (a) you may not create installations with multiple clusters, nor compute clusters with multiple replicas, nor compute cluster replicas with multiple processes; and 
> (b) you may not use the Licensed Work for a Database Service. A "Database Service" is a commercial offering that allows third parties (other than your employees and contractors) to access the functionality of the Licensed Work by creating views whose definitions are controlled by such third parties.

很简单，MaxScale + CockroachDB 的限制一起上，即不能创建大集群，也不能提供数据库服务。

### Outline

Outline 是一款知识库产品，可以对标 Notion 或印象笔记等软件。在同样的四年“保护期”和 ALv2 作为变更协议以外，其生产环境使用的条款为：

> You may make use of the Licensed Work, provided that you may not use the Licensed Work for a Document Service.
>
> A "Document Service" is a commercial offering that allows third parties (other than your employees and contractors) to access the functionality of the Licensed Work by creating teams and documents controlled by such third parties.

基本是仿照了 CockroachLabs 的写法，不过把数据库服务改成了文档服务。其中，对文档服务的定义是允许外部用户自行创建或使用文档。

简言之，如果只是在公司内部做知识库构建，可能可以允许外部用户查看，但是不允许外部用户创建团队和文档，这是协议授权范围内的。这基本满足了用户自建知识库和共享给客户查阅的需求。

### Akka

Akka 是久负盛名的 Scala 语言异步通信和应用开发框架，实现了 Actor Model 的设计，号称 JVM 上的 Erlang/OTP 实现。Akka 开源的时间非常久，从 2009 年到去年中修改协议，已经以 ALv2 发布了十多个年头。许多开源软件和业务都搭建在 Akka 的底盘上。

Akka 于 2022 年九月宣布未来版本将改用 BuSL 1.1 许可。在填空题上，Akka 选择了三年“保护期”和 ALv2 作为变更协议。其生产环境使用的条款如下：

> If you develop an application using a version of Play Framework that utilizes binary versions of akka-streams and its dependencies, you may use such binary versions of akka-streams and its dependencies in the development of your application only as they are incorporated into Play Framework and solely to implement the functionality provided by Play Framework; provided that, they are only used in the following way: Connecting to a Play Framework websocket and/or Play Framework request/response bodies for server and play-ws client.

写得非常复杂，但是总结下来是很简单的一句话：任何情况都不能在生产环境部署 Akka 应用，除非你是用 Play 框架开发应用，且应用中没有直接和 Akka 的接口通信。

这个涉及到一些历史背景：Play 框架和 Akka 都是 Lightbend 公司的产品，早在几年前 Lightbend 公司就宣布不在以公司投入维护 Play 框架，而是转为“社群维护”。这也是个后来被广泛应用的话术，用以指代公司放弃某个开源软件的开发。由于 Play 框架的底层就是 Akka 支撑的，修改 Akka 协议时，或许出于避免级联影响到此前已经弃养的 Play 框架的用户，Lightbend 公司通过这一条款规避了原 Play 框架用户可能收到的冲击。

从协议上看，Akka 直接禁止了生产环境的使用，可以说是最严格的 BuSL 1.1 实例。不过在 Lightbend 的博文中提到，年收入在一千万美元以下的公司，可以向 Lightbend 公司申请免费使用的许可。

### HashiCorp

最后，终于我们可以看看今天的主角 HashiCorp 是怎么使用 BuSL 1.1 协议的了。

毫无意外，HashiCorp 选择了四年的“保护期”，变更协议是此前它们采用的 Mozilla Public License 2.0 协议。其生产环境使用的条款如下：

> You may make production use of the Licensed Work, provided such use does not include offering the Licensed Work to third parties on a hosted or embedded basis which is competitive with HashiCorp's products

这个协议，我称之为毫无诚意的协议，跟带兜底条款的竞业限制协议是类似的。它写的是：不能把被许可的软件用在向第三方提供和 HashiCorp 产品存在竞争的服务上。

那么，什么是“跟 HashiCorp 存在竞争”就是一个非常模糊的说法。对此，HashiCorp 的解释很有一家商业公司典型的做派：如果你不清楚是否违规，请联系我们的律师。

> HashiCorp considers a competitive offering to be a product or service provided to users or customers outside of your organization that has significant overlap with the capabilities of HashiCorp’s commercial products or services. For example, this definition would include providing a HashiCorp tool as a hosted service or embedding HashiCorp products in a solution that is sold competitively against our offerings. If you need further clarification with respect to a particular use case, you can email licensing@hashicorp.com. Custom licensing terms are also available to provide more clarity and enable use cases beyond the BSL limitations.

当然，如果你给钱，HashiCorp 将竭诚为您定制符合您需要的协议。

## 开源商业的深层次动机及得失计算

我在[《诱导转向的伪开源策略》](https://mp.weixin.qq.com/s/HsgoUoBzsyXSmDfV00DlgQ)一文中提到：

> 自诩“开源商业公司”的企业一开始不提供商业收费的版本，投入巨大的人力开发唯一的开源软件，这可能是一种不成熟的行为。尤其是如果公司创始人没有想好此后如何盈利，只是觉得自己写好一个软件，以开源的方式打开名声，就能坐地收钱，那日后破防也是不可避免的。
> 对于这些企业来说，初心就是“写个软件好卖钱”，而且确实也是创始人辛辛苦苦拿到融资，组织起来一帮兄弟姐妹领工资夜以继日地开发软件。到头来用户只是使用而不付费，甚至因为太好用找不到付费的理由。这个时候，又冒出来几家供应商把代码拿过去改改做出自己的解决方案，甚至由于上游使用宽容开源许可，这些供应商源代码一藏，随口就说碾压上游版本。
> 这实在是大大超出了企业创始人的预料，于是修改软件许可，让这些用户和供应商搞清楚状况就会被加紧提上日程。

在企业转向带有商业保护条款的源码公开协议时，此前利用开源标签赢得口碑和声望的企业都会写一篇辩白书：

* [Why are we changing the license for MongoDB?](https://www.mongodb.com/licensing/server-side-public-license/faq)
* [Upcoming licensing changes to Elasticsearch and Kibana](https://www.elastic.co/blog/licensing-change)
* [Why We're Relicensing CockroachDB](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/)
* [A New License to Future Proof the Commoditization of Data Integration](https://airbyte.com/blog/a-new-license-to-future-proof-the-commoditization-of-data-integration)
* [Why We Are Changing the License for Akka](https://www.lightbend.com/blog/why-we-are-changing-the-license-for-akka)

可以看到，Materialize 和 Redpanda 这样一上来就是 BuSL 1.1 的软件是不用写一篇《我的忏悔》的。

上述辩白书不全是转向 BuSL 1.1 的，还有 SSPLv1 和 ELv2 等。但是它们都提到了同一个问题：自己投入人力开发的软件，商业对手却坐享其成，这使得竞争对手在这个层面上存在投入产出的优势。当然，这些企业随后会放大这种竞争对手的优势，控诉他们“不向上游回馈”，自己几乎要因此而无法存续，然后警告用户自己无法存续等于软件死亡。

这个逻辑链条有两个不成立的地方：

1. 挑战通常不是无法持续，而是无法扩张。资本的本性就是扩张，赚了一百万就想赚一千万，市值一个亿就想冲一百亿。除了 Lightbend 确实有可能是因为 Scala 式微导致维持现有规模都有挑战以外，MongoDB、Elastic 和 CockroachDB 控诉 AWS 等云厂商竞争导致它们丢掉客户，实际上是增长受挫的反应。
2. 公司等于社群对社群的存续未必是一件好事。这些企业会把开源软件的存续和自己捆绑，由于这些开源软件确实是公司产权，这也无可厚非。不过公司死了，开源软件有用，未必它就不能发展了。例如 Akka 修改协议以后，其庞大的用户群自发从最后一个开源版本拉出分支继续以开源协同的形式维护，目前在 Apache 孵化器以 [Pekko](https://pekko.apache.org/) 的名字在继续。

当然，逻辑链条不对不代表客观上没有道理。

关于增长受挫的问题，其之一是资本的本性就是扩张，所以增长受挫确实是资本所不能接受的。其之二是云厂商搭建起来的完善交付体系，确实挤压了采用原先商业模式的开源商业公司的生存空间。作为反制，Red Hat 虽然不能修改 Linux 的软件协议，但是通过改变其发行版的打包流水线，实际上增加了云厂商在其企业级发行版上原封不动打包交付的难度。

关于社群存续的问题，毫无疑问核心参与者的离开会重挫开源社群的可持续性。当开源社群中心的软件是企业产权，开源社群的核心开发者都是该公司雇员的时候，一旦公司倒台，大部分情况下确实软件也会随之消亡。但是事实证明 Akka 不会，ElasticSearch 也不会，我相信 Redis 和 Kafka 这样的项目，没有公司做商业化，也能持续下去。所以这是个有相关性但不绝对的论断。

我在[《企业实践开源的动机》](https://mp.weixin.qq.com/s/NYC_beiBvsxCjkocA1FUZA)一文中，对“商业模型是销售开源软件”的企业做过判断，认为它们早晚会将自己的开源软件改成专有软件：

> 如果一个企业的商业模型就是销售“开源”软件本身的功能，那么他们的核心功能转向专有软件只不过是时间问题，或者说只要面临商业竞争，就是经不起挑战的。

回到修改软件协议这件事上，我在[《企业开源的软件协议模型实践》](https://mp.weixin.qq.com/s/iSR1sryhmp_wQxf5cvrxOA)一文里已经提出了这个风险：

* 风险：竞争对手的商业竞争
* 风险：团队分裂并参与竞争
* 策略：运维和高级功能
* 策略：独特品牌建设
* 策略：赛道维度升级
* 策略：市场占有率与开放标准

随后我提到的“源码公开但禁止商业竞争”其实就是第五个策略：改变协议。其中又包含“核心禁止商业竞争”和“高级功能需要付费”的分支。

应该说，在现有的市场经济体制和资本主义体系下，开源软件本身是不能作为企业盈利的核心的。即使在《大教堂与集市》的《魔法锅》一章中，Eric Raymond 提出了十几个与开源软件相关的获利途径，他也同时承认“开源使得从软件中直接获取销售价值变得更加困难”。

对于商业开源来说，企业在当前的体制体系下能够找到的相对最优解，就是 BuSL 1.1 协议或 ELv2 协议：绝大部分和开源协议一样，但是禁止（直接）商业竞争。因为如果发行商能够直接和原厂竞争，那么原厂投入的研发资源就被竞争对手搭便车，竞争对手从而能够构建出其他排他的优势。典型的案例就是云厂商可以优化自己的交付体验和云基础，直接移植开源软件提供收费服务。对于没有这样一个完整基础设施团队和获取客户的强大销售团队的原厂来说，这确实使得它们在市场竞争下失去了独占软件产权的优势。

不过，对于开源软件本身，这并不是什么致命的变化，甚至都谈不上变化。

开源软件只有很少的一部分是由一家企业主导的。Redpanda 闹腾得再厉害，开源的标准是 Kafka 协议。不管 Redpanda 和 Confluent 还在不在，我相信 Kafka 会一直在。当初依靠做 Hadoop 生态发行版的企业几经浮沉，并没有太多影响 Hadoop 自己的发展。至于 RedisLabs 公司，我甚至觉得它如果死了，对 Redis 可能是一件好事。毕竟以 @antirez 现在的声誉，仿照 Linus 或尤雨溪的路子养活自己并不难，而他的参与贡献才是 Redis 发展的核心。

企业选择带有商业保护条款的源码公开协议，可以看做是从完全闭源的商业协议，到冒进的全面开源协议，在之后的一次螺旋上升的准备。我相信开源协议是完善的，它解决了源代码如何自由分享的问题。在《大教堂与集市》的论述中，Eric Raymond 从未指望供应商自己转变，而是试图通过说服用户理解开源的价值，以及鼓动任何企业开源其非盈利软件来实现开源的未来。这也是我认可的方式。

对于个人开源来说，Apache 基金会的前任董事、经验丰富的开源开发者 Ted Dunning 说过一个故事。

Ted 曾经在发布自己的软件源码时，授权接收方自由使用、更改和分发，但是如果接收方要商用，那么需要向他付一笔授权费用。但是后来他发现，用 Apache 协议发布自己的软件以后，自己一下子得到了更多的用户和他们宝贵的反馈，而这才是他作为一个开发者所期待的。同时，作为个人，他没有那么强的动力，实际上也不可能花费大量自己的时间向每一个商用的用户索要费用。

他于是说：如果我不愿为授权费奔走，那么我根本不必提出要求。

所以，商业源码协议对个人应该是没有什么帮助的（笑）。
