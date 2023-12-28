---
title: 全票通过？同侪社群无须整齐划一
date: 2023-12-28
tags:
    - 开源
    - 开源社群
    - Apache
categories:
    - 夜天之书
---

近几年，国内开源项目捐赠到 Apache 软件基金会（ASF）的案例很有一些。几乎每个在进入孵化器和从孵化器当中毕业时发通稿的项目，都会选择在标题中加入“全票通过”的字样。

诚然，大部分项目在 ASF 孵化器中茁壮成长，实际上投票结果也是没有反对票，使用这一标题无可非议。然而，对于把同侪社群（Community of Peers）作为社群核心价值之一的 ASF 来说，追求全票通过并不是必须的。

在 ASF 孵化器当中，近些年来由于孵化器主席 Justin Mclean 个人风格的原因，许多项目遭受了无端的审查压力。我认为有必要在国内营造出人人都可以，甚至都应该“全票通过”的氛围时，阐明 ASF 同侪社群的理念和工作方式，以减少项目在面临不合理的挑战时遭受的挫败，尤其是当它来自于某个看起来权威的成员时。

<!-- more -->

## 理念与制度支撑

[The Apache Way](https://www.apache.org/theapacheway/) 当中即包括同侪社群的理念：

* ASF 的参与者是个人，而不是组织。ASF 的扁平结构决定了无论职位如何，角色都是平等的，投票权重相同，贡献是基于志愿的（即使有人因为 Apache 代码的工作而获得报酬）。Apache 社区期望成员之间相互尊重，遵守我们的行为准则。我们欢迎领域专业知识，但不允许有终身仁慈独裁者。

也就是说，ASF 当中所有人在原则上都是平等的，所有的 PMC 成员在投票表决议案时具有相同的权重。

进一步地，[ASF 关于投票的专门文档](https://www.apache.org/foundation/voting.html)中写到：

* 对于流程问题的投票，遵循多数原则的常见格式：如果赞成票多于反对票，该问题被认为已通过，而不考虑赞同或反对的具体票数，即反对票不构成否决。
* 对于代码补丁的投票，反对票构成否决。为了避免否决权被滥用，投票人必须在行使否决权时提供技术理由，没有理由的否决是无效的，没有影响力。
* 对于[版本发布的投票](https://www.apache.org/legal/release-policy.html#release-approval)，要通过至少需要三票有效赞同票，且有效赞同票多于有效反对票。反对票不构成否决。

实际操作中，行使技术否决时，如果其他 PMC member 不认同否决者提出的理由，否决也不成立。

因此，全票通过当然是一件值得开心的事情，但是 ASF 的运作方式并不要求需要全票通过。

## 面对反对意见

我在指导 ASF 孵化项目的过程中遇见过多次反对意见。

先看一个压力没那么大的。StreamPark 的孵化提案在提交表决时，最终是以 8 票有效赞成票，12 票其他赞成票，两票其他反对票通过的。

* [[DISCUSS] Incubating Proposal for StreamPark](https://lists.apache.org/thread/ns5n6ozl1mdvdbhmkfol67lt163m74v3)
* [[RESULT][VOTE] Accept StreamPark into the Apache Incubator](https://lists.apache.org/thread/cq35o6hfn9ynyth5klrddk330ks0nx5n)

两票反对票来自 Apache StreamPipes 的项目成员，他们没来由地觉得 StreamPark 跟他们的项目“很像”，所以不应该进入孵化器。

且不说 ASF 并不禁止定位相似的项目进入孵化器，例如复数个消息队列和功能相似的大数据软件，StreamPipes 定位是物联网的工具箱，而 StreamPark 是为流计算系统 Flink 打造的作业管理平台（现在也部分支持管理 Spark 作业）。

所以，这种反对意见，既不是有效票，更没有什么可靠的理由，忽略即可。

再看一个比较搞笑的。Doris 的[毕业提案](https://lists.apache.org/thread/9fwf8o8vkgfg8dg0p1nvtz8vy1x84jsv)在 2022 年 4 月 27 日以 12 票有效赞成票，13 票其他赞成票“全票通过”。但是孵化器主席 Justin Mclean 在 5 月 15 日找了一下存在感发了一个[反对意见](https://lists.apache.org/thread/23ry2zdzpgnr44qn3p34175ml2zox1c7)。

显然，时间已经过去了，而且赞成票远多于反对票，因此 Doris 毕业是既定事实。

## 面对傲慢的审查

既然是同侪社群，那么允许不同的意见存在就是合理甚至必要的。有人提出反对意见，有人行使投票权投有效反对票，这都是正常的。我在本文开篇所反对的，是通过投反对票带给项目无端压力的傲慢的审查。

上面 Justin 给到 Doris 连续的负面意见，虽然对毕业结果没有影响，但是实际上作为 Doris PMC 整体处理起来的负担并不小。Justin 不停地抛出各种链接，要求 PMC 对此做出解释，其中各种无厘头或者过分的要求层出不穷。

例如，他提到，搜索 Baidu Doris 或者 DorisDB 会出现可能模糊 Apache Doris 品牌的内容，这些内容都需要 Doris PMC 去处理解决。

这根本就是扯淡的。

今天，你主动搜索 Baidu Doris 或者 DorisDB 还是会有各种导向非 Apache 品牌的内容，难道 PMC 整天啥正事儿不干，就陪你做因特网警察？这还是在 Doris PMC 对当时的品牌侵占大户，如今的 StarRocks 有较大影响力，且 Doris PMC 中不少成员受雇投入时间解决这些问题的情况下。

另一个例子来自于几乎全员志愿者的 OpenDAL 项目。

* [[DISCUSS] Graduate Apache OpenDAL (incubating) as a TLP - Incubator](https://lists.apache.org/thread/3lwt4zkm1ovoskrz77y69pwntvn27xvs)

OpenDAL 自进入孵化器以来已近一年，在这段时间里，[OpenDAL](https://incubator.apache.org/projects/opendal.html) 提名了 9 位新 Committer 和 3 位新 PPMC 成员，发布了十几个版本，且分别由近十位 Release Manager 主导，不同语言的版本被多个下游软件所依赖。以任何开源社群的标准来看，这都是一个蓬勃发展且做出成绩的项目社群。OpenDAL 的作者 Xuanwo 信任 ASF 的社群发展理念，把 OpenDAL 捐赠到 ASF 当中，其本身就是对 ASF 品牌的认同。

那么好了，在上面链接对应的孵化毕业讨论中，OpenDAL 遭受了怎样的审查呢？

第一次回复，Justin 表示 OpenDAL 的一些引用最好改成 Apache OpenDAL 并带上商标标记，一些第三方的网站提到 OpenDAL 的时候也没有 Apache 的品牌。Xuanwo 看到以后及时的处理，甚至到第三方项目中提交 PR 将 OpenDAL 改成 Apache OpenDAL 的字样。

一般来说，到这里我们就可以认为 OpenDAL PMC 认真对待商标问题，尽力展现 Apache 商标，这已经很足够了。

足够吗？Justin 认为还不够呢。

Justin 进一步提出，按照 ASF 品牌政策的字面意思，所有 OpenDAL 网站的页面，都要用 "Apache OpenDAL" 来指称项目，而且都要带商标名称。最为离谱的是，这个要求连带要执行到 API 文档的每个页面上。

这个真的是保护 ASF 品牌吗？我要打个大大的问号。且不论 OpenDAL 的网站明晃晃的是在 opendal.apache.org 域名下的，根本就没有任何一个 ASF 项目，能够做到在所有网页和材料里都用 Apache ProjectName 指称项目，还要带上商标名称。还是那句话，PMC 整天啥正事儿不干，就陪你搞这些？

说到“任何一个 ASF 项目”，就不得不提 ASF 孵化器讨论里某些人的 360° 立体防御体系。其运作方式如下：

1. 顶级项目不能作为参考，原因不明反正就是不行。你说某个顶级项目也是如此，他们不会解释为什么顶级项目那么做是有问题的，甚至为什么很多顶级项目都没管这些破事，只会说顶级项目不能作为参考，其回答模式就像低水平 AI 一样。难道孵化器项目毕业，不是为了成为顶级项目？怎么顶级项目反而没这么多破事，到你这就有了？
2. 其他孵化项目不能作为参考，因为它们反正也没毕业，有问题是正常的。
3. 基金会以外的项目不能作为参考，因为我们是 ASF 孵化器，别人爱咋咋地。

你发现了吗？这样一套操作下来，一个孵化项目要 argue 自己的做法的时候，不能援引任何其他项目做参考，建设性讨论几乎无法进行。

不能参考其他项目，那怎么界定合理性呢？那就要回到 ASF Policy 及其解释了。

例如，Justin 援引 ASF 品牌政策和自己写的 Incubator Distribution Guideline 说，政策规定项目正式名称是 Apache ProjectName，所以你的 NPM 包名应该是 `apache-projectname`，PyPI 包名应该是 `apache-projectname`。下面一众项目发出问号：

* https://www.npmjs.com/package/echarts
* https://www.npmjs.com/package/openwhisk
* https://www.npmjs.com/package/@apachedubbo/dubbo
* https://www.npmjs.com/package/thrift
* https://www.npmjs.com/package/skywalking-client-js
* https://pypi.org/project/avro/
* https://pypi.org/project/datafusion/
* https://pypi.org/project/pyarrow/
* https://pypi.org/project/pyspark/

哦对了，其他项目不能被引用论述。这下无敌了。

哦，也不一定。比如 Justin 自己要证明说这个包名用 `apache-` 前缀是合理的时候，[他就可以说](https://lists.apache.org/thread/f126pro3dsmq0t5l3o98mgky21lkjlcn)：

> This is no different to any project that comes to the ASF via the incubator. Many of them need to change names, often before joining the incubator, and all need to change their name to be in the form "Apache Foo".

这又可以了。

双标。

当然，没有 ASF Policy 支持，Justin 也可以创造出一些村规来审查你。

例如，Justin 表示 opendal.databend.rs 被重定向到 opendal.apache.org 上，那么 OpenDAL PMC 就要能控制 opendal.databend.rs 这个域名。

哈？所幸 databend.rs 是捐赠 OpenDAL 的企业 DatafuseLabs 控制的，这件事情可能还没那么离谱。换个思路，任何人今天就可以搞定 opendal.vercel.app 重定向到 opendal.apache.org 上，其他服务只要想找肯定能找到，是不是 OpenDAL PMC 还得买下 Vercel 啊？

不过我依稀记得 Justin 自己 mentor 的项目 Answer 也有过 answer.dev 的旧域名吧？这个怎么说呢？

[Answer 域名的问题](https://lists.apache.org/thread/sj5nv4bhxl3xrm8yp01fkkrl1rkk3w8b)还是我提出来的，我也是 Answer 的导师之一。在这里，Justin 明确说：

> redirection would be best

这又可以了。

双标。

再来看另一个莫名其妙的审查。

上面说到要用 Apache OpenDAL™ 来指称项目的事情，OpenDAL PMC 觉得也不无道理，一些显著的引用改改也行的。于是 Python API [文档的首页](https://opendal.apache.org/docs/python/opendal.html)就用 Apache OpenDAL™ 来指称了：

{% asset_img opendal-python-apidocs.png %}

Justin 说这不行，你第一个 opendal 是包名，没有 Apache 字样。所幸我强忍恶心，耐心问了下商标团队的成员这个问题。商标团队的成员是个正常人，曰：“如果工具限制就是这样的，那也没事”。我补了一刀，说你非要说那 PMC 高低得自己做个 API 文档工具来解决合规问题。

当然，只有这个怎么够呢？这首页行了，没说其他页不行啊。pdoc 生成页面是按 Python 模块生成的，Justin 找来一个[模块的文档页](https://opendal.apache.org/docs/python/opendal/layers.html)，指着说：你看，没有 Apache，不行。

{% asset_img opendal-python-apidocs-layer.png %}

真要较真，合着以后大家搞网站全别分页了，塞成一个大单页，就像 [Kafka 这样](https://kafka.apache.org/documentation/)：

{% asset_img kafka-single-page.png %}

合规只要做一次，岂不美哉？哦，Kafka 这个大单页也不符合 Policy 呢。

这种想要做事的人反而莫名其妙多了很多繁文缛节要搞，可不就是官僚主义么？

## 小结

开源社群存在的首要目的，包括 ASF 自己写的[第一愿景](https://www.apache.org/foundation/how-it-works/#what)，是支持开源开发者生产开源软件。

所谓的政策、指南、规则，其目的应该是保护社群成员免收意外风险侵扰。本身它们是一种非强制性的指引，有道理不遵循也是可以的，更不要说违反了就等同于违法。

我在 ASF 当中得到过很多人的帮助。OpenDAL 作为一个支持多语言的库，为 ASF 在很多发布方面的共识提供了讨论的基础。例如，在我和 Mark Thomas 以及 Drew Foulks 等人的合作下，OpenDAL 搞定了所有 ASF 流程以支持包括 Maven Central 在内多平台自动发布。

Justin 本人愿意花费大量的时间检查孵化项目的发版和提案，我个人对这一点本身是尊敬的。他实际上也指出过很多项目实际存在的合规或品牌问题，而且确实应该被合理的解决，包括上面一开始点出 OpenDAL 的品牌问题，OpenDAL PMC 是有可以改进的地方，也确实改进了。

但是，Justin 把 Policy 苛刻成一种对内进攻项目的武器，用一种非常令人头疼的语气攻击项目，实际上是对 ASF 品牌和孵化器更大的伤害。

此前，这种苛刻又傲慢的审查已经逼退了只有一个核心开发者的 ZipKin 项目：

* [[VOTE] Withdraw from the Apache Incubator](https://lists.apache.org/thread/h7nv1kx38c9fboojpocq3xv70251rmth)

OpenZipKin 本是监控领域的明星项目，它愿意进入 ASF 并宣传 The Apache Way 是对 ASF 品牌的巨大帮助。然而，在这封令人伤心的退出提案中，ZipKin 的主创 Adrian Cole 无不失望的写到：

> Process and policy ambiguity has been ever present and cost us a lot of time and energy.
> The incubator spends more energy on failing us than helping us.

这其实是一个早该被提起更高优先级的反馈，ASF 的孵化项目居然感觉到孵化器在促使它们失败而不是帮助它们成功。有了本文前面的介绍，你应该知道这是怎么一回事。

关于流程和政策的争论，我想引用 Rust 作者 Graydon Hoare 的博文 [Batten Down Fix Later](https://graydon2.dreamwidth.org/307105.html)

> 这里所谓的不专业或不健康的处理方式，我至少见过四种具体的形式：
> 
> 4. 通过花费时间争论消耗对手的精力。
>
> 离开阶段常常显得有点突然，因为其原因不透明，并且也有几种不同的形式，通常对应到上述处理的模式：
>
> 4. 由于精疲力竭或倦怠而退出。

毫无疑问，Justin 苛刻且傲慢的审查，就走在这个模式上。

OpenDAL 跟 ZipKin 相似，有一位明确的主创 Xuanwo。如果没有几位导师支持，就像 ZipKin 的 Adrian 一样独自面对这些东西，很难想象如何能够坚持下来。不止一次 OpenDAL PPMC 成员和项目导师对 Justin 的雷人言语表示“麻了”。Justin 本人近五年没怎么正式写过代码也让他的很多“意见”显得非常业余。

例如，要求更改发布平台上 OpenDAL 的 README 包括 Apache 商标，PMC 改完以后说下次发版就会更新。Justin 来了一句能不能不发版就更新 ... 你说呢？

当然，如标题所言，ASF 是一个同侪社群，孵化器和基金会并不会因为有一个特别苛刻而傲慢的人就不工作。但是 Justin 是孵化器主席，还是 ASF 董事会九人组的成员，身在基金会中的我即使知道这是同侪社群都会感觉到不可避免的压力，更不用说对此了解较少的其他开发者了。

## 附

真要说起来，Justin 的表达真像他自己那样较真的理解，并没有这么大的压力。

例如，在我挑战 NPM 和 PyPI 的包名到底要不要非得用 `apache-` 前缀后，他改口说 Guideline 都是 SHOULD 不是 MUST 所以有理由的话不用也行。但是又不死心的加了一条临时村规说这个要改也得在毕业提案前，提前跟 IPMC 商量。争论村规毫无意义，但我确实有心情，就说 IPMC 在每次发布的时候都会检查，这些内容都是公开的。毕业提案前，导师组都觉得没问题，怎么你不在导师组里，就得跟 IPMC 商量了？我看你在导师组的项目都不怎么商量啊。

再有一个例子是蚂蚁集团捐赠 CeresDB 核心代码的时候，出于保留商标的商业动机，用新名字 HoraeDB 捐赠核心代码。另一个 ASF 老玩家 Roman 都说这种 Dual Branding 很正常了，Justin 觉得不行。

* [[DISCUSS] HoraeDB proposal](https://lists.apache.org/thread/6vbhv4soxw45yf2w9l495ofdqr3029ll)

> "Daul branding" is nothing new, but recently, some entities have taken unfair advantage of this (including one you mentioned), and I feel the Incubator should take care that others do not also do this.

诛心言论，死了也证明不了自己只吃一碗粉。我就觉得你未来要 taken unfair advantage of this 了，你说你不是，我觉得你是。

> Why a company would be unwilling to give up that brand or trademark just because it may be convenient in the future is a concern.

为什么呢？商业行为，甚至都找不到 ASF Policy 来说这不行了，但我不喜欢，我觉得是个 concern，你就要给我解释。

HoraeDB 的提案，最后我就说不剩什么正经问题了，你的这些意见我都听到了，该说的都说了，我们投票表决。最终 HoraeDB 以 13 票有效赞成票，1 票其他赞成票“[全票通过](https://lists.apache.org/thread/pp17oy2fh737k2tpb1vplkkgw4s6nrx4)”。Justin 没有投票。蚂蚁集团的运营也好险能继续沿用“全票通过！”的标题。

最后复述一遍，我写这篇文章是为了阐明 ASF 同侪社群的理念和工作方式，以减少项目在面临不合理的挑战时遭受的挫败，尤其是当它来自于某个看起来权威的成员时。
