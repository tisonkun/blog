---
title: 分析时序数据：从 InfluxQL 到 SQL 的演变
date: 2024-06-05
tags:
    - InfluxDB
    - SQL
    - 开源
    - 数据分析
categories:
    - 天工开物
---

近年来，时序数据的增长是 Data Infra 领域一个不容忽视的趋势。这主要得益于万物互联带来的自然时序数据增长，以及软件应用上云和自身复杂化后的可观测性需求。前者可以认为是对联网设备的可观测性，而可观测性主要就建构在设备或应用不断上报的指标和日志等时序数据上。

分析时序数据的演变史几乎是大数据分析演变史的复现，即一开始都是把数据存在关系型数据库上，使用 SQL 分析；而后由于规模增长的速度超过传统技术增长，经历了一个折衷技术的歧出；最终，用户在 SQL 强大的理论框架和生态支持的影响下，回到解决了规模问题的 SQL 方案上来。

对于时序数据来说，这一歧出造成了大量时序数据库自创方言。其中以 InfluxDB 在 V1 版本创造了 InfluxQL 方言，在 V2 版本创造了 Flux 方言，又在 V3 里开始主推 SQL 的演变过程最为有趣。

<!-- more -->

## 查询语言简介

### InfluxQL

[InfluxQL](https://docs.influxdata.com/influxdb/v1/query_language/) 是 InfluxDB V1 自创的查询语言，大体上模仿了 SQL 的结构，以下是一些 InfluxQL 查询的示例：

```sql
SELECT * FROM h2o_feet;
SELECT * FROM h2o_feet LIMIT 5;
SELECT COUNT("water_level") FROM h2o_feet;
SELECT "level description","location","water_level" FROM "h2o_feet";
SELECT *::field FROM "h2o_feet";
```

InfluxDB 设计开发的年代，实现一个数据库的技术远远没有像今天一样有大量人才掌握。因此，尽管 InfluxQL 努力靠近 SQL 的语法，但是在当时，以关系代数为支撑实现完整的 SQL 查询并添加时序扩展是比较困难的。InfluxQL 转而实现了大量专为时序数据分析设计的功能和运算符。例如，所有查询会默认返回时间列并按升序排序，所有查询必须带有 field 列才会返回结果，面向时间线粒度设计的特殊查询语法，等等。

基本上，InfluxQL 就是 InfluxDB 对以数值指标为主的时序数据分析需求的直接翻译。随着 InfluxDB 产品的发展，InfluxQL 还支持连续查询和指定保留策略，以实现某种程度的实时数据处理。

虽然 InfluxQL 在 InfluxDB V2 中也能使用，但是由于 InfluxDB V2 主推 Flux 查询语言，使用 InfluxQL 会面临一系列[模型失配导致的额外挑战](https://docs.influxdata.com/influxdb/v2/query-data/influxql/)。

### Flux

[Flux](https://docs.influxdata.com/flux/v0/) 是 InfluxDB V2 自创的查询语言。不同于 InfluxQL 模仿 SQL 的语法结构，Flux 的语法应该算作 DataFrame 的流派。Elixir 的开发者大概会对 Flux 的语法感到亲切，以下是 Flux 查询的示例：

```elixir
from(bucket: "example-bucket")
    |> range(start: -1d)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> mean()
    |> yield(name: "_result")
```

从设计理念上说，Flux 的目的是要支持各种数据源上的时序数据的联合分析。它允许用户从时序数据库（InfluxDB）、关系型数据库（PostgreSQL 或 MySQL），以及 CSV 文件上获取数据，然后进行分析。例如，可以用 `sql.from` 或 `csv.from` 相关的语法从数据源拉取数据，替代上述示例中 `from(bucket)` 的部分，后接其他分析算子。

Flux 语言只能在 InfluxDB V2 中使用，V1 上不支持，V3 上被[弃用](https://docs.influxdata.com/flux/v0/future-of-flux/)。原因想必大家看完上面这个例子也可以想象：学习成本巨高。更不用说没有专业的语言开发者支持，要在扩展语法的同时修复各种设计实现问题，这几乎是不可负担的工程成本。

### SQL

SQL 大家耳熟能详了。它的大名是结构化查询语言（Structured Query Language），理论基础是关系代数。

不同于从业务中生长出来的，专为业务场景定制的方言，SQL 有坚实的理论支持。从 E. F. Codd 发表了经典论文 [A Relational Model of Data for
Large Shared Data Banks](https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf) 之后，五十多年来积累在关系型数据库上的研究汗牛充栋。

尽管各家 SQL 数据库都会实现独特的扩展，有时让用户也挺摸不着头脑，但是在关系代数理论的支持下，基本的查询分析能力，每一个 SQL 数据库都能一致实现。如果在十几二十年前，或许 Data Infra 的舆论场还会出现 SQL 已死或者 NoSQL 才是未来的论调。但是在今天，毫无疑问 SQL 作为数据分析的默认选择已经王者归来。几十年来，SQL 不断地被改进和扩展，并经由一系列久经考验的实现推广，在全球范围内得到了广泛采用。

InfluxDB V3 号称实现了 SQL 查询的支持，并在该版本中推荐用户使用 SQL 分析时序数据。GreptimeDB 在技术选型上和 InfluxDB V3 不谋而合，率先自主实现了面向时序数据的 SQL 数据库，并在多个严肃生产环境当中部署使用。

抛开时序查询扩展不谈，在 GreptimeDB 上可以用[标准 SQL 执行查询](https://docs.greptime.com/user-guide/query-data/sql)：

```sql
SELECT idc, AVG(memory_util) FROM system_metrics GROUP BY idc;
```

SQL 的理论支持帮助新的时序数据库可靠地实现复杂的查询逻辑，以及完成日常数据管理任务。SQL 丰富的生态，也使得新的时序数据库能够快速接入到数据分析的技术栈上。例如，此前制作的[输入行为分析示例](https://github.com/GreptimeTeam/demo-scene/tree/main/keyboard-monitor)，就利用 GreptimeDB 支持 MySQL 协议这点，零成本地集成到 Streamlit 上实现了可视化。

## 时序分析的挑战

### SQL

虽然 SQL 有着理论支持强大和分析生态丰富两个核心优势，但是在传统的 SQL 数据库在处理时序数据时仍然会面临一系列的挑战，其中最突出的就是数据规模带来的挑战。

时序数据的价值密度大多数时候非常低。设备上传的信息大部分时候你都不会专门去看，应用上报自己状态健康的数据，也不需要额外留意。因此，存储时间数据的成本效率就至关重要。如何利用新时代的云共享存储降低成本，通过针对时序数据的极致压缩来减少数据本身需要的容量，都是时序数据库需要研究的课题。

此外，如何高效地从大量时序数据中提取关键信息，很多时候确实需要特定的查询扩展来优化。GreptimeDB 支持 [RANGE QUERY](https://docs.greptime.com/user-guide/query-data/sql#aggregate-data-by-time-window) 以帮助用户分析特定时间窗口下的数据聚合就是一个例子。

### Flux

毋庸赘言，学习成本就杀死了这个方言。同样，复述一遍前文的观点，作为一个单一提供商独木难支的方言，其语言本身的健壮性，性能优化能做的投入，以及生态的开发，都面临巨大的挑战，更不用说现在这个唯一提供商还放弃了继续发展 Flux 方言。这下已死勿念了。

### InfluxQL

虽然 InfluxQL 查询写起来有些像 SQL 的语法，但是其中细微的区别还是非常让人恼火的。而且，即使努力的 Cosplay SQL 的语法，InfluxQL 从根上还是一个从主要关注指标的时序分析业务需求长出来的方言。它在后续开发和维护成本上的挑战和 Flux 不会有本质的差别。

例如，InfluxQL 不支持 JOIN 查询。虽然你可以写类似 `SELECT * FROM "h2o_feet", "h2o_pH"` 这样的查询，但是它的含义是分别读出两个 measurement 上的数据（😅）：

```
> SELECT * FROM "h2o_feet","h2o_pH"

name: h2o_feet
--------------
time                   level description      location       pH   water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica        2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek        8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica        5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica        4.938

name: h2o_pH
------------
time                   level description   location       pH   water_level
2015-08-18T00:00:00Z                       santa_monica   6
2015-08-18T00:00:00Z                       coyote_creek   7
[...]
2015-09-18T21:36:00Z                       santa_monica   8
2015-09-18T21:42:00Z                       santa_monica   7
```

此外，虽然 InfluxDB V3 在强烈的用户呼声下支持了 InfluxQL 以帮助用户逐步迁移到新版本，但是 InfluxDB V3 主推的还是基于 SQL 的查询方案。换句话说，大胆点判断，InfluxQL 也是一个已死勿念的方言。

> 注意 InfluxQL 是查询方言，不包括 InfluxDB 行协议（Line Protocol）的部分。InfluxDB 行协议是一个简洁、完整、高效的数据写入接口。它几乎没有再开发和维护的成本，并且通过 Telegraf 的插件生态，能够快速跟一系列数据上报方案做集成。

## 如何迁移到 SQL 分析

上文提到，InfluxDB V3 仍然支持 InfluxQL 的核心原因是用户需求。诚然，InfluxDB 过去很长一段时间可说是时序数据库的代名词，并且现在仍然是 DB-Engines 上时序数据分类中最高影响力的数据库。因此，不少时序数据分析的用户现有的分析逻辑是用 InfluxQL 写成的。

这里介绍 InfluxQL 跟 SQL 的核心不同，从而说明如何从 InfluxQL 迁移到 SQL 分析。

### 时间列

应用逻辑迁移当中，最重要的一个区别就是 **SQL 对时间列没有特殊的处理**，而 **InfluxQL 会默认返回时间列，且结果按时间戳升序排列**。SQL 查询需要显式指定时间列以在结果集中包含时间戳，也需要手动指定排序逻辑。

数据写入时，InfluxQL 会默认自动用当前时间填充时间列，而 SQL 必须手动指定时间列的值。如果是当前时间，也需要明确写出：

```sql
-- InfluxQL
INSERT INTO "measurement" (tag, value) VALUES ('my_tag', 42);
-- SQL
INSERT INTO measurement (ts, tag, value) VALUES (NOW(), 'my_tag', 42);
```

InfluxQL 不支持一个 INSERT 语句插入多列，SQL 数据库通常支持一个 INSERT 语句插入多列：

```sql
INSERT INTO measurement (ts, tag, value) VALUES (NOW(), 'my_tag_0', 42), (NOW(), 'my_tag_1', 42);
```

此外，InfluxQL 查询使用 `tz()` 函数指定查询的时区，而 SQL 通常有其他设定时区的方式。例如，GreptimeDB 支持 [MySQL](https://docs.greptime.com/user-guide/clients/mysql#time-zone) 和 [PostgreSQL](https://docs.greptime.com/user-guide/clients/postgresql#time-zone) 设置时区的语法。

### 时间线

InfluxQL 有一些时间线粒度的查询语法，例如 `SLIMIT` 和 `SOFFSET` 等。

`SLIMIT` 会限制结果集中单个时间列返回数据的数量，例如 `SLIMIT 1` 意味着每个时间列最多返回一个符合过滤条件的结果。

SQL 不是专为时序数据分析设计的，因此需要一些取巧的手段，例如：

```sql
SELECT DISTINCT ON (host) * FROM monitor ORDER BY host, ts DESC;
```

这个查询返回以 host 为标签区分的时间列，每个时间列唯一一个结果：

```
+-----------+---------------------+------+--------+
| host      | ts                  | cpu  | memory |
+-----------+---------------------+------+--------+
| 127.0.0.1 | 2022-11-03 03:39:58 |  0.5 |    0.2 |
| 127.0.0.2 | 2022-11-03 03:39:58 |  0.2 |    0.3 |
+-----------+---------------------+------+--------+
```

通常，时序数据库会实现各自的语法扩展或特殊函数来支持时间列粒度的查询。

### 时间间隔

InfluxQL 的时间间隔语法形如 `1d` 或 `12m` 等，SQL 的时间间隔语法有标准：

```sql
INTERVAL '1 DAY'
INTERVAL '1 YEAR 3 HOURS 20 MINUTES'
```

### 数据列和标签列

InfluxQL 从模型上就区分了数据列和标签列，只 SELECT 了标签列的查询是查不出数据的。此外，InfluxQL 支持 `::field` 和 `::tag` 后缀来指定数据列或标签列，并由此支持同名的数据列和标签列。

SQL 标准不区分数据列和标签列，都是普通的一列。不过在具体系统实现上，可能会对概念做一些映射。例如，GreptimeDB 的[数据模型](https://docs.greptime.com/user-guide/concepts/data-model)就区分了时间列、标签列和数据列，并有对应的映射规则。

![GreptimeDB 的数据模型](time-series-data-model.svg)

### 函数名称

部分函数的名称未必相同。例如，InfluxQL 当中的 `MEAN` 函数对应 SQL 当中的 `AVG` 函数。

其他函数，例如 `COUNT` / `SUM` / `MIN` 等等，许多还是相同的。

### 标识符

InfluxQL 的标识符很多时候需要用双引号括起来，而 SQL 则支持无引号的标识符。

值得注意的是，SQL 的标识符默认是大小写不敏感的，如果需要大小写敏感的标识符，则需要用对应的引号括起来。在 GreptimeDB 当中，默认是用双引号括起。但是在 MySQL 或 PostgreSQL 客户端链接上来的时候，会尊重对应方言的语法。

InfluxQL 标识符引号的部分使用区别示例如下：

| InfluxQL                                | SQL                                    |
| --------------------------------------- | -------------------------------------- |
| WHERE("value") > 42                     | where value_col > 42                   |
| GROUP BY "tag"                          | GROUP BY tag_col                       |
| SELECT MEAN("value") FROM "measurement" | SELECT AVG(value_col) FROM measurement |

### JOIN

InfluxQL 不支持 JOIN 查询，SQL 数据库的一个重要甚至是基础能力就是支持 JOIN 查询：

```sql
-- Select all rows from the system_metrics table and idc_info table where the idc_id matches
SELECT a.* FROM system_metrics a JOIN idc_info b ON a.idc = b.idc_id;

-- Select all rows from the idc_info table and system_metrics table where the idc_id matches, and include null values for idc_info without any matching system_metrics
SELECT a.* FROM idc_info a LEFT JOIN system_metrics b ON a.idc_id = b.idc;

-- Select all rows from the system_metrics table and idc_info table where the idc_id matches, and include null values for idc_info without any matching system_metrics
SELECT b.* FROM system_metrics a RIGHT JOIN idc_info b ON a.idc = b.idc_id;
```

以上是来自 [GreptimeDB JOIN](https://docs.greptime.com/reference/sql/join) 的示例。目前时序数据库在 JOIN 查询上支持最全的应该是 [QuestDB](https://questdb.io/docs/reference/sql/join/) 数据库。

### 时间范围查询

InfluxQL 的 GROUP BY 语句支持传递一个时间间隔，以按照特定长度的时间窗口来聚合数据。

SQL 没有这样特定的查询能力，最接近的应该是 `OVER ... PARTITION BY` 的语法，但是这个语法还挺难理解的。

支持 SQL 的时序数据库大多会实现自己的范围查询扩展：

* [GreptimeDB RANGE QUERY](https://docs.greptime.com/user-guide/query-data/sql#aggregate-data-by-time-window)
* [TimescaleDB Time Bucket](https://docs.timescale.com/use-timescale/latest/time-buckets/)
* [QuestDB WHERE IN](https://questdb.io/docs/reference/sql/where/#time-range-where-in)

GreptimeDB 的 RANGE QUERY 是其中最强大的。不过其中 `ALIGN` / `RANGE` / `FILL` 的含义和应该出现的位置需要一点点学习成本，我应该近期会写一篇文章来讨论这个场景的需求和 RANGE QUERY 的实现。

### 持续聚合

InfluxQL 支持[持续聚合](https://docs.influxdata.com/influxdb/v1/query_language/continuous_queries/)，这在 SQL 当中是标准的物化视图（Materialized View）的需求，TimescaleDB 就使用了 `MATERIALIZED VIEW` 的相关语法来实现持续聚合。

不过物化视图在大部分 SQL 数据库中的实现都比较脆弱，目前仍然是一个有待探索的领域。部分时序数据库会实现自己的持续集合方案，例如 [GreptimeDB 基于数据流引擎实现了持续聚合](https://mp.weixin.qq.com/s/BDaXjui2wOc7PIxcqv5WJw)。
