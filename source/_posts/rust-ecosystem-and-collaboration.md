---
title: Rust 程序库生态合作的例子
date: 2024-05-31
tags:
    - 开源
    - Rust
categories:
    - 夜天之书
---

近期主要时间都在适应产品市场（Product Marketing）的新角色，不少想法还在酝酿和斟酌当中，于是文章输出没有太多时间来推敲和选题，只能保持每月发布相关的进展或一些零碎的思考。或许我可以恢复最早的模式，多做更新但是文章内容可能不会太过完整。

原本这一期想讨论的是 ASF 开源项目代码的所有权，以及开源软件变更协议的具体含义与操作方式。但是这个话题稍显枯燥，而且要把相关细节讲清楚，还需要继续斟酌。所以我改为采取把最近开始全职投入 Rust 开发，并接触相关生态发展和合作的经历做一点梳理，分享个人在其中的所见所闻。

我会从 Rust HTTP 库的生态切入，从最近一个大事件出发，即 Rust 采用范围最广的 HTTP 库 hyper 和 http 前后发布 1.0 版本，讲述其导致的整个 Rust 应用开发上下游牵一发而动全身的变化。

<!-- more -->

起因是我在整蛊 GreptimeDB HTTP 相关代码的时候，发现项目依赖的 axum 库是 0.6 版本，而上游是 0.7 版本。这天降的升级闲手，不升有点对不起自己了。通过解决升级过程中的问题，也能帮助摸清 GreptimeDB HTTP 模块的逻辑。

不过，我显然是小看了 Rust 生态荼毒甚广的 [ZeroVer](https://0ver.org/) 文化的威力。

ZeroVer 是一个揶揄的说法，即在采用语义化版本（[SemVer](https://semver.org/)）的前提下，因为各种原因，项目迟迟不愿发布 1.0 版本。

![0ver 的魅力时刻](zerover.png)

在语义化版本中，0.x 版本是在项目正式发布或说进入稳定期前，一个相对动荡的快速迭代阶段。语义化版本的核心价值是告诉用户升级版本可能面临什么变化：

* 升级补丁版本（Patch Version）：应当只有缺陷修复和性能提升等，不会破坏用户程序的改动。
* 升级小版本（Minor Version）：可能包含新功能，应当向后兼容，用户应用应当可以顺滑升级。
* 升级大版本（Major Version）：可能包含破坏性变更，用户需要做好应对逻辑甚至数据迁移的准备。

当然，在实践当中，语义化版本并不那么严格执行。尤其对于大型项目的实验性功能，是可能有一个独立的可靠机制的。但是无论如何，进入 1.0 之后就意味着项目对用户做了一个向后兼容的保证，除非升级大版本，否则用户会假设软件升级是可以非常激进的。

> ZeroVer 方案的反面极端是 Apache Arrow 和 Apache DataFusion 每次发版都升级大版本的做法，很难评价。
>
> * [build(deps): update datafusion to latest and arrow to 51.0](https://github.com/GreptimeTeam/greptimedb/pull/3661)
> * [build(deps): bump datafusion 20240528](https://github.com/GreptimeTeam/greptimedb/pull/4061)

话说回来，axum 0.6 到 0.7 的版本升级是一个巨大的变更，基本把核心的类型设计做了一个颠覆，即 Body 不再是泛型了。

> 这其实也是一个槽点。国内开发者油条哥做的 [Poem](https://docs.rs/poem/latest/poem/) 就不搞这些花里胡哨的泛型，直接用胖指针抹掉底下的差别，提供更好的开发体验。你说我都 HTTP 了，搞应用层接口开发了，我是跟你抠这点性能的人吗？

![一个屏幕都写不完的 breaking changes 列表](axum07.png)

![Rust HTTP 生态泛型的魅力时刻](tower-generic.png)

于是我着手升级 axum 的版本，一上来就是好几个屏幕的编译错误。没事，Rust 开发者的日常而已。

第一个小问题，我们依赖了 axum-test-helper 这个库，它没跟上 axum 0.7 的版本。我先试着给上游提 PR 升级：

* [feat: support axum 0.7](https://github.com/cloudwalk/axum-test-helper/pull/29)

未果。

自己维护比较头疼，其实只有一个文件，最后我在 GreptimeDB 里 vendor 掉了：

* [refactor: bundle the lightweight axum test client](https://github.com/GreptimeTeam/greptimedb/pull/3669)
* [chore: respect axum test client's origin](https://github.com/GreptimeTeam/greptimedb/pull/3805)

> 这里我又要吐槽了。axum 是不是哪里有问题，居然不提供测试套件，还要下游自己 embedded 然后去掉 `(crate)` 修饰词，好玩吗？虽然其实也是可以用 reqwest 套一个 TestClient 解决，按照上游的说法：[“这只是很薄的一层”](https://github.com/tokio-rs/axum/issues/1146)，但是这么简单提升使用体验的事情，为何不做呢？
>
> 反观 Poem 就提供了 [TestClient](https://docs.rs/poem/latest/poem/test/struct.TestClient.html) 工具，开发起来舒服多了。不管是不是我一个文件就能解决，这不是下游应该解决的事情。

紧接着，发现 axum 自己的 TestClient 有落后，以及一个 Rust Nightly toolchain 的兼容问题，提 PR 解决：

* [Upgrade reqwest to 0.12](https://github.com/tokio-rs/axum/pull/2688)
* [Enable diagnostic attributes for Rust 1.78+](https://github.com/tokio-rs/axum/pull/2693)

> Rust Nightly toolchain 的兼容问题是一个很奇妙的问题。因为 Nightly 顾名思义就是最新的 Rust 开发版本，不提供语义化版本保证，只是在 Rust 1.x 的时间线上大体向后兼容。但是结合上 Rust Stabilize 的流程，以及打开 feature gate 如果找不到 feature flag 就会编译失败等等细碎的问题，经常会导致生态在跟进 Nightly 之前有一个无法编译的窗口。
> 
> 这不算是绝对的坏事，甚至推着生态跟新版本是合理的。但某种程度上其实是 Rust Stabilize 太慢，导致系统开发比如 GreptimeDB 不得不用 Nightly 版本，而出现的新问题。Rust 开发很多用 Nightly 版本，跟 0ver 可能也有某种互相呼应的巧合。在这种环境下，开发公共库并保持多平台多版本兼容，其实是一件非常困难的事情，怪不得都 0ver 了。

然后我就遇到了本次升级最大的大魔王。Rust 生态的 gRPC 库 [tonic](https://github.com/hyperium/tonic) 闪亮登场！

这里的依赖关系大概是这样的。

首先，axum 0.7 除了接口变化，还有一个关键的依赖变化是把 hyper 和 http 给升到了 1.0 上。因为 Rust HTTP 生态都依赖 hyper 和 http 这两个库，这就导致如果你的接口开始交互，那么所有的结构都要同步到同一个版本。

这个问题并不那么致命。因为如果你合理的 re-export 了依赖的接口，那么同一个 crate 的多个版本是可以共存的，就像我最近在升级 Apache OpenDAL 的时候连带需要升级 reqwest 到 0.12 版本，它依赖了 hyper 1.0 和 http 1.0 但是跟 axum 的 server 端代码关系较小，所以我可以切割开：

* [build(deps): upgrade to reqwest 0.12](https://github.com/GreptimeTeam/greptimedb/pull/4037/commits/ad0793b48cb0ac19fbd7c52be215140d96ca6eb5)

注意以上 PR 里修改 `use` 语句以选择正确的 re-export 符号的变更。

不过，tonic 的情况就比较幽默了。tonic 依赖了 axum 0.6 版本，而且 tonic 和 axum 都用了 tower 作为中间件的第三方库，而且都没有 re-export 而是标榜自己能无缝接入 tower 丰富的中间件生态。

由于 tonic 尚未完成 axum 0.7 和 hyper 1.0 的升级，这下就连环爆炸了：你找不到一个合适的 tower 版本，或者说你找不到一个合适的 axum 版本，来作为 GreptimeDB 被传递关联起来的版本约束。

于是，直到今天，GreptimeDB 的升级还是未完成的状态：

* [Upgrade Axum to 0.7](https://github.com/GreptimeTeam/greptimedb/issues/3610)

不过，在三月底，tonic 上游就出现了一位大英雄开了一个升级的 PR 完成了主要的工作：

* [Upgrade to Hyper 1.0 & Axum 0.7](https://github.com/hyperium/tonic/pull/1670)

这个 PR 我看到的时候还需要两个 hyper-util 的改动，我给帮忙推着合并了：

* [Adds max_pending_accept_reset_streams for legacy](https://github.com/hyperium/hyper-util/pull/102)
* [feat: add {http1,http2}_only for auto conn](https://github.com/hyperium/hyper-util/pull/111)

这里又岔开一下。虽然 tonic 在 hyperium 组织下，跟 hyper 和 http 一样，但是 hyper 和 http 的作者，Rust 生态真正负责人的英雄 @seanmonstar 并不怎么看 tonic 这个库。tonic 主要是 tokio 的作者 @LucioFranco 和另外两位志愿者 @tottoto 和 @djc 维护的。他们都有自己的本职工作要做，所以并没有太多时间 Review tonic 的变动。实际上，很多项目就用着 tonic 0.11 和 axum 0.6 万年不动也还行的（有没有发现 tonic 也是 ZeroVer 流派）。

不过，经过两个月当中的空闲时间累积，这个 tonic 的升级 PR 终于看着要走进尾声，希望能顺利。开源项目能有这个效率，小几个月跟进一个大型重构，虽然比不上 @seanmonstar 和其他活跃维护项目的响应速度，也绝对算是能及时更新的了。

这个 tonic PR-3610 有很多经典的开源贡献者跟维护者之间的交流和争论，我这里就不展开了。但是我非常建议各位关心开源的人去看看，了解真实的开源世界，未来或许参与进去做出自己的贡献，而不是自己想象或者冷眼旁观。

最后，贴两张图说明 Rust 生态 ZeroVer 的严重程度：

![GreptimeDB 的依赖 ZeroVer 有 782 个](greptimedb-zerover.png)

![GreptimeDB 的依赖非 ZeroVer 有 278 个](greptimedb-zerover.png)

在 GreptimeDB 的依赖里，ZeroVer 的占比约莫七成。

其实，GreptimeDB 很多升级都很有工程上的说法，欢迎各位关注发现。我可能也会在今年的某些 Rust 会议上分享相关的经验。

文末放两个我在 Reddit 上跟这次 HTTP 生态大更新相关的讨论链接，在 Rust channel 上还算有一些有趣的讨论。

* [Spreading http 1.0 and hyper 1.0 among the ecosystem](https://www.reddit.com/r/rust/comments/1bqfjbo/spreading_http_10_and_hyper_10_among_the_ecosystem/)
* [Super heavy generic on HTTP lib makes debugging hard](https://www.reddit.com/r/rust/comments/1czi4g4/super_heavy_generic_on_http_lib_makes_debugging/)
