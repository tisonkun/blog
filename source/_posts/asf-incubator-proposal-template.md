---
title: 如何撰写一个 ASF 孵化器提案？
date: 2023-12-23
tags:
    - 开源
    - 开源项目
    - ASF 孵化器
categories:
    - 夜天之书
---

随着 Apache 软件基金会（ASF）在国内的深入发展，越来越多的项目希望藉由进入 ASF 孵化器孵化，来建设开源社群。在进入孵化器之前，项目发起人或其核心团队必须撰写一份孵化器提案来介绍项目的基本情况，以供孵化器项目管理委员会（Incubator Project Management Committee, IPMC）评估是否适合孵化。

ASF 孵化器成立于 2002 年，至今已有超过 20 年历史。截至本文写作时，孵化器一共孵化了 347 个项目，其中 241 个项目已毕业，28 个项目正在孵化中。

ASF 孵化器的[官网](https://incubator.apache.org/)有丰富的文档介绍如何进入孵化器以及按照 The Apache Way 建设开源社群。对于孵化项目而言，最核心的两份文档是：

* [A Guide To Proposal Creation](https://incubator.apache.org/guides/proposal.html)
* [The Apache Incubator Cookbook](https://incubator.apache.org/cookbook/)

此外，进入孵化器前需要撰写的提案，孵化器也提供了相应的[模板](https://cwiki.apache.org/confluence/display/INCUBATOR/New+Podling+Proposal)，过往的孵化提案都是公开可查的，这也是撰写孵化提案时的重要参考。ALC Beijing 整理翻译了这份材料，可以阅读其发布文章[《ASF 新孵化项目提案指导》](https://mp.weixin.qq.com/s/2L5HSDxx2JkohjrYfkpiwQ)。

本文从我至今指导孵化五六个项目的经历出发，讨论项目在进入孵化器前撰写提案时经常遇到的问题以及应对方法。

<!-- more -->

## 找到一位领路人

提交孵化器提案时，需要一位 IPMC 成员担任该提案的领路人（Champion），其职责主要是作为项目和 ASF 的沟通桥梁，帮助项目进行一些基本的自我评估，并完成孵化提案的评审工作。同样，ALC Beijing 整理翻译了一份材料[《Apache 孵化器领路人与导师的职责》](https://mp.weixin.qq.com/s/neaf4f0-QDO0D4RhXNwq6g)做详细介绍。

除了我指导孵化的第一个项目 Kvrocks 是陈亮担任领路人，以及思否捐赠的 Answer 项目是姜宁担任领路人，其他我指导孵化的四个项目都是由我担任这个角色，并帮助项目完成提案撰写和通过孵化器评审。

虽然从流程上说，领路人的职责在项目顺利进入孵化器后就结束，但是许多项目的领路人都会稍后仍然担任项目的导师（Mentor）。毕竟愿意在项目成员还很不了解 ASF 的文化和工作模式的时候，予以指导并帮助项目顺利加入孵化器，需要付出不小的努力。如果不是对项目本身的认同，是很难做这样的投入的。既然如此，那么参与后续孵化，帮助项目进一步建设发展社群，从孵化器中毕业，也就顺理成章。

因此，找到一位领路人不仅是项目进入孵化器时流程上必要的条件，实际上也是找到一位当前在任的 ASF 孵化器导师，愿意支持项目整个孵化过程的发展。

随着 ASF 在国内蓬勃发展，这几年来，进入 ASF 孵化器的源自中国的项目数量可观，我也能看到有许多富有经验的导师和新锐进取的导师在帮助项目孵化。不过，以我现在指导的项目数量来说，我应该很难再支持一个新的项目进入孵化。或许等到现在指导孵化的四五个项目（Kvrocks 已经毕业，OpenDAL 接近毕业）减少到一两个，我还能有多一些时间。国内有作为孵化项目导师意愿的 IPMC 成员我知道一些，但是不合适在这里罗列。如果有想要寻找领路人加入 ASF 孵化的项目，可以跟我联系或者找到 [ALC Beijing](https://cwiki.apache.org/confluence/display/COMDEV/ALC+Beijing) 或 [ALC Shenzhen](https://cwiki.apache.org/confluence/display/COMDEV/ALC+Shenzhen+Team+meeting) 等组织询问。

## 第一大原则：真诚

我所指导孵化的六个项目，它们撰写的提案没有第一次就能通过导师自检的。其中最主要的两个问题，一个是英语技能不熟练，另一个就是不够真诚。

原本我想在这写的原则是“诚实”，因为有部分提案编造项目现状尤其是成员多样性和活跃度。这种问题项目导师和后续参与审议的 IPMC 成员稍微查证一下就会暴露，如果在提案正式讨论时才被公开挑战，那么提案通过的概率就非常渺茫了。

不过，“诚实”到底是一个相对客观的标准。很多情况下，项目团队还不至于直接撒谎。然而，如果用“真诚”这样一个相对主观的标准来界定，那么刻意隐瞒、夸大、春秋笔法之类的问题就能囊括其中了。实际评审过程中，不够真诚往往也是很大的挑战。

所谓真诚，意味着明确阐述项目定位，如实披露项目及其社群目前的状况，以及说明加入孵化器的目的和计划。在此之上，知道评议项目提案的人大都是 IPMC 成员，即潜在的孵化器导师，知道 ASF 孵化器的目的是以 The Apache Way 帮助项目发展开源社群，就能够比较好的确定如何写好这个提案。

例如，一个典型的问题是在提案中填充市场材料。这尤其常见于企业团队捐赠的项目，毕竟企业团队在做内部报告和外部宣传时，标配就是一份 PPT 和一系列营销材料。

某项目的孵化提案草案中，几次三番提到捐赠项目的企业建设了中国最大的某品类平台。诚然，首次提及时补充相关信息无可非议，但是原本就不长的的提案里每屏都会出现一到两处提及此事的长难句，属实有点难绷。

某项目的孵化提案草案中，罗列了项目荣获各种开源奖项，希望以此说明项目如何的好。可惜这些开源奖项本身的认可度极低，很多时候是拿着奖项找人领奖。同时其知名度也极低，放在特定环境下或许还有人关注，但是到了 IPMC 成员的审议里，只会认为项目团队是否只是注重虚名。实际上，在提案中需要回答的问题有一条，就是项目需要解释自己的捐赠行为是否只是“对 Apache 品牌的过度迷恋”。

在我的认知中，往往是对社群本身的发展和软件的价值没什么可说的项目，才会期望以填充市场材料的方式来蒙混过关。相反，真正值得展示已有社群规模的项目，通常寥寥数语就能勾勒其形状，IPMC 成员也知道如何求证。

例如，Seata 是阿里巴巴集团和蚂蚁集团共同开发的开源项目，多年以来独立发展得也很好。由于一些原因两家公司希望将 Seata 捐赠到 ASF 当中以在中立的平台和品牌下继续对 Seata 项目做投入。Seata 项目是这样描述其社群的：

> Seata is being developed by the development team inside Alibaba who's responsible for building internal distributed system too. Since Seata was open-sourced on GitHub, it has gained significant traction, receiving up to 24k stars, being forked over 8k times, and having more than 40 versions released. Besides being widely adopted inside Alibaba and Ant Group, Seata is also widely adopted by hundreds of other companies, including ...  For more information, please click here. We aim to expand the contributor by inviting all those who make valuable contributions and excel in adhering to The Apache Way. The Seata project and its side projects always accept contributions from individuals outside of Alibaba.

因为它确实有人用，所以展示自己的时候才有的放矢。

当然，并非所有项目都像 Seata 一样经过多年的运作。Fury 是蚂蚁集团今年七月份开源的另一个项目，起初项目团队也犯了难，为了让项目看起来勃勃生机万物竞发，把钉钉群的人数也写进去，还把一些未来可能可以做的事情当做已经做完的事情来表述，显得项目似乎得到了广泛的采用。

我首先要求把提及群聊人数的内容给删掉，因为这个大家都知道是怎么回事，背靠大公司或者经过一定的宣传，拉出几个五百人微信群或几千人钉钉群并不是难事，然而其中到底有多少价值，至少不是按群聊人数来衡量的。

此外，我告诉项目团队，Fury 项目的优点是定位清晰，社群用户反馈积极，可以着重突出这一部分。对于未来能做的事情，只要定位说清楚了，再辅以几个确实做过的集成，认真审议的人是能 Get 到的。社群用户反馈积极，则是项目作者杨朝坤在开源的小半年时间里，积极在 Reddit 和 HackerNews 上宣传项目，由于 Fury 作为序列化方案的定位简单易懂，用于替换 Kyro 和 Protobuf 的一些场景下优势明显，所以有不少用户确实公开表示了对项目的兴趣。

最终，我们把 Fury 实际的几个用例做了一点展开来体现项目的价值和其合作的前景：

> Currently, Fury has a group of individual users, and organizations such as Alibaba/Vipshop are Fury users, too. Here are some of Fury's use cases:
> * Ant Ray uses Fury for serialization at 100W+ CPU cores every day at Ant Group.
> * Ant Mars replaced its serialization with Fury, which sped up task scheduling TPS by 2.5X and 4X for data transfer.
> * Ant real-time-graph computing systems replaced Kryo with Fury to speed graph serialization.
> * A few companies replaced Kryo with Fury in Flink jobs for faster data transfer and state persistence.
> * Lindorm at Aliyun uses Fury for serialization between clients and servers.
> * Taobao Android app, which has 880 million monthly active users, is considering using Fury for IPC serialization between Android processes.
> * Vipshop replaced Protobuf with Fury, reducing the end-to-end latency by 30ms.

可以看到，由于开源时间不长，大部分的使用场景仍然在蚂蚁集团内，但这就是实情，而且本身技术场景是多样的。我们没必要编造说因为钉钉群有好几千人，所以或许大概可能这里面对应的几百家企业也在尝试将 Fury 用在生产环境。也许这个逻辑听起来很离谱，但是真的有孵化草案一开始就像这样写的。

这里引出第二个问题，真诚意味着对项目当前的风险如实披露。

例如，Fury 项目开源不久，核心开发者确实只有两个人，而且都是在蚂蚁集团的员工。虽然有过提交的人有几十人，但是显然大家一看 commit 数，时间和内容就清楚怎么回事了。好在前期讨论捐赠的时候，项目引起了 Kvrocks PMC 成员刘明阳（@PragmaTwice）的注意，在提案审议时，项目有三个开发者做出了 non-trivial 的贡献。此外，我为项目找到的另一位导师 PJ Fanning 是 Jackson 的开发者，他也看好 Fury 并改进了 Scala 实现的一些小问题。我也看好 Fury 项目并做了一些微小的改进。最终 Fury 提案是这样表述其开发者团队的：

> Currently, Fury has only three core developers, but they are not homogenous: although Chaokun and Weipeng work at the same company, they know each other only due to their common interest in Fury. Mingyang Liu joined the Fury community recently, and he mainly contributed to C++ part of Fury.
> We don't have enough diversity for now. It's a risk, although we're optimistic about future developer diversity. Since Fury is open-source, we have attracted more than 20 developers to contribute. We will keep building community diversity following The Apache Way.

在早期商议的时候，其他导师对这一点也提出了担忧。我想到了 OpenDAL 捐赠时也只有 4 个初始成员，且他们都来自 DatafuseLabs 公司，所以我补充了一个评论来自己挑明这个风险和我的判断：

> tison's comment: Although only three initial committers are listed above, PJ (who contributes to Jackson also) and I, as mentors, would participate in the development. Also, another podling that I mentored, named OpenDAL, has four initial committers but so far invited nine (days before its tenth) committers and two PPMC members, done eight (now during its ninth) releases. From my experience with Fury's initial committers, I saw several shared characteristics with OpenDAL's members. So, I'd invest efforts to help this project grow within the ASF Incubator.

Hudi 项目到今天也有相当多样的参与者了。然而它起初也只是 Uber 内部的一个方案，在几个合作伙伴间有共享。这就类似蚂蚁集团开发的 Fury 在阿里巴巴集团和唯品会内也有一些采用。Hudi 是这样写关于同质化开发者的风险的：

> Currently, the lead developers for Hudi are from Uber. However, we have an active set of early contributors/collaborators from Shopify, DoubleVerify and Vungle, that we hope will increase the diversity going forward. Once again, a primary motivation for incubation is to facilitate this in the Apache way.

这里非常有趣的一句话是，加入 ASF 孵化器的动机之一就是为了发展一个多样的社群。

这体现了撰写孵化器提案的时候另一个常被误解的问题，那就是你并不是来证明说你的项目已经非常好，解决了所有的问题。如果这样，那还要孵化啥呢，直接作为顶级项目运作就好了（这并不是玩笑，实际上已有先例）。或许由于我们总是从一个成功走向另一个成功，我们很少能够坦率的展示项目目前面临的挑战，要么是好的，要么正在往好的方向发展。但是其实 IPMC 并不介意项目有些地方目前还并不跟 ASF 的文化理念和顶级项目的标准对齐，不真诚导致 IPMC 对项目产生信任危机，才是更大的风险。

## 两个主要段落：现状与风险

我第一次作为孵化项目的领路人，是在 OpenDAL 项目上。当时我误以为孵化提案应该是领路人负责起草的，只是需要项目团队支持补充一些信息。但是，当我实际开始试着写提案的时候，我就发现这个提案的定位就是项目团队的一个自我介绍和自我剖析的。

整个提案大致可以分为两到三个部分：

1. Abstract 和 Rationale 等前几部分是对项目本身的介绍，项目到底是干嘛的，用在什么场景，相比其他方案有什么差异。这个问题只有核心开发团队才能回答。Initial Goals 是项目捐赠的动机和捐赠后的初步工作，这个也只有核心团队心里才有答案。这部分可以算是简答题。
2. Current Status 和 Known Risks 也即现状和风险，是几个具体的问题，需要项目披露当前的社群状况和回答一些常见风险的挑战。这部分可以算是问答题。
3. 此外的内容可以算是填空题，包括源代码的地址，文档的地址，依赖项及其软件协议，捐赠后所需要的资源和初始团队的成员等等。

填空题写起来是比较标准的，简答题除了大规模加塞市场材料突显自己多么 NB 的问题以外通常也不会遇到什么问题，主要出现夸大、掩盖的地方，就是关于现状与风险的问答题。所以我会说它们是一份提案的主要段落。

现状披露分为以下几个方面：

* Meritocracy
* Community
* Core Developers
* Alignment

Alignment 比较简单，就是说一下跟其他 ASF 项目的联系，没有就不说了，通常没什么问题。是的，提案模板只是一个模板，如果没什么好说的，可以不写。

主要出问题的就是前三项，为了证明社群不只是捐赠方一家在参与，有很多人在用，草案里 Community 的 Core Developers 里凑数夸大的情况非常严重。关于 Meritocracy 就更整蛊了，很多时候项目开源不久或者就是一两家公司的员工在维护，雇佣关系决定提交权限，非要编出多么的开放，甚至为此把一些新来的 Contributor 临时提成 Committer 指着说这就是 Meritocracy 了。

实际上 Meritocracy 并不是多样性的意思，而是任人唯贤，对比的是仅由雇佣关系授予和回收权限的方式。把一个没做什么贡献的人提名成 Committer 反而是违反这一条的。

对 Meritocracy 的回答，其实只要表示出理解它是什么含义就行。当然如果确实已经按照这样在运行了，举出例子是最好的。

风险评估分为以下几个问题：

* Project Name
* Orphaned Products
* Inexperience with Open Source
* Length of Incubation
* Homogenous Developers
* Reliance on Salaried Developers
* Relationships with Other Apache Products
* A Excessive Fascination with the Apache Brand

如前所述，下意识的规避项目存在的问题，是不真诚的主要诱因。

**Project Name** 通常没什么问题，只要做好自检就行。如果要改名或者发现跟其他项目名称冲突，则最好在提案前就完成改名，避免提案对名称产生疑问。Ignite 和 Seatunnel 在捐赠前都改过名字，HoraeDB 也有相似的经历。这里如果没有说清楚改名的缘由，IPMC 评估时发现存在品牌问题，是会有比较大的挑战的。品牌和合规问题是 ASF 当中的红线。

展开说一下，Seatunnel 的原名 Waterdrop 已经被其他组织注册，为了避免品牌问题不得不改名。Ignite 原本是 GridGain 公司的一个项目，其名称 GridGain In-Memory Computing Platform 跟公司名相同，同时作为独立项目也过长。因此实际上 GridGain 可以认为是把 GridGain In-Memory Computing Platform 的核心代码，以 Ignite 的名字捐赠出来。

HoraeDB 情况和 Ignite 类型，是蚂蚁集团的 CeresDB 产品核心代码，用 HoraeDB 的名字捐赠给 ASF 孵化器。然而，由于技术上需要修改代码中对 ceres 文本做替换，我在指导项目撰写提案的时候使用了 rename 一次来表达这个操作。实际评议提案时，技术上的名称替换做了一小部分，rename 的用词导致某些 IPMC 成员对 CeresDB 和 HoraeDB 的关系产生了误会，由此引发了不必要的一系列争论。

**Orphaned Products** 主要可能的风险有两种，一个是个人开发者捐赠的项目，如果人数很少，一旦开发者转移兴趣，项目可能就死了。另一个是公司捐赠的项目，如果没有 solid 的用例，可能公司一转向，项目也就死了。

如果项目开发者足够多样，有很多用户从中获益，这自然没问题。但是如果人并不多，IPMC 就需要评估项目的定位和未来发展的可能性。例如 Fury 未来长出一个社群的风险并不高，替换逻辑也清晰，不会因为项目没有用而废弃。相反的例子是 Tuweni 作为 Java 作成的区块链工具，虽然也进入了孵化，但是很快就因为没什么人感兴趣，作者自己也觉得没指望而放弃。

如果是公司项目，很多时候公司项目总要打包票说未来可期大大的投入，所以在 IPMC 这关通常也不好挑战。但是对于导师们来说，就要评估这个项目到底有没有足够的高层支持和内外用例。因为公司改主意经常比个人开发者转移兴趣或 burnout 来的快，除非有什么外力牵引，否则项目组换方向或者原地解散，这项目就死定了。对于导师来说，投入帮助项目孵化和成长的努力也就打了水漂。

类似的例子比如 Hotonworks 的 Ambari 项目，在公司被 Cloudera 收购后，项目跟 CDH 冲突，也就停摆了。但是换个角度看，由于 Ambari 仍然有其价值，所以在归档一年后，又有人出来复活这个项目继续运作。可惜的是由于一些其他原因，这次复活后的运作也不顺利。

另一个例子是同样来自 Hotonworks 的 Livy 项目，由于类似的原因停摆。然而在其从孵化器中退休前，有的用户已经上船并在生产环境使用，所以他们自告奋勇来维护这个项目，至少保持能够修复 BUG 和安全漏洞的情况。

**Inexperience with Open Source** 这个也是经常容易不真诚的地方。

从我的经验来看，大部分想要进入孵化器的项目，往往在社群建设上还有很大的欠缺。如果一个项目已经建立起了完善的社群，例如 ApolloConfig 和 Nacos 这样的，它们很少会想到要捐赠给 ASF 谋求进一步发展。因此，如实披露项目成员在开源方面的经验即可。

反面例子是一些草案在披露是添油加醋故意夸大，说是有某个成员四五年前在某个知名不知名的开源项目里提交过补丁，这就算是不会 Inexperience with Open Source 了。这就像是在建立上放一个 fix typo 的 PR 链接，然后说自己深入参与开源项目开发一样。

**Length of Incubation** 标准答案是 2 个月进入孵化器，2 年内孵化毕业：

> Expect to enter incubation in two months and graduate in about two years.

这个在提案时基本不会被挑战，不过背后是孵化器运作的部分逻辑，即孵化项目是要奔着毕业去的，如果长时间不能毕业，可能会面临被要求退休的风险。历史上退休的孵化项目一共有 78 个，除了项目自己放弃以外，IPMC 会定期评估孵化时间过长的项目，并需要项目对风险做出回应。如果没有回应或确实状况很不健康，可能由 IPMC 出面将其退休。

**Homogenous Developers** 同质化开发者，即项目核心团队的多样性。这个在前面讨论真诚的时候已经介绍过很多。人的兴趣会转移，精力会消磨，公司的注意力转移得更快。如果项目本身不能凭借自己的价值吸引到足够多样的开发者，那么其失败的风险是极高的。

**Reliance on Salaried Developers** 这点跟同质化开发者有相似之处，不过其实并不一定是坏事。Flink 的开发如果不是拿钱，一个纯粹的志愿者是很难撑起社群的需要的。所以关于这个问题，我认为要么是不依赖，表达出项目核心团队对技术本身的追求和认同，要么是确实就是一直有钱雇佣开发者做这个项目，都没有问题。同样这里容易产生一些不真诚的地方，明明就是一群拿钱办事的人，编造出自己没钱也会做的谎言就显得很可笑。

HoraeDB 的提案里并没有回避这个问题：

> We acknowledge that most developers are supported by their employers to contribute to HoraeDB, which poses a significant risk. However, HoraeDB has already been extensively deployed within Ant Group, with no internal forked versions. The version available on GitHub is the actual production version used in practice. As a result, Ant Group can ensure long-term commitment. We believe that within this timeframe, we can attract more maintainers and developers from diverse backgrounds to address this risk.

作为对比，Fury 的作者独立开发这个项目两年多，他有底气说自己就是会做这项技术，而不只是因为被雇佣做这件事：

> Although Fury is created at work time in Ant Group, Chaokun and Weipeng contribute to Fury in their spare time. They love the process of building such a versatile framework and the value it brings to all users and organizations. They will continue to work on Fury even if they leave their current cooperation, and Mingyang Liu also contributes to Fury in his spare time. We plan to attract more committers to address this risk. 

**Relationships with Other Apache Products** 如实回复即可。

**A Excessive Fascination with the Apache Brand** 这个问题是整个提案模板里最容易被误会的一条，反应了我一开始说的撰写提案时最主要的两个问题，第一个是英语技能不熟练。

这个问题的意思是，项目是否只是“对 Apache 品牌的过度迷恋”而捐赠，而不是孵化器关注的按照 The Apache Way 建设社群。换句话说，是不是只想借 Apache 的品牌做营销。不少草案写作时不知为何理解成要表达对 Apache 品牌的认可，洋洋洒洒写了一堆说 Apache 品牌是如何如何的好，完全是背道而驰。

当然，你说想要捐赠到 ASF 的项目团队不认同 Apache 品牌，这也不可能。可以参考 Kvrocks 提案的写法：

> Although we expect that the Apache brand may help attract more contributors, our interest in starting this project is based on the factors mentioned in the fundamentals section. We are interested in joining ASF to increase our connections in the open-source world. Based on extensive collaboration, it is possible to build a community of developers and committers that live longer than the founder.

## 其他琐碎的问题

第一个，前面已经说过，这里再提出来强调，孵化器提供的模板只是个模板，不一定要完全按照它的格式来写，不知道写啥的可以留空或者询问领路人。

第二个，填空题的标准答案可以看 Fury 提案。一般来说需要三个邮件列表：

* private 用于讨论不适合公开的内容，例如安全问题的处理，涉及具体人的讨论，例如提名新 Committer 或某人行为不端等。
* dev 用于项目开发的讨论。以往还会有一个 users 来回答用户问题，但是现在大部分用户习惯开 Issue 或者 Discussion 聊，除非有明确需求，否则复用 dev 已经足够。
* commits 用于归档项目开发产生的信息。这个主要是 The Apache Way 约定所有开发活动都要在邮件列表上留痕，ASF 会维护邮件服务器和保存所有邮件，这保证 ASF 项目的所有信息资产不会依赖外部系统。

Git 仓库现在基本都是 GitHub 上的迁移，不过 ASF 实际上有自己的 GitBox 做同步来确保不依赖外部系统。

Issue Tracker 大部分新项目都用了 GitHub 的 Issue 功能，老项目很多还使用 ASF 自建的 JIRA 平台。同样这些活动会被同步到邮件列表上，确保信息保存不依赖外部系统。

Initial Committers 的人选要仔细，这个也是经常被挑战的问题之一。在这个问题上，倒是可以多考虑 Meritocracy 的问题，同时不要设置过高的门槛但也不要为了凑人数而把没有什么实质性参与的 Contributor 强行提上来。最后，小心不要把没有参加项目实际工作的公司老板安排进来，这个如果被公开挑战会很难回应，因为跟 ASF 的文化完全格格不入。

Sponsoring Entity 捐赠给孵化器就写孵化器，Sponsors 需要注意领路人（Champion）只负责项目进入孵化器的过程，所以如果他想要继续担任项目导师，在导师一栏里要重复提名。

最后一个，依赖项的协议要认真看，从别处抄来的源代码要保留原先的文件协议头信息。合规和品牌问题是 ASF 的红线，IPMC 里有些人会特别仔细的看这些问题的。关于 ASF 项目如何看待依赖项协议是否合规，可以参考[这份材料](https://www.apache.org/legal/resolved.html)。

注意有不符合 ASF 合规要求的依赖，只要写清楚了而且有后续修复方案，并不需要在进入孵化器前就一定解决。ASF 对孵化项目的 endorsement 其实是有限的，它会要求孵化项目发布时必须带 incuabting 字样和带有一份 DISCLAIMER 文件，来表示孵化项目并不一定完全符合 ASF 承诺的软件标准。

## 参考案例

* [Fury](https://cwiki.apache.org/confluence/display/INCUBATOR/Fury+Proposal)
* [HoraeDB](https://cwiki.apache.org/confluence/display/INCUBATOR/HoraeDB+Proposal)
* [Hudi](https://cwiki.apache.org/confluence/display/INCUBATOR/HudiProposal)
* [Ignite](https://cwiki.apache.org/confluence/display/INCUBATOR/IgniteProposal)
* [Kvrocks](https://cwiki.apache.org/confluence/display/INCUBATOR/KvrocksProposal)
* [OpenDAL](https://cwiki.apache.org/confluence/display/INCUBATOR/OpenDAL+Proposal)
* [Seata](https://cwiki.apache.org/confluence/display/INCUBATOR/Seata+Proposal)
* [StreamPark](https://cwiki.apache.org/confluence/display/INCUBATOR/StreamPark+Proposal)
