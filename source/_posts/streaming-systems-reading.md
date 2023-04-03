---
title: 流式系统阅读指南
date: 2023-04-03
tags:
    - 流式系统
    - Flink
categories:
    - 大图书馆
---

本文从软件系统、学术论文和出版书籍三个方面介绍研究学习类似 Apache Flink 的流式系统的参考材料。

<!-- more -->

## 软件系统

现实世界的软件系统都是以生产可用为目的的。因此，其代码、文档和讨论不局限于流式计算本身，还有许多分布式系统共通的话题。在这里，我会强调其中和流计算相关的内容。

### Apache Flink

[Apache Flink](https://flink.apache.org/) 大约是国内目前知名度最高的流式系统。要想了解它的流式计算设计，最好的办法是从用户编程接口切入。它提供了两套编程接口，一套参考了 Dataflow 论文的设计，另一套则是致力于兼容和扩展 SQL 标准。

* [Fraud Detection with the DataStream API](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/try-flink/datastream/)
* [Flink DataStream API Programming Guide](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/datastream/overview/)
* [Real Time Reporting with the Table API](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/try-flink/table_api/)
* [Table API & SQL](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/dev/table/overview/)

具体的 API 指南目录下，涉及时间（Time）和状态（State）的章节是流式计算核心的差异点。

{% asset_img flink-core-docs.png 核心文档章节 %}

此外，Flink 还有 Flink Imrpovement Proposal (FLIP) 页面记录和核心设计决策，这里同样介绍流式计算与众不同的一些。

* [FLIP-1: Fine Grained Recovery from Task Failures](https://cwiki.apache.org/confluence/display/FLINK/FLIP-1%3A+Fine+Grained+Recovery+from+Task+Failures)
* [FLIP-27: Refactor Source Interface](https://cwiki.apache.org/confluence/display/FLINK/FLIP-27%3A+Refactor+Source+Interface)
* [FLIP-76: Unaligned Checkpoints](https://cwiki.apache.org/confluence/display/FLINK/FLIP-76%3A+Unaligned+Checkpoints)
* [FLIP-92: Add N-Ary Stream Operator in Flink](https://cwiki.apache.org/confluence/display/FLINK/FLIP-92%3A+Add+N-Ary+Stream+Operator+in+Flink)
* [FLIP-119: Pipelined Region Scheduling](https://cwiki.apache.org/confluence/display/FLINK/FLIP-119%3A+Pipelined+Region+Scheduling)
* [FLIP-143: Unified Sink API](https://cwiki.apache.org/confluence/display/FLINK/FLIP-143%3A+Unified+Sink+API)
* [FLIP-145: Support SQL windowing table-valued function](https://cwiki.apache.org/confluence/display/FLINK/FLIP-145%3A+Support+SQL+windowing+table-valued+function)
* [FLIP-147: Support Checkpoints After Tasks Finished](https://cwiki.apache.org/confluence/display/FLINK/FLIP-147%3A+Support+Checkpoints+After+Tasks+Finished)
* [FLIP-150: Introduce Hybrid Source](https://cwiki.apache.org/confluence/display/FLINK/FLIP-150%3A+Introduce+Hybrid+Source)
* [FLIP-235: Hybrid Shuffle Mode](https://cwiki.apache.org/confluence/display/FLINK/FLIP-235%3A+Hybrid+Shuffle+Mode)
* [FLIP-296: Extend watermark-related features for SQL](https://cwiki.apache.org/confluence/display/FLINK/FLIP-296%3A+Extend+watermark-related+features+for+SQL)

### Apache Spark (Structured Streaming)

[Apache Spark](https://spark.apache.org/) 对标 Flink 的流计算方案，这里仅放几个相关链接。

* [Structured Streaming Programming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html)
* [What is Apache Spark Structured Streaming?](https://docs.databricks.com/structured-streaming/index.html)

### Apache Beam

[Apache Beam](https://beam.apache.org/) 是 Google Dataflow 论文的开源实现。不过这个系统仅实现了论文当中的模型概念，实际执行计算需要编译到 Flink、Spark 或者 Google Cloud Dataflow 上。下面文档介绍了 Dataflow 论文当中的领域模型是如何落实到 Beam 的代码中的。

* [Apache Beam Programming Guide](https://beam.apache.org/documentation/programming-guide/)

### Materialize

[Materialize](https://materialize.com/) 是一个专有的流数据库。底下执行逻辑基于 [Timely Dataflow](https://timelydataflow.github.io/timely-dataflow/) 和 [Differential Dataflow](https://timelydataflow.github.io/differential-dataflow/) 搭建，Materialize 上层做了一个 Postgres 模型的 SQL 层。

它是微软研究院 Naiad 系统的转世。不过目前通过 SQL 暴露出来的功能还完全没有用上 Timely Dataflow 尤其 Differential Dataflow 的核心能力，到底能不能跑起来集群，集群容错效果如何，都是未知数。

上面链接里 Timely Dataflow 和 Differential Dataflow 的页面是对应的用户文档，可以当做是一个标注详解版的论文参考手册，值得一读。

### RisingWave

正在开发中的流数据库 [RisingWave](https://github.com/risingwavelabs/risingwave) 也开放了 RFC 文档，其中有不少内容可以借鉴学习。我相信他们的研发人员也乐于和有一定基础的开发者做深入的探讨。

* [Unify the materialized source and table](https://github.com/risingwavelabs/rfcs/blob/main/rfcs/0004-unify-materialized-source-and-table.md)
* [Watermark Operators Explained](https://github.com/risingwavelabs/rfcs/blob/main/rfcs/0016-watermark-operators-explained.md)
* [Temporal Filter](https://github.com/risingwavelabs/rfcs/blob/main/rfcs/0018-temporal-filter.md)
* [Dynamic Filter](https://github.com/risingwavelabs/rfcs/blob/main/rfcs/0033-dynamic-filter.md)
* [Temporal Join](https://github.com/risingwavelabs/rfcs/blob/main/rfcs/0049-temporal-join.md)

## 学术论文

首先放一篇调研报告，可以看它引用的论文。后面的是一些我有印象的相关论文，可以看被引用的关系。

* [A Survey on the Evolution of Stream Processing Systems](https://arxiv.org/pdf/2008.00842.pdf)
* [Time, clocks, and the ordering of events in a distributed system](https://dl.acm.org/doi/10.1145/359545.359563)
* [Distributed Snapshots](http://lamport.azurewebsites.net/pubs/chandy.pdf)
* [Lightweight Asynchronous Snapshots for Distributed Dataflows](https://arxiv.org/abs/1506.08603)
* [State Management in Apache Flink](http://www.vldb.org/pvldb/vol10/p1718-carbone.pdf)
* [Watermarks in Stream Processing Systems](http://www.vldb.org/pvldb/vol14/p3135-begoli.pdf)
* [The Dataflow Model](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43864.pdf)
* [Naiad: A Timely Dataflow System](https://sigops.org/s/conferences/sosp/2013/papers/p439-murray.pdf)
* [Differential dataflow](https://www.microsoft.com/en-us/research/wp-content/uploads/2013/01/differentialdataflow.pdf)
* [One SQL to Rule Them All](https://arxiv.org/pdf/1905.12133.pdf)

## 出版书籍

### 流式系统

大名鼎鼎的[《流式系统》](https://book.douban.com/subject/34439870/)其实是 Dataflow 论文的一个超级加长版，扩充了流表二象性和流式 SQL 的内容，必读。

### Fundamentals of Stream Processing Application

[Fundamentals of Stream Processing Application](https://book.douban.com/subject/22017723/) 是基于 IBM InfoSphere 系统介绍流式系统的著作，讲透了很多基础的 Streaming 概念，必读。

### 基于 Apache Flink 的流处理

[Stream Processing with Apache Flink](https://book.douban.com/subject/30152777/) 一本主要介绍流式处理定义、场景和 Flink 的 DataStream API 的书籍，有中文译本。

### Apache Spark 流处理

[Stream Processing with Apache Spark](https://book.douban.com/subject/30152733/) 对标 Flink 的书，讲的是 Spark Structured Streaming 的版本。

### 设计数据密集型应用

[《设计数据密集型应用》](https://book.douban.com/subject/27154352/) 介绍了通用的分布式数据密集型应用的特点，如果你想参与现实世界的流式系统开发，这本书介绍的内容也不可错过。

### 数据库系统内幕

[《数据库系统内幕》](https://book.douban.com/subject/35078474/) 介绍了数据在存储系统上的组织和多年来发展出的数据库查询及事务语义。今天，一个流式系统要想走近用户群体，支持 SQL 和经典数据库语义是不可或缺的。另外，当前流式系统主要面临的问题，就包括状态和中间结果的存储问题。流数据库的物化视图及其级联，就是中间结果的存储和访问问题。
