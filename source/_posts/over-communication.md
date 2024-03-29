---
title: 饱和沟通：开源社群的消息传递准则
date: 2022-08-21
tags:
    - 开源
    - 开源协同
    - 沟通
categories:
    - 夜天之书
---

分布式系统的开发者知道，不同于本地方法调用总是被执行，要么成功要么失败，分布式系统之间各个组件的远程调用还存在第三种可能，那就是超时。

从消息发送者的角度看来，超时意味着没有确认信息返回。但是当前调用对应的一系列操作到底是已经成功，只是回复丢失，还是其中某些失败某些成功，或者全部失败，甚至是请求本身没发出去，这些情况一概无法断言。

大部分开源社群是分布式组织，社群成员分布在不同的地域乃至不同的时区。相比于线下集中办公的组织而言，分布式组织与分布式系统一样存在着“超时”的挑战。

线下集中办公时，负责同一个工作项目的人经常会坐在一起，有什么事情转过头、走几步也就当面说清楚了。工作关系紧密的几个人往往会共享午餐时间，休息娱乐时间。这种面对面的合作带来的信任感和大小事情都能当面沟通的效率，是分布式组织很难直接做到的。

不过，无法效仿线下集中办公的方式直接面对面沟通，并不意味着开源社群这样的分布式组织的沟通效率就总是低下的。从我在开源社群数年的观察和实践来看，要想做到在开源社群这样的分布式组织当中高效地协同，确保事情在异步沟通和分布式合作的情形下仍然能够稳步前进，一个不可缺少的点就是饱和沟通（Overcommunicate）。

<!-- more -->

饱和沟通的重点落在“饱和”，这意味着沟通反馈必须是及时的，甚至会稍微超出必要的限度。

我刚进入到开发者社群关系的角色的时候，曾经被问过这样一个问题：为什么你能够在 Flink 社群持续参与，直到成为 Committer 呢。稍加思索过后，我给出了这样的答复：因为在 Flink 社群里，我的提问会有人回复，我的补丁会有人评审，这是一个能够得到反馈的社群，我喜欢这样的正反馈循环。

要想在开源社群建立起正反馈循环，关键在于沉默的参与者能否主动发声，相对少数的维护者能否给予必要的回复。

前不久，我在推特上看到[这样一条推文](https://twitter.com/Kontinuation/status/1560095182137094144)：

> 现实：
> 1. 提了 PR，经过了几轮 review，PR 的作者消失了，PR 就一直挂在那儿；
> 2. 提了 PR，经过了几轮 review，maintainer 不跟进了，PR 就一直挂在那儿；
> 3. 提了 PR，maintainer 根本没有任何反馈，PR 就一直挂在那儿。

这反映出开源社群当中沟通的缺失，已经成为众多参与者面临的共同问题。

我在《{% post_link effective-open-source-participant %}》当中提出，新成员首先要明确加入开源社群，跟社群建立起联系。

虽然刚开始的一段时间可能会感到无从下手，先观察其他成员讨论的内容和做法也不失为一个选择，但是很快你就应当试着加入到讨论当中，针对你不懂的问题大胆的提出自己的疑惑。绝大部分社群成员愿意解答其他人的问题，或者引导你到能够解决问题的地方。经过这样的几轮沟通，社群成员对你也能建立起基本的了解，你也知道什么问题应该在哪里求助。反之，如果像我在《高效参与开源的诀窍》所举的反例那样，闭门造车式地想要搞个大功能，而社群完全不知道你在做的工作，那么社群前进的过程中就有可能无意间破坏了你所做的功能设计的假设，使得费劲心力设计的大教堂图纸付诸东流。

Kvrocks 的参与者 @xiaobiaozhao 在今年六月份的时候提出可以用 [LuaJIT 替换 Lua](https://github.com/apache/incubator-kvrocks/pull/697) 实现更好的执行性能。在得到两位项目维护者的回复和鼓励以后，他拿出一个原型以供测试。最终经过近一个月四名 Reviewer 一共五十余条消息的讨论和建议以后，成功地以后向兼容的方式用上了 LuaJIT 依赖。这是 Redis 上游都没有办成的事情。

这个过程当中，所有参与者都及时地在 GitHub PR Review 这个平台上同步自己测试的结果和改动意见，对于自己拿不准的地方提出自己的问题和阶段性的想法。当补丁合并被其他问题阻塞住一度搁置的时候，一旦阻塞问题解决，也能有人想起来重提这个补丁让几名 reviewer 再次判断是否可以合并。

这就是开源协同非常典型的一种合作方式。愿意投入时间发起或推进某项工作的成员，积极地与其他相关成员沟通获取必要的信息，做出自己力所能及的贡献，并同步结果和请求进一步的反馈。

我在进行 [TiDB 测试迁移工作](https://github.com/pingcap/tidb/issues/26022)的过程中，会随时同步编码上的最佳实践以及与其他参与者协同的过程中得出的结论。这些结论在后续其他相关工作里被多次引用，迁移工作本身也被作为 tracking issue 管理工程的实践被其他项目所借鉴。在将近一年的过程中，tracking issue 和不少 subtask 都有我和其他社群成员的沟通，有些 issue 在估期和细节上的沟通甚至有些啰嗦，但是这种多次发送消息和确认的过程却实在地避免了不知道对方是否理解了自己意思的问题。

即使是在面对面的沟通当中，误会也时常发生。异步沟通的方式本来就缺少微表情和肢体语言的信息量，如果合作者对于相关信息的同步再三缄其口，假设其他人能够独立得出和自己一样的结论，那就是异想天开了。

当然，overcommunicate 一词也有两面性。如果饱和沟通超出了必要的限度，变成信息轰炸，对于所有参与者来说就成了一种负担和消耗。要想避免饱和沟通变成信息轰炸，可以从两个方面入手。

第一个，虽然饱和沟通要及时反馈进展和提出问题，但这并不等同于任何中间过程都要急火火地发布出来。由于异步协同天然的滞后性，阅读消息并发出回复的成本比起面对面沟通是要高出许多的。只有适当整合自己的观点，简明扼要地分点提出问题并说明期望的回复，才能减少接收者的阅读理解负担。

我在 Pulsar 社群[提议开启 Update Branch 按钮](https://lists.apache.org/thread/wjs4zzyz1dmchw75bsv6y4c6l5y7ftm0)以改善开发者体验的时候，就采用了这种方式。首先以一句话说明期望读者做的事情，表明是否支持这个提案，然后再有一个完整版本分点说明这个提案的背景、意义和可能存疑的方面。在信息爆炸的时代，大部分人都会先判断这件事情是否与自己有关，是否应该付出时间了解细节。这是 [TL;DR](https://en.wikipedia.org/wiki/TL;DR) 大行其道的原因，也是在饱和沟通时不得不顺应的环境。

第二个，饱和沟通绝不是 at 所有人或者随机找人搭话。参与社群一段时间后，你应该能够知道项目不同领域的大致划分。例如，谁是某个功能模块的专家，谁负责项目构建逻辑的维护，谁对 CI 的问题最清楚，谁是总体协调社群的领袖。如果你想让自己的提案得到回复，最好根据提案涉及的领域和决策的影响范围来确定干系人，把饱和沟通的策略应用在这些干系人上，而不是无差别地骚扰社群成员。

要想做到这一点，可以参考 [RACI 模型](https://en.wikipedia.org/wiki/Responsibility_assignment_matrix)来对当前工作及其干系人建模。RACI 模型把干系人分成四类：实际完成工作的责任人（Responsible）、参与投票的决策人（Accountable）、可以寻求帮助的领域专家（Consulted）和需要知悉这项工作正在发生的相关人员（Informed）。

例如，提出[拆分 Pulsar SQL 的提案](https://github.com/apache/pulsar/issues/17137)的过程中，我是实际完成工作的责任人。首先，我要密切联系的是参与投票的决策人，在 Pulsar 社群当中，这主要是关注整体模块演进的领袖，比如多次关注此事的 Matteo Merli 等。其次，我要尝试寻求帮助的是此前参与过相关工作的成员，尤其是向上游 Trino 社群提过 [Pulsar Plugin](https://github.com/trinodb/trino/pull/8020) 补丁的 Marvin 和补丁的 reviewer 们。最后，由于拆分方案涉及到打包和 CI 的变化，我需要在以 Pulsar Improvement Proposal (PIP) 的方式全社群可见的提出这个提案，知悉所有人。其中，我会专门跟当前 CI 的作者 Lari Hotari 打个招呼，并在修改打包内容的过程中发现有相关的提案，都告知他们有另一个和打包相关的提案正在进行。

例如，作为 Kvrocks 项目里替换 Lua 提案的决策人之一，首先我会跟其他决策人同步意见。其次我会关注责任人对进度的把握，目前是否有阻塞的环节。如果 review 过程中间遇到了我自己拿不准主意的内容，我会试着找领域专家提供意见。到了 Kvrocks 项目里要采用现代 C++ 风格改写现有代码的决策里，我会放缓这个决策的推进，确保主要的开发者都知悉代码风格取向的变化，充分表达自己观点以后再做决策。

如果作为 Consulted 或 Informed 的角色，则一般不需要你主动推动工作的进展，只需要提示可能存在的风险，说明清楚问题并响应提问即可。

开源运动几十年来，发展出了一套适合于开源社群这类分布式组织的一套协同工作方式。依靠开源协同的力量，开源共同体调动起全球范围内全行业的精英的积极性，一起开发高质量软件。越来越多的软件公司也试图借鉴开源协同的模式来提高软件开发的效率，越来越多的公司因为自己的业务依托于开源软件的发展而不得不了解开源协同的工作方式。

要想参与到开源协同当中来，就必须适应饱和沟通的工作方式，否则将始终游离于多样化的社群之外。要想学习开源协同的方式建设高效的分布式组织，实践饱和沟通的经验是一个很好的切入点。分布式组织独特的挑战，很大部分是由于地域和时区的隔阂带来的沟通难题，如果能以饱和沟通的经验在不同地域的成员之间建立起信任，保证工作不断地向前推进并且每个干系人都能被“饱和”覆盖到，那么解决其他组织管理问题，也将势如破竹。
