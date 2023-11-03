---
title: Elastic License 2.0 与开源协议的发展
date: 2023-11-01
tags:
    - 开源
    - 开源协议
categories:
    - 夜天之书
    - 译文
---

## 译序

我在此前的多篇文章中讨论了商业开源的话题：

* [《企业开源的软件协议模型实践》](https://mp.weixin.qq.com/s/iSR1sryhmp_wQxf5cvrxOA)
* [《企业实践开源的动机》](https://mp.weixin.qq.com/s/NYC_beiBvsxCjkocA1FUZA)
* [《商业源码协议为何得到 HashiCorp 等企业的垂青？》](https://mp.weixin.qq.com/s/hYfw7HoBr-cm8cxyQIXLgw)
* [《企业如何实践开源协同》](https://mp.weixin.qq.com/s/d5pwuMOUKYdO30REVL73Mw)
* [《中国不缺好的开源开发者》](https://mp.weixin.qq.com/s/vcyn9jKvGkGBLD9Y7upNtg)“商业探索与可持续”一节
* [《开源不是商业模式》](https://mp.weixin.qq.com/s/VIKlKIthvYaHaBl6ALqtSA)
* [《诱导转向的伪开源战略》](https://mp.weixin.qq.com/s/HsgoUoBzsyXSmDfV00DlgQ)
* [《免费增值的商业模式》](https://mp.weixin.qq.com/s/2BayiBGrlOmA-BJ2NoqMKw)

这些讨论当中观点的源头，除了我在商业开源公司的工作经历以外，也有对国外企业主和律师的内容的理解。其中，撰写了[《Open Source for Business》](https://book.douban.com/subject/35309516/)（中文版为开放原子开源基金会律师刘伟翻译的《商业开源》）的大律师 Heather Meeker 的观点尤为重要。早在[夜天之书 #6](https://mp.weixin.qq.com/s/FsolP0IPIq0pFolPVDD8Ug) 一文里，我就引用过 Heather Meeker 的观点。

今年五月份前后，我读到了 [Elastic License 2.0 and the Evolution of Open Source Licensing](https://www.coss.community/cossc/elastic-license-2-0-and-the-evolution-of-open-source-licensing-3jb3) 一文。它是 Heather Meeker 律师带头撰写 Elastic License 2.0 协议背后的故事和自述。我深感它对于近五年商业开源软件形势发展的影响，于是向 Heather Meeker 申请了翻译本文的授权。今天终于有时间完成翻译，希望能帮助国内关注商业开源的企业家、开发者以及律师，了解发生在北美软件行业的一系列变化。

**以下原文翻译。**

<!-- more -->

2021 年 2 月，Elastic 发布了其软件产品的新协议，即 [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license) 协议。通过这一举措，包括 ElasticSearch 和 Kibana 在内的一系列重要软件采用了一种新的、公开的以及简化的协议模型。这一变化是如何发生的？其背后的原因是什么？这些变化又意味着什么呢？

Elastic 的新协议是针对采用开放发展模式的公司在软件协议最佳实践方面的一个重要趋势的结晶。它并不是一个开源协议，但它旨在设定最低限度的限制，以在自由使用、共享和修改软件之间取得平衡，并防止对社群造成损害的行为的发生。

## UNIX / Linux / 自由软件 / 开源

要想理解 Elastic License 2.0 所代表的新协议趋势，知道它是如何从开源协议运动中发展而来的至关重要。

开源运动或自由软件运动，源于开发者对软件私有化和软件开发分叉的担忧。UNIX 的一系列操作是这些担忧的来源。

UNIX 是当时最流行的操作系统。多年来，UNIX 的许可条件非常慷慨，因为它的开发者 AT&T 贝尔实验室受制于 1956 年的同意法令，不能从其研究项目中获利，其中包括 UNIX 和 C 语言。学者、研究人员和开发者开始分享他们的改动和改进，因此 UNIX 很快成为操作系统的领导者。

> 原注 "Modification of Final Judgment," August 24, 1982, filed in case 82-0192, United States of America v. Western Electric Company, Incorporated, and American Telephone and Telegraph Company, U.S. District Court for the District of Columbia web.archive.org/web/20060827191354/members.cox.

然而，上述同意法令在 1983 年一经解除，AT&T 就立刻根据传统的商业条款设计不允许分享更改的软件协议。此后，UNIX 分裂成许多不兼容的版本，并且其专有软件协议禁止用户像以前那样通过分享改动进行合作。

自由软件运动以及随后的开源运动是对 UNIX 私有化的回应。它们试图防止基础设施软件再次走向封闭。这个运动以 UNIX 的自由软件替代品 Linux 为中心，并很快发展成一个认为“所有软件生而自由”的具有巨大影响力的运动。这个运动的核心理念包括用户有权访问源代码、改进软件和分享软件的改进版本。这些原则体现在 [GNU 通用公共协议](https://en.wikipedia.org/wiki/GNU_General_Public_License)（GPL）中，该协议要求二进制文件的分发者必须向接受者免费提供相应的源代码。

随着时间的推移，尤其是 2000 年初互联网的兴起，开源协议变得越来越受欢迎。尽管部分开源协议（例如 GPL 协议）新颖且复杂，引发了一些法律上的担忧，但它们为企业间的合作铺平了道路。很快，开源以及它所促进的合作被整个技术行业全心接受。如今，开源是电子商务的支柱，企业经常合作开发基础软件。

## 云的兴起和 AGPL 协议

GPL 协议要求分享修改后的源代码，但是这个要求只在二进制分发时生效，即取得二进制的人有权索要源代码。但是，这意味着 GPL 允许制作和使用“私有版本”：如果不对外分发二进制，也就无需分享更改。在大多数软件仍然依靠本地分发的年代，这种方式有效地促使了分享。从 2000 年开始，软件交付开始向公共云迁移，软件服务提供商不再需要直接向客户分发任何二进制文件。相反，客户可以在不获取本地副本的情况下使用软件。

随着云服务的业务规模增长，这种范式转变激化了部分开源社群和 AWS 等企业之间的紧张关系。云厂商没有任何法律义务分享他们的改进。有点讽刺的是，这种情况有时被称为“Google 漏洞”。“Google 漏洞”这一称谓之所以说讽刺，是因为尽管谷歌依赖 Linux 来支持其搜索服务，但是谷歌和许多其他顶级云厂商（如 IBM 等）为包括 Linux 在内的开源社群做出过重大贡献。

自由软件社群对此的回应，是创造了一种名为 Affero GPL (AGPL) 的 GPL 替代形式。AGPL 3.0 与 GPL 3.0 几乎完全相同，但增加了一个远程网络交互条款，该条款规定：“如果你修改了程序，你的修改版本必须明显地向通过计算机网络与之远程交互的所有用户，提供通过某种标准或习惯的软件复制方式，无偿地从网络服务器获得您版本的相应源代码的支持。”这个新的协议旨在强制云厂商分享它们的源代码改进，从而再现 GPL 约束 Linux 发行版开放其源代码的成功。

> If you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network … an opportunity to receive the Corresponding Source of your version by providing access to the Corresponding Source from a network server at no charge, through some standard or customary means of facilitating copying of software….

## AGPL 和双重许可

AGPL 自首次发布以来就备受争议。

在 GPL 3.0 起草并最终于 2007 年发布的过程中，有一派人想将 GPL 改为与如今的 AGPL 一样的网络共享模型。然而，自由软件社群最终决定保留 GPL 3.0 中的“漏洞”。

几个月后，自由软件基金会发布了 AGPL 作为解决该漏洞的替代方案。但是 AGPL 并没有得到广泛采用。不过，就像 GPL 有 Linux 这一杀手级应用，AGPL 也有自己的杀手级应用，这就是 [MongoDB](https://en.wikipedia.org/wiki/MongoDB) 数据库。

MongoDB 是一款非常受欢迎的分布式数据库产品。虽然一开始，很多企业难以理解和接受 AGPL 协议，但是大多数用户从未更改过软件，也没有将其作为服务提供，因此他们能够理性地决定在 AGPL 下使用该软件。

MongoDB 基于 AGPL 协议设计了它的[双重许可](https://monty-says.blogspot.com/2009/08/thoughts-about-dual-licensing-open.html)商业模型，即软件可以根据被许可人选择的两种协议之一提供：（1）AGPL 协议（2）经过协商取得的商业软件协议。那些不希望遵守 AGPL 要求，或不愿进行法律分析以确定是否能够遵守的人，选择购买商业软件协议。

这种商业模型最初由 MySQL 开创，MySQL 当时使用了 GPL 的一个变种。随着时间的推移，AGPL 成为双重许可模式的首选软件协议。MongoDB 在这种协议模型下取得了相当的成功。AGPL 是常用软件协议里最强的强制共享（Copyleft）软件协议，因此在推动商业谈判方面最有用，也就被用在双重许可模型上。但是，AGPL 的起草者批评了这种使用 AGPL 的方式，称该商业模型是一种有害的[勒索行为](https://ebb.org/bkuhn/blog/2020/01/06/copyleft-equality.html)。尽管如此，APL 的源码分享条件并不足以阻止企业在不给开发者或用户社群带来任何回报的前提下大规模商用。

## Strip-mining

> 译注：国外开源语境下的 strip-mining 含义和国内所谓的“白嫖开源”意义类似。

就像云计算的发展打破了基于 GPL 的双重许可模型一样，2010 年代云计算的进步，云交付模式开始对基于 AGPL 的双重许可模型施加压力。

这次问题有所不同，“漏洞”出现在 GPL 或 AGPL 的范围仅限于一个单独的程序可执行文件。这个“漏洞”是有意设计到 GPL 中的，理论上，版权协议只能为一个可受版权保护的作品规定条款。因此，GPL 对衍生作品（derivative works）有源代码共享的要求，但对集体作品（collective works）没有。在法律上，这两者之间的界线非常模糊，完全取决于观察者的主观看法。但在过去，随着 GPL 的普及，强大的行业实践已经形成：一个程序被定义为一个可执行进程。自由软件基金会在其 [GPL FAQ](https://www.gnu.org/licenses/gpl-faq.en.html#MereAggregation) 中长期阐述了这些原则。

然而，随着云服务的发展，发生了两件事：

1. 软件工程越来越专注于云部署。云厂商曾经需要修改开源软件以使其能在云环境中正确运行，但软件工程的进步使现有的开源软件更加适应云厂商的“即插即用”需求。也就是说，不用修改一行代码，开源软件也可以与云基础设施良好的集成。
2. 云厂商开始在核心开源软件之外进行创新。他们开发了额外的软件来管理、监控和部署软件。这些创新推动了云服务的业务增长。同时，它们是跟核心开源软件独立的软件，即使核心软件以 AGPL 发布，也无法强制云厂商分享这些辅助软件的源代码。

这两者相结合形成了这样一种形势：商业开源公司实际上成为大型云厂商“资产负债表以外的研发机构”。这个问题在开源的平台软件或中间件方面尤为突出，因为这些软件位于顶层应用程序和操作系统之间，在应用程序栈中起着重要作用，且对于云部署非常有用。

这种变化在商业界引起了对云厂商使用开源软件的强烈抗议。在 2018 年的一份具有里程碑意义的[宣言](https://techcrunch.com/2018/09/07/commons-clause-stops-open-source-abuse/)中，贝恩资本的 Salil Deshpande 写道：“明确地说，这并不违法。但我们认为这是错误的，不利于开源社群的可持续发展。”另一位评论家[写道](https://onezero.medium.com/open-source-betrayed-industry-leaders-accuse-amazon-of-playing-a-rigged-game-with-aws-67177bc748b7)：“AWS 正在攻击开源的阿喀琉斯之踵：窃取他人的工作，并销售租赁这些工作成果的服务。”问题在于，所有主要的开源协议都允许以这种方式使用软件。

商业开源公司及其投资者对开源模型的局限感到不满，他们手头没有任何软件协议可以利用版权法强制云厂商进行共享。即使是 GPL 和 AGPL 也对此无能为力。

同时，拥有庞大客户群的云厂商可以为开源软件提供更好的云平台集成。在 AWS、Azure 或 Google Cloud 平台上，客户可以轻松地一键添加软件。一些开源软件的开发者提供了自己的云服务，但是发现与免费使用他们开发的开源软件的大型云厂商竞争太困难了。即使开发者的服务更好，与云厂商建立合作关系也存在交易成本，而不仅仅是云厂商原生集成服务的一键集成体验。

## SSPL 和源码可得协议

在 2018 年，整个行业的发展来到了一个临界点：随着 AWS 等云厂商持续不断地通过托管开源软件挣钱，开发者们开始采取应对措施，首先就是一系列快速的软件协议变更。

商业开源公司对 [strip-mining 问题](https://techcrunch.com/2018/11/29/the-crusade-against-open-source-abuse/)做出了两种不同的反应：一种是超强网络共享软件协议，另一种是带有限制条件的源码可得协议。在此之前，还没有人对这两类协议进行明确定义。这两类协议都旨在支持双重许可模型，即引导潜在客户经过协商购买商业软件协议，就像帮助构建 MySQL 和 MongoDB 的模式一样。

超强网络共享软件协议的方法由 MongoDB 推进发展，他们在 2018 年发布了 [Server Side Public License (SSPL)](https://www.mongodb.com/licensing/server-side-public-license) 协议。SSPL 与 AGPL 几乎完全相同，但扩展了 AGPL 的远程网络条款，如下所述：

> 13. Offering the Program as a Service.
>
> If you make the functionality of the Program or a modified version available to third parties as a service, you must make the Service Source Code available via network download to everyone at no charge, under the terms of this License. Making the functionality of the Program or modified version available to third parties as a service includes, without limitation, enabling third parties to interact with the functionality of the Program or modified version remotely through a computer network, offering a service the value of which entirely or primarily derives from the value of the Program or modified version, or offering a service that accomplishes for users the primary purpose of the Program or modified version.
>
> "Service Source Code" means the Corresponding Source for the Program or the modified version, and the Corresponding Source for all programs that you use to make the Program or modified version available as a service, including, without limitation, management software, user interfaces, application program interfaces, automation software, monitoring software, backup software, storage software and hosting software, all such that a user could run an instance of the service using the Service Source Code you make available. [emphasis added].

> 译注：法律文本翻译极其拗口，这里放原文。主要 SSPL 跟 AGPL 的区别就在于 AGPL 仅对衍生作品提出分享源码的要求，即前文所述的运行在同一进程的代码，而 SSPL 定义了 Service Source Code 的概念，即要求整个服务栈相关的代码都需要以 SSPL 的条款提供。

SSPL 的编写旨在为 strip-mining 问题提供一个开源解决方案。它的源码共享要求比 AGPL 更广泛。这种更广泛的源码共享描述被有意设计成类似于 GPL 对分发软件的要求的形式。MongoDB 继续采用双重许可模型，其软件可根据 SSPL 协议或[经过协商的商业软件协议](https://www.mongodb.com/community/licensing)提供。

MongoDB 将 SSPL 提交给[开源促进会](https://opensource.org/approval)（OSI）审议。经过数月的激烈争议后，SSPL 的 OSI 认证申请被驳回，但 MongoDB 继续在其双重许可模型的“开源”选项中使用 SSPL 协议。关于为什么 SSPL 符合或不符合[开源定义](https://opensource.org/osd/)，讨论很复杂。不过，符合开源定义并不是唯一的争论点，总体而言，这个要求共享范围如此广泛的软件协议是否能够“[保证软件自由](https://opensource.org/licenses/review-process/)”，尚且没有一个明确的结论。

其他人选择了不同的道路。一些公司采用了由 Salil Deshpande 主持编写的 [Commons Clause](https://commonsclause.com/) 条款，而其他公司则自行制定了软件协议，例如 [Redis](https://redis.com/legal/licenses/)、[Confluent](https://www.confluent.io/confluent-community-license/) 和 [CockroachDB](https://www.cockroachlabs.com/cockroachdb-community-license/) 等，以及 Elastic 公司的 [Elastic License 1.0](https://github.com/elastic/elasticsearch/blob/7.10/licenses/ELASTIC-LICENSE.txt) 协议。不同于 SSPL 协议，这些软件协议从未期望符合开源定义。相反，它们具有专门针对 strip-mining 的限制条款。

为什么选择了这些不同的道路？这与一个被称为 [Freedom 0](https://www.gnu.org/philosophy/free-sw.en.html) 的概念有关。Freedom 0 的内容是：用户按照自己的意愿运行程序，用于任何目的的自由。

> 原注：自由软件定义和开源定义类似，但是更加简短和清晰。

开源或自由软件协议的主要特点之一，就是它不包含任何许可限制或限制条件。

> 原注：开源协议可以包含条件，例如发布时包含 NOTICE 文件或要求共享源代码，但是这些并不是限制用户使用软件的规定。它们只要求如果用户选择执行某些操作，您也必须执行其他操作。（译注：例如，GPL 允许用户自由使用，但是如果一个人要分发修改版本的二进制，那么分发者需要保证接收者能够以和 GPL 相同的条款使用修改版本，其中包括取得修改版本的源代码。）

相比于典型的商业软件协议，终端用户协议只允许用户使用软件，但不允许分发或修改；企业软件协议通常限制软件使用的用户数、服务器数或物理位置，并要求公司对其使用进行审计。但是，开源协议不包含任何此类限制。因此，可能有些反直觉，虽然开源软件源代码总是免费提供，但是如果一个自称开源协议限制软件的非商业使用，那么它也违反了开源定义。

这意味着任何许可限制都使软件协议不再属于开源协议。

在 2018 年及以后的重新许可浪潮中发布的所有协议都具有大致相似的限制。虽然每个协议都有自己的条款，但它们都侧重于允许用户免费使用软件，同时禁止使用软件提供竞争性的托管服务。

## Elastic License 2.0

在2021年初，Elastic 开辟了新的道路，同时选择了上述两种路径。它使用 SSPL 和 [Elastic License 2.0](https://www.elastic.co/licensing/elastic-license) (ELv2) 对 ElasticSearch 进行双重许可。

ELv2 非常简短。它用通俗的语言编写，内容总共只有一页多。ELv2 授予用户一个典型开源协议授予的几乎所有自由。软件的接收者可以自由使用、更改和重新分发软件。即使您以前从未阅读过软件协议，也值得一读。

ELv2 在上述自由之外有两个关键限制：

> You may not provide the software to third parties as a hosted or managed service, where the service provides users with access to any substantial set of the features or functionality of the software.
>
> You may not move, change, disable, or circumvent the license key functionality in the software, and you may not remove or obscure any functionality in the software that is protected by the license key.

第一条限制是为了解决 strip-mining 问题。通过这条限制，ELv2 不授权接受者基于该软件提供托管服务。

第二条限制禁止破解软件许可密钥。这样的限制在软件许可中长期存在，但在源码可得协议中的使用刚刚开始。这些条款允许开发人员运行与软件交互的付费服务，或者保留一些软件组件用于付费功能。

ELv2 的其他条款非常直接，对于任何阅读过开源协议的人来说应该是熟悉的。

## 为什么选择双重许可？

在提供 SSPL 和 ELv2 两种选择给用户时，Elastic 选择了一条不寻常的道路。如今，许多公司采用“开放核心”模型，事实上，Elastic 之前也使用过这种模型。两者之间的区别可能很微妙。开放核心模型在开源协议下提供核心软件：通常使用 Apache License 2.0 这样的宽松开源协议。然后，这些公司开发额外的适用于大规模企业部署的功能，并只在限制型协议下提供，或者仅作为商业服务提供。但是，通过新的软件协议，Elastic 坚持采用双重许可模型，即相同的软件可在两种不同的软件协议下使用。这种模型由 MySQL 首创，通常使用类似 GPL、AGPL 或 SSPL 的强制共享协议作为免费软件协议选择。由于开源协议和云服务之间的紧张关系，这种模型在最近几年变得不太流行。

Elastic 的选择更加不寻常，因为它提供了两种免费的软件协议选择，SSPL 和 ELv2 都有免费使用的条款，而双重许可通常只提供一种免费选项。通过做出这个独特的选择，Elastic 强调了其灵活性，可以免费向几乎所有用户提供软件。

## Elastic License 2.0 和软件协议的最新发展

Elastic 采用了新的软件协议模型，以尽可能保持开放性，同时保持对用户和开发人员公平可持续的商业模式。在这样做的过程中，它呼应了源代码可用运动中其他参与者的目标，并在创建软件协议时寻求同行的意见。

正如 [ELv2 FAQ](https://www.elastic.co/licensing/elastic-license/faq) 提到的，Elastic 的软件协议变更预计不会对其客户群体产生影响，对社群用户的影响也很小。因为大多数用户在 Elastic 的软件上构建应用程序，并不从事“将软件作为托管或管理服务提供给第三方”的业务。

## 设计一个更好的软件协议

此外，通过投入资源起草 ELv2 协议，Elastic 努力推动软件协议起草的技术水平。从某种意义上说，源码可得协议的存在时间与软件一样长。事实上，仅二进制的软件协议是上世纪 80 年代 PC 平台标准化的产物；在那之前，几乎所有的软件都以源代码格式进行许可。但是随着时间的推移，软件协议的形式和部署方式发生了很大变化。

ELv2 是这一趋势的最终体现。在形式上，它采用了一些最受欢迎的开源协议特性：简单直观的起草和模板协议。它的密钥保留条款使得供应商发布同时包含免费功能和付费功能的软件事也能轻松地使用 ELv2 协议。

与几十年前专有 UNIX 的不兼容版本一样，专有软件协议是一个由自定义条款和条件组成的混乱合成体。即使是普通消费者软件产品的简单终端用户协议通常也很长，晦涩难懂，大多数用户无法理解。关于[没人阅读用户协议的笑话](https://en.wikipedia.org/wiki/HumancentiPad)屡见不鲜。但是，大部分复杂性是不必要的。这是开源协议的一个教训，特别是宽松开源协议：一套简单的规则就足够了，而且规则越易理解，用户越有可能遵守。

ELv2 不仅简短、简单和易理解，而且其他人也可以将其[用作模板](https://www.elastic.co/blog/elastic-license-v2)。自反对 strip-mining 的辩论开始以来，用户愈发希望出现一个能够支持流畅部署软件、可以具有合理限制，但是必须简单易懂的软件协议。但是，大多数小型软件公司没有资源来起草自己的协议。因此，毫不奇怪，许多软件初创公司都希望采用 ELv2 或 Confluent Community License 等现成软件协议来构成其软件协议模型。

这个趋势愈演愈烈，最终形成了一个名为 [Fair Code](https://faircode.io/) 的倡议和标准，其中写到：

> Fair-code is not a software license. It describes a software model where software:
> 
> * is generally free to use and can be distributed by anybody
> * has its source code openly available
> * can be extended by anybody in public and private communities
> * is commercially restricted by its authors

虽然这项倡议还处于非常早期阶段，但显然行业开始意识到需要一个公平对待用户和开发者的范式。同时，这一范式还应当允许商业开发者，以一种比如今的开源协议更加灵活的方式，在两者之间取得平衡。一位评论员甚至将最近的软件协议发展称为[后开源时代](https://monetize.substack.com/p/open-source-eras)。不过事实上，在商业和软件协议模型不断发展的过程中，源码可得协议与开源协议通常是并行发展的。因此，这两种模型互补，而不是互为替代品。

同一时间，其他标准化的软件协议工作也在进行。2020 年，一群律师发起了 [PolyForm](http://www.polyformproject.org/) 项目，起草了一系列源码可得协议模板。这些软件协议由在开源和专有协议方面经验丰富的律师进行同行评审。就像 [Creative Commons](https://creativecommons.org/) 用于开放内容协议一样，它提供了一系列选项，如非商业、仅用于评估和反竞争协议。所有这些软件协议，就像 ELv2 一样，都允许免费使用、提供源代码，并授予必要的专利许可。PolyForm Perimeter 和 PolyForm Shield 与其前身 Confluent Community License 类似，而 ELv2 也遵循了这一趋势，推进了软件协议可选项的发展。

如果您有疑问或想要阅读更多信息，这里有一些资源：

* [The rise of open source IPOs](https://coss.media/rise-of-the-open-source-ipo/) 这篇文章追踪了一些商业开源公司的成功案例。
* [The After Open Source Era Has Started](https://monetize.substack.com/p/open-source-eras) 这篇文章讨论了公司转向源码可得协议所代表的重大变革。
* [美国众议院司法委员会关于数字市场竞争调查的报告](https://www.documentcloud.org/documents/7222836-Investigation-of-Competition-in-Digital-Markets.html)（由反垄断、商业和行政法小组牵头）请注意第 326 页提到了 Elastic 的例子。

注：本文的起草代表了我（Heather Meeker）的个人观点。然而，我想指出，撰写这篇白皮书的工作部分受到了 Elastic 的资助。
