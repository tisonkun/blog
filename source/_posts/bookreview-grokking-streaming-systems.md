---
title: 《流计算系统图解》书评
date: 2023-11-20
tags:
    - 流式系统
categories:
    - 大图书馆
---

上周，我收到清华大学出版社编辑寄来的新书《流计算系统图解》。趁着周末的功夫，我快速浏览了本书的主要内容。一句话评价：值得一读，尤其是对开始开发流计算任务或系统一到两年，初步实现过一些功能或作业，但是还没有对流式系统建立起系统认识的开发者。

![cover](cover.jpg)

<!-- more -->

本书作者是两位 Apache Heron (incubating) 项目的 PMC 成员，Heron 是源自 Twitter 的计划取代 Storm 的流计算系统。据称，两位原本是打算写一本 Heron 的系统介绍，但是考虑到绑定具体系统，很难公平地介绍清楚流计算的基础概念和实现方向，最终选择以图解的方式讲解流式系统的设计重点和难点。

巧合的是，Heron 项目社群后续发展不顺利，已于[今年一月放弃孵化](https://lists.apache.org/thread/374rqg8s5j532qs6tcdw6zjc9c11p55w)。本书不局限于特定项目的定位，反而使得它能够在今天仍然有足够的价值被翻译。

本书译者是傅宇、黄鹏程和张晨。这几位都是流计算系统的专家。如果有读者关注数据处理系统的出版，可能还会知道他们合作翻译过另一本著作《Presto 实战》。应该说，这几位译者在 Data Infra 领域的经验和外文著作翻译的经验都是值得信赖的。

回到这本《流计算系统图解》上来。

本书一大特点就是书名点出的以图解方式介绍流计算系统。流计算作业通常包括多个阶段，每个阶段可以设置并行度，不同阶段之间可以用多种方式连接。一旦流计算作业运行起来，其不同阶段的算子通常会长时间运行，从而形成一个长期在线的流计算执行拓扑图。事件如何产生，如何在不同算子之间流转，连续事件处理的顺序和跨越算子不同扇入扇出时的分发机制，不画图可能还真说不清楚。

本书的另一大特点是提供了各个章节系统讲解的[在线参考代码](https://github.com/nwangtw/GrokkingStreamingSystems)。两位作者删繁就简，设计实现了一个简单的流计算参考系统，并在概念讲解中穿插基于这个系统的实例演示。我在浏览过程中针对一些有趣的主题测试过这份在线代码，应该说，两位作者是用心设计的，读者可以阅读代码理解流计算系统的基础结构，也可以做一些 HACKING 验证书中提出的一些发散的问题和想法。

下面介绍一下本书各个章节的关注点，并附上我写过的文章或者相关章节参考资料。

第一章和第二章是对数据处理系统和流计算系统的简介和 Hello World 示例。

第三章介绍了流计算中的数据并行和任务并行。

这个主题非常重要。因为流计算要想在大数据量下取得良好的延迟和吞吐体验，合理的并行设计是必不可少的。并行的策略会影响数据分发的形式，事件处理的顺序和算子状态的管理。

第四章讨论了流计算作业的拓扑结构。主要介绍的是 DAG 的形式，以及不同算子对应的扇入扇出及其性质。

DAG 也是流计算系统主要支持的作业拓扑结构，目前最热门的流计算系统 Flink 实现的也是 DAG 拓扑结构的作业调度。除此之外，可以补充阅读 [Naiad](https://sigops.org/s/conferences/sosp/2013/papers/p439-murray.pdf) 论文。这篇论文里介绍了用于流图上迭代计算的环结构，其开源实现是 [Timely Dataflow](https://github.com/timelyDataflow/timely-dataflow/) 库，被用在流数据库 Materialize 上。不过上次看的时候，Materialize 并未利用上 Timely Dataflow 的迭代计算能力，现如今也不标榜自己是流数据库了，令人唏嘘。

第五章讨论了流计算作业的事件送达语义，即经典的至多一次（At-Most Once）、至少一次（At-Least Once）和恰好一次（Exactly Once）。

书中点出了恰好一次根本是实际一次（Effectively Once），即是通过重试和幂等实现的，而不是真的只投递一次消息并能确保下游收到。这个认识对理解恰好一次语义是至关重要的。

关于流式系统中的恰好一次语义，我也写过一篇文章 [Exactly Once](https://zhuanlan.zhihu.com/p/102607983) 做讨论。其他参考材料如下：

* [An Overview of End-to-End Exactly-Once Processing in Apache Flink](https://flink.apache.org/2018/02/28/an-overview-of-end-to-end-exactly-once-processing-in-apache-flink-with-apache-kafka-too/)
* [《流式系统》](https://book.douban.com/subject/34439870/)第五章 Exactly-Once and Side Effects

第六章是对前面几章的总结和开启第二部分进阶话题的序章。

第七章讨论了流式系统中的窗口计算。窗口其实可以理解成流计算中的攒批计算，跟批处理中的微批模式形成某种对偶。不过，窗口计算有着语义上的需求，而微批模式主要是性能上的需求。

关于窗口计算和水位线，我写过 [Window](https://zhuanlan.zhihu.com/p/103890281) 和 [Watermark](https://mp.weixin.qq.com/s/syvp4k1bVnMXf3qri3OqIw) 两篇文章。其他参考材料如下：

* [The Dataflow Model](https://research.google/pubs/pub43864/)
* 《流式系统》第三章和第四章

其中，The Dataflow Model 是 Google 流计算的经典论文，Dataflow 模型的开山之作。这篇论文当中，主要讨论的就是如何设计和实现一个带窗口计算的流计算系统。

第八章讨论了 JOIN 操作，主要涉及到流和表的共轭关系或者说数据的流表二象性。

本书从算子扇入扇出切入，把 JOIN 作为一种特殊的扇入方式引进，还是比较自然的。现实世界中，最复杂的流计算就是涉及双流 JOIN 或维表 JOIN 的计算。书中先从表是流的物化视图引进，接着讨论不同类型的 JOIN 对应的效率和数据完整性考量。

这部分内容涉及《流式系统》整个第二部分，足以见其复杂

第九章讨论了反压。前面提到，流计算系统通常是长期在线运行的系统，因此它需要应对潜在的在线流量洪峰。

反压实际上是一个在线系统实现层面的细节，并不完全跟流计算系统相绑定。关于反压的问题，我推荐 Flink China 社群早年录制的一个教程[《Flink 网络流控与反压剖析》](https://www.bilibili.com/video/BV124411P7V9)。

第十章讨论了有状态计算。实际上，在前面讨论送达语义、窗口计算和 JOIN 操作的时候，或多或少都涉及到了流式系统中的状态管理。

领我入门流计算领域的施晓罡博士说过，Flink 的创造性价值，不在于流计算，而在于实现了带状态的流计算。把状态管理内化到流计算系统的设计当中，解决了 Storm 等系统依赖外部状态存储导致的数据一致性很难保证的问题。直到今天，Flink 官网上巨大的 Slogan 仍然是：数据流上的有状态计算。

![flink-homepage](flink-homepage.png)

关于这个主题，我写过一篇文章 [State](https://zhuanlan.zhihu.com/p/119305376) 讨论。其他参考资料如下：

* [Lightweight Asynchronous Snapshots for Distributed Dataflows](https://arxiv.org/abs/1506.08603)
* [From Aligned to Unaligned Checkpoints](https://flink.apache.org/2020/10/15/from-aligned-to-unaligned-checkpoints-part-1-checkpoints-alignment-and-backpressure/)

第十一章终章是对前面章节的总结和展望。

关于其他流式系统的参考资料，我写过一份书单[《流式系统阅读指南》](https://mp.weixin.qq.com/s/IY_iptfE0zOE6roWGCBQbQ)。

最后，我想引用《流计算系统图解》最后一节的内容，给有志于深入学习和实践流计算系统的读者分享一些参与方向：

挑选一个开源项目来学习，甚至直接参与到开源项目当中。

开源运动让我们平等地接触到业内领先的流计算系统。它们的代码实现和设计文档，甚至设计过程的讨论和用户使用的反馈都唾手可得。学习流计算从来没有一个时候像现在这样简单。

* [Apache Flink](https://github.com/apache/flink) 无可争议的顶级开源流计算系统。
* [Apache Spark](https://github.com/apache/spark) 无论如何，Spark Streaming 的用户基数还是很大的，并且它也确实适合一些流计算的场景。
* [Apache Beam](https://github.com/apache/beam) Dataflow 的开源实现。
* [RisingWave](https://github.com/risingwavelabs/risingwave) 译者之一傅宇参与的开源项目。虽然项目还很年轻，缺乏生产案例，但是这也意味着巨大的技术实践空间。我推荐它主要是因为项目设计文档丰富详实，以及核心开发者们乐于分享和交流。
* [Materialize](https://github.com/MaterializeInc/materialize) 这个并不是开源软件，但是源码可以自由阅读。同时代码仓库中也有非常丰富的设计讨论和文档。

开始写博客，传授你所学的知识。

上面的参考资料中包括了不少我自己写的博客。在流计算的国内传播上，[云邪的博客](https://wuchong.me/)起到了很大的作用，不少人第一次深入了解流计算就是从阅读他的博客开始的。另外，[林小铂的博客](https://www.whitewood.me/)也值得一读。当然，还有 [Flink 的博客](https://flink.apache.org/posts/)。主动分享和交流是开源开发者技术进步的阶梯。

参加聚会和会议。

Flink Forward 大会几乎每年都会在中国举办。此外，随着 RisingWave 和一系列 MQ 社群的崛起，流计算相关的聚会和会议只会越来越多。

永不放弃。原文写到：

> 要实现任何卓越的目标，都需要经历一次又一次的失败。接受失败，这将使你变得更优秀。
