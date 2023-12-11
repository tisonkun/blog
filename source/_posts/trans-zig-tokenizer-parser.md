---
title: Zig 词法分析和语法解析
date: 2023-12-11
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

本文翻译自系列第一篇和第二篇博客：

* Zig Tokenizer https://mitchellh.com/zig/tokenizer
* Zig Parser https://mitchellh.com/zig/parser

这一部分属于编译器的前端，相对而言比较简单。

**以下原文。**

<!-- more -->

## 词法分析

词法分析是典型编译器流程中的第一步。词法分析是将字节流，即编程语言的语法，转换为 Token 流的过程。

例如，Zig 的 `comptime {}` 语法经过词法分析后，将得到 `[.keyword_comptime, .l_brace, .r_brace]` 的结果。词法分析通常不处理语义问题，也不关心分析得到的 Token 是否有实际意义。例如，`comptime []` 不是有效的 Zig 语法，但是词法分析过程仍然会将其解释为合法的 `[.keyword_comptime, .l_bracket, .r_bracket]` 输出。解析 Token 流的语义以及在无效情况下失败推出，是下一章要介绍的语法解析的内容。

词法分析器的实现方式多种多样。本文主要介绍 Zig 的词法分析工作原理，并不会跟其他的方案做对比。

### 词法分析器

Zig 语言的词法分析器是标准库的一部分，代码位于 [`lib/std/zig/tokenizer.zig`](https://github.com/ziglang/zig/blob/0.11.x/lib/std/zig/tokenizer.zig) 文件内，对外暴露为 `std.zig.Tokenizer` 结构。

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

### Token 的结构

理解了词法分析的高级接口之后，紧接着下一个问题就是：Token 结构如何定义？

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

### 查找下一个 Token

在词法分析器上每调用一次 `next()` 方法都将得到一个 Token 输出。

`next()` 函数从缓冲区的当前索引开始，逐个字节查看以构建 Token 输出。它使用一个状态变量来实现状态机，以跟踪可能出现的下一个状态。

在分析 Zig 词法分析器的实现细节之前，我们先从高层抽象上思考 `next()` 的工作流程。比如，输入包含空白符的语句 while 如何被分词。

首先，词法分析器会遇到 `w` 字符。此时，我们知道这个 Token 不会是数字，但它仍然可以是关键字或标识符。因此，我们不能确定 Token 的类型。词法分析器每次只看一个字符，所以我们接下来获取 `h` 字符。它仍然可以是标识符或关键字，所以我们继续读取字符，并依次读到 `ile` 三个字符。

现在，词法分析器得到了 `while` 输入，我们知道它是一个独立的关键字。但是，它仍然可以是标识符，因为可能还有更多字符，所以我们需要再向前看一个字符。

下一个输入是空格。我们现在明确知道它是 `while` 关键字，而不是标识符。于是，我们返回 `.keyword_while` Token 作为结果。反之，如果下一个字节是数字 `1` 这样的字符，我们会知道我们正在构建一个标识符，并且它绝不会是一个关键字，因为没有以 `while1` 开头的关键字。

这就是 Zig 词法分析器的工作原理。它维护当前状态，比如“正在构建一个标识符或关键字”，并逐个字符查看，直到明确确定了 Token 的类型和内容。

词法分析器只查看状态和当前字符：它不会向后查看，也不会向前查看。大多数词法分析器都是这样的。正如开头所提到的，词法分析器不关心语义，因此诸如 `if while comptime x = 7 { else }` 这样的无意义输入会产生一个有效的 Token 流。接下来，负责语法解析的解析器会分析 Token 流对应的语义含义。

### 词法分析的实现

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

### 从 Token 到抽象语法树

词法分析完成后，下一个阶段是语法解析。语法解析器接收由词法分析器生成的 Token 流，并将其转换为更有意义的抽象语法树。

## 语法解析

语法解析是编译流程中紧随词法分析的下一步。语法解析负责从 Token 流构建[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。我之前已经写过关于 Zig 如何将字节流（源代码）转换为 Token 流的内容。

Zig 语法解析器的代码位于 [`lib/std/zig/parse.zig`](https://github.com/ziglang/zig/blob/0.10.x/lib/std/zig/parse.zig) 文件中，对外暴露成标准库中的 `std.zig.parse()` 接口。语法解析器接受整个源代码文本，输出 `std.zig.Ast` 抽象语法树实例。Ast 结构定义在 [`lib/std/zig/Ast.zig`](https://github.com/ziglang/zig/blob/0.10.x/lib/std/zig/Ast.zig) 文件中。

> 译注：0.11 版本后，语法解析的接口有所变化，但是整体流程仍然是相似的。

### MultiArrayList

从解析开始，Zig 编译器大量使用 `MultiArrayList` 结构。为了理解语法解析器的工作原理以及抽象语法树的结构，我们首先介绍 `MultiArrayList` 的设计。

在讲解 `MultiArrayList` 之前，我想先简要介绍一下常规的 `ArrayList` 的设计。`ArrayList` 是一个动态长度的值数组。当数组已满时，会分配一个更大的新数组，并将现有项复制到新数组中。这是一个典型的、动态分配的、可增长或缩小的项目列表。

例如，考虑如下一个 Zig 结构：

```zig
pub const Tree = struct {
    age: u32,       // trees can be very old, hence 32-bits
    alive: bool,    // is this tree still alive?
};
```

在 `ArrayList` 中，多个 `Tree` 结构会按如下形式存储：

```
       ┌──────────────┬──────────────┬──────────────┬──────────────┐
array: │     Tree     │     Tree     │     Tree     │     ...      │
       └──────────────┴──────────────┴──────────────┴──────────────┘
```

每个 `Tree` 结构需要 8 字节内存存储，所以 4 个 `Tree` 值的数组需要 32 字节内存来存储。

> 原注：为什么是 8 字节？
>
> 一个 `u32` 值需要 4 字节存储，一个 `bool` 值需要 1 字节存储。但是结构体本身有一个 `u32` 字段，所以 `bool` 字段需要是 4 字节对齐的，也就占用了 4 字节的内存（其中 3 字节是浪费的）。总的就是 8 个字节。

MultiArrayList 同样是一个动态分配的值列表。然而，存储在数组列表中的类型的每个字段都存储在单独的连续数组中。这带来了两个主要优点：

1. 由于对齐而减少了浪费的字节
2. 具有更好的缓存局部性

这两个优点通常会带来更好的性能，以上面 `Tree` 结构为例，`MultiArrayList(Tree)` 的存储结构如下：

```
          ┌──────┬──────┬──────┬──────┐
   age:   │ age  │ age  │ age  │ ...  │
          └──────┴──────┴──────┴──────┘
          ┌┬┬┬┬┐
 alive:   ││││││
          └┴┴┴┴┘
```

结构体的每个字段都存储在单独的连续数组中。一个包含四个树的数组使用了 20 字节，相比 `ArrayList(Tree)` 的方案减少 37.5% 的内存占用。这忽略了多个数组指针的开销，但是随着列表中项目数量的增长，这种开销会分摊到总共减少了 37.5% 的内存需求上。

> 原注：为什么是 20 字节？
>
> 由于结构体被拆分，`age` 字段需要 4 字节，上面数组有 4 个 `Tree` 实例，因此是 16 字节。`alive` 字段不再需要 4 字节对齐，因为它不再是结构体的一部分，所以只需要 1 字节（没有浪费的字节！）。上面数组有 4 个 `Tree` 实例，因此 `alive` 字段一共需要 4 字节。这两个字段加起来总共是 20 字节。

本文不会深入介绍 MultiArrayList 的实现细节。对于理解 Zig 编译器来说，只需要知道几乎每个结构都存储为 MultiArrayList 就足够了。编译一个真实世界的程序通常会生成数万个“节点”，因此这样做可以节省大量内存，并提高缓存的局部性。

### 语法解析器的结构

语法解析器使用 Parser 结构体来存储当前解析状态。这不是一个公开导出的结构体，只用于管理解析操作的内部状态。调用者会得到一个 Ast 作为解析操作的结果，这将在本文后面进行探讨。

以下是本文写作时解析器的结构，我在其中插入了换行符，以将状态分成功能组：

```zig
const Parser = struct {
    gpa: Allocator,
    source: []const u8,

    token_tags: []const Token.Tag,
    token_starts: []const Ast.ByteOffset,
    tok_i: TokenIndex,

    errors: std.ArrayListUnmanaged(AstError),
    nodes: Ast.NodeList,
    extra_data: std.ArrayListUnmanaged(Node.Index),
    scratch: std.ArrayListUnmanaged(Node.Index),
};
```

第一组状态包含了 gpa 和 source 两个字段。这是一个独立 Zig 文件的分配器和完整的原始源代码。

第二组状态中，token_tags 和 token_starts 是语法解析的结果。如前所述，语法解析器采用面向数据的设计，以获得更好的内存使用和缓存局部性。因此，我们有 `token_tags.len == token_starts.len` 的不变式，Zig 只是将结构体字段放置在单独的连续内存块中。tok_i 值是解析器正在查看的当前 Token 的索引（从 0 开始计数）。

第三组状态是语法解析器的实际工作状态。这是 Ast 部分累积的结果。第三组非常重要，因为它是语法解析器构建的核心部分：

* `errors` 存储了语法解析器在进行解析过程中遇到的错误列表。大多数良定义的语法解析器在各种错误情况下都会尝试继续解析，Zig 的解析器也不例外。Zig 解析器会在这个字段中累积错误并尝试继续解析。
* `nodes` 是 AST 节点的列表。初始为空，在语法解析器继续进行时逐渐构建起来。理解 AST 节点的结构非常重要，这将在下一节中介绍。
* `extra_data` 是 AST 节点可能需要的附加信息的列表。例如，对于结构体，extra_data 包含了所有结构体成员的完整列表。这再次展示了面向数据的设计的例子；另一种方法是直接将额外数据放在一个节点上，但这会使整个解析器变慢，因为它会强制每个节点变得更大。
* `scratch` 是语法解析器共享的临时工作空间，通常用于为节点或额外数据构建信息。一旦语法解析器完成工作，这些空间就会被释放。

### AST Node 的结构

语法解析的结果是一个 AST 节点的列表。请注意，AST 在抽象定义上是一棵树，但解析器返回的结果是包含树中节点的列表，也就是上面介绍的 MultiArrayList 内存表示方式。

AST 节点结构可能会令人困惑，因为数据本身存成 MultiArrayList 结构，其中包括许多间接引用。我建议反复阅读本节，确保理解 AST 节点的结构。在理解 Zig 编译器的内部工作原理时，对这种数据模式理解不透彻会导致许多问题，因为这个模式在编译器的每个后续阶段都被重复使用。

AST 结构可以在 `lib/std/zig/Ast.zig` 中找到，下面是其核心 `Node` 结构的定义：

```zig
pub const TokenIndex = u32;

pub const Node = struct {
    tag: Tag,
    main_token: TokenIndex,
    data: Data,

    pub const Data = struct {
        lhs: Index,
        rhs: Index,
    };

    pub const Index = u32;
};
```

请注意，语法解析器本身将节点存储在 `NodeList` 中，这对应的是 `MultiArrayList(Node)` 类型，意味着它是 Node 结构，其中每个字段都存储在单独的连续内存块中。从概念上讲，可以将节点视为上面显示的单个结构体，但在具体实现中，字段分解存储到不同的字段数组中。

`tag` 是可能的 AST 节点类型的枚举。例如，`fn_decl` 对应函数声明，`integer_literal` 对应整数字面量，`builtin_call` 对应调用内置函数，例如 `@intFromEnum` 等。

`main_token` 字段现在并不是非常重要。它存储跟当前 AST 节点密切相关的 Token 值。例如，对于函数声明，它可能是一个 `fn` Token 值。该值是一个索引，指向用于构建 AST 的 Token 列表。

`data` 字段非常重要。它包含与 AST 节点关联的数据信息。例如，函数声明（`.tag == .fn_decl`）使用 data 存储函数原型和函数体。data 字段将在下一节详细介绍。

### AST Node 的数据

AST Node 的数据是关联到 AST Node 的关键数据。例如，函数声明具有函数名称、参数列表、返回类型和函数体等信息。Node 结构的定义没有立即解释这些信息存储的位置。

在我们深入了解语法解析器的具体工作方式之前，理解 AST Node 的数据存储模式非常重要。对于想要了解整个编译器流程的人来说，这是一个关键的细节，因为 AST 使用了一种贯穿整个编译流程的模式。

让我们来看看给定 Zig 代码的函数声明的 AST 结构会是怎样的：

```zig
fn add(a: u8, b: u8) callconv(.C) u8 {
	return a + b;
}
```

#### 函数声明

函数声明的根 AST 节点会被打上 fn_decl 标签。

对于 fn_decl 标签的节点，data 字段的 lhs 存储了函数原型在 NodeList 中的索引（名称、类型信息等），而 rhs 字段存储了函数体在 NodeList 中的索引。这些信息目前只能通过阅读 `.fn_decl` 标签上面的注释或源代码才能得知。

lhs 和 rhs 中的索引值是关联到 NodeList 上。因此，你可以通过 `tree.nodes[lhs]` 访问函数原型信息（伪代码，并非完全正确的写法）。

data 的两个字段都用于存储 NodeList 的索引。这是 data 的一种用法，用于存储与 AST 节点相关的信息。接下来，让我们看一下函数原型，了解 Zig 如何确定参数列表、返回类型和调用约定。

#### 函数原型

通过 `tree.nodes[lhs]` 我们可以访问函数原型节点。函数原型节点对应的是 `fn_proto` 标签。这种类型的 AST 节点存储了有关参数、调用约定、返回类型等信息。

函数原型节点以不同的方式使用 lhs 和 rhs 字段。其中，rhs 字段的用法与函数声明相同，存储了返回类型表达式在 NodeList 中的索引。Zig 除了支持直接类型标识符，还支持使用各种表达式来在编译时计算返回类型。

然而，lhs 字段并不指向 AST 节点。相反，它是指向某个 extra_data 字段的索引。该索引是附加元数据的起始索引。附加元数据的长度根据 AST 节点类型事先已知。所以，lhs 字段对应的信息不是通过 `tree.nodes[lhs]` 来访问，而是通过 `tree.extra_data[lhs]` 来访问。

现在我们知道，lhs/rhs 可能指向一个 AST 节点，也可能指向一段额外数据。

此外，extra_data 具有 `[]Index` 类型。这可能会让人误以为 `tree.extra_data[lhs]` 只是指向另一个索引。这是不正确的。这种情况下的 lhs 只是指向 extra_data 中的第一个索引。要读取的后续字段数量也取决于标签。例如，`fn_proto` 对应的 extra_data 有六个字段。要想知道 extra_data 的具体内容，当前只能通过阅读源代码及其注释来了解：

```zig
pub const FnProto = struct {
    params_start: Index,
    params_end: Index,
    /// Populated if align(A) is present.
    align_expr: Index,
    /// Populated if addrspace(A) is present.
    addrspace_expr: Index,
    /// Populated if linksection(A) is present.
    section_expr: Index,
    /// Populated if callconv(A) is present.
    callconv_expr: Index,
};
```

因此，`fn_proto` 的情形下，`tree.extra_data[lhs]` 指向的是一个 `params_start` 字段。对应地，`tree.extra_data[lhs+1]` 指向一个 `params_end` 字段。依此往下，直到 `tree.extra_data[lhs+5]` 指向 `callconv_expr` 字段。

Ast 结构提供了一个 `extraData()` 帮助函数来完成这些解码工作：传入一个 `tree` 实例，你可以简单的访问其 lhs/rhs 对应的数据：

```zig
const fnData = tree.extraData(idx, FnProto)
fnData.params_start
fnData.callconv_expr
```

其中，`idx` 是 NodeList 中 AST Node 的索引，该 AST Node 必须是 `.fn_proto` 标签的。

下一个问题是，`params_start` 和 `params_end` 等字段仍然是一些索引，那么它们所指向的数据是什么类型的呢？答案是，它们分别对应第一个参数、最后一个参数等的 AST 节点的 NodeList 索引。这是读取有关函数原型的所有额外信息的方法。

如前所述，这里存在很多间接索引。但是现在理解这一切非常重要，否则将来的阶段将更加混乱。

#### 函数标识符

现在，我们只剩下 main_token 字段还未讲解，这也是某些数据可能被访问的最后一种方式。

在上面函数原型的例子中，tag 和 data 等字段都不存储函数名称。实际上，`.fn_proto` 类型的节点使用 main_token 字段来存储函数名称。fn_proto 的 main_token 存储了指向 Token 流中 `fn` 关键字的索引。Zig 函数的标识符总是紧随该关键字之后。因此，你可以通过查看索引 `main_token + 1` 的 Token 来提取函数标识符。这正是编译器后续阶段读取标识符的方式。

#### 小结

如果你对了解 Zig 编译器的其余工作感兴趣，深刻理解上面介绍的信息存储模式非常重要。第一次阅读时，你可能会感到很难理解（甚至第二次或第三次也是如此）。本节再次回顾 AST 的数据布局方式。

AST 节点数据可能对应到以下三个位置的内容：

1. Token 流的数据，其中存储标识符或其他值。
2. NodeList 即节点列表，用于查找其他 AST 节点。
3. extra_data 列表，即额外数据列表，用于查找额外的数据结构。

后续的 AST 节点或额外数据结构通常包含额外的索引，这些索引可能指向其他节点、某个 Token 或额外的数据结构。例如，`fn_decl` 节点存在一个索引指向 `fn_proto` 节点，`fn_proto` 节点存在一个索引指向额外的 FnProto 数据结构，FnProto 结构存储了指向参数的一系列 AST 节点。

确定数据是否可用以及如何访问数据取决于节点标签。你必须阅读 `lib/std/zig/Ast.zig` 中的注释或语法解析器的源代码，才能了解数据的确切用法。

### 语法解析的工作原理

现在，我们对语法解析器的内部状态和 AST 构造有了坚实的理解，可以进一步讨论语法解析器实际解析 Token 流的过程了。

抽象地说，语法解析器检查 Token 流中当前 Token 的内容，并以此作为上下文来确定下一个 Token 可以是或应该是什么。例如，在解析 Token 流 `fn foo` 时，第一个 Token `.keyword_fn` 期望的下一个 Token 应该是一个标识符。如果不是标识符，则会出现语法错误。

不同于词法分析，语法解析关心 Token 的顺序是否合理。词法分析只是单纯的从文本中产生 Token 流，因此无效的语法，例如 `fn pub var foo i32 } {` 也能产生一个有效的 Token 流。但是，语法解析该 Token 流将产生一个错误，因为它是无意义的。

接下来，让我们具体看一下解析器如何解析一个简单的 Zig 文件：

```zig
var x = 7;

pub fn inc() callconv(.C) void {
  x += 1;
}
```

#### 解析一个 Zig 文件

语法解析器的主要入口是 parse 函数，它接受一个完整的 Zig 文件源代码。这个函数会初始化解析器状态，并调用 `parseContainerMembers()` 来解析 Zig 文件的成员。Zig 文件隐式地是一个结构体，因此解析器实际上是在解析一个结构体。

语法解析过程对应一个 while 循环，根据当前的 Token 确定下一个期望的内容。大致结构如下：

```zig
while (true) {
    switch (p.token_tags[p.tok_i]) {
        .keyword_var => ...
    }
}
```

根据当前 Token 的值，上述代码确定下一个期望的内容。第一个 Token 是 `.keyword_var` 因为示例文件正在定义一个变量。这将进一步调用 `parseVarDecl` 来解析变量声明。此外，Zig 还有许多其他有效的 Token 如 `comptime`/`fn`/`pub` 等。

#### 解析变量声明

示例文件中第一个被解析的对象是一个变量声明。Zig 语法解析器最终调用 `parseVarDecl` 方法来产生对应的 AST 节点。其代码概略如下：

```zig
fn parseVarDecl(p: *Parser) !Node.Index {
    const mut_token = p.eatToken(.keyword_const) orelse
        p.eatToken(.keyword_var) orelse
        return null_node;

    _ = try p.expectToken(.identifier);
    const type_node: Node.Index = if (p.eatToken(.colon) == null) 0 else try p.expectTypeExpr();
    const init_node: Node.Index = if (p.eatToken(.equal) == null) 0 else try p.expectExpr();

    return p.addNode(.{
        .tag = .simple_var_decl,
        .main_token = mut_token,
        .data = .{
            .lhs = type_node,
            .rhs = init_node,
        },
   });
}
```

这个函数会“吞掉”一个 `const` 或 `var` 对应的 Token 值。“吞掉”意味着 Token 被消费：返回当前 Token 并使语法解析器的 `tok_i` 状态值递增。如果 Token 不是对应 `const` 或 `var` 关键字，那么函数将返回 `null_node` 以代表一个语法错误。因为变量定义必须以 `const` 或 `var` 开头。

接下来，语法解析器期望一个变量名的标识符。如果 Token 不是标识符，`expectToken` 函数会返回一个错误。例如，如果我们写成 `var 32` 那么语法解析器会在这里产生一个错误，表示语法解析期望得到一个标识符，但实际得到的是整数字面量。

如果没有遇到错误，下一步有几种可能的情况。通过分析 `eatToken` 的结果，我们可以确定下一步该做什么。如果下一个 Token 是冒号，那么期望的是找到一个类型表达式。例如 `var x: u32` 这样的源码。但是，类型表达式是可选的。上面示例中没有类型表达式，所以 `type_node` 将被设置为零。

然后，我们检查下一个 Token 是否是等号。如果是，我们期望找到一个变量初始化表达式。我们的变量声明确实有这个，所以这将创建一个 AST 节点并返回节点列表中的索引。我们不再往下讲解 `expectExpr` 的细节。

注意，这段逻辑可以接受多种有效的变量声明语法：

* `var x`
* `var x: i32`
* `var x: i32 = 42`

但是，同样也明确了无效的语法，比如：

* `var : i32 x`
* `var = 32`

最后，我们调用 `addNode` 方法来创建节点。这将返回节点列表中的索引。在这种情况下，我们创建了一个带有 `.simple_var_decl` 标签的节点。

如果你查看 `.simple_var_decl` 的注释，其中写到其对应节点的 lhs 指向类型表达式 AST 节点的索引（如果没有类型表达式，则为零），而 rhs 指向初始化表达式 AST 节点的索引（如果没有初始化，则为零）。

`parseVarDecl` 函数返回 `.simple_var_decl` AST 节点的索引。最终，这个索引会一直返回到我们开始的 `parseContainerMembers` 函数，并存储在 `scratch` 状态中。我们将在后面解释 `scratch` 状态的用途。现在，while 循环继续解析下一个 Token 值，它将发现 `.keyword_pub` Token 并开始定义一个函数。

#### 解析函数定义

语法解析器看到 `.keyword_pub` 之后，将调用 `parseFnProto` 和 `parseBlock` 方法继续解析。让我们重点关注 parseFnProto 的行为，因为它执行了我们尚未见过的操作。

下面是 parseFnProto 的简化且不完整的版本：

```zig
fn parseFnProto(p: *Parser) !Node.Index {
    const fn_token = p.eatToken(.keyword_fn) orelse return null_node;

    // We want the fn proto node to be before its children in the array.
    const fn_proto_index = try p.reserveNode();

    _ = p.eatToken(.identifier);
    const params = try p.parseParamDeclList();
    const callconv_expr = try p.parseCallconv();
    _ = p.eatToken(.bang);

    const return_type_expr = try p.parseTypeExpr();
    if (return_type_expr == 0) {
        try p.warn(.expected_return_type);
    }

    return p.setNode(fn_proto_index, .{
        .tag = .fn_proto_one,
        .main_token = fn_token,
        .data = .{
            .lhs = try p.addExtra(Node.FnProtoOne{
                .param = params.zero_or_one,
                .callconv_expr = callconv_expr,
            }),
            .rhs = return_type_expr,
         },
    })
}
```

这里出现了一些新的模式。首先，你可以看到如果没有设置返回类型，上述逻辑会存储一个警告而不是停止所有解析。语法解析器通常会在面对错误时尝试继续解析，这是其中一种情况。

接下来，`fn_proto_one` 类型的节点，其 lhs 值是 extra_data 的索引。上述代码展示了额外数据的写入方式。addExtra 函数接受一个包含所有值的结构体，并以类型安全的方式将其编码到 extra_data 中，然后返回 extra_data 中的起始索引。正如我们之前展示的那样，AST 节点的使用者将确切地知道 `fn_proto_one` 类型对应的额外数据有多少个字段以及如何读取这些信息。

### 完成 AST 构造

语法解析会递归地继续进行，为整个程序构建 AST 节点。在解析结束时，解析器会返回一个结构化的 Ast 结构，如下所示：

```zig
pub const Ast = struct {
    source: [:0]const u8,
    tokens: TokenList.Slice,
    nodes: NodeList.Slice,
    extra_data: []Node.Index,
    errors: []const Error,
};
```

现在，我们已经理解了 Zig 的词法分析和语法解析过程，也清楚 AST 节点的结构，上面这些字段的意义也不难推断。

* source 存储了完整的源代码，可以用于确定标识符字符串的内容或提供错误消息
* tokens 是 Token 的列表
* nodes 是 AST 节点的列表
* extra_data 是 AST 节点的额外数据列表
* errors 存储了可能的错误累积结果

在后续文章中，我们将讨论如何从 AST 生成中间表示，以及如何进一步做语义分析。
