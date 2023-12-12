---
title: Zig 中间表示
date: 2023-12-12
tags:
    - Zig
categories:
    - 天工开物
    - 译文
---

本文承接《{% post_link trans-zig-tokenizer-parser Zig 词法分析和语法解析 %}》的内容，继续讨论 Zig 程序编译的下一步：从抽象语法树（AST）中生成中间表示（IR）。

本文翻译自 Mitchell Hashimoto 关于 Zig 的系列博客第三篇：

* Zig AstGen: AST => ZIR (https://mitchellh.com/zig/astgen)

翻译本文的过程中，我越来越回想起自己使用 Perl 6 做编译实习作业的时候。通过 Perl 6 内嵌的 [Grammar 语法](https://docs.raku.org/language/grammars)，我基本把词法分析和语法分析的内容给快速解决了。余下的大部分时间都在完成从 AST 到课程定义的中间表示的翻译，数据流分析和生成 riscv 汇编代码的工作。应该说，北京大学仿照虎书内容做的编译实习课程还是很有含金量的。

感兴趣的读者可以查看我当时的[代码仓库](https://github.com/tisonkun/minic)，其中包括一个完整的 PDF 报告。

**以下原文。**

<!-- more -->

构建出抽象语法树（AST）后，许多编译器的下一步是生成中间表示（IR）。AST 是一棵树，而 IR 通常开始为程序的各个块，例如文件、函数等，创建一系列指令。这种指令序列的格式更容易进行优化分析和转换为可执行的机器码。

Zig 编译器具有多个中间表示。AST 首先通过 AstGen 的阶段转换为 Zig 中间表示（ZIR）。ZIR 是一种无类型的 IR 形式。每个 Zig 文件对应一系列 ZIR 序列。

## ZIR 长成什么样子？

讨论 ZIR 的结构及其创建过程之前，我们先看一个简单的例子来初步建立对 ZIR 的印象。目前，你不需要理解下面展示的 ZIR 是什么含义。

给定一个简单的 Zig 源文件：

```zig
const result = 42;

export fn hello() u8 {
    return result;
}
```

其对应的 ZIR 指令序列打印如下：

```
%0 = extended(struct_decl(parent, Auto, {
  [24] result line(0) hash(193c9ec04fd3f33e5e849a85f0c3b7fd): %1 = block_inline({
    %2 = int(42)
    %3 = break_inline(%1, %2)
  }) node_offset:1:1
  [32] export hello line(2) hash(322ad1340dd6faf97c80f152e26dfdd4): %4 = block_inline({
    %11 = func(ret_ty={
      %5 = break_inline(%11, @Ref.u8_type)
    }, body={
      %6 = dbg_stmt(2, 5)
      %7 = extended(ret_type()) node_offset:4:5
      %8 = decl_val("result") token_offset:4:12
      %9 = as_node(%7, %8) node_offset:4:12
      %10 = ret_node(%9) node_offset:4:5
    }) (lbrace=1:22,rbrace=3:1) node_offset:3:8
    %12 = break_inline(%4, %11)
  }) node_offset:3:8
}, {}, {})
```

ZIR 只是一个内部中间表示，并不需要是一个稳定的格式，因此今天的 Zig 编译器未必对上述源文件产生和这里展示的 ZIR 指令序列相同的输出。不过，对于 ZIR 的初见来说，上面展示的内容应该是足够接近的了。

需要注意的是，ZIR 将程序的实际逻辑分解为更细粒度的指令。ZIR 指令可以通过它们的索引进行引用。如上面所示，可以使用 % 符号来索引。例如，指令 9 将结果引用转换为 hello 函数的返回类型。

> 原注：如何打印 ZIR 指令序列？
>
> 如果你从源码中用 DEBUG 模式构建得到了 Zig 编译器，你可以通过 `zig ast-check -t <file>` 命令生成任意 Zig 源文件对应的 ZIR 指令序列。编写一些简单的 Zig 程序并使用这一技巧生成对应的 ZIR 指令序列，是学习 AstGen 步骤的一个很好的方法。

### 为什么 ZIR 是无类型的？

ZIR 是一种无类型的中间格式。这并不意味着 ZIR 不知道类型，而是类型没有被完全计算。Zig 有两个语言定义特性与此相关。其一是 Zig 将类型作为一等值，其二是 Zig 将编译时求值作为泛型类型的机制。因此，在 AST 和 ZIR 格式中，类型可能仍然是未知的。

这很容易 ZIR 输出示例中验证。首先，让我们看一个大部分已经确定类型的形式：

```zig
const result: u32 = 42;
```

```
%0 = extended(struct_decl(parent, Auto, {
  [10] a line(0) hash(63c8310741c228c128abf6692d07292d): %1 = block_inline({
    %2 = int(42)
    %3 = as_node(@Ref.u32_type, %2) node_offset:1:16
    %4 = break_inline(%1, %3)
  }) node_offset:1:1
}, {}, {})
```

指令 `%3` 将无类型的 `42` 转换为 `u32` 类型。在这个简单的例子里，ZIR 看起来是完全具备类型的。

不过，仍然有不具备类型的指令。例如，指令 `%2` 没有对应的类型。虽然它对应了一个值为 `int(42)` 的常量，但是这个常量仍然可以被解释成 `u8`/`u16`/`u32` 等类型。直到 Zig 代码将无类型常量分配给有类型常量时，ZIR 才会产生类型强制转换指令，即 as_node 指令。

接下来，我们看一个明确无类型的形式：

```zig
const t = bool;
const result: t = 42;
```

```
%0 = extended(struct_decl(parent, Auto, {
  [16] t line(0) hash(243086356f9a6b0669ba4a7bb4a990e4): %1 = block_inline({
    %2 = break_inline(%1, @Ref.bool_type)
  }) node_offset:1:1
  [24] result line(1) hash(8c4cc7d2e9f1310630b3af7c4e9162bd): %3 = block_inline({
    %4 = decl_val("t") token_offset:2:10
    %5 = as_node(@Ref.type_type, %4) node_offset:2:10
    %6 = int(42)
    %7 = as_node(%5, %6) node_offset:2:14
    %8 = break_inline(%3, %7)
  }) node_offset:2:1
}, {}, {})
```

result 的类型是常量 t 被赋予的值。这种情况下，常量 t 的值是显而易见的。但是 Zig 允许为 t 赋值为任何编译时表达式。只要所有值都是编译时已知的，那么这意味着 t 的值几乎可以是任意 Zig 代码执行的结果。这是 Zig 的一个非常强大的特性。

鉴于这种动态的可能性，你可以看到分配给 result 的 ZIR 更加复杂。指令 `%4` 和 `%5` 加载由 t 标识的值，并将其强制转换为类型 type 的值。type 是类型对应的类型，而不是值的类型。然后指令 `%7` 做 as_node 强制转换，但这次类型操作数引用的是 ZIR 指令 %5 的结果，而不是静态值。

最后，我们看一个极端的例子：

```zig
const std = @import("std");
const result: std.ArrayListUnmanaged(u8) = .{};
```

这里我们不展示这两行代码对应的 ZIR 指令序列，因为它将是一大段文本。在这个例子中，result 的类型是通过函数 ArrayListUnmanaged 编译时求值生成的泛型类型。ZIR 无法指向 result 的预定义类型，因为在编译时求值之前根本不知道它的类型。

这就是为什么 ZIR 是无类型的：ZIR 是用于编译时求值和进一步语义分析的预备中间形式。在编译时求值阶段后，所有的类型都将被确定，并且可以形成完全具备类型的中间表示（AIR）。

## AstGen 过程的解析

AstGen 是一个把 AST 转换为 ZIR 的阶段，其源代码位于 `src/AstGen.zig` 文件中。AstGen 不是一个公开导出的结构体，它只用于管理 ZIR 生成过程的内部状态。外部调用方调用的是 generate 函数，该函数接受一个 AST 树并返回整个树的 ZIR 指令序列。

AstGen 结构体有许多用于内部状态的字段。我们不会列举所有的字段，但下面显示了一些重要的字段。以下结构体的字段顺序与源代码中的顺序不同：

```zig
const Astgen = struct {
    gpa: Allocator,
    arena: Allocator,
    tree: *const Ast,

    instructions: std.MultiArrayList(Zir.Inst) = .{},
    extra: ArrayListUnmanaged(u32) = .{},
    string_bytes: ArrayListUnmanaged(u8) = .{},

    // other fields, not covered...
};
```

第一组字段是 AstGen 过程的输入：

* `gpa` 用于分配在 AstGen 过程之外还需存活的数据
* `arena` 用于分配仅在 ZIR 生成期间使用的临时数据，这些数据在返回 ZIR 之前被释放
* `tree` 是要转换为 ZIR 的 AST 示例

> 原注：为什么 arena 叫这个名字？
>
> Arena allocator 是一种内存分配器的分类，它一次性分配和释放整个内存区域，而不是逐个追踪和释放单个项。它通常用于具有共同生命周期的分配，因为相比于追踪单个项，释放整个内存块要更容易且性能更好。有关分配器和 Zig 的基础知识，可以参考 [What's a Memory Allocator Anyways?](https://www.youtube.com/watch?v=vHWiDx_l4V0) 主题演讲。

第二组字段是 AstGen 过程的输出。这一组字段非常重要，因为它是生成的 ZIR 的核心结构：

* `instructions` 存储 ZIR 指令序列，该序列中的每个条目对应一个单独的指令。例如，前文 ZIR 输出中，这一字段的第 9 个条目将是 `as_node(%7, %8)` 指令。
* `extra` 是 ZIR 指令可能需要存储的额外数据。这与 AST 节点及其 extra_data 字段遵循相同的模式。如果您不了解 AST 中 extra_data 的存储访问模式，请查看上一篇文章进行复习，因为在 AstGen 过程中到处都使用了这种模式！
* `string_bytes` 是用于标识符、字符串字面量、文档注释等的[字符串池](https://en.wikipedia.org/wiki/String_interning)。所有静态字符串都作为 AstGen 的一部分进行了池化，并且 ZIR 指令引用了该字符串字节列表中的偏移量，而不是存储字符串本身的副本。

## ZIR 指令结构的解析

在深入介绍 AST 转换为 ZIR 的过程之前，我将花费大量篇幅来讨论单个 ZIR 指令的格式。我建议仔细阅读和理解本节，因为这是理解 ZIR 构建的基本构件。

ZIR 实际上是一个指令列表。ZIR 指令的格式与 AST 节点使用的模式很相似，因此本文可能会忽略一些结构细节。在这些情况下，我将特别指出结构之间的相似之处。

```zig
pub const Inst = struct {
    tag: Tag,
    data: Data,

    pub const Tag = enum(u8) {
        add,
        addwrap,
        // many more...
    };

    pub const Data = union {
        // various fields that can be set depending on tag
    };
};
```

这个结构跟 AST 节点非常相似。tag 的存储访问模式与 AST 节点相同，但标签是完全不同的集合。例如，整数字面量的 AST 是 `.integer_literal` 而无论整数的大小如何。但在 ZIR 中，具体取决于整数是否在 u64 表示范围内，对应的 tag 将会是 `.int` 或 `.int_big` 等。

每个指令都与数据相关联，数据存储都 Data 联合字段上。Data 联合中的有效字段取决于标签值。数据可以直接存储在 Data 字段中，例如整数字面量值。也有可能 Data 字段是指向其他信息的位置的引用。

与 AST 节点类似，ZIR 也有一个 extra 字段。它的行为与 AST 节点的 extra_data 字段几乎相同：一些数据条目可能指向 extra 字段中的一个条目，从那里开始的一些字段将包含与 ZIR 指令相关的特定值。有关更多详细信息，请参阅 Zig 语法解析器源码以及下面的示例。

### 静态值

最简单的 ZIR 指令是存储静态值的指令，让我们看一个例子：

```zig
const x = 42;
```

```
%0 = extended(struct_decl(parent, Auto, {
  [7] x line(0) hash(5b108956afe84d38689dcd3f2d652f04): %1 = block_inline({
    %2 = int(42)
    %3 = break_inline(%1, %2)
  }) node_offset:1:1
}, {}, {})
```

静态值对应的是 `%2` 指令（`int(42)`）。如你所见，静态值 `42` 被直接内联到指令当中。这个指令对应的内部结构如下：

```zig
Zir.Inst{
    .tag = .int,
    .data = .{
        .int = 42,
    },
}
```

这是所有可能的 ZIR 指令中最简单形式：数据直接嵌入到指令中。在这种情况下，活跃数据的标签是 `.int` 标签，活跃数据是内联的静态整数值。

更常见的情况是数据是一个引用，或者标签包含更复杂的信息，无法直接适应 Inst 结构。下面是一些示例。

### 引用

许多 ZIR 指令包含对值的引用。例如，一元运算符 `!` 可以是任何表达式的前缀，如静态值 `!true` 或变量 `!myVar` 或函数调用 `!myFunc()` 等。理解 ZIR 如何编码引用非常重要，因为它们非常常见。

ZIR 引用对应到 `Zir.Inst.Ref` 类型，这是一个[未穷尽的枚举](https://ziglang.org/documentation/master/#Non-exhaustive-enum)。类型定义的标签用于表示原始值或非常常见的值。否则，该值是对另一个 ZIR 指令索引的引用。

### 带标签的引用

让我们看一个具体的例子：

```zig
const x = !true;
```

```
%0 = extended(struct_decl(parent, Auto, {
  [7] result line(0) hash(0be0bb45d9cb29941abcc19d4176dde6): %1 = block_inline({
    %2 = bool_not(@Ref.bool_true) node_offset:1:16
    %3 = break_inline(%1, %2)
  }) node_offset:1:1
}, {}, {})
```

关注指令 `%2` 的内容，它包括一个对应 `!` 运算符的 `bool_not` 指令，而 `@Ref.bool_true` 为其参数。`bool_not` 指令接受一个参数，它大致的内部表示如下（部分字段省略，它们跟本例关系不大）：

```zig
Zir.Inst{
    .tag = .bool_not,
    .data = .{
        .un_node = .{ .operand = Ref.bool_true },
    },
}
```

`Ref.bool_true` 是表示静态值 true 的一个 Ref 枚举的标签。Ref 枚举还有许多其他标签。例如，每种内置类型都有一个标签。一个具体地例子是，尽管下面的示例毫无意义，但它确实产生有效的 ZIR 指令（编译器稍后会报错）：

```zig
const x = !u8; // ZIR: bool_not(@Ref.u8_type)
```

对于常见的原始类型和值，ZIR 使用带标签的 `Ref` 来表示。

### 指令的引用

对于不常见的值，`Ref` 代表的是一个指令索引。下面是一个具体的例子：

```zig
const input = true;
const x = !input;
```

```
%0 = extended(struct_decl(parent, Auto, {
  [13] input line(0) hash(1af5eb6ed7d8836d8d54ff390bb38c7d): %1 = block_inline({
    %2 = break_inline(%1, @Ref.bool_true)
  }) node_offset:1:1
  [21] result line(1) hash(4ba2a2df9e05a2d7963b6c1eb80fdcea): %3 = block_inline({
    %4 = decl_val("input") token_offset:2:17
    %5 = as_node(@Ref.bool_type, %4) node_offset:2:17
    %6 = bool_not(%5) node_offset:2:16
    %7 = break_inline(%3, %6)
  }) node_offset:2:1
}, {}, {})
```

`%6` 是查找指令引用的关键指令。我们看到了熟悉的 `bool_not` 指令，但这一次它的参数是 `%5` 即另一条指令。通读所有的指令序列，你应该能凭直觉理解到这个参数对应从 `input` 变量中读到的值。

这段 ZIR 指令的内部表示大致表示如下：

```zig
Zir.Inst{
    .tag = .bool_not,
    .data = .{
        .un_node = .{ .operand = Ref.typed_value_map.len + 5 },
    },
}
```

要确定 Ref 值是标记还是指令索引，我们可以检查该值是否大于标记的数量。如果是，则值减去标记长度等于指令。这个操作非常常用，因此 Zig 内部定义了 `indexToRef` 和 `refToIndex` 两个辅助函数来执行对应操作。在上面的示例中，操作数 `%5` 对应的是 `indexToRef(5)` 的值。如果调用 `refToIndex(operand)` 则可以得到 5 作为返回值。

```zig
const ref_start_index: u32 = Inst.Ref.typed_value_map.len;

pub fn indexToRef(inst: Inst.Index) Inst.Ref {
    return @intToEnum(Inst.Ref, ref_start_index + inst);
}

pub fn refToIndex(inst: Inst.Ref) ?Inst.Index {
    const ref_int = @enumToInt(inst);
    if (ref_int >= ref_start_index) {
        return ref_int - ref_start_index;
    } else {
        return null;
    }
}
```

> 译注：这两个函数现在重构了，分别变成了 `Zir.Inst.Index.toRef` 和 `Zir.Inst.Ref.toIndex` 方法，如下所示：
>
> ```zig
> pub const Index = enum(u32) {
>     // ...
>     pub fn toRef(i: Index) Inst.Ref {
>         return @enumFromInt(@intFromEnum(Index.ref_start_index) + @intFromEnum(i));
>     }
> }
>
> pub const Ref = enum(u32) {
>     // ...
>
>     pub fn toIndex(inst: Ref) ?Index {
>         assert(inst != .none);
>         const ref_int = @intFromEnum(inst);
>         if (ref_int >= @intFromEnum(Index.ref_start_index)) {
>             return @enumFromInt(ref_int - @intFromEnum(Index.ref_start_index));
>         } else {
>             return null;
>         }
>     }
> }
> ```

### 额外数据

一些 ZIR 指令包含对额外字段的引用，有时也称为“尾部”数据。这与 AST 节点中的 extra_data 字段非常相似，因此在这里不会详细介绍其编解码过程。如果您对 AST 节点中的 extra_data 字段不熟悉或不理解，我建议您复习一下该部分。

我们来看一个额外数据的例子：

```zig
const x = 1 + 2;
```

```
%0 = extended(struct_decl(parent, Auto, {
  [10] x line(0) hash(48fa081b63af0a1c7f2d11a7bf9fbbc3): %1 = block_inline({
    %2 = int(2)
    %3 = add(@Ref.one, %2) node_offset:1:13
    %4 = break_inline(%1, %3)
  }) node_offset:1:1
}, {}, {})
```

这个输出的 ZIR 指令包括了我们在上面已经学到的一切：指令 `%2` 是一个静态值，指令 `%3` 中的 `@Ref.one` 是一个带标签的引用，指令 `%3` 中的 `%2` 引用了另一个指令。

二进制加法操作使用了额外字段。在 ZIR 指令的文本输出中，这并不明显，因为 ZIR 渲染器理解 add 指令并从额外字段（指令 `%3`）中以美化形式打印了数据。实际上，它的内部表示如下：

```zig
// Instruction
Zir.Inst{
    .tag = .add,
    .data = .{
        .pl_node = .{ .payload_index = 7 },
    },
}

// Exra data
[ ..., Ref.one, %2, ... ]
```

该指令使用了 `pl_node` 数据标签（pl_node 是 payload node 的缩写）。其中包含一个 payload_index 字段，它指向 extra 数组中附加数据的起始位置。通过查看 `.add` 标签的注释，可以了解到 extra 字段存储了一个 `Zir.Inst.Bin` 结构，该结构包含 lhs 和 rhs 字段。在这种情况下，我们有：

* `lhs = Ref.one`
* `rhs = %2`

跟 AST 节点类似，AstGen 源代码包含一个名为 addExtra 的辅助函数，以类型安全的方式编码结构化的额外数据。

额外数据本身可以包含静态值或其他 `Zig.Inst.Ref` 值等等。你需要查看每个标签的源代码才能理解它所编码的值。

### 其他数据类型

ZIR 还有许多其他的数据类型，但是我不会在本文中穷举其所有。我个人的感受是，上面这些类型囊括了编译器中编码 ZIR 指令的信息的绝大部分模式。

## AstGen 的组件

AstGen 过程中有许多用于构建 ZIR 的共享组件。这些组件包含了通用的共享逻辑，了解这些逻辑对于理解 AstGen 的完整行为非常关键。

这些组件大多数是 AstGen 中函数的参数，下面介绍其中的一部分。我们不会介绍 AstGen 的所有功能，但是会强调一些关键要点。

### 作用域

AstGen 可以感知作用域，这使它可以引用父级作用域中的标识符，在使用未定义的标识符时抛出错误，或检测标识符被隐藏的问题。

`AstGen.zig` 文件中的 Scope 结构定义了作用域。作用域是多态的，可以是多个子类型之一。Zig 使用 `@fieldParentPtr` 模式来实现这一点。解释这个模式超出了本文的范围，但它 Zig 中很常见。

> 译注：以下材料可以帮助理解 `@fieldParentPtr` 模式。
>
> * https://www.ryanliptak.com/blog/zig-fieldparentptr-for-dumbos/
> * https://ziglang.org/documentation/master/#fieldParentPtr
> * https://github.com/ziglang/zig/issues/7831

在撰写本文时，有七种作用域类型：

* `Scope.Top` 表示文件的最外层作用域。它始终是最顶层的作用域，没有父级作用域。该作用域不跟踪任何附加数据。
* `GenZir` 通常表示 Zig 中的一个块，但也用于跨 AST 节点进行大量的额外状态跟踪。它跟踪当前块标签（如果有）、指令列表、是否在编译时位置等。
* `Scope.Namespace` 该作用域包含一个无序的可以进行引用的声明集合。这里的关键词是“无序”。该作用域通常是结构体、联合等块的子作用域。例如：结构体变量可以引用文件中稍后定义的变量，而函数体则不行。因为结构体是命名空间，但函数体不是。
* `Scope.LocalVal` 和 `Scope.LocalPtr` 表示已定义的单个标识符，例如变量或常量。随着标识符的定义，这将创建一个新的该类型的子作用域，使其“在作用域内”。这与命名空间不同，因为它表示确切的一个声明，而不是一个无序列表。
* `Scope.Defer` 表示 defer 或 errdefer 周围的作用域。它用于跟踪 defer 的存在，以在所有的退出点生成指令。

作用域具有一个 parent 字段，可用于通过作用域向上遍历。这就是标识符解析的工作原理。

### 字符串内化

字符串（字节数组）不直接存储在 ZIR 指令中。字符串会被内化，并存储在一个连续的 `string_bytes` 数组中。字符串的起始索引存储在 ZIR 指令中。这意味着共享的字符串（例如标识符）只存储一次。

到目前为止，ZIR 是编译流水线上第一个存储字符串的结构。AST 节点存储 Token 索引，而 Token 存储其在源代码中的起始和结束偏移量。这要求 AST 和源代码保持可用。在 AstGen 之后，可以释放 AST 和源代码。这个设计使得编译器可以解析非常大的 Zig 程序，并且只在内存中存储所需的内容。

### 结果的位置

ResultLoc 结构用于跟踪表达式树的最终结果应该写入的位置。在遍历 AST 并生成 ZIR 时，某些写操作的值可能嵌套得很深，AstGen 需要知道最终值应该写入的位置。

考虑以下示例：

```zig
const x = blk1: {
  switch (someUnion) {
    .someTag => break :blk1 42,
    else => break :blk1 0,
  }
}
```

在最外层作用域中，常量 x 正在定义。在这段代码的 AST 树中，我们需要嵌套进入一个块，然后是一个 switch 语句，然后是一个 switch 的匹配，最后是一个带标签的 break 语句。在递归超过四个函数以后，AstGen 需要依靠 ResultLoc 结构来定位写入标记跳出值的位置。

ResultLoc 是一个带有许多可能结果类型的标记联合。它有很好的注释，我建议阅读源代码。这里将解释一些示例标记：

* `.discard` 表示赋值被丢弃，因为赋值左侧是 `_` 标识符。在这种情况下，AstGen 知道不需要生成任何存储指令，我们可以直接丢弃该值。
* `.ty` 表示赋值是给某个类型化的值。这会生成一个 `as_node` 指令来强制转换返回之前的结果值。
* `.ptr` 表示赋值被写入某个内存位置。这会生成一个 `store` 指令，以便将结果写入该内存位置。

## ZIR 的生成

现在让我们来了解一下 AstGen 是如何将 AST 转换为 ZIR 的。抽象地说，这个过程将遍历 AST 并为每个 AST 节点发出指令，从而将其转换为 ZIR 指令序列。AstGen 采用立即求值的模式将整个 AST 转换为 ZIR 指令序列，这意味着 AstGen 不会延迟求值（在后续编译阶段我们将看到延迟求值的例子）。

重要的是，AstGen 引入了我们第一个重要的语义验证过程。例如，AstGen 验证标识符是否被定义，是否不会遮蔽外部作用域，并且知道如何遍历父作用域。回想一下之前提到的 AST 构建引入了结构验证：它确保像 `x pub == 7` 这样的 Token 序列会抛出语法错误，但它并没有验证任何标识符 `x` 是否被定义。而词法分析本身只是逐个验证 Token 的有效性，例如 `72` 是一个有效的字面量，而 `72a` 不是一个有效的标识符。

学习 ZIR 的生成过程最简单的方式是查看 `expr` 函数。这个函数为 Zig 语言中任何有效的表达式生成对应的 ZIR 指令序列。我发现从语言的最简单组件开始，然后逐步构建起来是最容易理解这一过程的方式，因为 IR 生成是一个深度递归的过程。

### 整数字面量

让我们看一个简单的静态整数值的例子：

```zig
42
```

这将被解析成带有 `.integer_literal` 标签的 AST 节点，进而引导 `expr` 函数调用 `integerLiteral` 函数。`integerLiteral` 函数的内容如下：

```zig
fn integerLiteral(gz: *GenZir, rl: ResultLoc, node: Ast.Node.Index) InnerError!Zir.Inst.Ref {
    const tree = astgen.tree;
    const main_tokens = tree.nodes.items(.main_token);
    const int_token = main_tokens[node];
    const prefixed_bytes = tree.tokenSlice(int_token);
    if (std.fmt.parseInt(u64, prefixed_bytes, 0)) |small_int| {
        const result: Zir.Inst.Ref = switch (small_int) {
            0 => .zero,
            1 => .one,
            else => try gz.addInt(small_int),
        };

        return rvalue(gz, rl, result, node);
    } else |err| switch (err) {
        error.InvalidCharacter => unreachable, // Caught by the parser.
        error.Overflow => {},
    }

    // ... other paths
}
```

这里有很多内容！这就是为什么我从最简单的事物开始。如果我从函数声明之类的东西开始，我会陷入太多细节中，学起来会很困难。即使看整数字面量，你可能仍然感到有些不知所措，但这已经是最简单的情况了，所以让我们深入了解一下。

首先，这个函数在 AST 中查找整数字面量对应的 Token 值。然后，我们可以使用 Token 的起始位置，通过 `tree.tokenSlice` 获取与 Token 关联的文本。这将得到 "42" 字符串，或者更具体地说，是 4 和 2 两个字节。

接下来，我们尝试将该字符数组解析为无符号 64 位整数。如果数字太大，代码就会走到 other parts 注释的逻辑，其中涉及存储“大整数”的复杂内容，我们在这里不进行探讨。在这个示例中，我们假设所有的整数常量都小于或等于无符号 64 位整数的最大值（18446744073709551615）。

> 原注：无符号？那负数怎么办？
> 
> 负数前面的符号 `-` 会作为一个单独的 AST 节点存储，并在 ZIR 中单独生成一个一元操作。整数字面量始终为正数。

上述过程最终成功解析数字，因为 42 可以解析为有效的 u64 类型的值。接下来，我们处理特殊情况，即值为 0 或 1 的情形，因为它们具有特殊的标记引用。否则，我们生成一个 `.int` 标签的 ZIR 指令，并将指令索引存储在 result 中。

最后，我们调用 rvalue 函数，它将 ResultLoc 的语义应用于该值，以确定我们是否需要原样返回它，将其转换为已知类型，或将其存储在内存位置等等。在许多情况下，这将是一个空操作，并且只会简单地返回带 `.int` 标签的 ZIR 指令。

> 译注：翻译时，integerLiteral 函数已被重构为 [numberLiteral 函数](https://github.com/ziglang/zig/blob/5c1428ea9db6c455fdd36b60fe6cd27b9e8eae4d/src/AstGen.zig#L7740)。

### 加法

理解静态值对应 ZIR 的生成过程，我们在进一步分析一个加法的生成过程：

```zig
42 + 1
```

这将被解析成带有 `.add` 标签的 AST 节点，并引导 `expr`  函数调用 `simpleBinOp` 函数：

```zig
fn simpleBinOp(
    gz: *GenZir,
    scope: *Scope,
    rl: ResultLoc,
    node: Ast.Node.Index,
    op_inst_tag: Zir.Inst.Tag,
) InnerError!Zir.Inst.Ref {
    const astgen = gz.astgen;
    const tree = astgen.tree;
    const node_datas = tree.nodes.items(.data);

    const result = try gz.addPlNode(op_inst_tag, node, Zir.Inst.Bin{
        .lhs = try reachableExpr(gz, scope, .none, node_datas[node].lhs, node),
        .rhs = try reachableExpr(gz, scope, .none, node_datas[node].rhs, node),
    });
    return rvalue(gz, rl, result, node);
}
```

这是我们第一个递归的例子。它通过递归构建左表达式和右表达式的 ZIR 指令序列，进而生成一个带有 lhs 和 rhs 数据的 `.add` ZIR 指令。其中 lhs 对应 42 字面量，rhs 对应 1 字面量，根据我们对整数字面量的探索，我们知道这将进一步转化为 `.int` 指令。

生成的 ZIR 大致如下：

```
%1 = int(42)
%2 = add(%1, @Ref.one)
```

### 赋值

接下来，我们把上面加法的值赋值给一个未标识类型的常量：

```zig
const x = 42 + 1;
```

`expr` 函数不会处理赋值，因为它不是一个表达式，而是一个语句。`statement` 函数也不处理赋值，因为 Zig 的变量赋值只能在容器（结构体）或块（函数体）内进行。因此，处理赋值的是 `containerMembers` 或 `blockExprStmts` 函数。前者用于结构体的主体，后者用于函数体。我认为首先看 blockExprStmts 会更容易，因为 containerMembers 比较复杂。

blockExprStmts 函数有一个 switch 语句，它在处理赋值时会跳转到 varDecl 函数处理变量或常量声明。varDecl 函数的代码量非常庞大！我不会在下面粘贴完整的函数，而只包括最关键的代码路径：

```zig
const type_node = var_decl.ast.type_node;
const result_loc: ResultLoc = if (type_node != 0) .{
    .ty = try typeExpr(gz, scope, type_node),
} else .none;
const init_inst = try reachableExpr(gz, scope, result_loc, var_decl.ast.init_node, node);

const sub_scope = try block_arena.create(Scope.LocalVal);
sub_scope.* = .{
    .parent = scope,
    .gen_zir = gz,
    .name = ident_name,
    .inst = init_inst,
    .token_src = name_token,
    .id_cat = .@"local constant",
};
return &sub_scope.base;
```

首先，代码递归地计算类型表达式（如果有的话）和初始化表达式。对于常量 `const x: t = init` 来说，t 是类型表达式，init 是初始化表达式。对于我们的示例，我们没有类型表达式，而初始化表达式是一个 `.add` 指令。

接下来，代码创建一个新的 LocalVal 作用域来表示这个值。这个作用域定义了标识符 `x` 和值指令 `init_inst` 并指向 `varDecl` 函数给出的父作用域。新定义的作用域是函数的返回值，调用者 blockExprStmts 将当前作用域从该语句起替换为这个新作用域，以便将来的语句和表达式可以引用这个赋值。

此前的示例返回 ZIR 指令索引，而这个示例返回了一个作用域。请注意，对 x 的命名赋值不会生成 ZIR 指令。如果你查看生成的 ZIR，你不会在任何地方看到 x 的命名：

```
%2 = int(42)
%3 = add(%2, @Ref.one)
```

`x` 被实现为一个作用域，而这个作用域被 `inst` 值指令追踪。如果 `x` 曾经被引用，我们知道它的值对应到前述值指令，并且可以通过值指令来引用 `x` 的值。具体地说，我们看到函数体中的后续 ZIR 指令序列：

```zig
const x = 42 + 1;
const y = x;
```

```
%2 = int(42)
%3 = add(%2, @Ref.one) // x assignment
%4 = ensure_result_non_error(%3) // y assignment
```

注意指令 `%4` 对应的对 `y` 的赋值直接引用了指令 `%3` 作为参数。ZIR 指令不需要进行显式的数据存储和加载，因为它可以直接引用指令的结果。

请注意，当生成机器代码时，后端可能会确定需要进行加载或存储数据，这取决于计算机体系结构。但中间表示不需要做出这个决定。

作为读者的练习：下一步，我建议研究 `const y = x` 语句的 ZIR 生成过程，并学习标识符引用的工作原理。这将解释上述的 ZIR 是如何生成的，并为应对更复杂的编译过程打下良好的基础。

## 完成 AstGen 流程

AstGen 进程为每个 Zig 文件各运行一次，并递归地构建整个文件的 ZIR 指令序列，最终在函数的末尾返回一个 `Zir` 值。

通过本文介绍的细节，你应该能够跟踪任何 Zig 语言结构并学习 ZIR 是如何生成的。你可以经常使用 `zig ast-check` 命令来查看 Zig 编译器实际生成的内容，并从中知道应该深入分析哪些函数。
