---
title: 锐评 Confluent 的 Apache 品牌指导手册
date: 2025-08-24
tags:
    - 开源
    - Apache
    - Confluent
    - 开源品牌
categories:
    - 夜天之书
---

Confluent 是一家著名的 Apache Kafka 提供商，其创始人在 LinkedIn 工作期间创造了 Kafka 项目，并将其贡献给了 Apache 基金会。这一模式后来也在 Apache 软件基金会（ASF）内被多次复制，即依托于 Apache 顶级项目打造商业产品，对应的商业公司核心成员是该开源项目的维护者或原始作者。

在[《应当尊重和保护开源项目的知识产权》](https://mp.weixin.qq.com/s/Mhg1kCUhm1Ee5KGLHFm6sg)一文中，我介绍了 ASF 的商标品牌政策。在 Confluent 创办到发展至今的十余年里，ASF 品牌管理部门就 Confluent 使用 Apache Kafka 等项目的商标品牌的问题和 Confluent 打过多次交道。后来，Confluent 总结出了一份 Apache 品牌指导手册，用于员工培训以避免因为缺乏相关知识导致的侵权行为。

原先，这个指导手册挂在 https://www.confluent.io/apache-guidelines/ 地址上。不过，就在上个月我想引用这个页面，向国内某些厂商说明，可以如何制定员工手册，指导处理 Apache 品牌的时候，我意外地发现这个页面已经无法访问了。

![经典的 ASAP 跳票故事，现在还没恢复](twitter-not-found.png)

不过，感谢互联网记忆令使 Wayback Machine 的记录，我们还能看到两年前的[快照版本](https://web.archive.org/web/20230202121630/https://www.confluent.io/apache-guidelines/#what_is_apache_software_foundation)。为了介绍这样一个比较彻底的，公司层面可以培训员工遵守 ASF 品牌政策的方式，我写作本文全文引用 Confluent 的 Apache 品牌指导手册（自翻译版）并做锐评。

<!-- more -->

## 基本介绍

指导手册的前三段是关于 Apache 软件基金会，Apache Kafka 项目，以及 ASF 重视商标品牌的原因。这些说的都比较笼统，没有太多需要评价。

> 什么是 Apache 软件基金会（ASF）？
>
> ASF 成立于 1999 年，是美国 501(c)(3) 慈善组织，资金来自个人捐款和企业赞助。ASF 的董事会全部由志愿者组成，负责监督旗下 350 多个开源项目的运行。
>
> ASF 建立了完善的知识产权和财务捐助框架，这减少了项目提交者的潜在法律风险。通过 ASF 的精英治理模式，超过 730 名个人会员和 7000 名提交者，合作开发了一系列企业级自由软件，惠及全球数百万用户：数千个软件解决方案采用 Apache 许可证分发；社群成员积极地在邮件列表上沟通，协商指导项目发展计划；每年，基金会还会举办官方的 ApacheCon 大会。

这一段需要强调的是 ASF 是一个总部在美国特拉华州的 [501(c)(3) 慈善组织](https://www.irs.gov/charities-non-profits/charitable-organizations/exemption-requirements-501c3-organizations)。尤其是，虽然都叫“基金会”，但是 Linux 基金会实质上是 [501(c)(6) 行业联盟](https://www.irs.gov/charities-non-profits/other-non-profits/business-leagues)。

所以，我常说 ASF 的理念是生产造福大众（For Public Good）的开源软件，而 LF 关注的是会员企业的利益（For Vendor's Good）。

另外，今年提名选举新的 ASF 基金会成员之后，目前总共有 824 名个人会员。所有的 Committers 人数突破了 8000 人。2023 年开始，ApacheCon 更名为 [Community Over Code](https://communityovercode.org/) 每年举办。目前，每年的 [Community Over Code Asia 大会](https://asia.communityovercode.org/)基本于七月份在中国举办。

Confluent 手册原文把 [The Apache Way](https://www.apache.org/theapacheway/) 简单解释成精英治理模式，这个问题不大，不过不太准确。

> ASF 与 Apache Kafka®
>
> 1. Apache Kafka 项目管理委员会 (PMC) 负责 Kafka 的技术决策。
> 2. ASF 由其成员和董事会管理，并负责制定组织规程。
> 3. Apache Kafka PMC 每季度向 Apache 董事会汇报。

事实正确。重点在于 Apache Kafka 是 ASF 拥有知识产权的软件，Apache Kafka PMC 负责实际治理 Kafka 社群，而非某家公司。

> （品牌政策的）重要性
>
> ASF 拥有强大的品牌影响力。许多企业不一定敢直接使用只是托管在 GitHub 上的项目，但却会因为信任 ASF 的品牌而放心采用 ASF 软件。这种信任帮助 ASF 的开源项目得到更广泛的采用。Confluent 致力于与 Apache 软件基金会以及 Apache Kafka 社群保持良好的关系。ASF 致力于让所有 ASF 软件的用户都知道自己正在使用 ASF 软件，并制定了创建和维护成功社群的指南。

> 成功的社区是开放包容的：
>
> * 开放包容的社区独立于商业影响
> * 提交者和 PMC 成员的多样性是保持项目长期独立治理的最佳方式
> * 积极发布容易上手的 Issue 以吸引新贡献者；快速而谨慎地评审补丁
> * 鼓励积极的参与贡献；指导新的贡献者成为提交者和 PMC 成员
> * 宣传项目软件如何帮助最终用户的真实案例

我在成为 ASF 孵化器导师以后，指导帮助了不少于十个开源项目进入孵化器孵化，其中很大一部分个人开发者的开源项目。不同于 Linux 基金会 pay-to-play 即只有成员公司能捐赠项目的模式，ASF 的视角下所有项目都是由个人（Individuals）合作开发的。这些开源项目之所以愿意到 ASF 孵化，很多时候就是认可 ASF 造福大众（For Public Good）的理念。

用户之所以敢使用 ASF 的软件，则是因为基金会在知识产权保护和安全软件监督上的重度投入。符合 ASF 标准的软件发布版本，用户可以放心地使用。换句话说，ASF 发布的软件，就是我在[《开源软件有断供的风险吗》](https://mp.weixin.qq.com/s/vSxWUcFgbS3D_0tZnBIfdg)一文里介绍的**可靠的依赖**。

因此，让用户准确地识别 ASF 软件至关重要，而确保有且只有 ASF 发布的软件才会使用 ASF 的商标品牌，是其中不可或缺的一步。这也是 ASF 一系列品牌商标政策的出发点：避免混淆，保护 Apache 的品牌价值。

## 遵守 ASF 品牌政策的最佳实践

> * 在结合使用 Apache Kafka、Kafka 与 Confluent 品牌时，请参考以下命名约定和商标使用指南。
> * 我们绝不应以 Confluent 拥有或控制项目的方式提及 Kafka 项目。
> * 请在必要时遵循以下商标归属说明。
> * 在引用 Kafka 项目时，请避免使用诸如“引领”、“驱动”、“路线图预览”等描述。
> * 对于所有线上或打印的市场材料，请仅使用以下经批准的公司样板文件。

这里提到的“以下”是后续会分段介绍的内容。

可以看到，重点在于不要暗示 Confluent 拥有或控制 Apache Kafka 项目，尤其点出了一些典型的侵权表达。如前所述，Apache Kafka PMC 负责实际治理 Kafka 社群，而非某家公司。

这里介绍一个实例。前段时间，有一个国内的供应商在介绍自己和某个 Apache 项目（Apache Foo）的关系的时候，提到“本公司是 Apache Foo 项目最大的贡献者”。这个表达被 ASF 品牌管理部门认定是不恰当的表达，原因就是 ASF 的视角下，所有项目都由个人（Individuals）合作开发，不存在公司作为一个实体参与的情形。当然，事实说明“本公司员工包括 N 名 Apache Foo 项目的提交者”是可以的。

有些供应商不服气，表示说如果没有我们投人参与，你这个项目早就活不下去啦。对此，我可以做三点回应：

1. ASF 拥有项目的知识产权和治理权，这是在捐赠的时候就通过 SGA 授予的权利，当捐赠人做这个决策的时候，应当知道结果。
2. 或许某个开源项目在某段时间内，确实依赖于某个公司的贡献，但是社群是否开放包容，决定了其他参与者对参与该项目的信心。例如，Aiven 和 AutoMQ 都投入了相当多员工，以个人的身份参与了 Apache Kafka 项目，如果 Kafka 项目是 Confluent 的软件产品，其他供应商还会考虑参与贡献吗？对于这一点，还有一个非常值得参考的例子，是 Istio 项目的产权在 Google 手上的时候，跟后续捐赠到 CNCF 以后，社群玩家不同的认知和参与程度。
3. 其实追根溯源，Apache Kafka 根本是原作者还在 LinkedIn 的时候，拿着 LinkedIn 的工资开发，然后捐赠到 ASF 的项目。如果 Kafka 不是 ASF 的项目而是 LinkedIn 的项目，还有 Confluent 创业的空间吗？

> * 在提及 Confluent 在 Apache Kafka 中的角色时，如果提到创造、启动了 Apache Kafka 项目，请务必包括“原（Original）”作为前缀。例如，“来自 Apache Kafka® 的原作者”或“来自最初创建 Apache Kafka 的团队”都可以接受，但 Original 前缀至关重要。

其实这个政策后来有所变化，具体可以参考 [ASF FAQ](https://www.apache.org/foundation/faq.html#can-i-refer-to-an-individual-or-organization-as-the-founder-or-creator-of-an-asf-project) 的内容。具体来说，"original creator of Apache Project Name" 这样的写法算是灰色地带，但是 ASF 的市场营销与宣传部门现在不在批准已经成为 Apache 顶级项目两年以上的项目的相关市场材料里包含这种写法。

其背后的原因还是希望尽可能的保持供应商中立。因为无论如何这种提法总是隐含着该公司在项目社群中有特殊地位的暗示。

> * 徽标：官方徽标必须包含“Apache”和“®”。
> * 在描述 Kafka（在线、印刷品、图形）时，如果提及 Confluent（包括对外营销/SDR 电子邮件、培训材料、活动、T 恤衫、宣传资料、博客、产品 UI 和技术文档等），必须清晰地表明 Apache Kafka 是由独立于供应商的 Apache 软件基金会开发的。
> * 尽可能避免混合使用 Confluent 和 Kafka 的资料，例如在文档中。
> * 避免使用诸如“Confluent 拥有最多的提交者或 PMC 成员”之类的语言。
> * 请注意，这些准则适用于个人博客（请记住，您是 Confluent 的员工，因此您必须始终遵守）。

关于这些，应该指出 Confluent 后来吸取了经验，在命名和宣传时都讲的是 Confluent Schema Registry 而不带上 Apache 或 Kafka 的字样。类似的，Databricks 早就很少提 Spark 的名称，真的是作为一个底层的框架（Powered By）提及，其产品大多有独立的命名。

> 品牌：以下是一些可以在产品命名时使用的示例：
> 
> * Ono-Sendai Console, Powered By Apache Steve
> * Yoyodyne Accelerator For Apache CloudStack
> * 反面案例：VodaCoder Hadoop Accelerator 或 Apache Hadoop Nokion App
> * 总的来说，不要在 Confluent 的品牌中使用 Apache 项目的名称或 Logo 等

指导手册提供了一个到 [Apache Trademarks FAQ](https://www.apache.org/foundation/marks/faq/#products) 的链接提供更多补充信息。

> Apache Kafka 的未来版本
> 
> 在谈论 Apache Kafka 未来版本中可能包含的内容时，请务必谨慎。Kafka 社群主导 Kafka 新版本的发布，而 Confluent 对 Kafka 的待办事项列表 (backlog) 没有任何官方控制权。在 Apache 发布新版本的 Kafka 之前，请勿承诺特定版本中的特定功能、发布时间或抢先体验。您可以提及 Confluent 或我们的合作伙伴正在开发并为正式版本做出贡献的特定功能，但请勿承诺实际的发布日期或版本。如果您不确定，请咨询 Ismael Juma

具体的操作指南，应该是针对被举报过的 case 打的补丁。我看了一下，这位 Ismael Juma 还在 Confluent 工作，大概在 Confluent 工作了十年，应该是志愿提供指导帮助的资深工程师。

![](ijuma-profile.png)

> Confluent 平台或 Confluent Cloud 的未来版本
> 
> 请勿提及即将在 CP 或 CC 中发布的功能，除非它们已正式发布。如有任何疑问，请联系 PMM 团队。在同时讨论 Confluent 平台和 Apache Kafka 的未来时，可以指出 Confluent 控制着 Confluent 平台的待办事项和发布周期，但并不控制 Kafka 的发布。Apache Kafka PMC 负责投票并决定未来的版本。

公司的产品就是自有产权了。确实有时候我也见过处理 ASF 政策太久了，对其他不受 ASF 政策约束的项目也下意识审查的情况。比如，虽然 ASF 要求项目不能包括 GPL 协议的必要依赖，这主要是保证下游用户能够闭着眼睛以 Apache License 2.0 的条款使用 ASF 软件，但是这并不意味着其他开源项目不能用 Apache 协议许可自己的项目，同时它依赖一个 GPL 协议的软件。比如，FFmpeg 的生态项目就可以用 Apache 协议发布，但是它只有跟 FFmpeg 整合的时候才能用起来。这样的项目是不符合 ASF 的发布政策的，但是作为一个一般的开源软件，没什么问题。

> 关于 Apache 项目的公开演讲
>
> * Apache Kafka 和所有其他 Apache 项目均为开源项目，并遵循 ASF 许可运营。这意味着没有人拥有该项目，也不能声称拥有其所有权或权力。这的确是开源项目的本质。您必须牢记这一点，并将其体现在您演讲的各个方面，包括个人简介、标题、摘要和内容本身。这包括聚会、会议、主题演讲、网络研讨会、技术讲座等活动。
> * 请熟悉 ASF 行为准则。
> * Apache 软件基金会拥有所有与 Apache 相关的商标、服务标记和图形徽标。

这里提到的两份材料的相关链接：

* 行为准则：http://www.apache.org/foundation/policies/conduct.html
* 图形徽标：http://www.apache.org/foundation/press/kit/

> * 请在您的演讲稿中包含以下商标归属信息：
>
> Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the Apache Software Foundation. The Apache Software Foundation has no affiliation with and does not endorse the materials provided at this event.

一般就是放在首页、尾页或者每一页的底部。

## 名称使用指南

> 如有疑问，请在 Kafka 前添加 Apache 并在首次出现时添加®商标。文章或文档正文中，第二次及以后均可使用 Kafka 来指代。
> 
> 标题：网页、电子邮件主题行、宣传资料
>
> * 所有提及 Kafka 的地方都必须使用 Apache Kafka 的形式。
> * 如果有副标题，副标题中也必须使用 Apache Kafka 的形式。
> * 第一次提及 Apache Kafka 时，必须使用 Apache Kafka® 的形式。
>
> 正文：网页、电子邮件主题行、宣传资料
>
> * 首次出现 Kafka 时应使用 Apache Kafka 的形式。

这个指导手册的页面上第一个提及 Kafka 的地方，也是写成 Apache Kafka® 的形式。对于不是注册商标的情况，应该使用商标符号“™”代替“®”。

国内没有侵权的大额罚金，所以我跟许多厂商沟通的时候，因为不熟悉，经常会听到类似“这么麻烦吗”的反馈。但是这是约定的一部分，实际上在引用任何注册商标时，都有类似的问题。你就想想迪士尼或者 Oracle 的经典操作，这也就不奇怪了。

ASF 公开提供了所有[商标和注册商标的列表](https://www.apache.org/foundation/marks/list/)。

## 商标归属信息

> 必须在页面页脚或网站内清晰标注的“条款”、“法律”、“商标”或其他常用二级页面中提供正确的商标归属。

这个不难，通常是在页脚加一段文本信息。

> 网页：页脚和宣传资料
> 
> 在每个页脚网页的末尾添加以下内容：
>
> Copyright © Confluent, Inc. 2014-2019. Privacy Policy | Terms & Conditions. Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the Apache Software Foundation.

最常规的做法。

> Kafka Summit 网页：页脚和宣传资料
>
> 在每个页脚网页的末尾添加以下内容：
>
> Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the Apache Software Foundation. The Apache Software Foundation has no affiliation with and does not endorse the materials provided at this event.

现在 Kafka Summit 已经更名为 Current 大会运作。这样，作为 Confluent 独立运营的新品牌，Current 大会每年举办的时候就不需要向 Kafka PMC 和 ASF 品牌管理委员会申请商标使用权。当然，这个 Trademark Attribution 因为大会还是大量涉及 Kafka 名称商标的引用，还是要添加的。

> Confluent 官方邮件
>
> 请在每封邮件的页脚中添加以下内容：
>
> Copyright © Confluent, Inc. 2014-2019. Privacy Policy | Terms & Conditions. Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the Apache Software Foundation.

> Confluent Kafka 峰会活动官方邮件
>
> 请在每封邮件的页脚中添加以下内容：
>
> Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the Apache Software Foundation. The Apache Software Foundation has no affiliation with and does not endorse the materials provided at this event, which is managed by Confluent.

> Confluent 宣传资料
>
> 请在每份宣传资料和 PDF 文件中的超链接末尾添加以下内容作为页脚：
>
> Copyright © Confluent, Inc. 2014-2019. Privacy Policy | Terms & Conditions. Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the Apache Software Foundation.

> 商标使用的详细指南
>
> * Apache Kafka®
> * 博客文章的标题里不需要 ® 符号
> * 确保使用最新的 Kafka Logo
> * 以下场景中，在第一次提及 Apache Kafka 时添加 ® 符号
>   * 落地页正文
>   * 宣传资料封面
>   * 赠品（swag）
>   * 宣传资料缩略图
>   * 在电子邮件正文中首次提及 Apache Kafka
>   * 落地页和网页上的首次提及

这些应该是以往 Confluent 被举报的多种情况一个一个打的补丁，以及和 ASF 明确达成共识的豁免情形。

## ASF 官方指南

Confluent 的 Apache 品牌指导手册最后提供了相关的 ASF 官方指南链接：

* [Apache 产品名称使用指南](https://www.apache.org/foundation/marks/guide)
* [如何跟 Apache 联系处理品牌问题](http://www.apache.org/foundation/marks/contact)
* [Apache 品牌社交媒体最佳实践](http://www.apache.org/foundation/marks/socialmedia)

## 小结

这份指导手册，可以算是国内 Apache 项目的供应商建设 Apache 品牌相关的内部培训的一份参考材料和不错的起始点。

我从 2023 年推动 [Apache OpenDAL 毕业](https://mp.weixin.qq.com/s/35DDpKnJjqhUIa2IIa5lyw)，遇到一系列跟商标品牌的挑战开始，逐渐熟悉 ASF 的相关政策，并在几个月后正式成为 ASF 品牌管理委员会的成员。自今年担任 ASF 董事以来，多重身份促使我参与了许多供应商或平台网站对 ASF 商标品牌的侵权问题。

应该说，尤其是供应商的侵权行为，很多时候是由于其内部研发团队员工，或者市场团队员工，完全不了解 ASF 的商标品牌政策导致的。就算是 Confluent 制定了这样的手册，新员工犯错或者老员工在无意识的情况下错误引用，仍然屡见不鲜。对公司而言，应该把合规作为一个长期关注的成本议题，几乎没有一劳永逸的情况。
