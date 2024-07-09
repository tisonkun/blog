---
title: 改良 SQL Interval 语法：一次开源贡献的经历
date: 2024-07-09
tags:
    - 开源
    - 开源协同
    - 开源社群
    - GreptimeDB
categories:
    - 夜天之书
---

本文是 GreptimeDB 首位独立 Committer Eugene Tolbakov 所作。

在上一篇文章[《GreptimeDB 首位独立 Committer Eugene Tolbakov 是怎样炼成的？》](https://mp.weixin.qq.com/s/tYYZeWJWQagTpNcSg2m0BA)当中，我从社群维护者的视角介绍了 Eugene 的参与和成长之路。这篇文章是在此之后 Eugene 受到激励，从自己的角度出发，结合最近为 GreptimeDB 改良 SQL Interval 语法的实际经历，分享他对于开源贡献的看法和体验。

以下原文。

---

<!-- more -->

开发者参与开源贡献的动机不尽相同。

开源贡献本身是一种利用自身技能和时间，回馈社群和造福更广大受众的方式。开源社群是一个绝佳的环境。参与贡献的人在其中能够与高水平开发者自由交流并建立联系，甚至可能找到可靠的导师或合作者。对于寻求职业发展的开发者，开源贡献可以作为个人技能和经验的展示。当然，也有许多开发者参与贡献只是出于个人的热爱。这很好！当你真正投入到一个开源项目当中后，你可能会发现软件的缺陷或缺失的功能。通过提交补丁修复问题或实现功能，不仅可以消除挫败感，还能让每个使用该软件的用户都受益。

成功参与开源贡献的秘诀不仅仅是编写代码。强烈的学习欲望才是內源动力，由此推动开发者才会主动了解本不熟悉的代码库，并应对其中出现的种种挑战。社群的及时响应和其他资深成员的支持，是这种学习欲望转换为真正参与贡献的重要保障。

社群的及时响应让开源开发者感到宾至如归；其他资深成员提供的指导和反馈，帮助新成员改进自己的贡献水平。理想情况下，你应该可以测试自己的补丁，并将修改版本应用到工作或个人项目当中。这种来自真实世界的需求，尤其是本人的需求，为开源贡献提供了重要的使用场景支撑，确保你的贡献是真的有用，而不是闭门造车的产物。只有如此，通过开源参与做出的贡献才能对整个社群产生持久的影响。

回到我本人的例子上来。虽然我已经花了不少时间锻炼自己的软件开发技能，但事 Rust 对我来说仍然颇有挑战。这种“新手”的感觉可能会让一些人不愿做出贡献，担心他们的代码不够好。然而，我把愚蠢的错误当作提高技能的垫脚石，而不是气馁的理由。

在 [GreptimeDB 社群](https://github.com/GreptimeTeam/greptimedb)一年多的参与贡献经历，是一段不断学习并获得丰厚回报的旅程。今天，我会向你介绍其中的一次具体的贡献。让我们亲自动手吧！（或者我应该说，爪子？🦀）

## 动机和背景

这次贡献主要的目的是支持一个 SQL Interval 字面量的[简化语法](https://github.com/GreptimeTeam/greptimedb/issues/4168)：

```sql
select interval '1h';
```

SQL 标准定义了 Interval 的语法：

```sql
select interval '1 hour';
```

这个语法相对冗长，我们希望支持上面展示的简化语法，让 `select interval '1 hour'` 和 `select interval '1h'` 返回相同的结果。

深入研究代码后，我发现处理转换的核心功能已经存在。为了实现上面的效果，只需针对 Interval 数据类型添加一条新规则：把简化语法格式的 Interval 将自动扩展为标准语法。让我们仔细看看代码中执行相关逻辑的部分：

```rust
fn visit_expr(&self, expr: &mut Expr) -> ControlFlow<()> {
  match expr {
    Expr::Interval(interval) => match *interval.value.clone() {
        Expr::Value(Value::SingleQuotedString(value)) => {
            if let Some(data) = expand_interval_name(&value) {
                *expr = create_interval_with_expanded_name(
                    interval,
                    single_quoted_string_expr(data),
                );
            }
        }
        Expr::BinaryOp { left, op, right } => match *left {
            Expr::Value(Value::SingleQuotedString(value))=> {
                if let Some(data) = expand_interval_name(&value) {
                    let new_value = Box::new(Expr::BinaryOp {
                        left: single_quoted_string_expr(data),
                        op,
                        right,
                    });
                    *expr = create_interval_with_expanded_name(interval, new_value);
                }
// ...
```

## 代码评审

上面是我第一次尝试写成的代码。GreptimeDB 的资深 Rust 开发者 Dennis 很快发现了[改进空间](https://github.com/GreptimeTeam/greptimedb/pull/4220#discussion_r1655250624)：

![Dennis 发现了不必要的复制](dennis-comment.png)

代码评审是一个优秀的学习渠道。

除了简单地接受建议（因为“减少复制”的理由很明确！），我决定深入研究。通过分析建议并尝试自己解释，我巩固了对 Rust 代码和最佳实践的理解。

### 避免不必要的 Clone 和所有权转移

起初，我直接在 `interval.value` 上调用 `clone` 来取得一个具有所有权的结构：

```rust
match *interval.value.clone() { ... }
```

这里的 clone 每次都会创建一个新的数据实例，如果数据结构很大或克隆成本很高，那么这可能是一个性能的影响因子。Dennis 建议通过使用引用来避免这种情况：

```rust
match &*interval.value { ... }
```

匹配引用（`&*interval.value`）避免了 clone 的开销。同样的手法可以用在对二元运算符 `left` 的匹配逻辑里：

```rust
match &**left { ... }
```

这个稍微复杂一些：它使用双重解引用来获取对 `Box` 内部值的引用。因为我们只需要读取数据结构中的部分信息，而不需要转移所有权，因此只获取引用是可行的。这也减少了 clone 的开销。

### 清晰的模式匹配

在模式匹配中使用引用可以强调仅读取数据而不是转移所有权的意图：

```rust
match &*interval.value { ... }
```

### 只在需要所有权的时候进行克隆

在第一版代码当中，`op` 和 `right` 总是被复制一份：

```rust
let new_value = Box::new(Expr::BinaryOp {
    left: single_quoted_string_expr(data),
    op,
    right,
});
```

但是，其实克隆只需发生在匹配左侧变量是 `Expr::Value` 的 `SingleQuotedString` 变体，同时 `expand_interval_name` 成功的情况下。Dennis 建议把 `clone` 调用移动到 `if let` 块内，从而只在需要所有权的时候进行克隆：

```rust
if let Some(data) = expand_interval_name(&value) {
    let new_value = Box::new(Expr::BinaryOp {
        left: single_quoted_string_expr(data),
        op: op.clone(),
        right: right.clone(),
    });
// ...
```

### 直接引用

在第一版代码当中，我用 `expand_interval_name(&value)` 显式借用了 `value` 的值。

然而，`value` 是 `String` 类型的值，它实现了 `AsRef<str>` 特质，所以它可以被自动解引用成 `&str` 类型。修改后的版本直接写成 `expand_interval_name(value)` 不需要再手动 `&` 取引用。

> 译注：
>
> 这个说的不对。其实是因为 String 实现了 `Deref<Target=str>` 所以不 clone 以后 `&String` 可以被自动转成 `&str` 类型，但是之前 clone 的时候传过去的是带所有权的 `String` 类型结构，这个时候 `&value` 取引用而不是把带所有权的结构整个传过去是必要的。
>
> Deref 的魔法可以查看[这个页面](https://doc.rust-lang.org/std/ops/trait.Deref.html#deref-coercion)。

## 总结

在这次贡献当中，代码的“效率”体现在以下三个方面：

* 避免不必要的克隆，减少运行时开销；
* 让借用和所有权转移的模式更清晰和安全；
* 提升整体的可读性和可维护性。

最终版本的 `visit_expr` 大致如下：

```rust
fn visit_expr(&self, expr: &mut Expr) -> ControlFlow<()> {
  match expr {
      Expr::Interval(interval) => match &*interval.value {
        Expr::Value(Value::SingleQuotedString(value))
        | Expr::Value(Value::DoubleQuotedString(value)) => {
            if let Some(normalized_name) = normalize_interval_name(value) {
                *expr = update_existing_interval_with_value(
                    interval,
                    single_quoted_string_expr(normalized_name),
                );
            }
        }
        Expr::BinaryOp { left, op, right } => match &**left {
            Expr::Value(Value::SingleQuotedString(value))
            | Expr::Value(Value::DoubleQuotedString(value)) => {
                if let Some(normalized_name) = normalize_interval_name(value) {
                    let new_expr_value = Box::new(Expr::BinaryOp {
                        left: single_quoted_string_expr(normalized_name),
                        op: op.clone(),
                        right: right.clone(),
                    });
                    *expr = update_existing_interval_with_value(interval, new_expr_value);
                }
            }
            _ => {}
        },
        _ => {}
    },
// ...
```

开源贡献是我找到的加速 Rust 学习的绝佳方式。参与贡献 GreptimeDB 只是一个例子，说明了我如何通过开源贡献获得知识。根据读者反馈，我很高兴在未来的帖子中分享更多这些学习经验！

非常感谢整个 Greptime 团队，特别是 Dennis 提供的帮助和指导，感谢他们在我贡献过程中的支持和指导。让我们继续贡献和学习！
