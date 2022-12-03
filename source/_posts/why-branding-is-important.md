---
title: 为什么开源协议不授予商标权利？
date: 2022-12-03
tags:
    - 开源
    - 商标
categories:
    - 夜天之书
---

众所周知，开源软件许可证粗略分为 Copyleft 类和 Permissive 类。

这两者常被提及的不同之处，是前者要求对软件的修改和派生仍需以相同条款发布，而后者允许修改软件和派生软件不再发布源代码。

不过，如果我们从两者相同的要求出发，重新看待开源共同体的成员对作为契约的开源许可证的认识，就会有崭新的发现：无论是 Copyleft 类的许可证，还是 Permissive 类的许可证，都没有授予接收方使用软件商标的权利。

特别地，[BSD 3-Clause](https://opensource.org/licenses/BSD-3-Clause) 和 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 明确限制了接收方使用软件商标（名称）为自己站台的权利，[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html) 则在附加条款中允许许可方补充限制接收方使用商标的权利。

简言之，商标是被保留的，与发布软件和上游作者绑定的，而不是公共的，任何人可以随意使用的。

那么，为什么开源许可证在允许接受方任意使用、修改、复制和重分发软件的情况下，对商标却采取截然不同的保留态度呢？

<!-- more -->

主要原因有二：其一是礼物文化所追求的社会资本，其二是对抗供应商的恶意混淆。

第一个原因，从开源软件维护者的个人角度或开源软件基金会等组织角度出发，保留商标权利确保发布的开源软件其价值产生的社会资本回流到作者或说上游社群当中。

每一个使用 Linux 工作的用户，从 Python 编程当中收获快乐的开发者，借助 Apache Flink 搭建实时处理流水线完成公司任务的员工，他们对软件的使用体会和评价，通过社交传播产生无数的社会资本，最终回流给到 Linus Torvalds 及 Linux 社群，Guido van Rossum 及 Python 社群，Apache Flink 社群及 Apache 软件基金会（ASF）。

软件作者天然地希望自己与自己创作或参与贡献的作品绑定起来，通过生产高质量的开源软件收获声誉。从商标本身所保护的内容来看，如果有其他开发者或组织团体使用相同的名称和标志开发另一款软件，那么这种混淆可能会干扰社会资本回流，导致不公平的后果。

第二个原因，是这种声誉混淆的另一种表现形式。破坏者不是混淆商标对应的内容，而是混淆商标的所有权。这也是 BSD 3-Clause 原文表述当中直接反对的做法：

> Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

Apache License 2.0 虽然只是笼统地保留了所有商标权利，但是 ASF 在长久的发展过程中多次遇到商标与品牌相关的争端。对应的，ASF 撰写了一系列与品牌和商标相关的指导文档：

* [APACHE PMC BRANDING RESPONSIBILITIES](https://www.apache.org/foundation/marks/responsibility.html)
* [APACHE PROJECT WEBSITE BRANDING POLICY](https://www.apache.org/foundation/marks/pmcs)
* [APACHE SOFTWARE FOUNDATION TRADEMARK POLICY](https://www.apache.org/foundation/marks/)

一种典型的情况，是企业将专有软件开源并捐赠给 ASF 以后，仍然将软件宣传为自己的产品，或者宣称自己是该软件的作者，具有特殊的地位。本土化的称呼，叫做“某项目‘背后’的公司”。

这些做法严重影响了社会资本回流到 ASF 当中，试想当一名用户使用 Apache Spark 的时候，他首先想到的是 Databricks 而不是真正的上游 Apache 社群。ASF 从成立之初就是为了保护开发者免受软件开发过程中可能的法律风险影响：

> [WHAT IS THE APACHE SOFTWARE FOUNDATION?](https://www.apache.org/foundation/how-it-works.html#what)
>
> ...
>
> * provide a means for individual volunteers to be sheltered from legal suits directed at the Foundation's projects
> * protect the 'Apache' brand, as applied to its software products, from being abused by other organizations

作为 Apache Kafka 的主要提供商之一，Confluent 提供了一份完整的[商标品牌指南](https://www.confluent.io/apache-guidelines/)讨论如何援引属于 ASF 和属于 Confluent 各自的商标及名称。可以看到，在这样的努力下，Confluent 实际构建出了独立于 Apache Kafka 的品牌：无论是 ksqlDB 还是 Stream Governance 等产品，都与 Confluent 的名称绑定，而不受 ASF 对 Apache Kafka 的品牌所有权影响。

当然，由于业务重度依赖 Kafka 或者说就是提供 Kafka 的集成服务，完全避开对 Kafka 的引用是不可能的。但是援引 Kafka 的时候都保证没有故意混淆成 Confluent 的产品，并在不影响阅读体验的前提下说明 Kafka 是 ASF 的商标，能够建立起 Confluent 是一家基于 Apache Kafka 开展业务的公司，而不是制造 Apache Kafka 的公司的正确印象。这实际上也为公司带来了商业上的灵活性。

可能对于身处“某项目‘背后’的公司”的人来说，不好理解基于某软件开展业务和制造某软件之间的区别。

试想 Upstash 作为 Kafka 的另一个供应商，自然是基于 Kafka 开展业务的公司。然而它只是缝合了 Redis 和 Apache Kafka 的能力，以自己独特的业务场景化思路为全球业务的服务对象企业提供全球立即可用的数据存储、订阅和同步服务。它的员工很少或者根本不参与 Kafka 上游的开发，自然也就与制造 Kafka 无缘。

关于商业上的灵活性部分，早期基于 Apache Spark 开展业务的 Databricks 从一开始就将自己的产品命名为 Databricks Runtime 而不包含任何 Spark 字样。近十年来，Databricks 从朴素的“更快的”批处理引擎出发，走进 AI 流水线，涵盖数据实时分析场景，大肆鼓吹 LakeHouse 概念，为多个行业定制了场景化解决方案，直到今天成为估值最高的技术公司之一。如果一开始的商业策略是和 Spark 强绑定，与上游社群混淆相互干扰，那么在商业上试错和转移阵地，在此过程中对客户心智重定位，就不可能如此灵活。

关于开源软件的商标问题，除了开源开发者和基金会等组织持有，并根据协议保护权利的情形以外，还有一种重要的场景是企业软件的开源。这种情形下，企业拥有软件的著作权和商标使用权，并将因此带来新的社会资本流动问题。

一个典型的问题是企业改变先前开源的软件的协议，从开源软件许可证改为专有软件许可证，这种例子数不胜数：

* [Why are we changing the license for MongoDB?](https://www.mongodb.com/licensing/server-side-public-license/faq)
* [Upcoming licensing changes to Elasticsearch and Kibana](https://www.elastic.co/blog/licensing-change)
* [Why We're Relicensing CockroachDB](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/)
* [A New License to Future Proof the Commoditization of Data Integration](https://airbyte.com/blog/a-new-license-to-future-proof-the-commoditization-of-data-integration)
* [Why We Are Changing the License for Akka](https://www.lightbend.com/blog/why-we-are-changing-the-license-for-akka)

这种做法导致的问题，是企业窃取了先前开源社群的共同成果，转而使用相同的商标发布软件的后续版本。关于这个问题，我在《{% post_link bait-and-switch-fauxpen-source-strategy %}》中有详细讨论。

Lightbend 发布改变 Akka 软件协议的时候，就曾经有人评论道：

> 我同意你的看法，因为像“社群的习惯”这种隐形的东西没有办法被复刻（fork），声誉也没有办法被复刻。我一直认为应该只能从更封闭的协议改到更开放的协议，或者应该是改协议的人去复刻而不是其他开发者去复刻。Akka 这个情况就应该他们公司的人去复刻和改名，社区的财产管理权包括账号邮箱地址都应该转让。

我也听到一种声音说：“企业本来就有自己研发的软件的著作权和商标，通过签署 CLA 从参与贡献者那里显式地征得变更协议发布其补丁的权利，这一切都是合法的，因此不应该被谴责。”

诚然，这样的操作并不会产生法律纠纷。但是开源协同的参与者是秉承着什么样的动机来发挥自己的聪明才智的，我想实际治理这个项目和实地参与开源协同的人，心里自有评判。

如果现有的法律和规则无法保护开源参与赠出的礼物赢得对应的社会资本回报，那么我想日后开发者只会越来越倾向于参与开源软件基金会所有的项目。而无论是个人还是企业，想要建立起与开发者之间的信任，则会变得更加困难。

当然，这并非不可能。而且所谓专有协议，相当部分是源代码可得，仅限制商业竞争的协议。对于个人（学习）用途或者企业内部使用的用户来说，至少使用层面的权利没有被侵害，他们和软件制造商之间是存在共同价值的。

最后，对于社会资本的追求，对于自由和公平的追求，我想分享几个不同程度的案例。

1. 最实用主义的用户，自然就只要“我”能用就行。这种用户能接受 [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license) 许可的软件。
2. 进一步的，开发者在参与贡献的时候，希望有对应的社会资本回流，并且能够以开源协议使用自己参与贡献的软件。TiDB 的开发者可以对应这个画像。
3. 再进一步的，开发者只参与贡献开源软件基金会的项目。
4. 再进一步的，开发者拒绝参与[商业联盟](https://www.irs.gov/charities-non-profits/other-non-profits/business-leagues)性质的开源软件基金会的项目。这种基金会典型的是 Linux 软件基金会。ASF 是[非营利组织](https://www.irs.gov/charities-non-profits/charitable-organizations/exemption-requirements-501c3-organizations)。
5. 再进一步的，开发者拒绝依赖任何专有软件。典型的是自由软件运动领袖 Richard M. Stallman 参与直播演讲时，总是要求直播采用的软件必须是自由软件。另一个案例是 Unicorn 的作者 Eric Wong 拒绝将开发迁移到 GitHub 上：

> [Re: Please move to github](https://yhbt.net/unicorn-public/20140801213202.GA2729@dcvr.yhbt.net/)
>
> No. Never. Github is proprietary communications tool which requires users to accept a terms of service and login.  That gives power and influence to a single entity (and a for-profit organization at that).
>
> Contributing to unicorn is *socially* as easy as contributing to git or the Linux kernel.  There is no need to signup for anything, no need to ever touch a bloated web browser.
>
> The reason I contribute to Free Software is because I am against any sort of lock-in or proprietary features.  It absolutely sickens me to encounter users who seem to be incapable of using git without a proprietary communications tool.
