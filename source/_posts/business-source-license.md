---
title: 企业开源的软件协议模型实践
date: 2023-02-15
tags:
    - 开源
    - 企业开源
    - 开源商业化
    - 开源协议
categories:
    - 夜天之书
---

我在《{% post_link enterprise-choose-a-software-license %}》一文当中，已经从软件许可证的角度讨论过不同协议对企业开源的意义。

不过，那篇文章主要是从许可证内容出发的，即先给定了协议，分析完协议细节，再判断是否符合企业和计划公开的软件的情形。本文从企业开源的不同诉求和风险出发，结合现存的企业组织实践，重新讨论源码公开第一步就要面临的选择软件协议问题应该如何决策。

<!-- more -->

## 完全开放源码

完全开放源码，即以符合[开源定义](https://opensource.org/definition/)的软件协议发布企业自研软件的情形。

在讨论什么样的企业针对什么样的软件会采用完全开放源码的策略之前，我们先讨论完全开放源码的策略会给企业带来什么风险。符合开源定义的软件协议既包括宽容软件协议，也包括 Copyleft 式的协议，这里不做区分，因为企业面临的是相同的问题。

当然，对于企业完全自有产权的情形，企业随时可以改变软件协议以规避下面提到的风险。所以这里提到的风险主要涉及的是将自研软件捐赠给第三方如开源基金会，或者试图坚持完全开放源码策略的企业。

### 风险：竞争对手的商业竞争

我在《{% post_link hackers-and-customers %}》一文里讨论过，开源软件的用户包括黑客和顾客两种类型。

对于完全开放源码的创始团队来说，黑客用户既然自己有能力把软件用起来，甚至修改软件以解决自己的需求，那么可以认为开发成本已经付出，不从这类用户身上赚钱，而是寻求合作共建，是合理的。目前绝大部分“开源商业化”企业的逻辑，也是以服务无力或不愿承担开发和维护任务的顾客为主。

这一点，从目前新兴的 [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license) (ELv2) 和 [Business Source License 1.1](https://mariadb.com/bsl11/) (BSLv1) 的不少实践都允许在不进行同类商业服务竞争的情形下自由使用可见一斑。而上述两个源码公开的商业软件协议，想要避免的也正是同行黑客的商业竞争。

例如，业内提供 Apache Kafka 托管服务的企业数不胜数。在聚拢了相当数量的核心开发者的 [Confluent](https://www.confluent.io/) 之外，[Upstash](https://docs.upstash.com/kafka) 和 [Aiven](https://aiven.io/kafka) 这样的 SaaS 企业都提供了 Kafka 托管服务，更不用说大大小小的平台云厂商顺手提供的 Kafka 服务，例如 AWS 的 [MSK](https://aws.amazon.com/msk/) 服务、[阿里云的 Kafka 服务](https://www.alibabacloud.com/product/kafka)和红帽的 [OpenShift Streams for Apache Kafka](https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-streams-for-apache-kafka) 服务等等。

这样的竞争使得 Confluent 不得不在简单的提供 Kafka 服务以外寻求新的增长点，例如只在商业版本提供多租户功能，以及在流计算集成上多次失败的尝试。当然，Kafka 的创始工作和捐赠都是在 LinkedIn 公司的主导下完成的。这样 Confluent 公司虽然无法效仿 MongoDB 公司在竞争对手直接提供商业服务的时候变更协议釜底抽薪，但是心里也不至于太不平衡。

ElasticSearch 和 MongoDB 起初分别以 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) (ALv2) 和 [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) (AGPLv3) 发布，但是在 AWS 等商业公司低技术成本、高平台优势的竞争下，既无法找到新的增重点缓解危机，又无法抗拒近在咫尺的釜底抽薪方案，于是变更协议直接禁止使用源码进行商业竞争。

### 风险：团队分裂并参与竞争

Confluent 的案例里暗含了另一种完全开放源码的风险，即在软件可以自由演绎和商用的情况下，企业当中的开发者可能分裂出去单独进行商业运作并参与竞争。

Confluent 的创始团队来自 LinkedIn 公司，LinkedIn 本身没有提供云服务的业务，这种竞争尚不明显。其他处于 LinkedIn 情境的公司，甚至可以通过提供早期投资的方式，换取新团队比此前直接雇佣更低成本的支持。

Apache Hadoop 的故事演示了多家势均力敌的企业，同时基于非自有产权的开源软件做简单封装的商业化模式的风险。

在 Hadoop 的孵化公司雅虎不下场的情况下，Cloudera 公司、Hortonworks 公司和 MapR 公司为了竞争 Hadoop 私有化部署和运维服务打得头破血流，最后的结局是 Hortonworks 和 MapR 被收购，Cloudera 私有化退市。而退市以后的 Cloudera 公司，还是面临市面上拿着 Apache Ambari 封装或者自研大数据套件的提供商的剧烈竞争。

Apache Flink 的故事演示了在一家企业主导社群发展的情形下，部分团队寻求独立带来的分裂风险。

起初，Flink 在一所德国大学里开发并捐赠到 Apache 软件基金会。随后创始成员成立了 Ververica 公司，并于 2019 年被阿里巴巴收购。完成收购的阿里巴巴基本形成了对 Flink 社群的主导，并于接下来的一段时间无需顾虑其他基于 Flink 的商业服务的竞争。然而，就在过去的一两年里，核心团队分几次出走，加入到其他基于 Flink 做商业服务的公司，或者单独成立商业公司提供 Flink 服务。其中，走后面一条路的 [Immerok](https://www.immerok.io/) 公司在不久前被 Confluent 收购，一下子使得阿里巴巴的流计算业务受到 Confluent 流存储 + 流计算的强势狙击。

在这些戏剧化的商业操作背后，Flink 本身是一个完全开放源码的软件，允许任何人和组织自由演绎和使用，也包括商用和提供商业竞争，是合规层面的一个基础性的支撑。

上面提到的例子里，即使有企业完成对社群话语权主导的案例，但是都全都是企业对开源软件没有自主产权的情形。接下来的这个例子虽然也是 Apache 软件基金会的项目，但是其中使用的方法是可以套用到企业自有产权的软件的。

这个案例就是 Apache Doris 项目。

Apache Doris 由百度的研发团队开发并捐赠给 Apache 软件基金会。凭借其符合国内企业需要的数据分析能力的设计，Doris 在一开始的十年里逐渐发展出一个可观的用户群体，其中相当部分还是有购买商业服务的潜在顾客。百度自己基于 Doris 发布了 [Palo](https://intl.cloud.baidu.com/product/palo.html) 数据分析产品，但是不久以后，部分核心开发者出走，并 fork Doris 发布了后来改名为 [StarRocks](https://www.starrocks.io/) 的同类竞争产品。没过几年，另一个研发团队出走并成立了 [SelectDB](https://en.selectdb.com/) 基于 Doris 提供同类的数据分析服务。

单看这个围绕 Doris 的竞争，似乎和 Hadoop 几家公司的竞争也没有什么差别。但是 StarRocks 并不是一个典型的围绕上游的版本，而是从某个版本硬分支的全新版本，目前和 Doris 的关系算得上是“大路朝天，各走一边”。这样硬分支的手段带来的竞争，即使上游是完全自有产权的软件，也无法通过修改协议来避免。

为了表明 Doris 的案例并非孤例，我这里再举几个类似的商业相关的硬分支案例：

* Trino 是基于 Facebook Presto 的硬分支，后续 Trino 团队成立了 [Starburst](https://www.starburst.io/) 公司提出数据网格（Data Mesh）概念做为商业化方向。
* [Lightbend](https://www.lightbend.com/) 公司将 Akka 切换成年收入在一千万美元以上的公司使用就需要商用协议以后，Akka 社群的中立成员随即 fork 了 Akka 并在 Apache 软件基金会的孵化器中以 [Pekko](https://pekko.apache.org/) 的名字继续运行。
* AWS 在 Elastic 公司将 ElasticSearch 切换到 ELv2 后，发起了 [OpenSearch](https://opensearch.org/) 项目并基于它提供了类似的商业服务。

### 策略：市场占有率与开放标准

与其说这是策略，不如说这是促使企业完全开放源码的动机，即选择和坚持完全开放源码策略的一个主要原因，是企业希望完全开放源码的软件赢得广泛的市场占有率，甚至形成开放标准。

以开源的程序设计语言实现为例，在语言本身赢得用户之前，很少有企业能够直接通过售卖语言实现的编译器或解释器来盈利。瑞典电信公司 Ericsson 支持工程师 Joe Armstrong 开发 Erlang 语言之后，将整个 [Erlang/OTP](https://github.com/erlang/otp) 平台完全开放。从当年的[发布文稿](https://web.archive.org/web/19991009002753/http://www.erlang.se/onlinenews/ErlangOTPos.shtml)中，我们可以看到开放标准的典型思路：

> Erlang/OTP was invented within Ericsson and most Erlang/OTP users are still within Ericsson. In order to speed development of Erlang/OTP, ensure a good supply of Erlang/OTP fluent programmers, minimise maintenance and development costs for the language, and keep the OTP applications up to world class, we need to spread the technology outside of Ericsson.

也就是说，Ericsson 内部的电信系统高度依赖 Erlang/OTP 平台，为了保证劳动力市场上一直有人熟练掌握这一语言和开发平台，从而保证 Ericsson 内部系统不至于无人能够维护，Ericsson 希望完全开发源码，以期在公司以外的广阔生态中推广 Erlang/OTP 平台。事实证明，这一决定为 Erlang/OTP 平台起初在电信行业内的推广，以及后来在游戏行业中的广泛应用，再到近些年其底层虚拟机 BEAM 借助新语言 Elixir 的发展再次得到关注，都起到了至关重要的作用。Joe 为 Ericsson 创建高可用的服务打造了一个完整的开源软件和开发平台，但是如果没有开放源码，这将只是 Ericsson 这个如今已不那么有名的企业的一个内部系统。或许会成为一个仅存于谈话之中的传说，但是不可能有今天的生态。

同样是 Erlang 生态的一部分，José Valim 设计的 [Elixir](https://elixir-lang.org/) 语言及其开发的解释器和网站开发套件，代表了开放源码以赢得市场占有率的策略。

José 起初在自己参与联合创办的 Plataformatec 开发出了 Elixir 语言的解释器，以及 [ecto](https://github.com/elixir-ecto) 工具和 [Phoenix](https://github.com/phoenixframework) 框架。后来，Elixir 的使用率日益增长，José 于是另外创办了 [Dashbit](https://dashbit.co/) 公司来提供 Elixir 应用的开发和运维支持。

从 Dashbit 公司的视角出发，其拥有部分 Elixir 核心生态软件的知识产权，但是它却没有通过限制核心软件使用，要求用户购买 LICENSE 的方式来盈利。这是因为，Elixir 毕竟还是一个小众的语言，用户使用量的增长才是做企业支持的基本盘。如果小有成就马上杀鸡取卵、竭泽而渔，那么新用户就很难有信心上车，而存量用户也会想办法跳车，最终生态凋敝，没人有理由购买 LICENSE 授权。

José 本人在 LinkedIn 上的头衔就是 Chief Adoption Officer 即首席（用户）采用官，可见 Dashbit 的开源策略当中对市场采用率的重视程度。同类的案例还有 [VMWare](https://tanzu.vmware.com/open-source) 的 Greenplum Database、Spring Framwork 和 RabbitMQ 等项目，这些公司（在相关方向）的主要商业模式是提供支持和咨询，而不是售卖软件或提供云服务，因此其提供支持和咨询的对象的使用率越高越好。

再来看一种竞争型的开放标准策略，其中典型的当属 Google 的开源矩阵：

1. Chromium 打下了浏览器内核的半壁江山。如今，多少网页应用都注明仅在 Chrome 上经过测试。
2. Android 从 iOS 和 Symbian 的夹缝中取得了移动端市场的船票，并最终和 iOS 二分天下。
3. Kubernetes 和 Istio 是 borg 技术溢出以后，Google 主动建立生态的尝试。在相当一段时间里，用上 Kuberneets 就“等于”云原生。

Google 是重度参与 C++ 标准讨论或者说竞争的，这可从 C++ 之父 Bjarne Stroustrup 的论文 [Thriving in a Crowded and Changing World: C++ 2006–2020](https://www.stroustrup.com/hopl20main-p5-p-bfc9cd4--final.pdf) 中关于 C++ 标准委员会的讨论中窥见端倪。应该说，标准之争是激烈甚至残酷的。企业内部总有领先与行业标准所做的尝试，一旦行业后续面对相同问题时将另一种解法确定为标准，那么本公司不说此前的研发投入打了水瓢，至少也需要付出可观的额外努力来兼容新标准。Google 深知这点的厉害，而 Kuberneets 打赢容器战争，对比失败的 OpenStack、Docker Swarm 和 Apache Mesos 与重金投入它们的公司，Google 账面之外的获利不可计数。

无独有偶，Facebook 的 [React](https://reactjs.org/) 前端应用开发框架已经成为无可置疑的标准，对应 Google 推出的 Angular 势弱，多少投资 Angular 的企业和开发者损失惨重。

国内也不乏出于这个动机完全开放软件源码的企业。例如，[Apache InLong](https://inlong.apache.org/) 是腾讯大数据平台里数据集成能力的开放，[Apache Dubbo](https://dubbo.apache.org/en/index.html) 和 [Nacos](https://nacos.io/zh-cn/) 是阿里巴巴微服务架设和治理经验的开源表现，[CloudWeGo](https://www.cloudwego.io/) 是字节跳动中间件能力的系列开源行动，[Go Kratos](https://go-kratos.dev/) 是 Bilibili 开源的微服务框架。当然，这些软件集中在所谓的“中间件”领域，是另一个值得探讨分析的话题。

最后，上面提到的都是体量巨大或至少相对较大的公司，对于小公司来说，有没有实践市场采用率和开放标准这一策略的空间呢？

肯定还是有的。例如，近期已被 Apache 孵化器接受的 [OpenDAL](https://github.com/datafuselabs/opendal) 数据访问库，就是由 2021 年初创的企业 [DatafuseLabs](https://databend.rs/) 捐赠的。又例如，CockroachDB 的存储引擎 [Pebble](https://github.com/cockroachdb/pebble) 以 BSD-3-Clause 协议开源，连 PingCAP 的数据导入工具 Lightning 都在使用。

一般来说，小公司更容易在细分领域或者新兴领域，通过开放源码软件来赢得大量声誉和共同维护生态成员都有需要的基础软件。
