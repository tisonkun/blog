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
