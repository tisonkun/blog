---
title: NoSQL Revolution
date: 2022-06-09 10:50:23
tags:
    - NoSQL
    - 数据库
categories:
    - 天工开物
---

从本世纪初谷歌的三篇论文发布以来，数据处理领域在大数据的方向上探索了将近二十年的时间。从三篇论文的开源实现 Hadoop 和 HBase 开始，到打破传统关系型数据库的分布式数据处理系统如雨后春笋般接连诞生，NoSQL 系统回答了移动互联时代的数据爆发式增长的挑战。

诚然，传统的数据库专家对 NoSQL 也有像 [MapReduce: A major step backwards](https://homes.cs.washington.edu/~billhowe/mapreduce_a_major_step_backwards.html) 这样的批评，不过 NoSQL 系统本身也在向传统数据处理领域当中被证明有效的特性靠拢，向 Not Only SQL 系统转变。

本文首先从移动互联时代数据增长和数据模型演进带来的实际问题出发，讨论 NoSQL 系统在现在企业数据处理生态当中的定位和价值。然后介绍 NoSQL 系统靠近 Not Only SQL 定位的过程中遇到的硬核诉求。最后分析新时代 NoSQL 的发展方向。

<!-- more -->

## 数据量的增长带来的挑战

## 数据模型贴近业务的价值

## Not Only SQL 的诉求

## 新时代 NoSQL 的发展方向

KV NoSQL Revolution

- 企业当中用例和诉求的不同。
	- RDBMS - 审核严格，数据资产持久化，数据平台生态。  
	- NoSQL - 业务逻辑、衍生服务快速上线。  

- 数据量的增长、数据模型的需要。
	- Web Scale - 单机 RDBMS 的缺陷。  
        NewSQL - 分库分表的难点（优点），NewSQL = NewNoSQL
        利用协议层兼容其他负载，Kv 是基础，不是要颠覆 NewSQL
	- 数据模型？

- KV 解决方案当中的硬核诉求：  
	- Schema
	- Index (Performance)  
	- Transaction (Consistency)  

- 新时代的 KV NoSQL 的发展方向
    - 满足硬核诉求
    - 低延迟（新引擎）、可扩展性、稳定性
    - 各种数据模型的基础是 KV
        - NewSQL
        - Redis
        - Message Queue
        - Remote State

- 现有系统例子穿插
    - Apache Cassandra
    - Apache HBase
    - Apache Kvrocks (Incubating)
    - ScyllaDB
    - Redis

## 参考材料

谷歌拉开大数据时代的三篇论文：

* [The Google File System](https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf)
* [MapReduce: Simplified Data Processing on Large Clusters](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)
* [Bigtable: A Distributed Storage System for Structured Data](https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf)