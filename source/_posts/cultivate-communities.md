---
title: 《知识社群》书评
date: 2022-02-27
tags:
    - 开源
    - 开源社群
categories:
    - 大图书馆
---

时隔两年，以姜宁老师的分享为契机，我重读了[《知识社群》](https://book.douban.com/subject/35083568/)一书。结合这两年在开源社群方向的经验，我从中发现了不少极具实践价值的内容。

《知识社群》一书从知识社群的社会性出发，从知识社群的历史沿革，全球知识经济的发展进程，以及知识社群在知识时代的机遇三点立论，阐述了知识社群的时代价值。进一步地，本书介绍了知识社群的三个结构要素，划分了知识社群发展的五个阶段，归纳了知识社群培养的七个原则。本书对知识社群的定义如下。

> 知识社群是这样一群人，他们有共同的关注点、同样的问题或者对同一个话题的热情，通过在不断发展的基础上相互影响，深化某一领域的知识和专业技术。

<!-- more -->

## 领域、社群和实践

本书提出的知识社群三个结构要素分别是领域、社群和实践。

> 领域创造共同点和共同身份的感觉。一个明确的领域能够确定社群的目的以及它对成员和其他人的价值，从而说明社群的合理性。这样的一个领域可以鼓舞成员们做出贡献、积极参与，指导他们的学习，使他们的行动具有意义。了解领域的范围和最前沿，使得成员们能够准确地决定哪些东西值得分享，怎样提出想法，追踪哪些活动，还使他们认识到试探性或不完整的想法的潜力。

规划一个新的开源社群，首要解决的就是核心开源软件的定位问题，也就是社群将关注在哪个技术领域。这个技术领域可以由一组用户需求，一个现有软件，或者一系列论文定义。

例如，Apache Kafka 一开始定位在解决日志存储和消费的业务问题上，Apache Flink 实现流式计算 API 后对标 Apache Storm 提出富有竞争力的有状态数据流计算定位，Apache Hadoop 则是对 GFS 和 MapReduce 论文的开源实现。

明确领域定位，才能降低开源社群成员交流的门槛。大部分的开源项目不是一个全新的问题，而是现有问题的解决或者现有方案的改良。因此，明确与现有概念之间的联系，才能够使得已经关注现有领域的人能够迅速理解新社群的领域定位，找到共同点和共同身份。不需要从头接触一个陌生的领域，而是对比与现有概念之间的联系和区别，就可以提出一系列的问题，也能理解什么问题是值得分享的。

例如，设计一门编程语言的时候，定位在静态类型或动态类型，就是完全不同的方向。相关领域的专家完全有可能分别拿 Haskell 和 Lisp 来比对概念上的差别，当前语言还没有实现的，尝试实现、模仿或者论证为什么不能实现。曾经对当前实现不满而因为种种原因无法落地的改进方案，抛出来与社群成员分享并争取在新项目当中实现。

领域的定位不是固定的问题，而是与社群一起演变的知识范围。领域的定位也不是抽象的兴趣，而是由社群共同经历的关键事件或问题组成的。

从现有概念延伸到新的知识社群的领域之后，社群存续下去而不是合并到现有社群的理由，就是自己的差异点。这些差异点不是一成不变的，随着不同人的加入可能发生很大的变化。例如，Apache Flink 一直在分布式计算引擎领域当中，但是在 14 年之前，它还是一个注重批处理负载的软件。直到两位开发者在 2014 年中的时候实现了 DataStream API 以后，才转向流式处理领域。例如，Perl 6 项目最初在设计上大量承袭了 Perl 的设计，并且很大程度受到那段时间的面向对象浪潮的影响。但是在 Pugs.hs 项目带来了 Haskell 社群的新鲜血液和函数式编程的思想以后，不少语言设计开始针对函数式编程的范式做出优化。而 Perl 6 的并发编程模型，则是在来自 Node.js 社群的强力开发者加入领导项目开发以后，利用 Node.js 所使用的 libuv 库搭建起来的。

可以看到，领域的问题都是非常具体的，能够围绕解决现有问题或改良现有方案分享知识和进行实践。领域的定位如果太过抽象，例如书中提到的“技术技巧”，那么社群就更像是一个兴趣小组甚至只是一组非常松散的圈子关系，因为围绕抽象议题提出的观点往往很难落到实处，也就很难激起社群成员的兴趣和创造价值。

> 社群创造学习的社会结构。一个强大的社群能培养互动精神，培养基于相互尊重与信任的关系。他鼓励人们分享想法，暴露自己的无知，提出困难的问题，并且仔细倾听，这是一种混合的气氛：人与人有着亲密的关系，同时又相互坦诚开放地提出和探讨问题。

社群对有效的知识结构非常关键。知识社群不仅仅是一个网站、一个知识库或者最佳实践集合，重要的是相互影响和共同学习，并在彼此之间建立联系的人。参与社群活动使社群成员形成归属感和相互的承诺。每个人分享对于某个领域共同的整体看法，而又在特定问题上带来个人的观点，这就创造了一种总和大于组成部分的社会学习结构。

虽然一个开源共同体可能为了推动软件的开发会建立相应的组织结构，但是在所有知识社群当中，知识的交换都是自由的，或者说去中心化的。Apache 软件基金会在 [The Apache Way](https://www.apache.org/theapacheway/index.html) 当中强调了它所构建的开源共同体是由平等的个体所构成的。

> Community of Peers: individuals participate at the ASF, not organizations. The ASF’s flat structure dictates that roles are equal irrespective of title, votes hold equal weight, and contributions are made on a volunteer basis (even if paid to work on Apache code). The Apache community is expected to treat each other with respect in adherence to our Code of Conduct. Domain expertise is appreciated; Benevolent Dictators For Life are disallowed.

书中提到，知识存在于人类认识事物的实践当中。它不是一种物质，不能像游戏当中双击使用书籍即可获得经验和智慧。只有通过社群的形式将关注到同一个领域上的个体聚拢起来，经过运营和管理有意识地促进知识的流动，才能促进知识的动态演进，并将知识带来的价值传达给每一个社群成员，最终使得社群成员所在的组织以及社群本身受益。

> 实践是社群成员分享的一套架构、想法、工具、信息、风格、语言、故事和文件。领域指出社群关注的主题，而实践是社群开发、分享和保持的特定知识。社群建立一段时间以后，成员们认为彼此应该已经掌握了社群的基本知识。大家分享共同的知识和资源，使得社群能够高效地处理领域内的问题。

知识社群不是魔法，它不能够直接将一个对领域一无所知的人转换成一个能够直接为社群创造核心价值的人。但是，社群可以通过实践的分享，将最佳实践总结成文档，在社群成员当中建立如何基于情景判断的共识，来提高知识社群交换知识、创造知识的效率。通过分享实践，知识社群扩大了自己的影响力，并且建立了一个隐形的参与要求。在正式成员之间，最佳实践是众所周知的，因此沟通的效率也将显著地提高。

## 知识社群的发展阶段

本书在介绍知识社群的发展阶段之前，首先讨论了培养知识社群的七个原则，这些原则将会贯穿不同发展阶段的关注点。

1. 精心设计社群的演化历程
2. 在内部和外部的不同观点之间建立对话
3. 鼓励不同程度的参与
4. 既发展社群的公共空间，也发展社群的私人空间
5. 以价值为关注点
6. 组合熟悉和兴奋的感觉
7. 构建社群节奏

### 知识社群的潜在期

知识无处不在。当围绕着同一个领域的一群人开始交换知识和实践的时候，一个非正式的知识社群就形成了。从非正式的知识社群转变成为正式的知识社群，意味着它开始强化社群的三个关键要素。

* 关键的领域问题是定义领域的范围。
* 关键的社群问题是找到那些已经就这个主题形成网络的人，帮助他们想象网络的扩张和知识分享活动的增加会发挥怎样的价值。
* 关键的实践问题是识别共同的知识需要。

这三个问题的目的都是找到潜在的社群成员之间足够多的共同点，从而使得即将构建的知识社群能够创造足够凝聚成员的价值。{% post_link value-creation %}是知识社群的最终目的。社群依靠它提供给成员的价值来推动，社群成员需要看到他们的热情怎样转变成有用的东西。

另一方面，启动社群不是从头开始。如果社群能够为其他人创造价值，那么一定已经存在围绕社群关注的领域形成网络的人。告诉他们你的社群能够就他们关注的领域提供足够多的价值，他们的知识和见解也能够在其中转变为实践。以开源共同体的潜在参与者来说，很少有人能够拒绝这样的诱惑。前提是你的社群真的对他们关注的领域有足够优质的实践。

我在一份规划开源社群的草案当中列出的一个关键问题，就是明确社群期望某种形式的参与，并思考可能的参与者现在在哪。书中写到，启动一个知识社群，需要同时发现你可以在什么基础上组建，并想象这个基础的潜力能够把你带到哪里。如果忽视了目前已经形成的网络，那么社群将很难吸引到最有可能成为早期参与者的人。但是如果只是考虑目前的网络，就不能超越个人的限制而为社群引入新的看法。

对于一个新的开源社群来说，一个常见的问题就是对参与者有过于苛刻的预期，并且在预期被屡次打破以后反转成一种彻底的不信任。实际上，哪怕是最有热情的参与者，也需要在持续的价值创造中找到和社群发展的共同利益。尤其是对于一个公司内部的软件团队，考虑突破组织边界以开源社群的方式运作的时候，不同背景带来的信息差是不可避免的。

这一方面需要建立起对话的渠道，就像我在 [Open Discussion](https://mp.weixin.qq.com/s/gOcQpXtUPqr1Ti7Hkyr_RQ) 当中介绍的一样。另一方面，也需要认识到社群当中存在不同程度和不同类型的参与。

本书当中也采用了同心圆形式的社群引力模型，核心人员往往只占有 10% 左右，积极参与者也不过 20% 上下，剩下的七成左右的参与者，不会对社群的发展产生明显的促进。当然，这些比例和每个个体的行为是会动态流动的。社群的核心组对这样的情形应该有足够的预见性，避免对每个社群成员都予以核心成员的期望，或者按照市场营销的漏斗模型强迫每个成员选择向核心成员的“转化”或者离开。

这一阶段最重要的就是广泛的接触潜在成员和联系社群成员，通过人与人的联系和知识的交换以及实践的交流，定义出领域的范围、社群的主要意图和富有吸引力的切入点。如果社群能够度过这个阶段，往往能够发现潜在的社群协调员和思想领袖。

社群协调员会关注到社群新人的招募，会见潜在的成员，并联络核心成员以对齐社群对关键问题的认识和增强人际连接。思想领袖是社群关注的领域的专家，他们能够定义前沿问题，或者本身是具备丰富经验、德高望重的从业者。思想领袖的加入为社群提供了强有力的凝结核，试想 Ruby on Rails 的作者为 Ruby 社群带来了多少 web 开发者的参与。

书中分点罗列了这一阶段的典型工作计划，作为书评无法面面俱到的议论，但是仍然值得引用以作推荐。

* 决定社群的主要意图
* 定义领域，识别有吸引力的问题
* 证明行动的理由
* 识别潜在的协调员和思想领袖
* 会见潜在成员
* 联系社群成员
* 发展社群的初步设计

### 知识社群的接合期

> 如果一个社群能够把对现状的良好理解和对未来发展方向的构想结合起来，它就已经具备条件，可以向接合期转变了。

社群启动的时候，正如一家创业公司最初的商业计划，看起来往往是脆弱甚至站不住脚的。如果一个社群的领袖能够有信心地宣传社群的目标，介绍当前的情况，并说明如何从当前的情况逐步实现最终的目标，那么社群就可以开始举办各种活动和正式启动，扩大互相信任的社群成员的范围了。

* 关键的领域问题是建立在这个领域内分享知识的价值。
* 关键的社群问题是充分发展关系和信任，使成员们能够讨论实践中真正复杂的问题。
* 关键的实践问题是明确哪些知识应该分享和怎样分享。

信任在这一阶段极为重要，没有它，社群成员很难发现领域最重要的方面和社群真正的价值。虽然每个人都知道平等的交流，相互请教和寻求帮助能够提升自己和他人的知识水平，解决问题的成员也能积累自己的声誉和经验，但是缺乏信任的环境当中，大部分人会选择沉默或观望，而这种沉默和观望如果没有核心成员和积极的参与者以身作则破除不信任的印象，就会不断恶化，使得社群无法产生价值，进而失去由共同的目标的背景聚拢起来的早期成员。

建立信任，不仅仅是核心成员以身作则带来的形式上的安全感，还涉及到社群成员对社群目标的信任。前面提到，共同创造价值是所有社群的最终目的，不同社群只是在创造什么价值，以及如何创造价值上有所差异。如果不能在聚拢起早期成员之后，持续地回馈知识分享的价值和知识实践的价值，那么大部分参与者将会保持或者变成观望的状态，而不是付出足够的时间精力和热情投入到社群当中来。这也是我常说的开源参与者的思路是“谁赢他们帮谁”。

例如，《大教堂与集市》在总结 Linux 的成功经验的时候，就提到了 Linus 在早期开发的时候经常每天发布新的版本，新的版本当中包括了社群成员提交并被接受的补丁。这种直接回馈参与者，让他们看到自己的参与真的能够赢得回报，能够在社群当中建立起最朴素的信任关系。我在提及自己为什么参与 Perl 6 和 Apache Flink 这两个开源社群的时候，也强调了能够及时得到响应，解决自己的问题，并且提交的补丁能够被合并和发布，在社群当中看到我的努力帮到了更多的人，这种喜悦和认同感是联系社群成员的关键。

我和开源社群维护者交流的时候，一定会问的一个问题就是参与者为什么要进入你的社群，你能提供什么价值。尤其是作为一个知识社群，你在领域知识上的领先性体现在哪里？如果是一个自研项目开源的情况，往往项目的所有人都转过好几手，团队负责人只是接受命令开放源代码，那么他是很少考虑这个问题的。实际上，他本人可能都不太关注这个项目有什么用，为什么存在。

如果一个社群只是纯粹的复制别人做过的工作，那么顺着开源文化将会导向上游优先的结果。Apache 孵化器在接受项目的时候，就会衡量这个项目是否已经有同类已经存在，如果已经存在，那么加入这个社群，比起另起炉灶分裂是要更合理的。

> We prefer "Do NOT confuse users" because we accepted projects nearly doing the same thing. We always encourage more people could join together and build a more powerful project and community, rather than building several similar projects.

同样，书中对接合期提供了一个典型的工作计划。这个计划的假设更多是在公司组织当中发起一个知识社群。

* 向成员说明理由
* 启动社群
* 发起定期的社群活动
* 赋予社群协调员合法地位
* 在核心组成员之间建立联系
* 发现值得分享的想法、见解和实践
* 明智地整理文件
* 识别提供价值的机会
* 经理的介入

### 培育和维持知识社群

书中还介绍了知识社群的在启动和实现正常运转以后，走向成熟和管理的后续阶段。限于一篇书评能够关注到的重点有限，这里不做展开论述，只做重点罗列，以期能够激起各位阅读原版的兴趣。

成熟期的关键问题

* 关键的领域问题是定义在组织中的角色以及与其他领域的关系。
* 关键的社群问题是管理社群的边界，因为这时的社群已经不仅仅是从事同一职业的朋友网络。在定义新的、更广阔的边界时，社群必须保证不脱离自己的核心目的。
* 关键的实践问题不再是简单地分享想法和见解，而是认真地组织和管理社群知识。随着社群形成更强的自我意识，核心成员开始认识到真正的前沿知识和知识社群的差距，感到需要更系统地定义社群的核心实践。

管理期的关键问题

* 关键的领域问题是保持领域的合理性，在组织中发出自己的声音。
* 关键的社群问题是保持有活力、吸引人的风格和关注点。
* 关键的实践问题是保持前沿地位。

《知识社群》一书立论的基础跟开源共同体还是有所不同，它主要关注到企业应该如何发起、维持和培养知识社群，并从知识社群的蓬勃发展中受益。当然，相当一部分开源共同体也遵循这样的模式，由企业当中的最佳实践出发，以开放源代码和开源协同的方式跨越组织边界交流知识和实践以解决领域当中实际的问题。

本文主要的关注点还是在于社群本身的健康发展，原文关于如何将社群的价值和组织的价值结合起来，有更加详细的分点讨论。简而言之，就是社群作为一个独立的结构，如何找到它与公司组织利益的共同点，是它能够获取资源和赢得员工信任的关键。而如何找到社群发展与个人发展的共同点，则是持续吸引参与者的关键。

其中对于企业组织的价值，我在过去几天有过一段论述：

开源运营，对于企业来说有两个主要目的，一个是技术品牌的建立，一个以开源协同的方式打造成为行业标准的软件。这两个做好了，技术公司的技术知识优势，人才吸引力和留存率，还有成为标准以后的赢家通吃的价值，就非常可观了。

最大的挑战是如何协调公司的利益和社群的利益，使得两者尽量互不冲突的往前去走，相互能够合作。这个能够达成好的结果的前提是各方能够坦诚沟通，所以需要一个渠道和真正的去沟通。至于沟通下来仍有冲突的各种情况，做好预案就行了。

现在的开源处于一个相对好的时代，MongoDB 和 Elastic 当初面临的那种激烈冲突不太可能再次发生了。当然最终能够守住自己的利益，还是依赖自己强大的实力，不管是技术实力、谈判能力，还是其他。

我现在感觉到最难找的是有技术能力，且认同开源理念的团队。有技术实力，才能够在运营的时候依靠正道的方法掌握主动权。否则所谓的“运营”，就会变成为了技术不足的团队“善后”社群的技术挑战，而采取排他垄断的一个部门。这样就跟开源的理念背道而驰了。
