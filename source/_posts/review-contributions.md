---
title: Code Review 的方法
date: 2022-11-06
tags:
    - 软件工程
    - 开源协同
categories:
    - 夜天之书
---

开源社群可以通过开展广泛的开源协同来规模化开发软件的生产力。为了实现提升生产力的目标，一般而言需要解决两个阶段的问题：第一个阶段是如何找到适合的潜在开发者人群，吸引他们参与软件开发和社群建设；第二个阶段是社群的原始生产力上来以后，应对项目复杂度和沟通成本随人员规模平方级别增长的难题。

第一阶段的解决方案在《{% post_link value-creation %}》当中有过相关讨论，第二阶段的问题可以通过工作的模块化和 Review 质量的提升来解决。本文即聚焦在开源协同当中的 Code Review 应该秉承什么原则，做到什么程度，如何避免常见问题来展开。

<!-- more -->

## Code Review 的目的

[《大教堂与集市》](https://book.douban.com/subject/25881855/)中有一个著名的 Linus 定律，“只要眼睛多，bug 容易捉”。这从某种方面体现了 Code Review 的价值，即发现代码补丁和主干代码当中可能的缺陷，在合并之前或合并之后予以修复，以保证软件的质量。

不过，Code Review 的价值远不止于发现代码缺陷，它至少还有两个重要的功能：减缓软件代码的熵增和传播项目社群的知识。前者从评估改动的必要性，改动方式是否与项目风格保持一致，以及保证代码的测试覆盖和文档覆盖等为切入点；后者主要是在 Patch Author 和 Reviewer 的交流过程中，传递社群成员共识的技术判断和做事方式。

## Code Review 的内容

可以从开源社群常见的 Code Review 内容看出各个社群对 Code Review 的定位。

### 合理的动机

Code Review 的第一步并不是扎到代码里面去看写得对不对跟好不好，而是项目要不要做这个改动。

实际上，相当部分的参与者提交补丁之后迟迟未能得到 Reviewer 反馈的重要原因，就是决口不提为什么要做相关的改动，假设这一改动是社群共识。尤其是公司环境中被委派的工作，完成后想要将对应改动合并到上游，问及缘由只说是甲方或老板的需求，而不能从技术上或者广泛社群用户的角度上论证其价值，往往不会被上游社群所接受。

试想当你看到一个等待 review 的补丁，其中包含成百上千行改动，或者虽然只改了几行几十行但是意义不明，你还会花时间去思考其背后的深意吗？对于 Reviewer 来说，从整个项目的工程效率来看，遇到这种情况要么是直接不看了，要么是让补丁作者说明清楚动机和改动内容。只有判断这个补丁可能是有价值的，Reviewer 才可能分配时间仔细看具体的代码改动。

从另一个角度看，对于影响用户界面的改动，重大代码重构和功能提案，开源社群几乎总是要求提议者在提交代码补丁之前先撰写一个技术提案。Rust 是 [RFC](https://github.com/rust-lang/rfcs) 机制，Apache Flink 是 [FLIP](https://cwiki.apache.org/confluence/display/FLINK/Flink+Improvement+Proposals) 机制，Python 是 [PEP](https://peps.python.org/) 机制，诸如此类。

只有提案通过 Review 达成了一致，实现提案的代码补丁才有被 Review 的意义。提案本身不是代码，而是对要做的事情的动机的阐述和方案高度概括的设计。可以看到，Code Review 不是从代码本身开始做起的，而是先判断动机是否合理。

各个开源社群的实践中，[PostgreSQL: Reviewing a Patch](https://wiki.postgresql.org/wiki/Reviewing_a_Patch) 文档就有一个 `Do we want that?` 的问题评估必要性，[TiDB 开发者指南](https://pingcap.github.io/tidb-dev-guide/contribute-to-tidb/review-a-pr.html)里也提到了 `The pull request should resolve a real problem for TiDB users.` 即改动必须有意义。

### 符合描述的实现

对代码补丁的动机和整体修改方案达成一致后，Code Review 的下一个阶段也是其核心阶段，就是检验代码实现是否与此前达成的共识一致。

Reviewer 进行 Code Review 的真相是这样的：首先，Reviewer 认同补丁的意图是合理的，随后，Reviewer 会在心里有一个预期的实现，对比这个预期的实现和代码补丁的实现，通常会快速略过和预期相同的代码，针对和预期不符的改动给出 Review 意见。

典型的情况是补丁的改动遗漏了某些特殊条件的判断，在配置的某种排列组合不能正确工作，或者引入了新的问题。这些情况下 Reviewer 会指出问题，负责的 Reviewer 还会尽量给出复现方式、技术原理和可能的改动方案。

为此，Reviewer 需要拉取补丁到本地，结合开发工具分析新版本代码，实际运行测试，以及按照自己的设想做出改动后再测试，最终给出需要改动的 Review 意见。

关于代码补丁的修改与描述一致，[Flink 的 Review 指南](https://flink.apache.org/contributing/reviewing-prs.html)有一点提到：

> Does the Implementation Follow the Agreed Upon Overall Approach/Architecture? In this step, we check if a contribution folllows the agreed upon approach from the previous discussion in Jira or the mailing lists.

TiDB 开发者指南也提到：

> The pull request should implement what the author intends to do and fit well in the existing code base.

### 夸奖优质的贡献

在上面提到的这个比对预期实现和补丁实现的过程里，除了发现补丁实现的问题，为补丁查漏补缺，还有一种情况，是补丁作者提出了意料之外的好方案。

老到的 Reviewer 不吝惜称赞亮眼的改动，虽然新人 Reviewer 可能会误以为 Code Review 的主题就是给补丁挑错，但是其实吸纳高水平的补丁，点出补丁作者做得好的地方，对社群发展有重要意义。这不仅是社群共识和软件质量螺旋上升的必经之路，对于补丁作者而言，得到正面反馈也是非常重要的一份激励。

曾经有位 Hadoop 的参与者在提交完第一个补丁之后，由于实现简洁明了而得到 Reviewer 的热情称赞，他受到强烈的正反馈持续参与，最终成为 Hadoop PMC 成员，并在不同场合分享这段经历，也传承了这个理念将更多新人带到开源参与的正向循环里。

关于正向激励的部分，TiDB 开发者指南有这样一段描述：

> Offer sincere praise. Good reviewers focus not only on what is wrong with the code but also on good practices in the code. As a reviewer, you are recommended to offer your encouragement and appreciation to the authors for their good practices in the code. In terms of mentoring, telling the authors what they did is right is even more valuable than telling them what they did is wrong.

[Python 开发者指南](https://devguide.python.org/getting-started/pull-request-lifecycle/#reviewing)也有简短的一句：

> Comment on what is "good" about the pull request, not just the "bad". Doing so will make it easier for the PR author to find the good in your comments.

### 统一的代码风格

Code Review 的一大作用是减缓软件代码的熵增。

随着软件版本不断迭代，开发者们不断实现新的功能，引入新的抽象，就地修复代码缺陷。这些改动重重叠加，会把代码的复杂度也就是熵抬高到任何一个开发者都无法单独理解的程度。

控制代码复杂度的重要手段就是保持统一的代码风格。统一的代码风格能减少开发者入门的学习成本，跨越不同模块的理解成本，以及相互之间交流的沟通成本。

统一的代码风格，首要的一点就是功能实现的风格。

例如，几乎所有大型项目都会遇到不稳定测试的考验。这种不稳定性来到分布式系统领域，则主要是并发问题处理不当，尤其是没有统一的并发风格所导致的。

Apache Flink 的 Task Executor 进程在引入 Mailbox 设计重构之前，进程内的线程逻辑是犬牙交错的。开发者很难判断某个函数会在什么线程上下文当中被调用，也就不知道如何正确的在代码补丁中引用其他接口而不导致死锁。Apache Pulsar 的[并发风格](https://github.com/apache/pulsar/pull/18025#pullrequestreview-1139931823)更是八仙过海各显神通，而开发者也最终要为这份代码熵付出巨大精力事后熵减的[代价](https://github.com/apache/pulsar/projects/11)。

反观开发超过 15 年的 Apache ZooKeeper 虽然并发工具的使用涵盖了直接使用 Thread 到 Executor 框架再到 CompletableFuture 组合子，但是核心的服务端处理逻辑和客户端通信逻辑的并发模型一直保持了连贯的风格，其他的并发工具使用范围都是局部的，这才造就了十余年来挑战者众多但是 ZooKeeper 一直保持分布式共识系统重要选型考虑的地位。另一个例子，Apache SkyWalking 的线程模型是核心模块统一设计、控制和调度的，其他模块通过接口提交任务，而核心模块调度保证这些任务不会出现竞争条件。这样，Code Review 的时候只要关注核心模块的线程变动，同时限制其他模块自建并发模型的范围，就可以很好地规避并发问题。

统一的代码风格，还包括语言范式和特性一致的的取舍。

典型的多范式编程语言，例如 C++ 和 Scala 都需要项目的核心开发者确定语言支持的各个范式和覆盖相同功能的不同特性之间的取舍。否则，一个 Scala 项目里部分代码对外暴露命令式调用方法，另一部分采用函数式编程提供一系列功能函数和组合子，在两个模块的交界处的代码就很容易产生不必要的胶水代码和引入难以分析的缺陷。同样，一个 C++ 项目既有 C 风格的函数尤其是对字符串和指针的用例，又有叠床架屋的模板代码设计出来的高度抽象的功能模块，这对跨越这两部分代码调试问题的开发者，就会引入极高的学习成本和理解成本。

哪怕是特性相对正交，几乎只有一条路实现特定功能的语言来说，这个问题也是存在的。例如，业内评价为暴力美学 Golang 即使代码写的差，也都是整整齐齐的“垃圾”。尽管如此，它还是面临错误处理风格没有语言级别约束的问题。前者虽然大部分 Golang 代码都是通过多返回值同时返回可空的错误和可空的结果来实现的，但是在 TiDB 代码里也有把 error 指针当成传出参数放到函数参数列表的 C 风格代码。类似问题放到 Java 代码里，虽然 Java 宣扬面向对象编程的范式，几乎凡事都可以通过抽象接口、不同实现，调用方只要调接口就行来建模，但是面向对象的几十个设计模式之间的取舍，也是风格不一致的诱发因素。

这是因为，无论语言是怎么设计的，不同的范式是客观存在的。对于熟悉 C 风格代码的开发者来说，他会在编写所有语言代码的时候都复用 C 风格代码的知识，在新的环境下找到熟悉的开发体验。这是难以避免的。对于 Code Review 来说，至少要保持模块内风格一致，模块间调用约定清晰，关系密切或说紧密耦合的模块采用相同的风格，而对于模块内部的实现，则不用锱铢必较。

统一的代码风格，最后是相同的代码格式和惯例。

例如，模块代入的是否有序、什么顺序，注释的风格，空格的风格，换行的风格。新生代的语言大多自带代码格式化工具，例如 Rust 的 [rustfmt](https://github.com/rust-lang/rustfmt) 和 Golang 的 [gofmt](https://pkg.go.dev/cmd/gofmt) 等，甚至 Golang 将某些传统代码格式的偏好固定成编译器检察项，例如 if 后左花括号换行就报错。对于早前的编程语言，包括 C 和 Java 等等，也都有业内共识度较高的工具，对应的是 [clang-format](https://clang.llvm.org/docs/ClangFormat.html) 和 [checkstyle](https://checkstyle.sourceforge.io/) 或 [spotless](https://github.com/diffplug/spotless) 等。

对于开源社群的协同开发而言，重要的不是选择什么风格，而是有一个确定的风格。当然，由于代码风格不适应严重的甚至会导致生理不适，一般而言所选的风格至少是核心开发者的共识。有了确定的风格，再将代码格式化作为提交前的必要检察项，这样就能减少由于不同人偏好的代码风格不同，导致提交上来的代码补丁总是包含形成干扰的格式变更带来的 Review 负担，以及格式化过程中难以控制的重构冲动导致引入新的缺陷。

最后这点，在 TiDB 开发者指南中强调为代码补丁需要专注于一件事：

> Concentration. One pull request should only do one thing. No matter how small it is, the change does exactly one thing and gets it right. Don't mix other changes into it.

显然，实现功能同时格式化代码，这就是两件事。

TiDB 开发者指南对代码风格还有另一段独立的说明：

> Style. Code in the pull request should follow common programming style. For Go and Rust, there are built-in tools with the compiler toolchain. However, sometimes the existing code is inconsistent with the style guide, you should maintain consistency with the existing code or file a new issue to fix the existing code style first.

[Flink 的代码风格指南](https://flink.apache.org/contributing/code-style-and-quality-preamble.html)则包括了上面提到的所有三个方面。

### 关键路径的性能因素

在知道算法的情况下，人是能像机器一样解决特定问题的，甚至依靠人的直觉和并行思考能力人的解决方案会更具现实意义。程序相较于人的突出优势，就在于处理重复的工作，尤其是不会出错的重复处理底层逻辑，并且这种处理速度远远超出人的极限。因此，程序的性能几乎是每个开发者心中的圣杯，每每会被提出来考量。

不过，Code Review 当中关注性能的部分，主要是关键路径上的性能因素。所谓关键路径，就是从输入到输出经过的延时最长的逻辑路径。

对于业务代码和实用工具来说，只要代码核心流程各个步骤不要出现时间复杂度的回退，尤其是不要出现与输入成指数级别时间复杂度的代码，基本上不会有太大的性能问题。

对于基础软件来说，处理的对象大多是更加底层的概念，例如单条数据记录或单个字节。在这些环节上就算出现常数级别的重复，在输入数据量的放大下，最终的时间和空间开销都有可能有显著的回退。例如许多 Java 网络系统都会做缓冲区零拷贝优化，就是避免语言运行时默认将网络传输过来的字节从网卡拷贝到用户空间再拷贝到 Java 堆上。从复杂度的大 O 记法来看，这只是常数级别的差异，但是在网络数据量级的放大下，这就是整个系统性能显著的回退了。

关于性能的 Code Review 工作，分析时间和空间占用的时候，不仅要看大 O 记法下的量级，还要考虑实际参数的取值范围和常数，两者综合的结果才是生产环境的实际性能表现。而在分析性能之前，要先判断相关代码改动是否是性能敏感的路径，或者补丁作者声称做出改动是为了改善性能。一个衡量性能优化的常用手段是提供基准测试（Benchmark）结果，这可以类比功能型修复对应的防止回退的测试。

各个开源社群的实践中，类似 TiDB 和 PostgreSQL 等以性能取胜的数据处理系统往往都会在 Code Review 指南中着重点出考虑性能方面的问题。而对于其他性能并非主要特性的项目，这类共识则一般隐含在 Reviewer 的共享知识当中，或者对于特定的几个关键路径会有注释或文档说明需要特别关注性能问题。

### 测试和文档

最后一个 Code Review 常见的内容是测试和文档。

虽然最后才提及测试和文档，但是它们在实现时却很可能在功能代码之前。上面提到的动机描述和设计文档，就可以算作是文档的一部分；而测试驱动开发的模式，测试是先于功能代码编写，随后实现功能或修复缺陷以通过测试。

测试和文档单独讨论都是一个内涵丰富的主题，在 Code Review 的语境下一并提出，是因为测试和文档的角度都是功能代码的用户。文档主要说明了代码实现了什么功能，调用约定和返回值内容都是什么，进一步的文档会提供代码使用的样例。测试则是功能代码的第一个消费者，Reviewer 和其他阅读源码的开发者都应该掌握阅读测试来理解一个功能模块或者整个系统的意图的能力。

TiDB 开发者指南提到 Code Review 中需要关注测试和文档的以下方面：

> Tests. A pull request should be test covered, whether the tests are unit tests, integration tests, or end-to-end tests. Tests should be sufficient, correct and don't slow down the CI pipeline largely.
>
> Documentation. If a pull request changes how users build, test, interact with, or release code, you must check whether it also updates the related documentation such as READMEs and any generated reference docs. Similarly, if a pull request deletes or deprecates code, you must check whether or not the corresponding documentation should also be deleted.

值得一提的是，测试和文档并不是必要的，也不是越多越好。好的代码是明显没有错误的自解释的代码。只是把一眼看到函数名称，返回值和参数的类型和名称就能明白的内容写成文档其实是冗余的；测试显然正确的代码例如 Getter/Setter 也没有什么意义。

测试应该只检验模块的契约，也就是在不同类别的输入参数下，返回值和副作用是否符合预期。一个常见的测试误区是测试不属于当前模块的代码，尤其是测试外部依赖的逻辑。依赖模块的逻辑应该自己保证正确，下游只会在测试自身逻辑是发现上游不可靠，从而替换成新的实现或者向上游提交补丁，拉取新的版本。

## Code Review 的暗礁

虽然大部分开源社群只有小部分成员才有向主干提交代码的权限，但是大部分开源社群都是鼓励所有社群成员参与 Code Review 的。从新人 Reviewer 成长为老到的 Reviewer 的过程中，有一些常见的 Review 技能以外的认识误区。本节从 Review 的几个常被忽略的真相出发，讨论如何规避 Code Review 的暗礁

### Code Review 是一个交流的过程

Code Review 虽然有流程，但却不是无需人类活动参与的程序。软件工程没有银弹，同样也没有尽善尽美的代码补丁。程序设计几乎就是关于权衡（trade-off）的艺术，而 Code Review 就是 Patch Author 和 Reviewer 之间关于如何权衡的讨论。

不过，这种讨论又不是完全开放式的讨论。技术交流有一些行业或领域内的共识，正确性、性能报告和成规模的用户反馈实相对客观的。因此，Code Review 是一个技术事实和数据胜过主观感受和偏好的讨论过程。尽管 Reviewer 可能认为某个改动非常“脏”，但是在必要的性能权衡下，或者立即解决正确性问题的权衡下，没有更好的解法，也不应该出于个人主观判断否决提案。这是绝大多数社群都会要求的，给出 -1 的同时必须附带理由，否则 -1 无效。

此外，Code Review 的讨论是务实准确的。TiDB 开发者指南特别强调了这一点：

> Asking questions instead of making statements. The wording of the review comments is very important. To provide review comments that are constructive rather than critical, you can try asking questions rather than making statements.
>
> Provide additional details and context of your review process. Instead of simply "approving" the pull request. If your test the pull request, report the result and your test environment details. If you request changes, try to suggest how.

Python 开发者指南也提到，如果你在 Code Review 中检查了补丁确实具备什么功能，那么在 Approve 的时候也请带上相关信息，如果发现了问题，也尽量说明复现方式和环境。

其实这些原则贯穿开源社群的所有交流场景。把发现问题报告问题的原则放到已经合并的代码上，就成了 Issue Report 的原则；而把 Approve 的时候说明检查了什么内容，就变成了 Release Verification 的一个重要步骤。

最后，Code Review 通过交流传递知识。无论是补丁作者还是 Reviewer 提供了好的代码实例，还是交流过程中学习到了其他人分享的知识，都不要吝惜称赞。这种正反馈循环是开源协同长期运转的重要支柱。

### 开源社群的 Reviewer 都是志愿者

当然，Reviewer 有可能是因为受雇于某家公司才参与社群帮助 Review 的。但是这不妨碍从社群视角来看，开源社群的 Reviewer 都是志愿者。毕竟，如果你跟某个特定的 Reviewer 不在同一家公司，他对你而言是不是一个十足的志愿者呢？

Python 开发者指南中关于 Reviewing 的第一段话就是：

> To begin with, please be patient! There are many more people submitting pull requests than there are people capable of reviewing your pull request. Getting your pull request reviewed requires a reviewer to have the spare time and motivation to look at your pull request (we cannot force anyone to review pull requests and no one is employed to look at pull requests).

所以，开源协同当中的 Code Review 以天或周为单位沟通合并是常有的事。为了提高自己在开源社群当中的效率，你不能死等在一个 Code Review 的反馈上，而应该尝试同时进行多个工作，哪一个给出反馈就调度上来再给一个回复。也就是说，开发者在开源协同当中像是一个并发的处理器。

从 Reviewer 的角度来看，你不是社群的雇员，更不是社群的奴隶。为了保持长久的参与热情和个人精神健康，认识到你是社群当中的一个志愿者至关重要：**你不欠社群什么，社群也不欠你什么**。当然，为了社群茁壮成长，掌握上面所有 Code Review 的方法，高效的完成 Code Review 也是社群生产力规模化的核心源动力。

### Approve 意味着同意合并代码补丁

对于一个增长的社群来说，Code Review 是严格把关代码质量的一个重要环节。同时，通过 Code Review 向社群新成员传递的正确理念，将会极大提升他们后续参与的积极性和质量。

然而，如果 Code Review 标准太低，甚至出现为了某些 KPI 而选择先合并低质量代码再修复的策略，不仅损害了当下的代码质量，也会传递出一种类似破窗效应的信号，让其他社群成员误以为这个社群对待软件生产的标准就到这了。

[Rust 标准库的开发者文档](https://std-dev-guide.rust-lang.org/reviewing.html)一开始就强调了 Approve 的意义和严肃性：

> You are always welcome to review any PR, regardless of who it is assigned to. However, do not approve PRs unless:
>   * You are confident that nobody else wants to review it first. If you think someone else on the team would be a better person to review it, feel free to reassign it to them.
>   * You are confident in that part of the code.
>   * You are confident it will not cause any breakage or regress performance.
>   * It does not change the public API, including any stable promises we make in documentation, unless there's a finished FCP for the change.

这其中，由于 Maintainer 有提交代码到主干的权限，他们的 Approve 会更加关键。实际上，这是一个选择 Maintainer 的标准。以 Apache 的权限模型为例：

> For the committer bar, I always think of whether the candidate is easy to work with - make decisions with caution while bravely, knowing when to ask for help.
>
> For too many new committers, it hurts when their contributions always need revision, especially trivial mistakes. If we elect a new committer while his/her contribution needs more attention to avoid merging wrongly quickly, we lose the reason to invite the very person.
>
> Apache doesn't set up fine-grained permissions so it's extremely important _not_ to approve something you're unsure with.

当然，随着项目固有复杂性的增长，很可能任何单独一个 Reviewer 都不敢确定是否应该合并一个相对复杂的补丁。

面对这种情况，如果补丁是由多个连续的步骤，或者相互独立的几个部分组成的，可以让补丁作者拆分成多个提交。

如果确实不好拆分，则可以由多名 Reviewer 各自 Review 一部分，然后由经验丰富的一位整合 Review 意见。Flink 的 Review 指南的第三点提到：

> Does the Contribution Need Attention from some Specific Committers and Is There Time Commitment from These Committers? Some changes require attention and approval from specific committers. For example, changes in parts that are either very performance sensitive, or have a critical impact on distributed coordination and fault tolerance need input by a committer that is deeply familiar with the component.

侧面来看，这也强调了 Approve 的时候带上自己检验过的内容，明确自己 Approve 的是哪一部分的意义。
