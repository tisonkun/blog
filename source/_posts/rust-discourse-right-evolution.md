---
title: Rust 社群何以走到今天？
date: 2023-11-14
tags:
    - Rust
    - 开源
    - 开源协同
    - 开源社群
categories:
    - 夜天之书
---

本文有些标题党，实际想讲的内容，是我从部分 Rust 曾经的核心开发者的自述当中，所发现的 Rust 项目社群开源协同模式发展至今的一些特点。

我会从这些自述发言的内容切入和展开，对比其他社群遇到相似挑战的状况和应对方式，讨论 Rust 项目社群在协同方式维度上走到今天的沿革。

<!-- more -->

## Graydon Hoare 的博文

说起 Rust 语言的核心成员，你会先想起谁？

不像 C# 之父 Anders Hejlsberg 和 Python 之父 Guido van Rossum 这样在很长一段时间里可以代表语言本身的人物，也不像 Brian Behlendorf 早期经常代表 Apache Web Server 项目发言，Rust 项目社群的一大特色就是不仅没有所谓的[终身的仁慈独裁者（BDFL）](https://en.wikipedia.org/wiki/Benevolent_dictator_for_life)，甚至很难找到一个有足够权威拍板的人。

这就是 Rust 社区协同模式发展成今天这样的一个核心影响因素。

Graydon Hoare 是 Rust 的第一作者，但是如果你不对 Rust 的历史感兴趣，在日常讨论 Rust 的对话中，你很难听到这个人的名字或者他的观点。这是为什么呢？

通过查看 Graydon 在 [Rust 仓库的提交记录](https://github.com/rust-lang/rust/graphs/contributors)，我们可以看到自 2014 年起，他就可以说不再参与 Rust 核心的开发了。

{% asset_img graydon-contribution.png %}

2014 年起，Graydon 的主要精力就投入在某区块链项目和 Swift 语言上：

{% asset_img graydon-contribution-swift.png "apple/swift" %}

{% asset_img graydon-contribution-swift-source-compat-suite.png "apple/swift-source-compat-suite" %}

不过，有趣的是，随着 Rust 在区块链领域越来越火，近一段时间 [Graydon 又开始写起了 Rust 代码](https://github.com/graydon)。

[Rust 1.0 的发布](https://blog.rust-lang.org/2015/05/15/Rust-1.0.html)要追溯到 2015 年，而此时 Graydon 早已从 Rust 的核心开发中离开。这其中的原因可以从 Garydon 今年发布的一篇博文[《我想要的 Rust 语言没有未来》](https://graydon2.dreamwidth.org/307291.html)中窥得端倪。

{% asset_img graydon-blog-no-future.png %}

文章讨论了 Garydon 在设计 Rust 之初和早期开发过程中对 Rust 的定位，以及他对 Rust 语言当前某些特性的锐评，其中包括他不喜欢的一系列语言特性：

* 跨 Crate 的内联和单态化；Garydon 引用了 Rust 另一位早期开发者 [@brson 关于 Rust 编译时间的评论](https://www.pingcap.com/blog/rust-compilation-model-calamity/)。
* 以库形式定义的容器、迭代器和智能指针；Garydon 希望这些都作为语法特性从而可以在编译器层面做更加极致的优化，这也是 Golang 的做法；
* 外部迭代器，Async/Await 语法，`&` 作为类型，以及显式的生命周期；这些都是如今 Rust 语言基石级别的设计，Garydon 有不同的看法。
* Lambda 表达式的环境捕获。
* Traits 的设计，不完全的 Existentials 实现；后者简单地说就是跟 dyn Trait 相关的一系列设计和实现的问题。
* 复杂的类型推导；这个评论可以参考[《对 Rust 语言的分析》](https://www.yinwang.org/blog-cn/2016/09/18/rust)中的“类型推导”一节。
* Nominal 类型；Garydon 喜欢 Golang 的 Structral 类型，这个问题跟 Traits 和 dyn Trait 的使用体验是相关的。
* 缺少反射的支持。
* 缺少错误处理系统；Garydon 喜欢 Swift 的错误处理方案。
* 缺少 quasiquotes 功能，缺少语言级别的大整数支持，缺少语言级别的十进制浮点数支持；这些功能现在部分由生态中的第三方库实现，例如 @dtolnay 的 [quote](https://docs.rs/quote/) 库实现了 quasiquotes 的能力，但是 Garydon 认为它应该是语言的一部分。
* 复杂的语法。
* 缺少尾调用的保证。

可以看到，Garydon 设计和期望中的 Rust 语言跟如今实际成长出来的 Rust 语言大相径庭：关于引用和生命周期的设计，关于 Traits 和类型系统的设计，关于性能和编程效率之间的取舍，Garydon 的思路都不同于 Rust 如今的主流思路。

Garydon 对上面这些异议都分享了他 argue 的历史，实际上，他在博文一开始就对他在 argue 中失败的情形做了分类：

1. 我计划或初步实现了 X 方案，其他人以高度的热情和坚持支持 Y 方案，包括利用舆论的影响力。最终，他们得到了自己想要的结果，而我失败了。
2. 我初步实现了 X 方案，其他人更喜欢 Y 方案并做出了原型。Y 方案很吸引人，于是大家转而投入 Y 方案的开发，而我们时间紧迫，没有重新审视 Y 方案的所有缺点。
3. 我初步实现了 X 方案，但是实际情况（通常是 LLVM 的限制）要求我们采用 Y 方案快速实现。我们暂时开发除了 Y 方案，然后同样由于时间紧迫，我们就一直将错就错的在 Y 方案上持续发展。
4. 我初步实现了 X 方案，但是实现得明显有问题。于是在正式发布前我们把它从语言核心中移出，免得开发者在错误的基础上构建软件。于是一个语言级别的功能没有实现，后来生态系统或许填补了这一空白，甚至或许有多个竞争者。

对号入座，上面的众多 Garydon 不满意的特性都能分类进这四项中来。Garydon 在介绍这些他不喜欢的特性时多次提到了“我输了”，甚至在关于尾调用的讨论中，他写到：

> 由于实现尾调用的计划和其他成员对“性能上胜过 C++ 语言”的目标有冲突，我最终被说服不要使用尾调用。于是，我写了一篇悲伤的帖子来表达我对这个结果的不满，这是这个话题中最令人悲伤的事情之一……如果我是“终身的仁慈独裁者”，我可能会让语言朝着保留尾调用的方向发展。早期的 Rust 有尾调用，但主要是 LLVM 的原因让我们放弃了这个功能，而对跟 C++ 在性能上比拼的执著，使得这个结论几乎永远不会被推翻。

这就是 Rust 项目社群不同于其他编程语言项目社群的一个重要特点：**它的作者不喜欢语言实际采用的许多核心设计，他没有妥协，也没有说服其他人，最终只能选择离开。**

开源世界里有没有作者后来离开的例子，或者朝着不同于最初目标发展的案例呢？其实是有的。

Python 的作者 Guido van Rossum 在前几年也开始输掉不少关于 Python 新语法的争论。终于在 2018 年，他精疲力竭地离开了。但是至少 Python 的几乎所有核心功能都是在他的领导下实现的，同时他也能够以 BDFL 的身份强推社群从 Python 2 迁移到 Python 3 上来，尽管他事后表示这样的事情再来一次他或许从一开始就不会做。而在 Rust 项目社群当中，你很难想象有人能够做出这种级别的 breaking changes 并让社群接受。

C# 的作者 Anders Hejlsberg 在开始搞 TypeScript 以后实际也不怎么参与 C# 的发展了，但是他奠定了 C# 的基础和核心设计，且 C# 总体由思路一致的微软研发团队主导开发，所以这没有带来什么重大的影响。

Apache Flink 的作者最近也去创业搞别的事情了，不过由于社群人丁兴旺，社群发展过程一直是开放讨论达成共识，在早期开发者离开后，现在的开发者持续维护没有什么问题。如果熟悉 Flink 的历史，你会发现起初 Flink 是一个跟 Spark 正面竞争的批处理引擎，是在 2014 年中 Gyula Fora 带着他的实习生在 Flink Runtime 的基础上把整个项目改造成了流计算框架。不同于 Rust 的是，Flink 的作者们愉快地接受了这个改造，并把 Flink 重新定位成带状态的流计算框架全力发展，最终走出了一条不同于 Spark 的竞争之路。

当然，除了作者离开的，还有坚守在原地且不断整合不同人的意见的。在这一点上，做得最出色的毫无疑问是 Linux 的 BDFL 林纳斯·托瓦兹。

《时代周刊》曾经评论到：

> 有些人生来就注定能领导几百万人，有些人生来就注定能写出翻天覆地的软件。但只有一个人两样都能做到，这就是林纳斯·托瓦兹。

其实，这样的例子在开源世界中实在是少之又少。跟 Graydon 一样离开项目的有没有呢？Redis 的作者或许可以算一个。即使 Redis 的基石是他奠定的，但是后来 RedisLabs 的很多发展明显跟他对 Redis 的期望是有很大出入的，他于是在 2020 年公开声明不在担任 Redis 的维护者。

## @withoutboats 的博文

Garydon Hoare 的博文分享了上古时期 Rust 团队的争论，而 @withoutboats 最近的几篇博文补充了许多 Rust “中世纪”的故事。

例如，上一节中 Garydon Hoare 不喜欢的外部迭代器，Async/Await 语法，`&` 作为类型，以及显式的生命周期这些特性，在 [Why Async Rust](https://mp.weixin.qq.com/s/u1Eod_7S0hExrQ3V5UJnXQ) 一文里 @withoutboats 是高度正面评价的。

那么，@withoutboats 是谁？

他是 Async Rust 的主要实现者之一，主导确定了 Async/Await 的语法，并实现了 Pin 和 Waker 等关键接口。

* [Parse async fn header](https://github.com/rust-lang/rust/commit/18ff7d091a07706b87c131bf3efc226993916f88)
* [Add Wake trait for safe construction of Wakers](https://github.com/rust-lang/rust/commit/06ede350c2f8369cc9f69d0d8e03f9bc497944a4)
* [Pin and Unpin in libcore](https://github.com/rust-lang/rust/commit/918ef671b04398560d8860363736ba120825e6fe)

可惜的是，由于一些 GitHub Commit 和账号关联的问题，我们并不能简单地列出他的所有贡献。不过，就算是所有的 Commits 都能正确显示，@withoutboats 从提交数上看仍然不能排到 Rust 哪怕前 100 的贡献者名单里，从 2020 年开始，@withoutboats 就没有在 Rust 语言相关仓库的新提交了。

如果我们看看 @withoutboats 文章中提到的另外两位 Async Rust 的核心开发者，情况会更加有趣。

{% asset_img aturon-contribution.png %}

Aaron Turon 从 2017 年开始就没有任何参与了。

{% asset_img alexcrichton-contribution.png %}

Alex Crichton 是非常重要的 Rust 核心开发者。除了 Async Rust 的开发以外，他是 [Cargo 项目的核心作者](https://github.com/rust-lang/cargo/graphs/contributors)，且以 [rust-lang-nursery](https://github.com/rust-lang-nursery) 为阵地，打造了一批 Rust 早期的关键生态。

然而，他从 2022 年起也慢慢淡出了 Rust 项目社群，投入到 wasmtime 项目的开发中去了。

当然，wasmtime 项目的核心也是以 Rust 语言编写的。Alex Crichton 的这一决定，其实有点像从 2018 年开始淡出了 Rust 项目社群，2019 年加入 PingCAP 开发 TiKV 项目的 Brian Anderson

{% asset_img brson-contribution.png %}

2021 年，Brian Anderson 从 PingCAP 离开，关注起区块链公司 Solana Labs 的项目，甚至最近还跟 Graydon Hoare 主持的 Rust 项目 [stellar/rs-soroban-env](https://github.com/stellar/rs-soroban-env) 有些合作，也是一种循环。

这个时候，我们再来看看 @withoutboats 对 Rust 语言演化建议的几篇博文，可能就会有不一样的感受：

* [Changing the rules of Rust](https://without.boats/blog/changing-the-rules-of-rust/)
* [Generic trait methods and new auto traits](https://without.boats/blog/generic-trait-methods-and-new-auto-traits/)
* [A four year plan for async Rust](https://without.boats/blog/a-four-year-plan/)

《大教堂与集市》第三篇《开垦心智层》里讨论了关于开源软件话语权的问题，里面提到话语权的两种来源：

1. 代码是你写的，于是你拥有代码的“所有权”，根据“责任背后是权力”的规则，你能够对如何演进这部分代码做定夺。
2. 争议的双方并没有明确的所有权，但是一方在整个项目中投入更多，也就是在整个项目中拥有更多的领土权，所以他作为资深者胜出。

书中提到，如果这两条规则不能解决，那么“则由项目领导人来决断”。

很显然，Rust 项目不怎么符合这些条件。如前所述，拥有 Async Rust 的代码“所有权”的人都已经离开，且很难说有什么明确的传承。“项目领导人”在 Rust 社群中可以认为并不存在，第一作者 Garydon Hoare 伤心地离开了项目，堪称继父的 Brian Anderson 也从 2017 年起投入到 Rust 写成的项目而非 Rust 语言本身。

如此，Rust 项目社群就进入了 @withoutboats 所观察到的现状：尽管用户对 Async Rust 的后续进展很不满意，尽管 Rust 语言对 Immoveable / Unforgetable / Undroppable 这些能够与编译器深度协作的基础类型的需求是清楚的，但是放眼整个 Rust 社群，对于已经确定要做的事情如何做，争论几乎总是无法收敛，而对于不确定要不要做的提案，尤其是核心假设的进化与兼容方案，更是在未来几年内都看不到达成一致的希望。

@withoutboats 在《关于 Async Rust 的四年计划》的最后一段无不担忧地分享了一个过往的失败经历：

> 对于那些不了解的人来说，有一个关于 Rust 中 await 运算符应该是前缀运算符（就像其他语言一样）还是后缀运算符（最终的选择）的大辩论。这引起了极大的争议，产生了超过 1000 条评论。事情的发展是，几乎所有语言团队的人都达成了运算符应该是后缀的共识，但我是唯一的反对者。此时，明显已经没有新的论点出现的可能性，也没有人会改变主意。我允许这种状态持续了几个月。我对自己的这个决定感到后悔。显然，除了我屈服于大多数人的意见外，没有其他的出路，然而我却没有第一时间这样做。我让情况不断恶化，越来越多的“社群反馈”重复着已经提出的相同观点，让每个人都筋疲力尽，尤其是我自己。
>
> 我从这个经历中学到的教训是：区分真正关键的因素和无关紧要的因素。如果你对某个问题固执己见，最好能够清楚地阐述为什么它很重要，并且它的重要性应该超过语法选择之间微小的差异。自那以后，我试图将这一点铭记在心，以改变我在技术问题上的参与方式。
>
> 我担心 Rust 项目从这个经验中得出了错误的教训。正如 [Graydon 在这篇文章中提到的](https://graydon2.dreamwidth.org/307105.html)，Rust 开发团队坚持只要有足够的构思和头脑风暴，就能找到每个争议的双赢解决方案，而不是接受有时必须做出艰难决策的事实。Rust 开发团队提出的解决这种无休止的争议所带来的 burn out 的方式，是转向内部讨论。设计决策现在主要以 Zulip 线程和 HackMD 文档等未索引的格式进行记录。在公开表达设计方面，主要是在相关开发者的个人博客上发布。如果你是一个开发团队以外的人，那么你几乎不可能理解 Rust 开发团队认为什么是优先事项，以及这些事项的当前状态如何。
>
> 我从未见过 Rust 项目与其社群的关系如此糟糕。社群当中存在着无价的知识，封闭自己不是解决方案。我希望看到项目成员重建与社群成员之间的相互信任和尊重的关系，而不是无视目前的敌对和不满的现状。对此，我要感谢那些在过去几个月中与我就设计问题进行交流的项目成员。

## Nick Cameron 的博文

对于 @withoutboats 在上一节的最后提出的问题，Nick Cameron 在今年早些时候有几篇文章做出了讨论，直接相关的是这篇[《关于开放式协作的一些想法》](https://www.ncameron.org/blog/some-thoughts-on-open-collaboration/)。

非常有趣，在我介绍 Rust 的历史沿革的时候，我大量引用了其核心参与者的博客，这可以看做是 @withoutboats 所提到的“在公开表达设计方面，主要是在相关开发者的个人博客上发布”的习俗对整个 Rust 项目社群工作方式的一个更深远的影响。

那么，Nick Cameron 又是谁？

{% asset_img nrc-contribution.png %}

他是 Rust 语言团队曾经的成员，Rust 曾经的核心开发者。跟 Brian Anderson 一样，他在 2019 年加入了 PingCAP 公司，并于 2021 年离开 PingCAP 加入 VS Code 团队做 Rust 语言集成。于是，他在 Rust 主仓库的参与也从 2019 年开始消失，只在做回 Rust 语言层面相关的工作后做了一点工作。可以说，他所写的代码，如今也进入到上一节里提到的困境中：他是作者，但是已经离开太久，且他并未找到明确的继任者，于是这些代码如今是无主的。他对相关代码的演进没有说一不二的话语权，其他人也没有。

其实，在 Rust 项目社群中对编译器或标准库还能有很强势话语权的人，我能想到的大概就是：

* 语言团队的领袖 Niko Matsakis
* 编译器团队的成员 Oli Scherer
* 发布团队的领袖和 Leadership Concil 的成员 Mark Rousskov

其他人就算是所谓 Leadership Concil 的成员或者是某个团队的领袖，从《开垦心智层》里提到的朴素的代码“所有权”的理解方式来看，也不一定是有说服力的。

说回 Nick Cameron 的博文，《关于开放式协作的一些想法》的核心是重申了 Rust RFC 流程的价值，并希望 Rust 在代码以外的治理流程里也坚持相同的开放原则和勇敢做出决定而不是征求所有人意见，这跟 @withoutboats 博文的观点是一致的。

实际上，Nick Cameron 在前两年年强力推进 Async Rust 的部分工作和 GAT 进入稳定版本。后者引起了巨大的争论，这同样让他精疲力竭，写下这两篇文章表达自己对这些争论的看法：

* [We need to talk about RFCs](https://www.ncameron.org/blog/the-problem-with-rfcs/)
* [Mini-post: the role of Rust's teams](https://www.ncameron.org/blog/mini-post-the-role-of-rusts-teams/)

在具体项目的开放式协作以外，Nick Cameron 的其他几篇博文揭示了 Rust 项目社群今日协同格局的另一个重要影响因素：Rust 基金会。

* [Rust Foundation in 2023-25](https://www.ncameron.org/blog/rust-foundation-in-2023-25/)
* [Follow-up to Foundation post](https://www.ncameron.org/blog/follow-up-to-foundation-post/)
* [Rust in 2023](https://www.ncameron.org/blog/rust-in-2023/)

## 评论

Rust 项目社群发展成今天的样子，其最核心影响因素，就是开发层面没有一个说一不二的领导人，或者一个团结的核心团队。

相信很多人还记得前两年 Rust Mod Team 集体辞职的事情，作为某种后续，实际上 Mod Team 批评的 Core Team 成员包括 Core Team 本身也都从 Rust 社群中消失了。

取代 Core Team 的是所谓的 [Leadership Council](https://blog.rust-lang.org/2023/06/20/introducing-leadership-council.html) 组织.该组织于今年六月份成立，起初每周有一次[会议](https://github.com/rust-lang/leadership-council/tree/main/minutes/sync-meeting)，现在减少到每个月有一次会议。讨论的内容主要关注治理、流程和标准问题。

这种情况是否经常发生呢？实际上它也不算罕见。

几乎可以称作 1:1 复刻的例子是 Perl 社群 2021 年的一个故事：致力于激进推动 Perl 发展的项目领袖 [Sawyer X](https://github.com/xsawyerx) 想要推动 Perl 7 版本的发布，结果被其他项目成员联手弹劾。最终项目夭折，他也[失望地离开了 Perl 语言团队](https://www.theregister.com/2021/04/13/perl_dev_quits/)。Perl 如今也是由一个叫 [Perl Steering Council](https://perldoc.perl.org/perlgov#The-Steering-Council) 组织管理。不过不同点是 PSC 尽管在语言发展上相对保守，但确实是领导语言开发的，且[工作内容全面公开](https://blogs.perl.org/users/psc/)。

作为补充，有心的读者可能已经发现上面列举的三位撰写跟 Rust 发展相关的博文的前核心开发者，如今并不在 Rust 的任何治理机构上。所以尽管没有那么激烈，但是他们的处境和 Sawyer X 是有某种相似之处的。

最后，Rust 项目社群的未来会如何发展呢？我想最有可能的结局，就是像 C 或者 C++ 那样，演化成由标准化委员会主导的语言项目。

实际上，这个新的 Leadership Council 做的一件重要的事情就是开始搞所谓的 [Rust 标准](https://github.com/rust-lang/rfcs/pull/3355)。

Rust 不像 C# 和 Golang 那样，语言本身就是某家公司的独占软件；也不像 Java 那样，虽然有 JCP 和委员会，但是 Oracle 以模块化提案为契机，奠定了自己几乎说一不二的地位；更不像 Ruby 或者 Elixir 这样的个人作者可以作为 BDFL 拍板。

Rust 基金会的成员就像 C++ 标准化委员会里的成员那样，哪个不是行业大鳄，哪个不是已经有或者打算有海量 Rust 生产代码。为了保护自己生产代码不被 Rust 演进制造出庞大的维护迁移成本，这些厂商势必要尽己所能的向 Rust 项目社群发挥自己的影响力。

由于 Rust 的第一作者和绝大多数早期核心作者已经长期离开项目社群，即使现在回来也不可能再建影响力。唯一有足够长时间和技术经验的 Niko Matsakis 又只关心语言技术发展，甚至 Leadership Council 的语言团队代表也让其他成员参与。这种情况下，Rust 项目社群的个人开发者，是不可能跟基金会里的企业有对等的话语权的。

实际上，如果 Rust 真能发展到 C++ 那样的状况，即使 C++ 有公认的第一作者 Bjarne Stroustrup 存在，他也无法在 C++ 委员会中强力推行自己的主张。

如果你对这样的未来感到好奇，推荐阅读 Bjarne Stroustrup 的论文 [Thriving in a Crowded and Changing World: C++ 2006–2020](https://www.stroustrup.com/hopl20main-p5-p-bfc9cd4--final.pdf) 的第三节 C++ 标准委员会。我预计是已有之事，后必再有。
