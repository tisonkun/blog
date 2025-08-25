---
title: EMQX 开源版停止维护：开源协议的承诺边界是啥？
date: 2025-08-25
tags:
    - EMQX
    - 开源
    - 开源软件基金会
categories:
    - 夜天之书
---

今天起来就看到 EMQX 将于明年初[正式结束开源版产品生命周期](https://mp.weixin.qq.com/s/a_NHnvvlpfYaWfNk0kROuw)。通常我是不评论时事的，不过最近关于产品是否应该开源的议题逐渐触达了国内先做开源产品再考虑商业化的公司，或许是一个整理过往的观点，集中提供相关思考方式的契机。

<!-- more -->

## EMQX 做了什么？

首先看一下事实是什么。上面关于开源版后续停止维护的公告里，没有提到企业版是如何发布的。在早些时候的另一篇官方博文当中，写到 [EMQX 采用商业源码许可证，加速 MQTT + AI 创新](https://mp.weixin.qq.com/s/rp0fz-LwaSSM4jn-6ElKLg)。因此，在 EMQX 做进一步变更之前，可以假定其“企业版”会按照 Business Source License (BuSL) 来发布。

EMQX 采用的 [BuSL 文本](https://github.com/emqx/emqx/blob/master/LICENSE)如下：

![相对严格的 BuSL 限制条件](emqx-busl.png)

可以看到，不同于 [CockroachDB](https://www.cockroachlabs.com/blog/oss-relicensing-cockroachdb/) 和 [Outline](https://github.com/outline/outline/blob/f4e49925/LICENSE) 相对宽松的，仅禁止同类产品竞争的限制条件，EMQX 选择的是和 BuSL 创作者 MariaDB 许可 [MaxScale](https://mariadb.com/projects-using-bsl-11) 接近的约束：

1. 生产环境仅允许部署单节点；
2. 在此基础上，不允许提供同类产品或服务。

当然，这里面还写了对教育用途和非营利用途的豁免条款，再考虑到 EMQX 本身是一个分布式系统，所以加总起来可以大致理解为（1）禁止商业竞争（2）禁止大规模商用。

这也符合我在[《我应该将产品开源吗》](https://mp.weixin.qq.com/s/e_9P4npQpjM2vItQAPOSWw)以及[《企业实践开源的动机》](https://mp.weixin.qq.com/s/NYC_beiBvsxCjkocA1FUZA)当中的判断：

> 如果一个企业的商业模型就是销售“开源”软件本身的功能，那么他们的核心功能转向专有软件只不过是时间问题，或者说只要面临商业竞争，就是经不起挑战的。

在[《诱导转向的伪开源战略》](https://mp.weixin.qq.com/s/HsgoUoBzsyXSmDfV00DlgQ)当中，我路演了一个可能的场景：

> 对于这些企业来说，初心就是“写个软件好卖钱”，而且确实也是创始人辛辛苦苦拿到融资，组织起来一帮兄弟姐妹领工资夜以继日地开发软件。到头来用户只是使用而不付费，甚至因为太好用找不到付费的理由。这个时候，又冒出来几家供应商把代码拿过去改改做出自己的解决方案，甚至由于上游使用宽容开源许可，这些供应商源代码一藏，随口就说碾压上游版本。
>
> 这实在是大大超出了企业创始人的预料，于是修改软件许可，让这些用户和供应商搞清楚状况就会被加紧提上日程。

当然，这未必是 EMQX 实际遇到的情况，也有可能是公司不想再投入额外的人力和精力单独维护一个开源版本，或者其他公司层面的战略转换。如果回顾一下 EMQX 的发展轨迹，可以看到这是一个已经存在[十年以上](https://github.com/emqx/emqx/commit/11db16725e76c3072f7b50cd62abc4a0aa6a43ba)的开源软件：

![从 2012 年开始的 EMQX 项目](emqx-history.png)

![第一个 Commit 的时候叫 EMQTT](emqtt.png)

从项目发展轨迹来看，目前 EMQX 的商业公司映云科技成立于 2017 年，即项目第一个 Commit 之后的五年。从 Commit 曲线来看，EMQX 也是自那以后开始比较频繁的提交，在 2019 年有一个爆发期，再到 2021 年后又有一次显著的增长。

应该说，一个开源软件能持续提供十年就已经非常不容易了。随着公司接管 EMQX 的开发，公司策略影响 EMQX 项目的开源策略并不奇怪。

## 可以看见源码就是开源吗？

关注开源项目修改协议的朋友可能会发现，在 EMQX 修改软件协议的博文里，他们采用的措辞是“加速 MQTT + AI 创新”。当然这也是一个相对市场营销的说法，但是他们至少没有说这是“加速开源创新”。我依稀记得之前 Lightbend 还在狡辩自己是“可持续开源”，ElasticSearch 改完协议以后更是狡猾地使用了 “Free and Open” 的表达，不是自由与开放，而是免费和代码公开。

开放源代码 OpenSource 目前公认的是由 OSI 组织发布的[开源定义](https://opensource.org/osd)所界定，其第六条写到：

> 6. No Discrimination Against Fields of Endeavor
>
> The license must not restrict anyone from making use of the program in a specific field of endeavor. For example, it may not restrict the program from being used in a business, or from being used for genetic research.

所以，限制商用的 BuSL 和 ELv2 虽然允许用户访问源代码，但都不是开源协议。

## 开源协议承诺了什么？

在[《开源软件有断供的风险吗》](https://mp.weixin.qq.com/s/vSxWUcFgbS3D_0tZnBIfdg)以及[《如何安心使用开源软件》](https://mp.weixin.qq.com/s/-2CeJq1XZdwifZkJY2oXNA)两篇文章中，我已经说明了：

> 开源协议不可撤销地授予接收者使用、复制、修改和分发软件的权利。

因此，使用 OSI 认可的开源协议，比如典型的 MIT 和 Apache License 2.0 等，许可的开源软件发布版本，将永远可以就对应的开源协议来使用。开源协议没有承诺维保，自然也就不存在后续迭代的版本会一直以相同的协议发布。即使是 GPL 的情形，约束的也是拿上游自由软件修改的作者，在分发时需要附带源代码。类似于映云科技这样拥有 EMQX 完整知识产权的情况，他们愿意用什么协议发布自己的知识产权作品，都是他们的权利。这也是 MySQL 跟其他之前使用 GPL + Dual License 模式，告诉客户只要买了商业协议就不用担心 GPL 的影响的法理所在。

所以，国内此前对开源追高的美好想象，确实导致了生产者和消费者之间就承诺边界理解的一些偏差。关于这部分问题的详细讨论，可以阅读我上面引用的两篇文章，也可以参考 PG 专家冯若航写作的[《从PG“断供”看软件供应链中的信任问题》](https://mp.weixin.qq.com/s/SBVcO8fi5mK1Qnb3AWbqxQ)。

## 基金会项目更可靠吗？

从形式上说，是的。例如，Apache 软件基金会（ASF）作为一家以生产造福大众（For Public Good）的开源软件为目标的慈善机构，其官网有一个[完整页面](https://www.apache.org/free/)说明为什么 ASF 软件永远是开源（自由、免费）的。

![ASF Always Free](asf-always-free.png)

某种意义上说，Airbyte 在改协议之前也说会永远使用 MIT License（虽然那篇文章好像已经被下架，现在找不到了），但是改完了又有[新的说法](https://airbyte.com/blog/move-to-elv2)。从技术上看，公司的章程和“承诺”并非不可改变。

但是，ASF 存在的意义和立身之本就是生产开源软件。作为一家非营利机构，它没有改变软件协议的理由，如果这么做了，那就意味着基金会本身也走到头了。

不过，即使是考虑 ASF 本身在可预见的未来里是可信的，即 ASF 顶级项目永远是开源提供的，但从实际使用开源软件的角度来看，这并不 100% 意味着基金会的项目就更加“可靠”。

例如，ASF 的项目由于缺乏志愿者维护，也有可能偃旗息鼓，移入阁楼。虽然过往的版本都是 Apache License 2.0 发布的，未来也不会突然出现商业版本。但是这个项目就是不维护了，对于选择该项目的用户、企业来说，都是一个要处理的问题。比如，当初选择了 Apache Mesos 作为自己容器管理方案的企业，如今大概率就要花费相当的投入迁移到 Kubernetes 上了。

## 如何选择和审查开源依赖？

在[《开源软件有断供的风险吗》](https://mp.weixin.qq.com/s/vSxWUcFgbS3D_0tZnBIfdg)一文里，我将开源依赖分为四类：

1. 稳定的依赖。
2. 可靠的依赖。
3. 可替换的依赖。
4. 风险。

那么，在 EMQX 的用户的眼里看来，EMQX 属于什么类型的依赖呢？其实，这跟用户使用的场景有关。

例如，类似于如今相当一部分选择 Java 开发业务的公司，还锁定在 JDK 1.6 或 1.7 上的情况，如果一位 EMQX 的用户并不介意永远锁定在 5.8 版本之前，对于他来说，EMQX 就是一个稳定的依赖：啥也不用改。

对于愿意付钱购买企业版的用户来说，只要他相信映云科技在他使用 EMQX 的期间不会有其他重大变故，而且 EMQX 企业版的迭代更新符合自己的需求，那么 EMQX 就是一个可靠的依赖。

对于仅使用了 EMQX 基础功能的用户，或许能够简单地将自身用例替换成其他的开源产品。或者相对罕见，但并非不可能的，EMQX 的某位用户能够自行维护 EMQX 的版本，那么 EMQX 就是一个可替换的依赖。这一点可能没有想象的那么困难，尤其是对于核心能力已经基本开发完毕，主要业务上需要的维护工作是修复缺陷和安全漏洞的情况。

对于其他用户来说，这自然就是一个风险。

关于如何选择和审查开源依赖，在上面引用的文章里已经有相对系统的介绍，我不打算在这里做完整的重复，只是结合 EMQX 的案例，再提出一个观点：

> 由一家公司主导的开源软件，其可持续性风险与由一人主导的开源软件相近。

众所周知，一个随机的开发者发布的开源软件，作者很快失去兴趣，或者不能响应用户实际需求迭代的情况，是完全可以想象的。同时，对于热忱的开发者来说，一辈子维护一个软件，例如 Vim / Netty / Jackson 这样的案例，也是存在的。

一家公司的力量看起来比个人要强大的多，但是其决策逻辑仍然是单一决策：维护开源版，或者不维护开源版。人会跑路，公司也会改变政策；人的生命终有尽头，公司的生命绝大多数比人还要短。所以，一家公司主导的开源软件，其韧性并不见得比一个热忱开源开发者来得高。

那么，企业开源或说商业开源的软件就不可信了吗？也不见得。

类似上面分析不同 EMQX 用户可能面临的情况，只要你不落在风险的区域内，相信也不会有什么坏处。另外有些时候，信任是一个前提。比如依赖安卓系统的下游手机厂商，安卓如果没了，这部分生意也就做不下去了，不存在信不信的说法。

当然，还有一个具有实操意义的判断方式。各位可以关注 ElasticSearch 修改协议以后 OpenSearch 能够诞生，最终促使 ElasticSearch 前日又再改回 Apache License 的案例。还有 Redis 修改协议以后，Valkey 项目的发展；Hashicorp 修改协议以后，OpenTofu 项目的发展；Akka 修改协议以后，Apache Pekko 项目的发展。

也就是说，如果你选择的开源依赖，有一个多样的社群，尤其是，其中的开发者并不全都受限于单一公司的雇佣关系，而且他们有能力在软件修改协议后另起炉灶维护一个开源版本，那么这也是一种逃生的出口。

不过，这个前提要达成其实相当困难。例如，前几日 KubeSphere 删除开源制品及修改协议的风波之后，虽然有部分开发者紧急重新整理并构建了最后一个开源版本的制品以供使用，但是这个 [openksc](https://github.com/openksc) 项目看起来也不会再有后续，很难以开源的形式重新激活一个 KubeSphere 的 Fork 了。

## 过往文章

* [我应该将产品开源吗？](https://mp.weixin.qq.com/s/e_9P4npQpjM2vItQAPOSWw)
* [诱导转向的伪开源战略](https://mp.weixin.qq.com/s/HsgoUoBzsyXSmDfV00DlgQ)
* [Elastic License 2.0 与开源协议的发展](https://mp.weixin.qq.com/s/6JYQcjbsfwszrXqu27wz3A)
* [商业源码协议为何得到 HashiCorp 等企业的垂青？](https://mp.weixin.qq.com/s/hYfw7HoBr-cm8cxyQIXLgw)
* [开源不是商业模式](https://mp.weixin.qq.com/s/VIKlKIthvYaHaBl6ALqtSA)
* [企业开源的软件协议模型实践](https://mp.weixin.qq.com/s/iSR1sryhmp_wQxf5cvrxOA)
