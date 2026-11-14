---
title: 基于 Apache OpenDAL 构建 ScopeDB 云存储层
date: 2026-11-14
tags:
    - Rust
    - 开源
    - Apache
    - 对象存储
categories:
    - 天工开物
---

近年来，基于 AWS S3 等云对象存储构建的数据系统越来越多。两年前我写过一篇[《开发者的未来：基于云服务构建基础设施》](https://mp.weixin.qq.com/s/VgmOZbNQeSmwptr-JkkAZw)，介绍过 ScopeDB 作为云原生数据库的设计初衷。

[ScopeDB](https://www.scopedb.io/) 是一个用 Rust 编写、构建在云对象存储之上的列式数据库，主要面向运维日志、产品事件和 AI Agent 链路追踪等高吞吐事件分析场景。高效、可靠地访问对象存储，一直是 ScopeDB 内核的核心需求。

从第一天起，ScopeDB 就选择基于 [Apache OpenDAL](https://opendal.apache.org/) 构建存储访问层。目前，这套方案在线上已验证单集群可以支持超过 10 PB 的数据规模，以及峰值 30 GiB/s 的写入流量。

在以对象存储为主存储的数据库架构中，查询延迟主要靠列裁剪、索引过滤，以及内存加本地磁盘的多级缓存来控制；弹性扩缩容则来自无状态计算节点与持久化数据的分离。

即便有本地缓存，数据库内核依然会频繁读写对象存储：查询遇到缓存未命中需要回源读取数据块；持续的数据写入、后台文件合并整理、分布式查询的中间结果落盘交换，以及过期历史数据清理，也都直接落在对象存储上。

本文结合 ScopeDB 过去两年的工程实践，聊聊我们为什么没有直接选用云厂商的官方 SDK 方案，如何围绕 OpenDAL 组织数据库的存储读写、鉴权与容错逻辑，以及在多云生产环境里解决过哪些实际问题。

<!-- more -->

## 对象存储在 ScopeDB 架构中的位置

在整体架构上，ScopeDB 将无状态的计算节点与对象存储服务分离。其中，计算节点还可以进一步按负载划分到不同的资源组，比如分别负责实时数据写入、即席查询、复杂报表生成，以及后台文件合并整理与垃圾回收作业等。由此，ScopeDB 实现了存算分离、读写分离乃至不同查询类型的负载隔离。

所有资源组共享同一份表元数据和对象存储文件，节点本地不保存需要持久化的分片状态。查询节点用内存和本地磁盘缓存加速热数据访问，全量历史数据则统一保存在对象存储中。当单集群数据量达到数 PB 规模、不可变数据文件累积到数百万个时，本地缓存只能装下活跃工作集，前台回源与后台的写入、合并、清理都会持续产生对象存储请求。

![ScopeDB on Apache OpenDAL](scopedb-opendal-architecture.png)

具体来看，访问对象存储的流量主要分为四类：

1. **缓存未命中时的稀疏区间读取**：查询计划经过列裁剪、索引过滤和本地缓存查找后，需要回源读取的往往是同一个列存文件里若干段不连续的字节区间。
2. **高吞吐写入与后台文件合并**：写入节点将成批到达的数据刷盘，后台 Compaction 任务不断把小文件归并重写为更大、聚合度更高的文件。
3. **分布式查询的落盘交换**：多阶段分布式查询在无状态节点之间通过共享存储前缀读写中间 Shuffle 数据，查询结束后再异步批量清理这些临时对象。
4. **后台垃圾回收**：后台 Vacuum 任务按前缀列举对象，分批删除已过期或被合并淘汰的历史文件。

如果直接基于云厂商官方的 Rust SDK 去实现并维护这四类逻辑，工程体验会很差：依赖树庞大、请求构造器层层嵌套、鉴权配置繁琐，再加上各家 S3 兼容服务在协议细节上的差异，很容易把大量精力消耗在胶水代码上。相反，我们基于经过充分测试的 [`opendal::Operator`](https://docs.rs/opendal-core/0.59.4/opendal_core/struct.Operator.html) 抽象，在 ScopeDB 的存储模块用几百行 Rust 代码就可以统一管理 HTTP 连接池复用、异步运行时隔离、云端鉴权、超时重试和指标采集等需求。

## 基于 OpenDAL 的几个关键设计

### 稀疏区间读取

分析型查询回源读取对象存储时，很少需要拉取整个文件。经过列裁剪、索引过滤和本地缓存查找后，传给存储层的通常是一组形如 `Vec<Range<u64>>` 的离散字节区间。如果每个小区间都单独发起一次 HTTP `GET` 请求，网络首字节往返开销太高；反过来直接拉取整个对象，又会读入大量无关列的数据，浪费带宽。

OpenDAL 提供的 [`Reader::fetch`](https://docs.rs/opendal-core/0.59.4/opendal_core/struct.Reader.html#method.fetch) 接口正好解决了这个问题。构造 `Reader` 实例时，只要传入 `gap` 合并间隙、最大 `chunk` 分块大小和 `concurrent` 并发度这三个参数，底层就会自动合并相近区间并并发拉取分块，不需要我们在数据库里自己维护一套容易出错的 HTTP Range 状态机：

```rust
let reader = op
    .reader_with(&path)
    .gap(hint.read_gap_size)
    .chunk(hint.read_chunk_size)
    .concurrent(hint.op_concurrency)
    .await?;

let buffers: Vec<opendal::Buffer> = reader.fetch(ranges).await?;
```

前台查询和后台 Compaction 任务对延迟与吞吐的取舍不同，因此我们会根据负载类型向存储层传入不同的参数：前台查询用较小的分块粒度控制单次读取延迟；后台合并的大块顺序读和分片上传则调大分块尺寸优先跑满吞吐，遇到不支持 Multipart 分片上传的存储服务时自动切回单次上传。后台过期清理和临时文件回收也复用同一套算子接口，组合前缀列举与批量删除来完成。

### 异步运行时隔离

在异步运行时层面，还有一个容易踩坑的隔离问题：数据库执行引擎里有大量计算密集的向量化流水线，不能让 CPU 计算任务阻塞或饿死存储网络 I/O 的调度。为此，我们一方面在最外层把存储任务显式投递到独立的存储运行时上执行，另一方面把同一个运行时连同进程内共享的 [HTTP 客户端](https://docs.rs/opendal-http-transport-reqwest/0.59.4/opendal_http_transport_reqwest/struct.ReqwestTransport.html)一起注入 OpenDAL 的 [`OperationContext`](https://docs.rs/opendal-core/0.59.4/opendal_core/struct.OperationContext.html) 上下文：

```rust
impl opendal::Execute for &'static IoRuntime {
    fn execute(&self, f: opendal::raw::BoxedStaticFuture<()>) {
        self.spawn(f).into_background();
    }
}

let context = OperationContext::from_parts(
    HttpTransporter::new(ReqwestTransport::new(shared_http_client)),
    Executor::with(io_runtime()),
);
let op = op.with_context(context);
```

这里，同时做外层投递和内层 `Executor` 注入的原因，主要是 OpenDAL 的并发调度边界：注入的 `Executor` 只在分块并发度大于 1 时才会 `spawn` 后台子任务；当并发度等于 1 时，或者执行 `stat` 和 `list` 这类单次请求时，对应的 Future 仍然直接在调用方当前的上下文里完成 `poll` 轮询。两层配合起来，才能保证无论是单次元数据请求还是并发分块读取，都跑在独立的存储线程池上，并复用同一个底层 HTTP 连接池。

### 云原生鉴权与临时凭证缓存

早期 ScopeDB 访问对象存储的做法很直接：把加密后的 `access_key_id` 和 `secret_access_key` 保存在元数据中，构造客户端时显式传入。随着云上部署规模扩大，为了省去托管和轮换静态密钥的运维负担，系统逐步转向了云原生免密钥鉴权，涵盖 Kubernetes Pod Identity 机制、云主机实例元数据服务、基于 OIDC 的令牌链路，以及公开数据集场景下的匿名访问。

OpenDAL 底层通过 [Apache Reqsign](https://reqsign.apache.org/) 库统一处理凭证加载与请求签名。因此，我们在 ScopeDB 实现这套免密钥鉴权几乎不需要额外开发，也不用引入庞大的云厂商 IAM SDK 依赖。顺带一提，Reqsign 起初是 @Xuanwo 的个人项目，后来被吸收成 OpenDAL 的子项目，并于两个月前成为 ASF 顶级项目。实际编码时，只要在构造 S3 服务时不传静态密钥，默认的凭证链就会自动探测运行环境并定期刷新临时凭证：

```rust
let mut builder = opendal::services::S3::default()
    .bucket(&config.bucket)
    .region(&config.region)
    .root(&config.prefix)
    .endpoint(&config.endpoint);

if let Some(ak) = &config.access_key_id {
    builder = builder.access_key_id(ak);
}
if let Some(sk) = &config.secret_access_key {
    builder = builder.secret_access_key(sk);
}
if config.allow_anonymous {
    builder = builder.skip_signature();
}
```

不过在落地临时凭证时，我们也踩过一个和 `Operator` 生命周期相关的坑。底层实现会把拉取到的临时凭证缓存在 `Operator` 内部的签名器实例里，而 ScopeDB 早期习惯按单次查询或表级操作按需创建短生命周期的存储句柄。如果每次都重新构造一个全新的 `Operator` 实例，内部的凭证缓存就会跟着丢掉，导致工作节点频繁请求云厂商的元数据服务或令牌端点。定位到原因后，我们在全局工厂里按存储配置缓存了基础 `Operator` 实例，短生命周期句柄直接从缓存实例 `clone` 派生，临时凭证缓存也就保留下来了。

### 组合中间件

对象存储服务不在本地，这意味着访问对象存储的延迟可能并不总是稳定的。任何访问对象存储的设计都要考虑请求超时和失败时重试等问题。

OpenDAL 针对这些通用的需求设计了一套 [`Layer`](https://docs.rs/opendal-core/0.59.4/opendal_core/raw/trait.Layer.html) 中间件机制。只需挂载 [`TimeoutLayer`](https://docs.rs/opendal-layer-timeout/0.59.4/opendal_layer_timeout/struct.TimeoutLayer.html) 和 [`RetryLayer`](https://docs.rs/opendal-layer-retry/0.59.4/opendal_layer_retry/struct.RetryLayer.html) 策略，就可以实现上述超时和重试机制：

```rust
// 延迟敏感的前台读路径：限制单次慢请求耗时，超时后回退到带重试的算子
let fast_read_op = base_op.clone().layer(
    TimeoutLayer::new()
        .with_timeout(read_timeout)
        .with_io_timeout(read_timeout),
);

// 写入与删除路径：挂载带抖动的退避重试与指标回调，优先保证最终成功
let write_op = base_op
    .clone()
    .layer(TimeoutLayer::new().with_io_timeout(write_io_timeout))
    .layer(
        RetryLayer::new()
            .with_jitter()
            .with_notify(RetryMetricsObserver::Write),
    );
```

前台读取时，请求会先走 `fast_read_op` 算子。这里有一个细节需要注意，超时层限制的是底层单次分块读取的耗时预算，按读取字节数动态折算，而不是给整个 `Reader::fetch` 调用设一个端到端的总超时。如果某个分块遇到网络抖动超时，存储层会回退到挂载了 `RetryLayer` 的常规读取算子重新拉取，既能尽早切断慢连接、压住长尾延迟，又不会把偶发的网络毛刺直接变成查询报错。同时，配合 [`RetryInterceptor`](https://docs.rs/opendal-layer-retry/0.59.4/opendal_layer_retry/trait.RetryInterceptor.html) 接口，重试次数和退避耗时也能直接接入 ScopeDB 自身的 OpenTelemetry 观测体系。

此外，我的两位合伙人 @leiysky 和 @andylokandy 在 OpenDAL 上实现了 [`OtelMetricsLayer`](https://docs.rs/opendal-layer-otelmetrics/0.59.4/opendal_layer_otelmetrics/struct.OtelMetricsLayer.html) 中间件，可以将 OpenDAL 使用过程中的各类指标，例如读写操作的计数和延时等，同样走 OpenTelemetry 观测体系上报到 ScopeDB 的自观测平台上。

## 回馈上游

生产环境里的对象存储远不止标准的单区域 AWS S3 服务。跨多家公有云和各类兼容存储部署时，经常会撞上协议细节上的边缘情况：比如批量删除返回非标准的限流错误码、底层用并行文件系统模拟对象存储时递归删除目录的语义差异、分片上传对分块大小的要求不一致，或者表元数据里明明已经记了文件长度，读取时却还要多发一次 `HEAD` 请求。

选择开源方案的一个长期好处，是这类存储服务的兼容性差异只需要在 Apache OpenDAL 上游社区解决一次，所有下游项目都能直接受益，不用每家数据库团队各自维护一堆私有补丁分支。过去两年里，我们也把生产环境遇到的问题陆续反馈并贡献回了上游社区：

* 贡献 [OpenTelemetry 指标集成](https://github.com/apache/opendal/pull/5524) 与 [HTTP 传输层指标打点](https://github.com/apache/opendal/pull/5800)，补齐存储算子与底层网络请求的可观测性。
* 扩展[兼容服务的错误码识别](https://github.com/apache/opendal/pull/6651)，让批量删除在遇到部分 S3 兼容厂商的非标限流错误时能正常触发重试。
* 推动支持[写入路径的固定分块切分](https://github.com/apache/opendal/issues/6521)，保证缓冲写入严格遵守配置的分片大小上限。
* 为读取与拷贝接口补上[已知对象长度参数](https://github.com/apache/opendal/pull/7543)，在表元数据已知文件大小时省掉多余的 `HEAD` 请求。
* 修复[请求签名阶段的错误重试标记丢失问题](https://github.com/apache/opendal/pull/8476)，让令牌刷新连接重置这类瞬时故障能够自动重试恢复。

## 小结

表面上看，对象存储的接口似乎只有单对象 `GET` 和 `PUT` 读写，以及前缀 `LIST` 列举与 `DELETE` 删除；但真拿它做数据库的持久化底座，落地时全是需要权衡的工程细节。从开始开发 ScopeDB 的第一天到现在，这套基于 Apache OpenDAL 的存储层帮我们解决了大量访问存储服务的需求，让团队可以把主要精力放在查询执行引擎、多级缓存和索引设计本身。

感谢 @Xuanwo 为世界带来 OpenDAL 这样一个优秀的数据访问库，也感谢 OpenDAL 维护者们长期以来的投入与协作。如果你对 ScopeDB 的存算分离实现感兴趣，欢迎访问我们的官网 [scopedb.io](https://www.scopedb.io/) 或进一步阅读[存储架构文档](https://www.scopedb.io/docs/guides/storage-architecture)。
