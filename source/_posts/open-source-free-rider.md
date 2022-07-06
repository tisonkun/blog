---
title: 开源世界当中到底存不存在“白嫖”？
date: 2022-07-05
tags:
    - 开源
    - 搭便车
    - 开源协同
categories:
    - 夜天之书
---

开源软件不是凭空出现的，开发开源软件是一项艰苦卓绝的工作。每个开源软件的背后少则有原作者一人的投入，多则协同了成千上万人组成的开源社群的共同努力。然而，开源软件的源代码总是免费可得，并且开源软件协议总是不限制用户的使用形式。

基于开源软件完成工作乃至搭建业务盈利的用户，并不总是参与软件开发的人，这种形似经济学中“搭便车”的行为，在国内被提及的时候总会被称为“白嫖”，以至于后者称为圈内的一个热词。那么，开源世界当中到底存不存在“白嫖”，不同角色眼中的“搭便车”行为到底是怎么样的？本文将对此做些讨论。

<!-- more -->

## 用户的“搭便车”行为

从经济学的角度上，“搭便车”行为意即不付成本而坐享他人之利。由于开源运动的精神就包括了制造出来的开源软件的源代码免费可得，并且不限制任何人将其用于任何用途，所以我们可以说，开源世界当中“搭便车”的行为是广泛存在的。

实际上，当我们编译一个 C 程序的时候，很可能我们就依赖了自由软件 [GCC](https://gcc.gnu.org/) 或开源软件 [Clang](https://clang.llvm.org/) 作为实现编译的编译器。大多数程序员都不曾直接参与过这两个编译器的开发，因此做过这样操作的人都可以算是这两个软件的“搭便车”者。

然而，自由软件运动发起的根本，就是 Richard M. Stallman 对软件自由的追求，即他认为软件开发应当像学术研究一样，其成果是公开透明并且允许其他人演绎的。开源运动方面，前面提到的“开源软件的源代码免费可得，并且不限制任何人将其用于任何用途”就是[开源定义](https://opensource.org/osd)的一部分，并且 Apache 基金会的元老级成员 [Ted Dunning](https://twitter.com/ted_dunning) 在纪录片 [Trillions and Trillions Served](https://www.youtube.com/watch?v=JUt2nb0mgwg) 当中也提到，当他不再纠结于其他人使用软件盈利，而是彻底使用开源软件协议授权自己开发的开源软件的使用以后，软件的生命力和他本人得到的反馈和声誉回报反而增强了。

也就是说，纯粹使用开源软件的用户，并不会挑战一个秉承自由软件精神或开源精神的开发者的认识。这样的“搭便车”行为在开发者选择对应的开源软件协议的时候就被视为做出了对应的承诺，这也意味着开发者应该谨慎[选择开源软件协议](https://mp.weixin.qq.com/s/6a5MsWcTn9PUAT4WJPhVcg)。

另一方面，Apache SkyWalking 的作者吴晟曾经说过，[“真正伤害开源的是开发者本身”](https://my.oschina.net/u/4489239/blog/5047833)。通过原文的描述和我走访若干开源软件的维护者得到的回应，以及自己作为开源软件的开发者的体会来看，当开发者痛斥用户的“搭便车”行为为“白嫖”的时候，往往指的是这样的一种情况：

> 一个是开发者，特别是中国的开发者认为，软件作者去帮助他人是天经地义的，因为整个软件是你写的，所以我来问你问题，你就应该有问必答。如果你不答，就认为你这个人摆架子。而不是考虑因为软件作者用了自己的时间提供服务，所以应该表示感谢。

简而言之，就是无偿使用了开源软件，却丝毫不尊重投入了巨大精力开发出开源软件的生产者们，反而认为这些生产者理所应当提供各种支持。

关于这个话题，我和吴晟在推特话题 [#开源逸闻](https://twitter.com/hashtag/开源逸闻)上抛出了不少例子。

其中我印象最深的是 Vue.js 作者的[尤雨溪拉黑挑衅者的案例](https://twitter.com/tison1096/status/1531212085933113344)。这个用户认为 Vue.js 的某个库用 TypeScript 写实在是太难懂的，于是抱怨难道作者不应该照顾纯 JavaScript 用户（言下之意，尤其是“我”）的心情吗？尤雨溪的回复堪称模板，也讲清楚了这种行为在维护者眼里的性质。这里做一个简单的翻译引用：

> 嘿，没有人强迫你用这个库，你也不需要为使用它付费。作为一个用户，你至少应该以一种互相尊重的态度进行有建设性的交流，但是你没有。源代码当中的复杂类型是为了给日常使用提供更好的提示，这是一个显而易见的折衷取舍。你把你自己在 TypeScript 上的挫败感发泄到库作者身上，而库作者却在免费地生产开源软件并试图为你提供帮助。你是一个典型的开源软件“搭便车”者，请你滚蛋并且再也不要使用这个库。
>
> P.S. 你已经被所有 vuejs 组织下的项目永久拉黑，请不要再试图回复。实际上，我相信你可以停止使用开源软件并且从头开始写所有东西，这会对你更好！

这个模板很快被其他的一些开源软件的维护者复用（笑）。当然，库本身仍然是开源软件，这个被拉黑的人仍然可以免费下载到源代码。但是从这个案例里我们可以看到开源软件作者最反感的“白嫖”行为，就是这种理所应当地索取。

吴晟在多年经营 SkyWalking 项目的过程当中也遇到了很多这类案例，

* [常见的开源用户的错误思路：把公司需求和定制化需求带到社区，期待社区花费人力时间解决。](https://twitter.com/wusheng1108/status/1540230384553558016)
* [这里提问者，典型的把开源开发和闭源的内部的功能性开发混淆了。他询问了一个开源社区开发者，不会遇到的场景。](https://twitter.com/wusheng1108/status/1539526352683945984)
* [宁可等待一周，反复的问一个问题，也不愿意把关键词放在官网搜索框中回车一下。](https://twitter.com/wusheng1108/status/1529001749679251456)

我也在邮件列表上看到过几个典型的案例。

一个是某公司的软件供应链审计人员“要求” ZooKeeper 说明自己软件的定位和不同版本使用风险，这是把 ZooKeeper 开源软件社群当成与自家公司签订了某种合同的软件提供商了。

另一个是 Flink 中文列表上，不止一名用户总会像上面吴晟见到的案例一样，把自己的本职工作的问题抛到邮件列表上，并心急如焚地等待别人的解答，一旦收不到回应，就会颇有些气急败坏地抱怨“这个问题没人解答吗？！”当然，在用户列表上抛出问题，这是软件用户的权利。但是 Apache 开源社群强调了每个社群成员都是志愿者，如果有人出于社群责任感、热心或者解答问题锻炼自己等等动机帮助你，这是值得感谢的。但是你本人才是领薪水做工作的那个员工，其他人没有义务回答你的本职工作带来的问题。或许你的老板很急，你也很急，但是你先别急，才有可能在社群的帮助下解决问题。

最后，我想提倡的一点是如果社群当中其他成员对你提供帮助，我个人希望听到的是感谢而不是“辛苦了”。因为我一不觉得辛苦，二不觉得这是个义务。我没有辛苦地为你做什么，你也不要以为我是在辛苦地为你做什么。至于我是在“非工作时间”或者你当地时间的凌晨回复，你也不要感到惊讶。不要以自己对这件事情的投入程度来揣测别人为什么要在你当地的这个时间做这件事情。很多情况下，他不是为你而做，而是出于前面提到的社群责任感、热心或者解答问题锻炼自己等等动机而采取行动。至于别人希望在什么时间做什么事情，也不需要你做评判，主观地觉得别人“辛苦”了。

行文至此也到一段落，原本准备写的“云厂商的‘搭便车’行为”和“开发者的‘搭便车’行为”两个主题就等日后再有动力的时候再写吧。