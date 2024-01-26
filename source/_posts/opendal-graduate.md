---
title: Apache OpenDAL 毕业随感
date: 2024-01-18
tags:
    - 开源
    - Apache
    - OpenDAL
categories:
    - 夜天之书
alias:
    # URL with typo leaked
    - /2024/01/18/opendal-graudate/
---

## Apache OpenDAL 简介

Apache OpenDAL 是一个以软件库形式提供的数据访问层。它允许用户通过统一的 API 简单且高效地访问不同存储服务上的数据。你可以把它当作是一个更好的 S3 SDK 实现，也可以通过统一的 OpenDAL API 来简化配置访问不同的数据存储服务的工作（例如 S3 / HDFS / GCS / AliyunOSS 等）。

OpenDAL 以库形式提供，因此使用 OpenDAL 无需部署额外的服务。OpenDAL 的核心代码用 Rust 写成，因此它原生的是一个 Rust 软件库。在项目孵化和成长的过程中，社群也开发出了 Java / Python / Node.js / C 等语言的绑定，以支持在其他语言程序中方便地集成 OpenDAL 的能力。

下图列举了 Apache OpenDAL 多语言实现的线上用户：

{% asset_img real-users.png %}

OpenDAL 核心的统一 API 设计，其使用方式如下：

```rust
async fn do_business() -> Result<()> {
    let mut builder = services::S3::default();
    builder.bucket("test");

    let op = Operator::new(builder)?
        .layer(LoggingLayer::default())
        .finish();

    // Write Data
    op.write("hello.txt", "Hello, World!").await?;
    // Read Data
    let bytes = op.read("hello.txt").await?;
    // Fetch Metadata
    let meta = op.stat("hello.txt").await?;
    // Delete Data
    op.delete("hello.txt").await?;

    Ok(())
}
```

可以看到，实际读写数据的 API 是经过精心设计的。用户想要访问存储在不同服务上的数据，只需修改 Operator 的配置构造，所有实际读写操作的代码都不用改动。

<!-- more -->

## Apache OpenDAL 孵化

OpenDAL 起初是 [@Xuanwo](https://xuanwo.io/about/) 在 DatafuseLabs 为 [Databend](https://databend.rs/) 项目开发数据访问层时创造的软件库。再往前追溯，Xuanwo 在青云工作时就开发过 BeyondStorage 这一目标相近的软件。不过，由于种种原因，[BeyondStorage 最终夭折了](https://xuanwo.io/en-us/2023/01-beyond-storage-why-we-failed/)。

不同于 BeyondStorage 遇到的挫折和经历的歧路，OpenDAL 在一个明确目标的指引下快速成长：

* 2021 年 12 月，Xuanwo 在 Databend 的代码库中开始开发后来作为 OpenDAL 核心代码的[数据访问层逻辑](https://github.com/datafuselabs/databend/pull/3575)。
* 2021 年 12 月，Xuanwo 同步开始起草 [OpenDAL 的定位和目标](https://github.com/datafuselabs/databend/discussions/3662)。
* 2022 年 2 月 14 日情人节，OpenDAL 的核心代码从 Databend 代码库中抽离，开始作为一个独立开源项目运作。

2022 年 8 月，Xuanwo 找到我讨论进入 ASF Incubator 孵化的可能性。彼时项目发展才大半年，几乎所有代码都是 Xuanwo 一个人开发的，也没有 Databend 之外的用户。我发给 Xuanwo 一份 ASF 孵化项目提案的模板并给出项目发展的一些建议，并告诉他如果能在用户增长上做一些工作，主动集成其他知名软件和打造示例场景，过程中发觉合作开发契机招徕开发者，年底应该项目就能成长到进孵化器标准的水平。

> 今天再次看到 OpenDAL 的提交历史，实际上这个时候 [GreptimeDB](https://github.com/GreptimeTeam/greptimedb/) 应该已经开始调研采用 OpenDAL 的方案。可以看到在 [v0.11.0](https://github.com/apache/opendal/releases/tag/v0.11.0) 和 [v0.11.4](https://github.com/apache/opendal/releases/tag/v0.11.4) 两个版本的发布里都有 GreptimeDB 的主创人员的参与贡献。

2023 年 1 月，春节前我正好跟 [Apache Kvrocks](https://kvrocks.apache.org/) 的成员讨论年后开始准备孵化毕业的事情，想起来之前跟 Xuanwo 交流过 OpenDAL 进入孵化器的意向，于是拉着 Xuanwo 一起起草了孵化提案，并在 2 月初开始[孵化讨论](https://lists.apache.org/thread/px7wjcjy3rd4s59d4d3ll1x6y11d240r)。

由于项目定位清楚，并且潜在地寄托了替代行将就木的 [Apache jclouds](https://jclouds.apache.org/) 项目的希望，孵化提案顺利地[“全票通过”](https://lists.apache.org/thread/h76wsb582xjdph6p430vjq3oq26502bc)。

> 这段时间的经历可以补充阅读这两篇博文：
>
> * [OpenDAL successfully entered Apache Incubator](https://opendal.apache.org/blog/opendal-entered-apache-incubator)
> * [2023-07: 一些里程碑](https://xuanwo.io/reports/2023-07/)

接下来的一年，Apache OpenDAL 孵化项目社群高速发展，在功能开发、版本发布和社群成长等各个方面全面取得可观的成绩：

{% asset_img incubation-status.png%}

上图所显示的是，孵化期间 OpenDAL 发展了 10 名新 Committer 和 3 名新 PPMC 成员，并有 8 名不同的 Release Manager 发布了 11 个符合 Apache 标准的版本。

上图未显示的是，孵化期间 OpenDAL 发起并实现了 23 个技术提案，处理了超过 1000 个问题报告，合并了 2000 多个代码补丁。

早在 2023 年 8 月，我就判断 OpenDAL 已经接近孵化毕业的标准。2023 年 10 月，在进行过一些沟通之后，项目导师之一吴晟将他发现的毕业前需要完成的工作列了一份[清单](https://github.com/apache/opendal/issues/3283)，正式开始推进毕业工作：

{% asset_img graduation-todos.png %}

这份清单上的工作对于 OpenDAL PPMC 来说并不全是简单易懂的，甚至有很多项内容颇有挑战。后面展开讨论 OpenDAL 毕业面临的挑战时，你将看到一些挑战解决起来是很有难度的。于是，在部分简单易懂的工作完成后，清单上的项目有四五周的时间没有任何推进。

2023 年 11 月底，我在准备发起两个新的孵化提案的同时，也决定同时推进 OpenDAL 毕业的工作，免得这些理论上可以一次性完成的工作越拖越久，反而日后需要彻底重新做一遍。

事后，我在跟 Xuanwo 的讨论中得知，这些事务性工作对于开发者来说还是有一定的门槛，看到很多个一眼不知道如何开始的工作项，下意识搁置是第一反应（俗称摆烂）。我作为项目导师，把这些颇具官僚主义色彩的事务性工作用通俗的语言向 PPMC 成员解释，并拆解成一些实际可执行的工作，才能推动项目往毕业的方向前进。

2023 年 12 月，OpenDAL 项目社群内部达成了[毕业共识](https://lists.apache.org/thread/kq00ynqtbbwsh2n7485s5vypzjropck6)。随后，毕业提案提交到 ASF Incubator 列表上讨论。经过一个月的激烈探讨和继续处理项目存在的问题，2024 年 1 月，项目成功通过[毕业投票](https://lists.apache.org/thread/nxd3218gdnylp8g2w7jhcjktorthjydl)并在 Board Meeting 上由董事会审核通过：**Apache OpenDAL 正式成为 ASF 的顶级项目**。

## PMC Member 的标准

ASF 词汇体系下，PMC Member 即项目管理委员会成员，大致上相当于开源项目的维护者。所有 PMC Member 都是 Committer 并且额外具有对项目发展议题投有效票（binding vote）的权力。

项目在 ASF Incubator 孵化期间也有项目管理委员会，称为 Podling 项目管理委员会（PPMC），其中 Podling 意即孵化中的项目。最初的 PPMC 通常由孵化提案中的 Initial Committers 组成。随后就是上文图中显式的走提名投票流程邀请新的 PPMC 成员。

项目毕业时，毕业提案需要说明最终形成的顶级项目的 PMC 由哪些人组成。通常，原先 PPMC 的成员包括项目导师会加入到顶级项目 PMC 中。此外，孵化阶段邀请的 Committer 也是潜在成为顶级项目 PMC 成员的候选。

> 万事皆有例外。比如 Apache Doris 毕业时，原先 PPMC 成员部分加入了现在的 StarRocks 公司，并且在孵化期间持续损害 Doris 的品牌。这些成员在毕业时就没有被包含在 PMC 中，甚至不是顶级项目的 Committer 了。

* [Have an agreement on the members of the PMC](https://lists.apache.org/thread/rzg7yb14cy2y3dw5twt7olgvy3whc814)

如同我在《{% post_link maintainer-criterions %}》中提到的，我倾向于给予做出贡献的社群成员更高的权限以减少他们参与的门槛，因此在发起 OpenDAL PMC 成员讨论时，我先抛出了一个极端的所有 PPMC 成员和 Committer 都加入 PMC 的提案。

这个提案遭到了 Xuanwo 和其他 PPMC 成员的挑战。他们认为因为“项目毕业”这个契机将 Committers 加入到 PMC 当中，这个说法是行不通的。

随后，项目导师吴晟回应说到 ASF 文化崇尚积极引入 Committers 和项目维护者，Committer 和 PMC Member 在代码权限上是相同的，只是 PMC Member 具有额外关注项目管理的责任，例如处理安全问题、响应 Board 的提问和要求、参与版本发布和投票决议等等。

在后续的讨论中，OpenDAL PPMC 成员表现出把 PMC Member 和 Committer 差别对待，以至于类似等级制度的表述。不过这更多的是一个表达和语境的差异，[我在推特上提到](https://twitter.com/tison1096/status/1730140534302498856)：

> 在国内的开源宣传和讨论语境下，确实经常会有一个升级甚至权限交易的 mindset 在。甚至有人就是说开源参与像打游戏一样打怪升级。不同流派和认识存在是很正常的，只是这确实不是 ASF 倡导的方式。

最后，OpenDAL 采取的做法是在包括 PPMC 的成员和项目导师的基础上，[询问所有 Committers 参与项目管理](https://lists.apache.org/thread/fzq7yzx4ty7f3vn3r8skby107vlzoy0h)成为 PMC Member 的意愿。如果 Committer 都不看邮件列表不回这个邮件，显然跟有意愿参与项目管理事务还是有一定距离的。最终有两位 Committer 回应了轮询，他们也在近期积极参与了项目发展的讨论和组织版本发布。

另一方面，在轮询以外，直到完成毕业流程的两个月间，OpenDAL 也按照以往的流程和标准提名了一位 PPMC 成员。最终毕业成为顶级项目的 Apache OpenDAL 共有 14 名 PMC 成员：初始 4 位，孵化期间提名 3 位，轮询增补 2 位，以及 5 名孵化导师。

从我个人的标准来看，至少愿意花时间做 Release Manager 或是作为项目某个模块的 [CODEOWNER](https://github.com/apache/opendal/blob/main/.github/CODEOWNERS) 的社群成员，都应该是 PMC 成员。按照这个标准看，PyO3 的核心开发者和 OpenDAL Python 绑定的原始作者 @messense 还不是 PMC 成员，这点应该再 Review 一下。

## 官方网站和文档

{% asset_img homepage.png %}

OpenDAL 的官方网站并不算非常“惊艳”。这一方面是由于核心开发者大多缺乏前端开发技能，另一方面也是作为一个被应用集成的软件库，OpenDAL 不需要独立部署服务，自然也就没有一个独立服务配套的管控页面相关的需求可以展示。大部分情况下，OpenDAL 的使用方式是在软件当中以代码的形式被调用。

在上面的首页信息展示中，可以看到 OpenDAL 主要设计了三个扩展点。

1. OpenDAL 的核心代码是 Rust 库，但是提供了多语言的绑定，从而可以在诸多语言写成的程序中调用。提供新语言的绑定是一个扩展点。
2. OpenDAL 的核心价值是屏蔽不同存储服务后端，从而使得用户可以用统一的 API 访问不同位置的数据。提供新的存储后端集成是一个扩展点。
3. OpenDAL 设计了 Layer 抽象，以在统一 API 的访问链路上提供不同切面的增强，包括重试、日志、监控、超时等功能。

{% asset_img docs.png %}

紧接着文档导航页几乎就展示了所有文档内容：OpenDAL 的设计理念，以及跳转到 QuickStart 页面的如何配置四个已经正式发布的语言的软件库。侧边栏的 Services 与其说是文档，不如说是已经支持的部分存储后端的参考手册。

{% asset_img community.png %}

相反，关于如何参与 OpenDAL 开发和作为 Committer 或 PMC Member 如何处理事务性工作的文档，由于有实际需要，是相对完整的。

其余页面，博客截至目前只发了四篇，且已经有小半年没有新发布。API 页面除了 Rust 文档，其他语言的 API 文档主要是参考手册性质的。Downloads 和 ASF 相关的页面主要是为了符合 ASF 的要求，对于项目本身基本没什么价值。

项目导师吴晟在毕业自检清单中提到了文档的问题，主要关注的是文档的版本化和避免露出未正式发布的软件库的临时文档。大体上，这是在以 [Apache SkyWalking 多语言集成和多模块功能文档](https://skywalking.apache.org/docs/)的标准给 OpenDAL 提建议。

OpenDAL PMC 成员之一 @suyanhanx 初步完成了[文档版本化的调研工作](https://github.com/apache/opendal/issues/3319)，但是没有彻底完成，也没有更新开发和发布文档以包括相关操作。

我认为，在文档上，OpenDAL 还是有很大的提升空间的。不过在做毕业检查时，我采用了以下的标准：

* 官网大致能用起来，谈到项目概念时引用链接要齐备。
* 至少需要让想用 OpenDAL 的人知道如何用起来，整个内容阅读路径是清楚的，就还算可以了。至于版本化的问题，OpenDAL 还没到 1.0 版本，可以先只提供 nightly 版本的文档，这也是目前用户实际的用法。

其实，关于 OpenDAL 的内核设计和各个服务后端的使用方式，Rust 核心实现中已经包括了[详细的版本化文档](https://opendal.apache.org/docs/rust/opendal/docs/index.html)。

我认为，OpenDAL 接下来的文档优化方向，除了继续完成所有语言的版本化发布以外，应该注重阐明概念的定义和常见的设计、使用模式，以及不同语言之间的翻译定式。在这一前提下，把实际的文档内容用引用链接导向 Rust 核心实现当中伴随代码的活文档，就可以把存在于 Rust API 文档中的完整文档给利用上。

{% asset_img rust-docs.png %}

用户实际的阅读路径，首先从设计、使用模式的文档中确定自己要到 Rust API 文档中查看哪部分模块的具体文档，了解相应的接口契约之后，对应自己使用的语言，查看不同语言直接接口翻译的定式，完成逻辑开发。

如果能做到这个程度，从软件产品角度说，OpenDAL 的产品力才算堪堪能打。

## 多语言软件库的开发与合规

如前所述，OpenDAL 的一大特色就是在 Rust 核心软件库的基础上，提供了不同语言的绑定，以支持在各种语言写成的程序中利用 OpenDAL 的能力。这也是为什么 OpenDAL 能被寄托替代 Java 写成的 jclouds 库的原因。

目前正式发布的四种语言的 OpenDAL 库的绑定方式如下：

* [Rust Core](https://crates.io/crates/opendal) 原生 Rust 库
* [Java Binding](https://github.com/apache/opendal/blob/main/bindings/java/README.md) 使用 [jni-rs](https://github.com/jni-rs/jni-rs) 和 JNI 技术完成绑定
* [Python Binding](https://pypi.org/project/opendal/) 使用 [PyO3](https://github.com/PyO3/pyo3) 技术完成绑定
* [Node.js Binding](https://www.npmjs.com/package/opendal) 使用 napi-rs 和 NAPI 技术完成绑定

其余开发中的语言绑定包括：

* [C](https://github.com/apache/opendal/blob/main/bindings/c/README.md)
* [C++](https://github.com/apache/opendal/blob/main/bindings/cpp/README.md)
* [.NET](https://github.com/apache/opendal/blob/main/bindings/dotnet/README.md)
* [Golang](https://github.com/apache/opendal/blob/main/bindings/golang/README.md)
* [Haskell](https://github.com/apache/opendal/blob/main/bindings/haskell/README.md)
* [Lua](https://github.com/apache/opendal/blob/main/bindings/lua/README.md)
* [OCaml](https://github.com/apache/opendal/blob/main/bindings/ocaml/README.md)
* [PHP](https://github.com/apache/opendal/blob/main/bindings/php/README.md)
* [Ruby](https://github.com/apache/opendal/blob/main/bindings/ruby/README.md)
* [Swift](https://github.com/apache/opendal/blob/main/bindings/swift/README.md)
* [Zig](https://github.com/apache/opendal/blob/main/bindings/zig/README.md)

这其中 C Binding 已经有线上用户直接拿去用了，而其他语言的绑定则还未发布或者甚至就只有一个占位符。

在开发多语言绑定的过程中，OpenDAL 总结了一套最佳实践：

1. 暴力开发出 Hello World 示例；
2. 重构完成基本的工程化编译和测试流程；
3. 重构完成基本的 API 映射设计；
4. 跑通语言对应的发布形式。

这其中最麻烦的其实是工程化的部分和搞清楚最终要怎么发布到目标平台。目前 C Binding 的设计开发已经相对完善，但是由于 C 生态没有一个发布的定式，因此导致了 C Binding 迟迟未能正式发布。

> 又或者说其实 C 生态就是直接拷贝源文件，所以实际上也已经“发布”。

相反，Rust / Python / Node.js 这样有官方背书的发布平台的语言生态，OpenDAL 可以很轻松的创建对应的 GitHub Actions 工作流来完成自动发布。

值得一提的是，虽然 Java 软件库大多发布到 Maven Central 上，但是 ASF 软件对应的 Repository 不是其他项目常用的 Sonatype 资源库，而是 ASF 自己的资源库。考虑到 Maven 也是一个 ASF 项目，这一点并不奇怪。不过，这就导致支持 OpenDAL Java Binding 自动发布需要 ASF INFRA 介入。OpenDAL Java Binding 是 ASF 第二个支持自动发布的 Java 库，也是第一个自动发布 JNI 原生共享库的 Java 库。相关的工作如下：

* [Setup opendal-java project GitHub secrets for signing artifacts](https://issues.apache.org/jira/browse/INFRA-24880)
* [ci: automatic java binding release](https://github.com/apache/opendal/pull/2557)
* [docs: auto relaese maven artifacts](https://github.com/apache/opendal/pull/2729)
* [docs(release): describe how to close the Nexus staging repo](https://github.com/apache/opendal/pull/3125)

此外，OpenDAL PMC 积极与 ASF 的品牌官员合作，探讨在 `@apache` scope 下发布 OpenDAL NPM 包的方案：

* [Add Apache org accont as the OpenDAL NPM package owner](https://issues.apache.org/jira/browse/INFRA-25325)

Apache Airflow 的 Jarek Potiuk 正在与 PyPI 团队合作探讨创建一个 ASF 账号的方案。OpenDAL PMC 密切关注进展并随时准备集成 OpenDAL Python Binding 到这个账号下：

* [Provide a trusted PyPI publisher capability for Python projects via INFRA](https://issues.apache.org/jira/browse/INFRA-24678)

可以看到，OpenDAL 认真对待软件发布工作，通过平台提供的机制，以及与 ASF INFRA 密切合作，切实提高了所发布软件包的可靠性。

最后，ASF 在技术合规方面还非常看重所发布的软件的依赖项采用的软件协议是否符合 [ASF 对软件协议的政策](https://www.apache.org/legal/resolved.html)。OpenDAL 为每个发布的制品都提供了 DEPENDENCIES 文件来披露这一消息。同时，由于大部分其他语言的绑定都是 Rust 核心库的一个翻译层，OpenDAL 开发者们尽可能减少不必要的第三方依赖，以降低下游使用时的合规负担。

技术上，由于需要对接多个存储服务后端，并且存在提供不同语言绑定的愿景，OpenDAL 高度重视代码工程化。

查看 OpenDAL 的 [GitHub Actions Workflows](https://github.com/apache/opendal/tree/main/.github/workflows) 就可以发现，OpenDAL 开发了一套可重用的测试框架，任何新语言绑定或新存储服务后端都能快速具备现有的测试覆盖范围。不过这也不算新奇，同样提供多语言支持和多模块分散开发的 SkyWalking 也研发了适用于自身情况的 [SkyWalking Infra E2E](https://github.com/apache/skywalking-infra-e2e) 测试框架。

就语言绑定技术而言，Rust 本身支持 C FFI 决定了 C Binding 的实现是非常流畅的。大部分语言也会提供访问 C API 的集成方式，于是通过 C Binding 可以产生其他语言的绑定。这也是 OpenDAL Haskell / Lua / Zig 等一众绑定的实现方式。

在这种大量利用现有技术的方案之外，上面提到的 jni-rs 和 napi-rs 等技术，则是在已有的 C API 集成方式之上，封装了一层符合 Rust 习惯的接口，从而在开发层面只需要涉及 Rust 语言和绑定目标语言。PyO3 更进一步，为这个开发过程研发了一套脚手架，中间打包和配置对接的工作也全部简化了。应该说，这是 Rust 生态主动向绑定目标语言靠拢。底层技术上，两边仍然是基于 C ABI 在通信。

于是这些技术统统可以归类到 FFI 的框架下，跨语言通信的主要成本就产生于数据拷贝和线程模型同步上。可以阅读我的另一篇技术博客《{% post_link jnirs-async %}》了解 OpenDAL 做过的实践。我想 OpenDAL 应该会活跃在 Rust 与其他语言深度集成的前沿。如果生态中有人想要改进 Rust 与某个目标语言的互操作体验，不妨在 OpenDAL 上实践你的想法。

## ASF 的政策、官僚主义与基金会发展

上文提到，在毕业讨论进入孵化器邮件列表后，截至顺利毕业前经过了一个月的激烈探讨和继续处理项目存在的问题。

绝大部分毕业前需要处理的问题，其实都包括的项目导师吴晟罗列的清单当中。在处理清单列表的过程中，文档版本问题、依赖合规问题和最终 PMC 人选问题花了一些时间研究讨论，剩下的基本都是按部就班顺利完成。

不过，在清单当中忽略了一个重要问题，那就是 ASF 项目的 PMC 要遵守品牌政策，保护项目品牌和 ASF 的品牌。这其中主要且基础的一条就是以 Apache Xxx 正式名称来引用项目。

OpenDAL 的捐赠没有经历过改名，所以大部分材料和项目核心成员在捐赠过后仍然沿用原来的称呼习惯用 OpenDAL 来指代项目，并认为既然已经捐赠到 ASF 了，那么项目归属 ASF 的事实会随着时间推进被不断强化，因此也没有特别在意。

实际上，ASF 当中明确违反品牌政策的行为主要是 DorisDB 这样直接占用品牌宣传竞争产品，或者在商业公司中用某某项目商业版来称呼自己的产品等等。OpenDAL 虽然脱胎于 DatafuseLabs 公司，但是跟商业化可以说是一点关系也没有。其核心开发者也大多是个人身份参与，所以我认为只要大家没有损害 ASF 品牌的行为也就差不多了。

但是 IPMC Chair Justin Mclean 不这么认为，他在 [OpenDAL 毕业提案的讨论](https://lists.apache.org/thread/3lwt4zkm1ovoskrz77y69pwntvn27xvs)里抛出了品牌问题的挑战。

现在回头看，其实一开始 Justin 的表达是 "I found a few minor issues where some name and branding work needs to be done." 并不十分强烈。但是在 Xuanwo 首次回复没有做到 Justin 期望的完美符合 ASF 政策之后，他表示 PMC 应该要“好好学习相关政策”。

随后，在 PMC 成员完全一头雾水不知道 Justin 所指的到底是什么问题的情况下，项目导师吴晟表达了不同看法，大致跟我上面说的类似，即 OpenDAL 项目成员没有损害 ASF 品牌的动机，实际指出的问题也并不是什么明显的问题，只是没有达到完美主义的标准而已。

这个回复让 Justin 彻底破防，认为 PMC 目无政策，在主观遵守规定的意愿上有严重的缺陷，于是对毕业提案投了 -1 票，并在接下来的一个月时间里充分发挥轴的特性不停地全方位质问。

这个过程给 OpenDAL 项目成员带来了非常不好的体验。不是说不能投 -1 票，而是在主观认定 OpenDAL PMC 不配合、不愿意解决问题之后，连续的挑战都不是奔着具体解决问题去的，而是为了证实 OpenDAL 的项目成员就是一群坏人，且就算 OpenDAL PMC 成员读过品牌政策做过一些 nice to have 的改进以后，得到的也不是认同和进一步改进的建议，而是“你做得还不够好”的持续 -1 批评。

我于是专门写了一篇文章《{% post_link community-of-peers-1 %}》批评这种行为。实际上，最后 OpenDAL 的[毕业提案确实没有“全票通过”](https://lists.apache.org/thread/nxd3218gdnylp8g2w7jhcjktorthjydl)。

{% asset_img opendal-graduation-result.png %}

不过，Justin 本人是 Board Member 之一，哪怕孵化项目在 IPMC 中如上图决策通过，最终是否可以建立顶级项目，还需要 Board 核准。

所以从 Justin 开始挑战，直到最终 Board 一致通过了 OpenDAL 成为顶级项目这一个月间，我跟 ASF 的商标品牌官员 Mark Thomas 以及其他 Board Member 就这个问题进行了全面的讨论。最终我们发现，实际上很多顶级项目都没有严格按照品牌政策来落实自己发布的内容，甚至一些 ASF 基金会层面官方渠道发布的内容，严格按照品牌政策来“审查”，也会有做得不够完美的地方。

不过，这并不是大家可以一起摆烂的原因。相反，这揭示了 ASF 项目在品牌保护上孱弱的现实。我做这些相关内容的讨论，也从来不是为了争个对错，而是带着相关人员重新审视一下目前 ASF 品牌政策的执行情况，从而能够用建设性的目光来评判 OpenDAL PMC 在过去和近一个月来处理品牌政策问题的行为到底做得怎么样。

> 在 ASF 孵化器里，一般而言顶级项目是不能作为参考的。从务实的角度出发，这是因为很多顶级项目都并不完全合规，也就是这里提到的问题。
> 
> 但是我仍然坚持应该在孵化器中讨论顶级项目的做法，至少对于做得好的地方应该予以传播和认可。对于做得不好的地方，也不应该局限于孵化器的范畴，而是站在基金会的角度统一协调解决。
>
> 这是因为我清楚地知道大多数开源项目进入孵化器，或多或少受到了其他顶级项目的影响，而且进入孵化器明面上的目的就是毕业成为顶级项目。如果顶级项目都在摆烂，都没有按照 ASF 政策行事，孵化项目如何能理解它们被要求符合的政策规定？

探讨的过程中，我们发现了 OpenDAL 和其他顶级项目存在的各种品牌问题，所有已知被发现的问题都被积极解决了。这些工作被总结发送到上面提到的毕业提案结果讨论串上。

Justin 仍然认为 OpenDAL PMC 做得不像他为另一个有志于捐赠到 ASF 孵化的项目做的那样“完美”。但是在我通过对话将他的挑战彻底转化为主观担忧以后，由于我本人问心无愧，说 OpenDAL PMC “不愿意解决问题，只是被动反应，并且习惯性向外甩锅”更是无稽之谈，所以这些挑战在我列举事实的回应之下也就烟消云散了。

在交涉探讨的过程中，我认为有以下几个片段是值得注意的。

**第一个是关于孵化器当中指出问题的方式**。

我用了两组对比。第一个是某个孵化项目对 ASF 执行政策时体现出的官僚主义失望，从而主动退出孵化器时，提到孵化器的维护者们并不是以帮助它们的姿态出现，而是表现得像是要通过项目的失败来证实自己的权威。如前所述，Justin 在 OpenDAL 的案例上最后完全是走向“我对你错”的模式，而不是我如何帮助你一起变得更好。

> 这未必是 ASF 结构性的问题。对于某个孵化项目来说，主要给予它们这个印象的就是孵化器主席 Justin 本人，有一个“权威”不断地否定你，这种挫败是非常明显的。

第二个是作为一个开源社群，指出问题最好的方式是提交补丁来修复，并在此过程中传达自己的理念，再不济也是提供一个可复现的问题报告，而不是说我认为你有点问题，你要自己发现问题并解决。我用的一个类比，是现在如果有个从未参与过项目开发，也不实际使用项目软件的人，跑过来说我感觉你代码写的方式会出现一些性能问题，你最好自己测一测改过来，这种莫名其妙的报告是无法得到项目维护者的注意的。

这两组对比用英文表达会更加对仗：

* Helping us rather than failing us
* Correcting with contributions rather than instructions

**第二个是关于政策的文档和实践的问题**。

ASF 一个做得非常好的地方是它的社群规则和工作方式都有相应的文档记录：

* 基金会官网 apache.org 记录了基金会的目标，核心定义和各个角色的职责，以及发布、品牌和投票等相关政策。
* 社群发展网站 community.apache.org 是政策实际执行时的最佳实践参考。
* 孵化器官网 incubator.apache.org 包括了孵化全过程的指南。
* 基础设施官网 infra.apache.org 说明了主要资源的位置和使用方式。

但是，这些网站上的内容很是年久失修。

基金会官网的内容东一块西一块，除非很有经验的老成员，否则大多很难快速找到相应的材料。

社群发展网站的最佳实践基本都是十几年前的实践。号称目前开源世界最泛用的成熟度模型，对本次毕业讨论时被挑战的品牌问题只字未提。

孵化器网站内容也是极其杂糅，且有部分“指南”实际是 Justin 个人的偏好，虽然更新时流程上也是经过讨论的，但是大部分审阅的人也很久没有参与孵化，很难对指南落实的时候实际产生的问题有直观的感受。

基础设施官网也是内容稀碎，除非很有经验的老成员，否则大多很难快速找到相应的材料。而且，ASF 在过去二十几年里，基本都在 Maven Central 上发布 Java 代码库，在 SVN 仓库上发布源代码压缩包，对于新时代的不同语言不同软件的发布形式有很大的落差。

Apache OpenDAL 一方面遇上了 Justin 近期跟品牌问题较劲的点子上，另一方面由于它多语言多平台想做自动化发布的工作直接挑战了 ASF INFRA 常年的舒适区，所以在孵化和毕业时相比起其他项目，跟 ASF 的各个机构打交道的次数和时间都要多得多。

这也算是一件好事。毕竟只有新鲜血液的加入，才能促进基金会不断向前发展。只要挑战被正确引导、合作解决，那么遇上问题就不是一件可怕的事情。

**第三个是关于基金会本身发展的问题**。

从另一个角度考虑，为什么 Justin 总是不断地在孵化器当中投 -1 票呢？其实这也反映出孵化器人才梯队建设的问题。由于太多人并不在乎 ASF 政策和 The Apache Way 到底要以什么形式建设出一个什么样的社群和发布什么样的开源软件，所以这些违反政策和文化冲突的问题才会不停挤压到 Justin 这里处理。

久而久之，比起费尽心力去了解项目社群发展的来龙去脉，到底是什么人出于什么动机做了这些事情，人类懒惰地天性就会促使有严格要求的人先直接一个 -1 拍脸，你自己反省。对我来说，我是有足够的动力来处理合规和文化问题的，所以这种处理方式对我来说很冒犯，我会认为原本好好谈合作解决就能行。但是对于某些项目来说，确实你不 -1 我就不管你了，也不是没有这样的案例。

一个更高抽象层次的问题是，ASF 的社群发展和孵化项目的形式，迄今为止仍然是某种“作坊式”的做法。ASF 起源于几个志同道合的开发者聚在一起成立的 Apache Group 并延续了它“一小部分人掌握一系列部落知识运作起一个开源社群”的模式。

在我直接指出作为孵化毕业标准之一的成熟度模型中根本没有关于品牌的论述之前，Justin 宁愿地低效逐个讨论他发现的品牌问题，不断评价 PMC 到底是听话还是不听话，主动还是不主动，也没想到其实这个可以在孵化的必经之路上做提示，最好能做成现在官网基本合规的检查器来提升整个社群的合规水平。

> The ASF is well past the point where a small number of folks who have huge "tribal knowledge" can guide the number of projects and podlings that we now have.

我在探讨这些问题的时候，推动和主动修复了一系列文档的缺失，促进了最佳实践的产生和归纳，并且思考到底我们怎么把这些政策、理念和文化传播给更多的人，让他们主动的承担起列表传播的责任。我想这是 ASF 在走过 25 年之后，面对新的开源社群形势和软件开发方法，应该要考虑和改进的问题。实际上，这也是从参与 ASF 项目接触 Apache 社群理念和方法论的人，成长为基金会成员的一条康庄大道。
