---
title: "Logforth: Rust 日志方案的最后一块拼图"
date: 2025-08-20
tags:
    - Rust
    - 开源
    - 日志
categories:
    - 天工开物
---

日志是应用可观测的重要组成部分。可以说，任何运行在生产环境的应用，可能还没建立起指标（Metrics）体系，也或许还没上一套完整的追踪（Traces）方案，但是一定会打日志，至少是关键生命周期日志和错误日志。否则，一旦应用出现问题，几乎无从着手排查。

早在 2014 年底，Rust 生态就出现了官方的 [log](https://github.com/rust-lang/log) 库。这个库主要提供了打日志的宏指令定义，日志结构体的实现，以及打日志的 trait 接口。不过，它并没有提供实际日志如何打印的实现，而是将具体的日志输出方案留待社群扩展。应该说，log 库的定位跟 Java 生态里的 [SLF4J](https://www.slf4j.org/) 是一样的。

我猜测在 Rust lib teams 的设想当中，Rust 开源生态里应该很快会出现像 Java 生态当中的 Log4j 或 Logback 一样的日志实现，补充这部分空白，从而为所有 Rust 开发者提供一个完整的日志解决方案。

可惜，整整十年过去，Rust 生态虽然有像 `env_logger` 这样方便快速上手的 `log` 生态的日志实现，但是却迟迟没有一个能够满足生产环境下复杂配置需求和扩展需求的实现。

![Log 生态的实现](impls.png)

可以看到，上图中属于可扩展日志框架的实现，只有包括 Logforth 在内的四个。其中 spdlog-rs 甚至是在 Logforth 之后才收录到这个名单的。也就是说，在 Logforth 之前，Rust 生态只有 fern 和 log4rs 两个选择，而这两个选择又各自有明显的问题以至于很难再生产环境中大范围使用。具体问题在后续章节我会介绍。

于是，Rust 生态的日志方案发生了 [slog](https://github.com/slog-rs/slog) 和 [tracing](https://github.com/tokio-rs/tracing) 两次歧出。其中 slog 已经不再迭代，甚至 README 里就推荐用户转向 tracing 库。而 tracing 的种种问题，在[上一篇文章](https://mp.weixin.qq.com/s/2D_aLr7phZUxubUvXSzfHw)里我们已经充分看到了。

Logforth 的出现弥补了 `log` 生态中可靠、可扩展日志实现的空白。本文从介绍 Logforth 的核心 API 和使用方式出发，分享 Logforth 的设计理念，以及开发并开源 Logforth 背后的故事。最后，讨论 Logforth 未来需要做的工作，以及相关的开源逸闻。

<!-- more -->

## Logforth 的基本介绍

Logforth 定义了四个核心概念和扩展点。

`Append` 是核心的日志实现抽象，负责将接收到的日志记录输出到指定的目标上。例如，最简单的有 `Stdout` 和 `Stderr` 两个 `Append` 分别会将日志记录打到标准输出或标准错误流。Logforth 第一方提供了其他常见的 `Append` 实现，例如文件输出、Syslog 网络端口、Journald 输出、OpenTelemetry 集成、Fastrace 集成等等。

```rust
/// A trait representing an appender that can process log records.
pub trait Append: fmt::Debug + Send + Sync + 'static {
    /// Dispatches a log record to the append target.
    fn append(&self, record: &log::Record, diagnostics: &[Box<dyn Diagnostic>]) -> anyhow::Result<()>;

    /// Flushes any buffered records. Default to a no-op.
    fn flush(&self) -> anyhow::Result<()> {
        Ok(())
    }
}
```

`Layout` 是格式化日志记录的接口，在接收到日志记录之后，负责将其转换为特定格式的字节序列。Logforth 提供了多种内置的 `Layout` 实现：默认文本格式、JSON 格式、logfmt 格式，以及 Google Cloud Structured Logging 日志格式。

```rust
/// A layout for formatting log records.
pub trait Layout: fmt::Debug + Send + Sync + 'static {
    /// Formats a log record with optional diagnostics.
    fn format(&self, record: &log::Record, diagnostics: &[Box<dyn Diagnostic>]) -> anyhow::Result<Vec<u8>>;
}
```

`Filter` 是日志记录的过滤器接口，根据日志记录的信息决定是否输出日志记录，比如最常见的根据日志级别进行过滤。Logforth 目前开箱提供了 `EnvFilter` 作为默认实现，这个实现即可以简单配置成根据日志级别进行过滤，也可以实现生态中已经近乎事实标准的 `RUST_LOG` 环境变量的所有功能。

```rust
/// A trait representing a filter that can be applied to log records.
pub trait Filter: fmt::Debug + Send + Sync + 'static {
    /// Returns whether the record is filtered by its given metadata.
    fn enabled(&self, metadata: &log::Metadata, diagnostics: &[Box<dyn Diagnostic>]) -> FilterResult;

    /// Returns whether the record is filtered.
    fn matches(&self, record: &log::Record, diagnostics: &[Box<dyn Diagnostic>]) -> FilterResult {
        self.enabled(record.metadata(), diagnostics)
    }
}

/// The result of a filter check.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FilterResult {
    /// The record will be processed without further filtering.
    Accept,
    /// The record should not be processed.
    Reject,
    /// No decision could be made, further filtering should occur.
    Neutral,
}
```

`Diagnostic` 提供应用诊断信息上下文，也即 Java 日志生态中的 Mapped Diagnostic Context (MDC) 概念。主要是用于在日志记录中附加额外的上下文信息，以便更好地理解和分析日志。例如，Logforth 开箱提供了 `StaticDiagnostic` 和 `ThreadLocalDiagnostic` 两种实现，以及从 Fastrace 的追踪上下文中获取诊断信息的 `FastraceDiagnostic` 集成。

```rust
/// A trait representing a Mapped Diagnostic Context (MDC) that provides diagnostic key-values.
pub trait Diagnostic: fmt::Debug + Send + Sync + 'static {
    /// Visits the MDC key-values with the provided visitor.
    fn visit(&self, visitor: &mut dyn Visitor) -> anyhow::Result<()>;
}

/// A visitor to walk through diagnostic key-value pairs.
pub trait Visitor {
    /// Visits a key-value pair.
    fn visit(&mut self, key: Cow<str>, value: Cow<str>) -> anyhow::Result<()>;
}
```

在此之上，Logforth 定义了 Dispatch 和 Logger 两个实际的日志实现抽象。其中，Logger 对应能够注册为 `log` 库定义的 `Log` 实现的日志记录器。一个 Logger 可以组装若干个 Dispatch 组件，或者说一个 Logger 对应了一组 Dispatch 流水线。每个 Dispatch 会包含对应的 Filter、Diagnostic 和 Append 实现，日志首先被 Filter 过滤，然后交给 Append 输出。Append 输出时可以获取 Diagostic 提供的上下文信息。由于特定的 Append 可能希望处理原始日志记录，甚至完全不会经过任何 Layout 格式化，所以 Layout 的配置是绑定在 Append 上的，每个 Append 决定要不要支持配置 Layout 组件。

综合下来，最终 Logforth 的典型配置方式如下所示：

```rust
use logforth::append;
use log::LevelFilter;

fn main() {
    logforth::builder()
        .dispatch(|d| d
            .filter(LevelFilter::Error)
            .append(append::Stderr::default()))
        .dispatch(|d| d
            .filter(LevelFilter::Info)
            .append(append::Stdout::default()))
        .apply();

    log::error!("This error will be logged to stderr and stdout.");
    log::info!("This info will be logged to stdout.");
    log::debug!("This debug message will not be logged.");
}
```

可以看到，Logfroth 没有定义新的日志打印接口，而是完全建设在 `log` 库定义的宏指令和数据结构之上。

为了方便用户快速试用，以及覆盖不需要复杂配置的应用场景，Logforth 仿照 env_logger 最常见的使用方式，提供了方便的快速开始接口：

```rust
fn main() {
    logforth::stdout().apply();
    // This is effectively:
    //
    // logforth::builder().dispatch(|d| {
    //   d.filter(EnvFilter::from_default_env())
    //    .append(append::Stdout::default())
    // }).apply();
}
```

## Logforth 的创作故事

跟 Cronexpr 和 Fastrace 的故事类似，Logforth 的开发起源于 ScopeDB 研发时的衍生需求。

由于清楚的知道 tracing 生态的问题，一开始 ScopeDB 选择的是 fern 库作为日志实现，日志接口选用 Rust 官方的 log 库。如果各位还记得的话，前文提到，log 库的生态里，当时只有 fern 和 log4rs 两个候选项。

log4rs 只支持 console (stdout/stderr) 和 file 两种日志输出目标。ScopeDB 至少还需要支持 OpenTelemetry 集成，log4rs 搞不定。就算没有这个问题，log4rs 的代码质量也让人不敢恭维。而且，log4rs 尝试学习 log4j 用配置文件定义 Logger 的行为。但是 Rust 根本就不是 Java 那样可以动态加载的语言，阻抗失配非常严重。所以，我只能说 log4rs 是 log 库生态做一个复杂可配置实现的一次先驱尝试，但是具体能用或者说哪怕看得下去，还有很长的距离。因为设计思路错误，以后变好基本也没有可能了。目前也没有人在积极迭代，只是因为来得早加上名字取得有独占性，仍然会有一些零星的维护更新。

fern 支持的日志输出目标比较眼花缭乱，但是同样不支持 OpenTelemetry 集成，也不支持 Fastrace 集成。当然，这都是后来衍生出来的需求。起初 ScopeDB 使用 fern 的时候，还没有这两个需求。而我当时就想把 fern 换掉的原因，是因为它有一些已知的安全问题，代码品味很差，充满各种临时代码和巧合编程。虽然 fern 在 Logforth 开发上线完成之后，突然诈尸更新了一个 0.7 版本修复了部分问题，但是在我开发 Logforth 的时间点上看，fern 也是一个疏于维护，一到两年才可能更新一次的库。而其接口设计和代码质量的问题，已经超出稍作修改就能捏鼻子忍受，等待不可靠的上游偶尔更新的极限了。

例如，colored 的安全问题，其实早在前年上游就已经解决，更新版本即可。例如，fern 写了长长一篇 [`meta-logging-in-format`](https://docs.rs/fern/latest/fern/meta/index.html) 的问题，其实只是个实现 BUG 而已，修了就好了。例如，fern 对 format (Layout) 的抽象，没有考虑到某些 Append 可能完全不会也不应该使用 format 的场景。最后，fern 的日志输出目标抽象，相比起 Logforth 完全可扩展的 `Append` trait 定义，是一个预定义的大 enum 枚举体。虽然有一些 Box dyn 的变体可能可以用某种形式扩展，但是总体来说是犯了过早优化（Premature Optimization）的问题。

至于上面 Log 生态的实现列表里出现的 spdlog-rs 库，在我写作 Logforth 的时候，并不知道有这样一个库，所以也就不在考虑范围之内。现在看来，spdlog-rs 的代码质量非常不错（看起来也是经典二次元头像中国开发者，这下刻板印象了）。不过，它也要定义自己打日志的宏指令，也就是有 `spdlog::info!` 等一系列接口，这跟 tracing 的路线是一样的。虽然 spdlog-rs 也提供了 `log` 库接口的适配器，但是仍然会有一些阻抗失配的信息缺失。而且，其设计思路和名称来源都直接继承自 C++ 的 spdlog 库，这会导致一些自我设限和名称品牌问题。所以就算站在当下的角度，综合考虑我应该也不会选择使用 spdlog-rs 库。

无论如何，我在 2024 年 7 月 31 日晚上十点钟提交了 Logforth 的第一行代码，并在三天内冲到了 0.7.3 版本，初步稳定了 ScopeDB 线上使用的案例。

![Logforth 的第一行代码](first-commit.png)

随后，我深知想要让一个日志库能够被广泛使用，其稳定性是非常重要的。于是，我在发布 0.7.3 版本之后，初步制定了 1.0 版本的发布计划。

![1.0 版本的发布计划](stabilize-plan.png)

拍脑袋想，大概花个一年的时间试试接口的成色，如果没有其他的点子，也就差不多是时候发布 1.0 版本了。从去年 7 月 31 日起一年，粗算就是今年的八月份，也就是这个月。至于 1.0 版本的进展和 Logforth 的稳定性，我会在下一节介绍。

自那之后就是常规的迭代和开发。抛开项目最开始的 1-2 周密集发版，后续直到今年 3 月初，大概保持了一个月发 2-4 个版本的频率。从今年 4 月份开始，由于接口逐渐稳定，大概是每个月会有时间收拢一下 Issues 做开发后发版。从 0.14.0 版本开始，每个版本发布都会对应一个 [CHANGELOG](https://github.com/fast/logforth/blob/main/CHANGELOG.md) 的新段落，其实 ScopeDB 的 CHANGELOG 的格式，就是继承自 Logforth 的格式。

在此过程中，我有三个有趣的开源开发经验想要分享。

第一个是接口抽象是开源软件库的生命线，在抽象封装和具体实现之间找到平衡至关重要。早期的 Logforth 实现也跟 fern 一样使用一个大 enum 定义套住所有的 `Append`、`Filter` 和 `Layout` 实现，但是很快发现其实对日志库来说，dyn dispatch 算不上什么，能让具体的实现简单实现一个 trait 就跟你集成起来是更重要的。于是到后来，前文提到的四个核心概念和扩展点就都变成了 trait 定义，不再搞自欺欺人的 enum 提前优化了。再有，`DispatchBuilder` 的设计很有趣，可以自行查看源代码。

第二个是对于这种基础库，写好 CHANGELOG 非常重要。我从 0.14.0 开始写 CHANGELOG 的动机，就是 0.14.0 版本引入了一个大的破坏性改动（breaking change），如果不写 CHANGELOG 那用户升级起来就抓瞎了。虽然说开源的情况下，用户总可以通过阅读源代码来理解现在的设计，通过版本控制系统也可以看到每个具体的 changeset 内容，但是不会真有人以为用户有这么闲吧？就像一个著名的笑话说的那样，只有你的竞争对手才会阅读你的源代码和产品文档。Logforth 从 0.14.0 到如今 0.27.0 版本，做了 13 次破坏性改动，有大有小。没有 CHANGELOG 的记录，可能过段时间我自己都不知道具体两个版本之间我做了啥大的改动。那样，一个先前就选择相信 Logforth 的用户，在这种情况下要么费老大的劲升级或重做，要么只会得出 Logforth 不可靠，得换个依赖的结论。

第三个是跟文档相关的。我在 [Cronexpr 的故事](https://mp.weixin.qq.com/s/Rj9aZU7xXY65zC3NoymJAA)里详细介绍了 Cronexpr 的文档如何成为了解 Cron 表达式的绝佳参考资料。在 Logforth 库里，我也一样开启了 `#![deny(missing_docs)]` 注解，确保每个公开的符号都有对应的文档。不过，Logforth 的文档我就写不了那么详细了。因为它不像 Cronexpr 那样努努力就能完全穷尽，而且整个 Rust 的日志方案还没尘埃落定。或许在后续的迭代里，Logforth 的文档也会像 Logback 或者 Log4j 那样逐步完善，成为一个小白也能轻松上手使用和扩展的软件库。

最后，关于 Logforth 这个名字的来源，细心的朋友可能已经发现，它取自 Logback 的反义词。这是因为 Logforth 的核心概念和扩展点，其灵感来源就取自 Logback 库的设计，我也很喜欢 Logback 的使用体验。当然，Logforth 在具体概念上有做不同的取舍，实现细节上针对 Rust 的 idiom 也做了很多修改。

## Logforth 的未来工作

目前，Logfroth 的最新版本是 0.27.0 版本，这显然没到开发者公认的 1.0 稳定版本。为了逐步完成 1.0 版本的发布，我在去年 11 月份的时候就罗列出了 Logforth API 的稳定目标。

![Logforth API 的稳定目标](stabilize-targets.png)

前几天，我根据稳定目标的实现情况，更新了 Logforth 的 [1.0 版本计划](https://github.com/fast/logforth/commit/b4bdbe3160f708bd86b3b4eca82b052b0e13aa4e)，并把 0.27.0 版本作为初步稳定的基准版本发布。

总的来说，目前 Logforth 的核心概念和扩展点抽象，都已经可以认为是稳定的了。之所以没有发 1.0 版本，是因为 Rust 库发布的一些习俗问题，导致存在还没解决的开放问题。具体来说，就是 Rust 生态当中，更发布一个 one-for-all 的库，而不是若干个拆分得很细的小库。虽然也有受 NPM 浪潮影响，把自身功能切成七零八落小库的 Rust 库（比如一个直观看很简单的 url 库，实际有 72 个以上的直接或间接依赖，gix 也把自身的功能拆成几十个小库），但是拆库发版本身也是一个蛮啰嗦的工作。如何设计拆分库的维度，拆分后的依赖关系，以及如何在小库之间共享公共函数，都是需要花时间做的额外工作。相反，提供一个 one-for-all 的库，用 feature flags 控制条件编译，相对显得就简单一些。

因此，如果 Logforth 想对已经稳定的部分单独发布 1.0 版本，势必涉及拆出一个 logforth-core 或 logforth-api 的库的问题，然后就涉及到 GitHub Repo 的结构调整跟开发工具对应的调整。虽然都是 chore works 但是也需要心情好的时候花至少一两个小时搞定。

在此之后，作为扩展点的 Append 等抽象的具体实现，可能会按以下方式拆成小库：

* logforth-append-opentelemetry
* logforth-layout-logfmt
* logforth-diagnostic-fatrace
* ...

其实，Logforth 不好直接发布 1.0 版本的核心原因，也是因为这个第一方支持的开箱即用的集成，比如 OpenTelemetry 集成，其依赖的上游库也整天 break changes 折腾。而 Logforth 做集成，为了暴露完整的上游能力，几乎必须在公共接口（主要是构造器）里引用这些上游库。于是，根据语义化版本的定义，上游 break changes 导致你的公开接口不兼容，你也会 effectivly 被动地出现不兼容改动。于是哪怕发了 1.0 版本，很快也会需要变成 2.0 和 3.0 等等，这样所谓的 1.0 稳定版本也就失去了预期的象征意义。

P.S. 这个问题 OpenDAL 因为集成了不同 services 和 layer 的功能，也依赖上游库，所以也存在。这或许就是 OpenDAL 也发不出 1.0 版本的原因 :D

还有一个问题是关于共享公共函数的。Logforth 的 RollingFile 和 Syslog 等 Append 实现依赖一个叫 NonBlocking 的模块，把可能比较耗时的 IO 操作发给一个后台线程慢慢往下刷。我正在纠结是把 NonBlocking 作为一个公开的 utility 开放出去，任何 Append 的实现者都可以选择使用，还是说用类似 spdlog-rs 的 AsyncSink 组合子的方式，搞个 AsyncAppend 里面套一个 Blocking 的 RollingFile 实现，在 AsyncAppend 这一层做后台线程驱动的泛化抽象。相关的工作可以关注 [Issue 145](https://github.com/fast/logforth/issues/145) 的进展，总的我感觉至少不用像 spdlog-rs 那样搞出线程池那么极端，但是 AsyncAppend 套一个 Blocking 的 RollingFile 的话，每次都要加锁访问似乎也是一个退步。具体怎么做还得有时间的时候仔细琢磨一下。

对于 RollingFile 本身，还有一个能成为 breaking change 的 [Issue 143](https://github.com/fast/logforth/issues/143) 待解决。这个 Issue 本身还比较好说，需要考虑的是像 Log4j 那样非常灵活用户可以自定义文件名模式的，需不需要支持。如果支持，得搞成什么样的接口。

其他的应该没啥了。Logforth 这个 crate 本身会保留，作为一个 one-for-all 的门面库把分拆后的小库全部捞进来，提供一个简单的使用方式。对于稳定性有要求，或者自己要定制化的用户，可以选择直接依赖分拆后的小库。

最后讲一个小故事，README 里的 Minimum Rust version policy 章节尊师的是 jiff 库的写法，后来沿用到许多我开发或参与的开源 Rust 库当中。这个信息对于库用户来说，还是蛮重要的。私心希望所有库作者联合起来，只要有需求，就猛猛跟进新的 Rust 版本，不要再无限兼容旧版本啦。

## FastLabs 的未来

如同[上一篇文章](https://mp.weixin.qq.com/s/2D_aLr7phZUxubUvXSzfHw)提到，[FastLabs](https://github.com/fast) 正在成为 Rust 生态又一个创新中心。Logforth 是 FastLabs 里第一个不以 fast 开头的库，某种意义上标志着 FastLabs 走向泛化。在 Logforth 之后，[`logcall`](https://github.com/fast/logcall) 和 [`stacksafe`](https://github.com/fast/stacksafe) 也加入到 FastLabs 里。

目前，FastLabs 的主要开发者包括：

* Fastrace 的原作者 @zhongzc 
* libfastrace 的作者 @ethercflow
* 核心开发者 @andylokandy、@leiysky、@Xuanwo 和我

FastLabs 下的开源软件质量是有保证的，且大多经过生产环境的测试和历练。正如我们的标语所说：

> We develop fast Rust crates and release them fast.

“早发布，勤发布”是集市模式下开源软件回馈贡献者，保持活力的不二法门。我热切地希望 FastLabs 能成为一个名副其实的富有创造力的 Rust 生态创新中心。现在，FastLabs 下有十余个开源软件库活跃迭代中，欢迎所有开源开发者参与使用、评审代码和加入开发。希望在不远的未来，我们能够一起制造出举足轻重的开源软件。
