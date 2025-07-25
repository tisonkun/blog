---
title: 应当尊重和保护开源项目的知识产权
date: 2025-07-25
tags:
    - 开源
    - 知识产权
categories:
    - 夜天之书
---

自去年八月以来，我一直在 Apache 软件基金会（ASF）担任品牌管理委员会成员。近期，上海开源信息技术协会组织的首次“上海开源创新菁英奖”，评奖结果包括了若干 ASF 旗下的开源项目。然而，结果公布文章在引用这些项目时，存在部分对 ASF 品牌的误用。经由一位 ASF 中国成员报告，ASF 品牌管理委员会处理，以及与上海开源信息技术协会沟通后，今天发布了[《关于 Apache 软件基金会有关项目的获奖信息更正》](https://mp.weixin.qq.com/s/qb9ueT2JekUyn0oFODtJfQ?scene=1)的公告，澄清了相关误用。

我由此想到，在过去很长一段时间内，由于 ASF 开源项目潜在的商业价值，许多公司基于 ASF 开源项目构建自己的商业产品或服务。在各个场合的宣传当中，这些公司不时有意或无意地违反 ASF 的品牌使用政策，主要表现是错误地将 ASF 品牌与其商业产品或服务关联起来。这种行为不仅误导了公众对 ASF 品牌的理解，也可能侵犯了 ASF 的知识产权。

激励创新，服务和推动高质量发展需要保护知识产权。本文结合我一年以来的经验，简单介绍开源项目的知识产权，ASF 的商标品牌政策，以及常见的侵权行为。

<!-- more -->

## 开源软件保留知识产权

很容易听到开源软件的用户认为开源项目就是公共领域的产品，拿来即用，没有任何约束。尤其是宽松型开源协议，经常被用户误认为是允许“做任何你想做的事情”。

事实并非如此。从知识产权的角度出发，可以将开源软件分成三种有代表性的类别。

第一种是公共领域（Public Domain）的开源软件。所谓公共领域作品，指的是所有不适用任何专有知识产权的创作作品。这些权利可能已过期、已被没收、被明确放弃，或可能不再适用。由于无人拥有专有权，任何人都可以合法地在未经许可的情况下使用或引用这些作品。

这类开源软件的代表，包括 [SQLite](https://github.com/sqlite/sqlite/blob/master/LICENSE.md) 和 [MD5](https://users.isc.org/~each/doxygen/bind9/md5_8c-source.html) 等。以下是一个公共领域开源软件的 COPYING 声明示例：

> This code implements the MD5 message-digest algorithm. The algorithm is due to Ron Rivest. This code was written by Colin Plumb in 1993, no copyright is claimed. This code is in the public domain; do with it what you wish.

尽管大多数开源软件在引用公共领域作品时，仍然会保留上述声明。但是从知识产权的角度讲，原作者已经放弃知识产权，因此实际上可以任意使用。这部分的确符合“做任何你想做的事情”的认知。

不过，最常见的宽松型开源协议不是这样写的。我们以最简略的 MIT License 为例，采用卫 Sir 的[中文翻译](https://mp.weixin.qq.com/s/GGf0pMaIZVb6ykBBWdjNIg)：

> 特此向任何得到本软件拷贝及相关文档 ( 以下统称“本软件” ) 的人授权：被授权人有权使用、复制、修改、合并、发布、发行、再许可、售卖本软件拷贝、并有权向被供应人授予同等的权利，但必须满足以下条件：
>
> 在本软件的所有副本或实质性使用中，都必须包含以上版权声明和本授权声明。
>
> 本软件是“按原样“提供的，不附带任何明示或暗示的保证，包括没有任何有关适销性、适用性、非侵权性保证以及其他保证。在任何情况下，作者或版权持有人，对任何权益追索、损害赔偿以及其他追责，都不负任何责任。无论这些追责产生自合同、侵权，还是直接或间接来自于本软件以及与本软件使用或经营有关的情形。

注意到，MIT License 写明“在本软件的所有副本或实质性使用中，都必须包含以上版权声明和本授权声明”。此即保留作品的知识产权。

Apache License 2.0 也有类似的条款，同样采用卫 Sir 的[中文翻译](https://mp.weixin.qq.com/s/y6rysKAifxefqfhSzcQcHg)：

> 在你分发的衍生作品的源代码中，你必须保留本作品源码中的所有版权、专利、商标和归属声明，但与衍生作品无关的除外；
>
> 如果本作品在分发时包含了一个 NOTICE 文本文件，则你分发的任何衍生作品都必须要有该 NOTICE 文件所包含的归属声明（与衍生作品无关的声明除外），该归功应位于以下至少一个位置中：衍生作品分发时所带的 NOTICE 文件；衍生作品所带的源码或文档；衍生作品生成的展示页面中（如果能正常显示这些第三方声明，不管在什么地方都行）。NOTICE 文件的内容仅仅是信息性的，不可以修改其中的许可证。你可以在衍生作品中附加自己的归功，在 NOTICE 文本里面直接添加或者以附录形式出现，前提是附加的归功不能造成对许可证的更改。

ASF 旗下的开源项目均以 Apache License 2.0 许可，因此同样保留知识产权，并且使用者有依条款保留和尊重作品版权、专利、商标和归属声明的义务。

最后，大名鼎鼎的 GPL 值得单独拿出来说道说道。从性质上说，它跟宽松型开源协议对知识产权的保留是一致的。不过，GPL 的作者 Richard Stallman 巧妙地运用了知识产权保护法，在授予用户自由地使用和修改 GPL 许可的软件的权利的同时，以 Copyright Owner 的身份要求，用户分发基于 GPL 作品制作的衍生作品时，必须同时交付衍生作品的源代码。能够对使用和修改 GPL 软件的用户提出这样的要求，其法理即来自于 GPL 软件的作者保留作品的知识产权。

## ASF 的商标品牌政策

今天，绝大部分新的 ASF 顶级项目都是经由孵化器孵化而来。在 ASF 孵化项目毕业之前，必须确保以下两点已经完成：

1. 项目软件的知识产权已经移交到基金会。这通常是由原产权所有者签署一份[软件授权协议（SGA）](https://www.apache.org/licenses/software-grant-template.pdf)完成的。
2. 基金会对项目名称、徽标和任何其他主要品牌元素拥有商标权，包括所有注册商标。如果原产权所有者已为项目注册商标，项目毕业前商标必须已经转让给基金会（特殊情况下，至少转让流程必须已经开始）。

因此，ASF 持有旗下所有顶级项目源代码的知识产权，也拥有其项目名称、徽标和任何其他主要品牌元素的商标权。这就是本文一开始的示例中，ASF 追究商标侵权的道理所在。

ASF 品牌管理委员会写作了一系列商标品牌管理的政策和答疑，这里不做展开，仅不完整地罗列如下：

* [Apache PMC Branding Responsibilities](https://www.apache.org/foundation/marks/responsibility.html)
* [Apache Software Foundation Trademark Policy](https://www.apache.org/foundation/marks/)
* [Apache Trademark FAQs](https://www.apache.org/foundation/marks/faq/)
* [Apache Trademark Reporting Best Practices](https://www.apache.org/foundation/marks/reporting.html)
* [Apache Project Website Branding Policy](https://www.apache.org/foundation/marks/pmcs)
* [New Project and Software Product Naming Process](https://www.apache.org/foundation/marks/naming.html)
* [Apache Trademark Resources And Site Map](https://www.apache.org/foundation/marks/resources)

唯一需要单独强调地是，ASF 项目的项目管理委员会（PMC）负责保护项目的品牌和商标。因此，在品牌管理委员会收到任何关于商标、品牌侵权的报告时，如果与具体的项目相关，我们总是跟对应的 PMC 取得联系，与他们合作并主要由 PMC 推动问题的解决。

最后，新版本的 [ASF 项目成熟度模型](https://community.apache.org/apache-way/apache-project-maturity-model.html)已经包含了几条最基本的商标、品牌指导原则。任何孵化项目毕业之前，都需要按照这几条指导原则审视自己的落实情况。

## 常见的侵权行为

最典型的问题，就是商业公司试图将自己打造成 ASF 项目唯一的提供商。这一问题最严重的表现形式是将 ASF 项目视作该商业公司的产品。例如，公开宣传某 Apache Foo 软件是其公司产品，或其商业产品的“开源版”。这是严重侵权行为，必须改正。

另一种常见的侵权行为，是试图暗示商业公司在 ASF 项目中拥有特殊地位或权利。[The Apache Way](https://www.apache.org/theapacheway/) 和 ASF 的章程明确定义，ASF 是一个同侪社群（Community of Peers），所有参与者均以个人身份参与项目，ASF 严格遵守供应商中立的原则。因此，将商业公司描述为“Apache Foo 背后的商业公司”，或“由 Apache Foo 的作者创造”，都是违反这些原则的。后者经常出现，所以品牌管理委员会专门写了一条 [FAQ](https://www.apache.org/foundation/faq#can-i-refer-to-an-individual-or-organization-as-the-founder-or-creator-of-an-asf-project) 澄清基金会对这种用法的态度。

还有一种不太常见，但是伤害极大的侵权行为，是将商业公司的产品名称用雷同或类似于 ASF 项目的名字命名。例如，众所周知的某公司将自己的产品命名为“FooDB”，其中“Apache Foo”是一个 ASF 顶级项目。这里的某公司不只一家，国内海外都有。同样，品牌管理委员会针对这种情况有一条专门的 [FAQ](https://www.apache.org/foundation/marks/faq/#products) 说明。

最后，回到前面提到的开源软件保留知识产权的点上，还有一种时常发生，而且往往被忽视的侵权行为，就是使用了 ASF 开源项目的产品，故意隐去 ASF 项目的归属声明。例如，前些年，针对 Apache SkyWalking 的侵权时有发生：

* [[Resolved][License Issue] Tencent Cloud TSW service violates the Apache 2.0 License when using SkyWalking.](https://skywalking.apache.org/blog/2021-01-23-tencent-cloud-violates-aplv2/)
* [[Resolved][License Issue] Volcengine Inc.(火山引擎) violates the Apache 2.0 License when using SkyWalking.](https://skywalking.apache.org/blog/2022-01-28-volcengine-violates-aplv2/)
* [[License Issue] Aliyun(阿里云)'s trace analysis service copied SkyWalking's trace profiling page.](https://skywalking.apache.org/blog/2023-01-03-aliyun-copy-page/)

## 结语

前两天，我在回顾自己在 ASF 七年的故事，准备后天演讲的时候，忽然意识到从最晚 2018 年起，直到现在，Apache Flink 社群一直都活跃地在邮件列表上讨论，并且每个月都会积极地讨论潜在的新 Committer 人选。我又想到，不少公司和单位组织能够积极处理自己有意无意损害 ASF 知识产权造成的问题，甚至形成一份使用 ASF 商标品牌的内部指南，以避免新员工由于背景缺失无意间造成侵权。

这不由得让我觉得，企业参与开源项目的时候，本来就存在一种良性的互动方式，能够 Behavior Properly 构建起一个受人爱戴、生机勃勃的社群。如果说公司当中的“开源专家”有什么唯一的优势，那就是把这样一条道路清晰的描绘出来，并且协调各方关系，真正将其落到实处。
