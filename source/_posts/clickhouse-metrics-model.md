---
title: ClickHouse 社群指标模型
date: 2022-07-25
tags:
    - 开源
    - 指标
    - 运营
    - ClickHouse
categories:
    - 夜天之书
---

数字化时代下绝大多数工作都有关键绩效指标（KPI）指导，任何组织都期望找到一个合理的指标来校准战略方向，衡量工作成果。

然而，并非所有工作都能有 KPI 准确地衡量产出。著名软件工程师，同时也是《重构》《分析模式》等书籍的作者 Martin Fowler 曾经写过一篇博客论证[软件工程师的生产力是无法衡量的](https://martinfowler.com/bliki/CannotMeasureProductivity.html)。

开源社群成员的重要组成部分，也是一切价值的核心飞轮就是这样一群软件工程师。这是否意味着开源社群的工作也是无法衡量的吗？

我认为，目前探索所及的一切开源社群指标都是人的活动产生的，并且这里的人都是匿名的网络用户。这样的背景下，如果有人背负着必须提高某个指标的任务，在不论对社群协作造成的次生影响的前提下，几乎所有指标都是可以做出来的。因此，只是考察社群指标的结果数字，甚至为了掩饰自己不愿意理解社群运作的深层逻辑，而要求组织的社群协调员以某种归一化的分数来汇报社群指标，都不能达到撬动社群杠杆完成组织生产力增效的目的。

但是，没有北极星指标引领社群工作方向，难免会导致社群成员对自己所在的社群正处于一种什么状态缺乏清晰的认识。不是将指标作为目标结果，而是以定性和定量的指标来辅助校准社群发展的方向和衡量社群工作的效率，这样的工作是有价值的。

[Apache 成熟度模型](https://guides.tisonkun.org/apache-maturity-model/)就是一个定性模型，从代码、版权、发布、质量、社群、共识和独立性七个方面衡量一个软件项目是否符合 Apache 开源之道。绝大部分从 Apache 孵化器毕业的项目在毕业前都会准备一份对应成熟度模型的报告，例如 Apache Pulsar 在毕业之际就专门撰写了一份[社群成熟度报告](https://github.com/apache/pulsar/wiki/Apache-Maturity-Model-Assessment-for-Pulsar)来回应孵化器导师的质询。

近年来，越来越多的企业和组织认识到社群运营的重要性。除了定性的指标以外，这些企业和组织投入的人力和资金也使得探索定量指标得到了更多的支持。这其中值得关注的两个，就是 [orbit.love](https://orbit.love/) 的[轨道模型](https://orbitmodel.com/)和 ClickHouse 社群基于 GitHub Events 全域公开数据进行的社群分析。

相比之下，orbit.love 的轨道模型不只是针对开源社群，而是针对普遍的社群运营行为及其结果的建模，定义更加严谨，理论更加丰富。ClickHouse 社群的指标模型是从使用自家软件分析社群活动出发，目前还停留在比较简单的统计分析的阶段上。

本文以 [ClickHouse 的社群分析报告](https://ghe.clickhouse.tech/)为基础，看看从 GitHub Events 全域数据能够进行哪些数字化社群指标分析。

<!-- more -->

## 准备工作

本文的结果均基于 ClickHouse 提供的 GitHub Events 公开数据集查询产生，任何读者都应该可以复现相同的查询。由于数据集每天都会更新，因此不同时间查询的结果可能会有所出入。

要想查询这个公开数据集，最简单的方式是下载 ClickHouse 的命令行工具：

```sh
curl https://clickhouse.com/ | sh
```

如果一切顺利，应该可以看到 `clickhouse` 可执行文件下载成功，通过下面的命令连接到公开数据集：

```sh
./clickhouse client --secure --host play.clickhouse.com --user explorer
```

如果上述操作不成功，可以阅读官方的[开始文档](https://clickhouse.com/docs/en/quick-start/)或者到[项目 GitHub Discussions 的提问区](https://github.com/ClickHouse/ClickHouse/discussions/categories/q-a)提问。

成功连接到数据集后，可以查询全域被 star 过次数最高的仓库来作为本次旅途的 Hello world 步骤：

```sql
SELECT repo_name, count() AS stars FROM github_events WHERE event_type = 'WatchEvent' GROUP BY repo_name ORDER BY stars DESC LIMIT 1;
/*
┌─repo_name──────┬──stars─┐
│ 996icu/996.ICU │ 359029 │
└────────────────┴────────┘
*/
```

## 关联社群

探索关注到特定项目的参与者也会关注哪些其他项目。

```sql
SELECT
    repo_name,
    count() AS stars
FROM github_events
WHERE (event_type = 'WatchEvent') AND (actor_login IN
(
    SELECT actor_login
    FROM github_events
    WHERE (event_type = 'WatchEvent') AND (startsWith(repo_name, 'apache/pulsar'))
)) AND (NOT startsWith(repo_name, 'apache/pulsar'))
GROUP BY repo_name
ORDER BY stars DESC
LIMIT 5;
/*
┌─repo_name────────────────────────┬─stars─┐
│ ant-design/ant-design            │  3810 │
│ kubernetes/kubernetes            │  3540 │
│ donnemartin/system-design-primer │  3416 │
│ pingcap/tidb                     │  3226 │
│ golang/go                        │  3225 │
└──────────────────────────────────┴───────┘
*/

SELECT
    repo_name,
    count() AS stars
FROM github_events
WHERE (event_type = 'WatchEvent') AND (actor_login IN
(
    SELECT actor_login
    FROM github_events
    WHERE (event_type = 'WatchEvent') AND (startsWith(repo_name, 'apache/flink'))
)) AND (NOT startsWith(repo_name, 'apache/flink'))
GROUP BY repo_name
ORDER BY stars DESC
LIMIT 5;
/*
┌─repo_name─────────────┬─stars─┐
│ apache/spark          │  6722 │
│ tensorflow/tensorflow │  6515 │
│ 996icu/996.ICU        │  5680 │
│ ant-design/ant-design │  5551 │
│ kubernetes/kubernetes │  5461 │
└───────────────────────┴───────┘
*/
```

可以看到，这个指标下被筛选出来的项目往往是热门项目，而不是与自己社群相关的其他项目。只有类似 Flink 和 Spark 这样同时都是热门项目的情况，才有可能把关联项目筛选出来。这也侧面提示了前文提到的，指标只能提供侧面辅助作用，最终需要熟悉社群运作和实际运行情况的人来解释。

为了提高关联度，我们筛选项目关注人员里，同时关注我们项目的人占比最高的那些。

```sql
SELECT
    repo_name,
    uniq(actor_login) AS total_stars,
    uniqIf(actor_login, actor_login IN
    (
        SELECT actor_login
        FROM github_events
        WHERE (event_type = 'WatchEvent') AND (startsWith(repo_name, 'apache/pulsar'))
    )) AS our_stars,
    round(our_stars / total_stars, 2) AS ratio
FROM github_events
WHERE (event_type = 'WatchEvent') AND (NOT startsWith(repo_name, 'apache/pulsar'))
GROUP BY repo_name
HAVING total_stars >= 100
ORDER BY ratio DESC
LIMIT 5;
/*
┌─repo_name──────────────────┬─total_stars─┬─our_stars─┬─ratio─┐
│ streamnative/pulsarctl     │         105 │        81 │  0.77 │
│ kuangye098/Pulsar-analysis │         107 │        75 │   0.7 │
│ bbonnin/pulsar-express     │         105 │        71 │  0.68 │
│ streamnative/pulsar-flink  │         260 │       165 │  0.63 │
│ streamnative/kop           │         332 │       196 │  0.59 │
└────────────────────────────┴─────────────┴───────────┴───────┘
*/

SELECT
    repo_name,
    uniq(actor_login) AS total_stars,
    uniqIf(actor_login, actor_login IN
    (
        SELECT actor_login
        FROM github_events
        WHERE (event_type = 'WatchEvent') AND (startsWith(repo_name, 'apache/flink'))
    )) AS our_stars,
    round(our_stars / total_stars, 2) AS ratio
FROM github_events
WHERE (event_type = 'WatchEvent') AND (NOT startsWith(repo_name, 'apache/flink'))
GROUP BY repo_name
HAVING total_stars >= 100
ORDER BY ratio DESC
LIMIT 5;
/*
┌─repo_name───────────────────────────┬─total_stars─┬─our_stars─┬─ratio─┐
│ ververica/flink-jdbc-driver         │         122 │        89 │  0.73 │
│ docker-flink/docker-flink           │         154 │       112 │  0.73 │
│ flink-extended/flink-remote-shuffle │         163 │       119 │  0.73 │
│ nexmark/nexmark                     │         180 │       124 │  0.69 │
│ ververica/stateful-functions        │         268 │       182 │  0.68 │
└─────────────────────────────────────┴─────────────┴───────────┴───────┘
*/
```

可以看到，项目的相关性大幅增强了。进一步地，我们可以通过增加项目集合的大小或筛选已知项目来逐步探索生态项目。

除了 star 这样动动手指就能做到的动作，如果一个参与者提出实际提出一个问题、提交一个补丁或者参与讨论，这样的行为所需要的动机更加强烈。我们也可以试着从 issue 和 PR 的角度来观察项目之间的相关性。

```sql
SELECT
    repo_name,
    count() AS prs,
    uniq(actor_login) AS authors
FROM github_events
WHERE (event_type = 'PullRequestEvent') AND (action = 'opened') AND (actor_login IN
(
    SELECT actor_login
    FROM github_events
    WHERE (event_type = 'PullRequestEvent') AND (action = 'opened') AND startsWith(repo_name, 'apache/pulsar')
)) AND (NOT startsWith(repo_name, 'apache/pulsar'))
GROUP BY repo_name
ORDER BY authors DESC
LIMIT 5;
/*
┌─repo_name──────────────┬──prs─┬─authors─┐
│ apache/bookkeeper      │ 1761 │      96 │
│ apache/flink           │  726 │      46 │
│ streamnative/kop       │  529 │      34 │
│ apache/spark           │ 1033 │      28 │
│ streamnative/pulsarctl │  227 │      26 │
└────────────────────────┴──────┴─────────┘
*/

SELECT
    repo_name,
    count() AS issues,
    uniq(actor_login) AS authors
FROM github_events
WHERE (event_type = 'IssuesEvent') AND (action = 'opened') AND (actor_login IN
(
    SELECT actor_login
    FROM github_events
    WHERE (event_type = 'IssuesEvent') AND (action = 'opened') AND startsWith(repo_name, 'apache/pulsar')
)) AND (NOT startsWith(repo_name, 'apache/pulsar'))
GROUP BY repo_name
ORDER BY authors DESC
LIMIT 5;
/*
┌─repo_name─────────────────┬─issues─┬─authors─┐
│ apache/bookkeeper         │    815 │     105 │
│ streamnative/kop          │    287 │      45 │
│ streamnative/pulsar-flink │    163 │      42 │
│ kubernetes/kubernetes     │     69 │      41 │
│ golang/go                 │    139 │      40 │
└───────────────────────────┴────────┴─────────┘
*/
```

可以看到，Pulsar 与部署集群的直接依赖 BookKeeper 项目，以及生态伙伴 Flink 项目和 Spark 项目是紧密联系的。StreamNative 围绕 Pulsar 打造了一系列的开源生态项目。

## 成员活动

接下来我们把目光放到单个项目群之内，看看社群当中的最活跃的 Code Reviewer 是谁。

```sql
SELECT
    actor_login,
    count(),
    uniq(repo_name) AS repos,
    uniq(repo_name, number) AS prs
FROM github_events
WHERE (event_type = 'PullRequestReviewCommentEvent') AND (action = 'created') AND startsWith(repo_name, 'apache/pulsar')
GROUP BY actor_login
ORDER BY count() DESC
LIMIT 5;
/*
┌─actor_login───┬─count()─┬─repos─┬─prs─┐
│ sijie         │    1828 │     8 │ 531 │
│ codelipenghui │    1599 │     2 │ 648 │
│ eolivelli     │    1482 │     5 │ 592 │
│ Anonymitaet   │    1306 │     8 │ 375 │
│ merlimat      │    1272 │     3 │ 579 │
└───────────────┴─────────┴───────┴─────┘
*/
```

这和绝大部分 Pulsar 参与者的观感是一致的。创始成员 @sijie 和 @merlimat 参与度非常高，目前分别就职于 StreamNative 和 Datastax 的研发领导者 @codelipenghui 和 @eolivelli 位列前三，Pulsar 文档的维护者 @Anonymitaet 也强于积极沟通。

我们可以通过扩大 LIMIT 数量和排除已知的活跃成员，或者将事件按照时间筛选和分区，来发现更多潜在的活跃参与者。

我们还可以聚合成员活动观察社群发展趋势，例如 Pulsar 项目群的 PR 数目在过去两年间的变化。

```sql
SELECT
    toStartOfMonth(created_at) AS date,
    count() AS total_prs,
    uniq(actor_login) AS unique_actors,
    bar(unique_actors, 0, 200, 100)
FROM github_events
WHERE startsWith(repo_name, 'apache/pulsar') AND (event_type = 'PullRequestEvent') AND (action = 'opened') AND (created_at > '2020-01-01 00:00:00')
GROUP BY date
ORDER BY date ASC;
/*
┌───────date─┬─total_prs─┬─unique_actors─┬─bar(uniq(actor_login), 0, 200, 100)───────────┐
│ 2020-01-01 │       149 │            56 │ ████████████████████████████                  │
│ 2020-02-01 │       161 │            62 │ ███████████████████████████████               │
│ 2020-03-01 │       142 │            47 │ ███████████████████████▌                      │
│ 2020-04-01 │       168 │            58 │ ████████████████████████████▊                 │
│ 2020-05-01 │       191 │            63 │ ███████████████████████████████▌              │
│ 2020-06-01 │       208 │            54 │ ███████████████████████████                   │
│ 2020-07-01 │       229 │            74 │ █████████████████████████████████████         │
│ 2020-08-01 │       168 │            55 │ ███████████████████████████▌                  │
│ 2020-09-01 │       190 │            75 │ █████████████████████████████████████▌        │
│ 2020-10-01 │       166 │            60 │ ██████████████████████████████                │
│ 2020-11-01 │       251 │            60 │ ██████████████████████████████                │
│ 2020-12-01 │       250 │            62 │ ███████████████████████████████               │
│ 2021-01-01 │       200 │            63 │ ███████████████████████████████▌              │
│ 2021-02-01 │       249 │            71 │ ███████████████████████████████████▌          │
│ 2021-03-01 │       245 │            58 │ ████████████████████████████▊                 │
│ 2021-04-01 │       251 │            60 │ ██████████████████████████████                │
│ 2021-05-01 │       221 │            68 │ ██████████████████████████████████            │
│ 2021-06-01 │       325 │            89 │ ████████████████████████████████████████████▌ │
│ 2021-07-01 │       248 │            83 │ █████████████████████████████████████████▌    │
│ 2021-08-01 │       193 │            70 │ ███████████████████████████████████           │
│ 2021-09-01 │       289 │            70 │ ███████████████████████████████████           │
│ 2021-10-01 │        33 │            19 │ █████████▌                                    │
│ 2021-11-01 │       383 │            77 │ ██████████████████████████████████████▌       │
│ 2021-12-01 │       402 │            90 │ █████████████████████████████████████████████ │
│ 2022-01-01 │       377 │            77 │ ██████████████████████████████████████▌       │
│ 2022-02-01 │       289 │            85 │ ██████████████████████████████████████████▌   │
│ 2022-03-01 │       352 │            78 │ ███████████████████████████████████████       │
│ 2022-04-01 │       314 │            77 │ ██████████████████████████████████████▌       │
│ 2022-05-01 │       345 │            86 │ ███████████████████████████████████████████   │
│ 2022-06-01 │       325 │            88 │ ████████████████████████████████████████████  │
│ 2022-07-01 │       306 │            76 │ ██████████████████████████████████████        │
└────────────┴───────────┴───────────────┴───────────────────────────────────────────────┘
*/
```

除了 2021 年 11 月的数据部分丢失以外，可以看到 Pulsar 社群每月独立贡献者数量从 50 人左右成长到 80 人左右。如果我们观察一个异军突起的社群，这种变化会更明显。

```sql
SELECT
    toStartOfMonth(created_at) AS date,
    count() AS total_prs,
    uniq(actor_login) AS unique_actors,
    bar(unique_actors, 0, 200, 100)
FROM github_events
WHERE startsWith(repo_name, 'bytebase') AND (event_type = 'PullRequestEvent') AND (action = 'opened')
GROUP BY date
ORDER BY date ASC;
/*
┌───────date─┬─total_prs─┬─unique_actors─┬─bar(uniq(actor_login), 0, 200, 100)─┐
│ 2021-03-01 │         2 │             1 │ ▌                                   │
│ 2021-07-01 │         2 │             2 │ █                                   │
│ 2021-08-01 │         2 │             2 │ █                                   │
│ 2021-09-01 │         2 │             2 │ █                                   │
│ 2021-11-01 │        37 │             7 │ ███▌                                │
│ 2021-12-01 │       226 │            10 │ █████                               │
│ 2022-01-01 │       216 │            14 │ ███████                             │
│ 2022-02-01 │       154 │            16 │ ████████                            │
│ 2022-03-01 │       320 │            19 │ █████████▌                          │
│ 2022-04-01 │       288 │            22 │ ███████████                         │
│ 2022-05-01 │       361 │            19 │ █████████▌                          │
│ 2022-06-01 │       316 │            19 │ █████████▌                          │
│ 2022-07-01 │       345 │            21 │ ██████████▌                         │
└────────────┴───────────┴───────────────┴─────────────────────────────────────┘
*/

SELECT
    toStartOfMonth(created_at) AS date,
    count() AS total_prs,
    uniq(actor_login) AS unique_actors,
    bar(unique_actors, 0, 200, 100)
FROM github_events
WHERE startsWith(repo_name, 'datafuselabs') AND (event_type = 'PullRequestEvent') AND (action = 'opened')
GROUP BY date
ORDER BY date ASC;
/*
┌───────date─┬─total_prs─┬─unique_actors─┬─bar(uniq(actor_login), 0, 200, 100)─┐
│ 2021-02-01 │         2 │             1 │ ▌                                   │
│ 2021-03-01 │        91 │             8 │ ████                                │
│ 2021-04-01 │       163 │            12 │ ██████                              │
│ 2021-05-01 │       135 │            13 │ ██████▌                             │
│ 2021-06-01 │       155 │            16 │ ████████                            │
│ 2021-07-01 │       188 │            17 │ ████████▌                           │
│ 2021-08-01 │       239 │            28 │ ██████████████                      │
│ 2021-09-01 │       222 │            25 │ ████████████▌                       │
│ 2021-10-01 │        42 │            13 │ ██████▌                             │
│ 2021-11-01 │       361 │            36 │ ██████████████████                  │
│ 2021-12-01 │       326 │            43 │ █████████████████████▌              │
│ 2022-01-01 │       274 │            34 │ █████████████████                   │
│ 2022-02-01 │       207 │            36 │ ██████████████████                  │
│ 2022-03-01 │       292 │            34 │ █████████████████                   │
│ 2022-04-01 │       383 │            37 │ ██████████████████▌                 │
│ 2022-05-01 │       404 │            47 │ ███████████████████████▌            │
│ 2022-06-01 │       444 │            45 │ ██████████████████████▌             │
│ 2022-07-01 │       300 │            40 │ ████████████████████                │
└────────────┴───────────┴───────────────┴─────────────────────────────────────┘
*/
```

随着核心团队获得资本投资，持续招募全职人员并在市场上释放协同信号，Bytebase 和 DatafuseLabs 的开源项目群都实现了从 0 到 1 乃至小有规模的增长。

## 总结

ClickHouse 社群指标模型的建设应该开始于 [ClickHouse 10616 号议案](https://github.com/ClickHouse/ClickHouse/issues/10616)。

对于相当部分开源数据处理项目来说，分析自己的开源社群的指标，是一种自然的展示项目价值，并且自己成为自己所制造的软件的用户的好途径。例如，TiDB 在完成 HTAP 能力生产可用建设以后，就发起了 [OSSInsight](https://ossinsight.io/) 项目。虽然在指标思考上不如 ClickHouse 做得这么丰富，但是前端展示水平上要惊艳许多。

另外，ClickHouse 社群的工作也得到了其他致力于开源社群指标衡量的工作小组的关注和引用。例如，X-Lab 开放实验室的赵生宇博士就在其分析工具 [Open Digger](https://github.com/X-lab2017/open-digger) 当中展示了 [ClickHouse GitHub Explorer 的样例](https://github.com/X-lab2017/open-digger/blob/master/notebook/clickhouse_demo.ipynb)。

其实，本文当中没有涉及 ClickHouse 社群分析报告里大量全域分析的内容。例如，GitHub 上名称最长的仓库是哪个，star 增长最快的是哪个，PR 最多的是哪个。这些查询虽然有趣，但是对于指导具体社群运营的前进方向提供的帮助则比较有限，只是简单的统计工作。

不过，一个公开可得的数据集，如果有数据开发工程师投入时间研究写出高水平的查询，还是未来可期。一份公开可用而且好用的数据集本身就是对开源指标衡量的重要贡献，GHArchive 原本的数据可远远称不上好用。

对于数据建模和质量方面，ClickHouse 的数据两个比较明显的问题。一个是可能数据会缺失，例如上面我们看到的 2021 年 11 月 PR 创建数据丢失。这是 GHArchive 数据集本身的问题，对这些数据的补偿修复工作，CNCF 的 [Devstats](https://github.com/cncf/devstats) 项目有一些经验。另一个是 ClickHouse 只记录用户和仓库名而不是唯一标识的 ID 字段，这就使得重命名过的用户、组织和仓库的对应关系需要先验知识补充。当然，即使记录了唯一标识，也有不同账户实际上是同一个自然人的情况，以及项目群聚类时需要合并计算的情况，这都是一般的 ID Mapping 挑战。

此外，ClickHouse 的数据集是历史全量数据，因此适合用于分析历史变化趋势，不同时间段的人群圈选。对于发现目前社群状态下立刻需要解决的问题，例如目前积压 Requested Review 最多的维护者是谁，以提醒或帮助他处理 backlog 这样的需求，直接调用 GitHub REST 或 GraphQL API 查询当前信息会更加合适。

我会在 [Neptune](https://github.com/korandoru/neptune) 项目里逐渐把这两年来发现的指标以网页的形式总结展示出来，希望在目前简单统计 star 数和 contributor 数量的基础上，为指标指导社群工作分享一些心得。不过由于我对前端知识的欠缺、指标开发固有的时间开销，以及本职工作的时间占用，可能进度不会很快。欢迎有前端展示经验的同学评审代码，也欢迎社群运营同学交流经验和提出需求。

赵生宇博士在今年初的时候写过一篇文章[《开放协作的世界里，每一份贡献都值得回报》](https://blog.frankzhao.cn/how_to_measure_open_source_4/)，议论了开源度量为开源生态发展可能带来的价值。结合 ClickHouse 社群自己探索社群指标模型，OSSInsight 项目的成立和发展，Open Digger 持续的迭代，我们有理由相信，度量指标助力社群运营，帮助更多开源社群定位自己目前的健康状况和潜在的发展改进方向将逐渐成为现实。
