---
title: Zig 词法分析
date: 2023-12-08
tags:
    - Zig
categories:
    - 天工开物
    - 译文
---

[Zig](https://ziglang.org/) 语言是近几年来逐渐声名鹊起的一个新编程语言，也是数目稀少的系统编程语言家族中的一个新成员。它由 Andrew Kelley 于 2015 年开始创造，至今已经开发了八个年头，但是仍然还未发布 1.0 版本。

不过，已经有不少新锐项目选择使用 Zig 开发，例如 JavaScript 运行时和完整开发套件 [bun](https://github.com/oven-sh/bun) 和分布式金融数据库 [tigerbeetle](https://github.com/tigerbeetle/tigerbeetle/) 等。

Hashicorp 的创始人 Mitchell Hashimoto 也在前年卸任 CEO 成为 IC 后开始投入大量时间开发 Zig 程序，包括开源的 [libxev](https://github.com/mitchellh/libxev/) 库和目前尚未公开的 [Ghostty](https://www.youtube.com/watch?v=l_qY2p0OH9A&t=331s) 等等。

Mitchell 在开发 Zig 程序的过程中，撰写了[系列博客](https://mitchellh.com/zig)介绍 Zig 程序的编译过程。这些内容有助于理解 Zig 语言的设计，以及它如何在 LLVM 提供的抽象和系统开发者之间建立起一层抽象。

我在取得 Mitchell 的同意后对这些文章做一个翻译，以飨读者。

**以下第一篇博客 Zig Tokenizer 译文。**

<!-- more -->

词法分析是典型编译器流程中的第一步。词法分析是将字节流，即编程语言的语法，转换为 Token 流的过程。

例如，Zig 的 `comptime {}` 语法经过词法分析后，将得到 `[.keyword_comptime, .l_brace, .r_brace]` 的结果。词法分析通常不处理语义问题，也不关心分析得到的 Token 是否有实际意义。例如，`comptime []` 不是有效的 Zig 语法，但是词法分析过程仍然会将其解释为合法的 `[.keyword_comptime, .l_bracket, .r_bracket]` 输出。解析 Token 流的语义以及在无效情况下失败推出，是下一章要介绍的语法分析的内容。

词法分析器的实现方式多种多样。本文主要介绍 Zig 的词法分析工作原理，并不会跟其他的方案做对比。

## Zig 词法分析器

Zig 语言的词法分析器是标准库的一部分，代码位于 [`lib/std/zig/tokenizer.zig`](https://github.com/ziglang/zig/blob/69195d0cd43468f213332c5792df04c941f8313d/lib/std/zig/tokenizer.zig) 文件内，对外暴露为 `std.zig.Tokenizer` 结构。

Zig 词法分析器接受一个字节数组切片作为参数，不断产生 Token 直到遇见结束符（EOF）。词法分析过程没有任何内存分配。

在深入讲解词法分析过程前，我们先看到它的一个基本使用方式：

```zig
const std = @import("std");
const expect = std.testing.expect;

const tok = std.zig.Tokenizer.init("comptime {}");
try expect(tok.next() == .keyword_comptime);
try expect(tok.next() == .l_brace);
try expect(tok.next() == .r_brace);
try expect(tok.next() == .eof);
```

Zig 的词法分析有两个重要特点：

1. 在字节数组切片上操作，而不是字节流。词法分析的参数类型是 `[:0] const u8` 而不是字节流。这意味着如果输入字符量巨大，调用方需要自己处理输入缓存和攒批处理的工作。实践当中，编程语言代码输入一般不会太大，所以整个源文件的词法分析可以一次性完成。这就是 Zig 当前的工作方式。
2. 没有内存分配。Zig 的词法分析器不做任何的堆上内存分配。对于系统编程语言，理解接口的内存使用和分配行为总是有意义的。Zig 的所有分配都是显式的，因此我们可以立即从词法分析器的参数列表中没有 `Allocator` 得到它不会做内存分配的结论。

如下所示，词法分析器结构的定义是相对简单的：

```zig
pub const Tokenizer = struct {
    buffer: [:0]const u8,
    index: usize,
    pending_invalid_token: ?Token,

    // ...
};
```

即使你对词法分析一无所知，从上面结构定义中你也应该能理解词法分析的工作原理。词法分析器逐个处理切片上的字节，同时前移索引并产生 Token 输出。

## Token 的构造

理解了词法分析的高级接口之后，紧接着下一个问题就是：Token 的构造是怎么样的？

Zig 当中 Token 的定义如下：

```zig
pub const Token = struct {
    tag: Tag,
    loc: Loc,

    pub const Loc = struct {
        start: usize,
        end: usize,
    };

    pub const Tag = enum {
        invalid,
        // ...
    };
};
```

其中，`tag` 保存了 Token 的类型，可能的取值包括 `.keyword_comptime, .l_brace, .r_brace, .eof` 等等。目前，Zig 大约定义了 120 个不同的 Token 类型。

此外，`loc` 字段定义了 Token 的位置。它由 `start` 和 `end` 两个索引组成。词法分析的调用者可以通过 `source[tok.loc.start .. tok.loc.end]` 来取得 Token 对应的文本内容。Token 结构中只保存两个索引是一种常见的效率优化手段。

Token 结构中只提供了最基本的信息：Token 的类型及其位置。不过，在不同的词法分析器中，Token 结构的定义可能有所不同。

例如，[Golang 的词法分析器](https://pkg.go.dev/go/scanner@go1.17.6#Scanner.Scan)把 Token 定义成一系列整型常数。同时，对应到 `next()` 的函数返回代表 Token 类型的整数、代表偏移量的单一整数，以及对应 Token 文本内容的字符串。

```go
func (s *Scanner) Scan() (pos token.Pos, tok token.Token, lit string)

type Pos int
type Token int

const (
	ILLEGAL Token = iota

    // ...
)
```

这与 Zig 大致相同。但是其中微妙的差异，对编译器的工效学和性能有重要影响。

## 查找下一个 Token

在词法分析器上每调用一次 `next()` 方法都将得到一个 Token 输出。

`next()` 函数从缓冲区的当前索引开始，逐个字节查看以构建 Token 输出。它使用一个状态变量来实现状态机，以跟踪可能出现的下一个状态。

在分析 Zig 词法分析器的实现细节之前，我们先从高层抽象上思考 `next()` 的工作流程。比如，输入包含空白符的语句 while 如何被分词。

首先，词法分析器会遇到 `w` 字符。此时，我们知道这个 Token 不会是数字，但它仍然可以是关键字或标识符。因此，我们不能确定 Token 的类型。词法分析器每次只看一个字符，所以我们接下来获取 `h` 字符。它仍然可以是标识符或关键字，所以我们继续读取字符，并依次读到 `ile` 三个字符。

现在，词法分析器得到了 `while` 输入，我们知道它是一个独立的关键字。但是，它仍然可以是标识符，因为可能还有更多字符，所以我们需要再向前看一个字符。

下一个输入是空格。我们现在明确知道它是 `while` 关键字，而不是标识符。于是，我们返回 `.keyword_while` Token 作为结果。反之，如果下一个字节是数字 `1` 这样的字符，我们会知道我们正在构建一个标识符，并且它绝不会是一个关键字，因为没有以 `while1` 开头的关键字。

这就是 Zig 词法分析器的工作原理。它维护当前状态，比如“正在构建一个标识符或关键字”，并逐个字符查看，直到明确确定了 Token 的类型和内容。

词法分析器只查看状态和当前字符：它不会向后查看，也不会向前查看。大多数词法分析器都是这样的。正如开头所提到的，词法分析器不关心语义，因此诸如 `if while comptime x = 7 { else }` 这样的无意义输入会产生一个有效的 Token 流。接下来，负责语法分析的解析器会分析 Token 流对应的语义含义。

## Zig 的实现

`next()` 的实现基于嵌套的 `while` 和 `switch` 语句，其中一个代码片段如下：

```zig
while (true) : (self.index += 1) {
    const c = self.buffer[self.index];
    switch (state) {
        .start => switch (c) {
            'a'...'z', 'A'...'Z', '_' => {
                state = .identifier;
                result.tag = .identifier;
            },
        }
    }
}
```

外部的 while 是一个无限循环，每次处理缓冲区里的一个字符。循环体将在发现一个 Token 或字符耗尽时退出。

Zig 的一个好特性是缓冲区 `buffer` 具有 `[:0] const u8` 类型，其中的 `:0` 代表缓冲区以字节 `0` 结尾。因此，我们可以在发现 `0` 是退出循环。

接下来，词法分析器查看当前的 `state` 值。对于每个具体的 `state` 值，词法分析器再查看当前字符的值。结合这两者，词法分析器决定下一个动作应该是什么。

在上面的代码片段中，我们可以看到，如果词法分析器处于 `.start` 状态，下一个字符假设是 `A` 的话，词法分析器将进入到 `.identifier` 状态并试图得到一个标识符。

## 从 Token 到语法分析树

词法分析完成后，下一个阶段是解析器。解析器接收由词法分析器生成的 Token 流，并将其转换为更有意义的抽象语法树。请继续阅读下一章关于 Zig 解析器的内容。
