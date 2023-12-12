---
title: Zig 语义分析
date: 2023-12-13
tags:
    - Zig
categories:
    - 天工开物
    - 译文
---

本文承接《{% post_link trans-zig-astgen Zig 中间表示 %}》的内容，继续讨论 Zig 程序编译的下一步：从 ZIR 指令序列，经过语义分析的过程，生成 AIR 指令序列。

本文翻译自 Mitchell Hashimoto 关于 Zig 的系列博客第四篇：

* Zig Sema: ZIR => AIR (https://mitchellh.com/zig/sema)

语义分析是 Zig 程序编译的核心环节，且它包括了 Zig 语言独特的设计：编译时求值。不同于其他语言常常需要使用额外的语法来定义和计算类型（泛型），Zig 采用编译时求值的方式来完成类型计算。这使得很多原本需要宏或者模板的逻辑，现在可以使用跟主语言相同的语法来编写代码完成。

我在[推特上发文](https://twitter.com/tison1096/status/1732309601847263538)讲过：

> Zig 的泛型是用编译时类型计算来实现的。这有一个挺有趣的提示：如果 Zig 的编码体验提升，很多类型计算方法（类型论的实现）可以作为 Zig 库来提供，而不用像之前一样嵌入到编译器里作为编译器的内部实现。这可能是一个开放编译时计算的方向。

本文讨论了 AIR 制导生成的主要流程，但是没有深入讨论编译时求值的细节，也没有包括变量活性分析的内容，比较可惜。

**以下原文。**

<!-- more -->

AstGen 阶段之后是 Sema 阶段。这一编译阶段接收 AstGen 阶段输出的 ZIR 指令序列，并生成 AIR 指令序列。AIR 是“经过分析的中间表示（Analyzed Intermediate Representation）”的缩写，是一个完全类型化的中间表示。作为对比，ZIR 是一个无类型的中间表示。AIR 可以直接转换为机器代码。

正如 AstGen 一文中所指出的，ZIR 不完全类型化的一个原因，是完全类型化一个 Zig 程序需要进行编译时求值，才能完全实现泛型类型等功能。因此，Sema 阶段还会执行 Zig 程序的所有编译时求值。这就是魔法发生的地方！

AIR 是按函数而不是按文件生成的，就像 ZIR 或 AST 一样。本文将重点介绍如何将函数体从 ZIR 指令转换为 AIR 指令。

> 原注：有一些 AIR 指令是在文件范围内生成的，因此不能武断地说 AIR 是按函数生成的。然而，理解文件范围的 AIR 过程还需要更深入地讨论编译过程，本文将作为理解那些过程的重要基石。

## AIR 是什么样的？

让我们看一个 AIR 的例子：

```zig
export fn add(a: u32, b: u32) u32 {
    return a + b;
}
```

```
# Begin Function AIR: add:
  %0 = arg("a", u32)
  %1 = arg("b", u32)
  %2!= dbg_stmt(2:5)
  %3 = add(%0!, %1!)
  %4!= ret(%3!)
# End Function AIR: add
```

你可以使用 `zig build-obj --verbose-air <file.zig>` 指令查看任意程序的 AIR 指令序列。这需要一个 DEBUG 模式构建的 Zig 编译器，可以查看 [Zig 仓库的 Wiki 页面](https://github.com/ziglang/zig/wiki/Building-Zig-From-Source)了解如何构建。

AIR 是按函数生成和打印的。上面的输出包含了以注释形式注明的 add 函数的 AIR 输出的行。请注意，只有导出或被引用的函数才会生成 AIR 指令，因为 AIR 是按需生成的。因此，为了调试目的，我通常会导出我想要查看 AIR 的函数。

如果你已经阅读了关于编译器先前阶段的内容，你会注意到 AIR 的打印形式跟 ZIR 非常相似。虽然如此，并且在许多情况下 ZIR 和 AIR 甚至有相同的指令标签名称，但是 AIR 是一个完全独立的中间表示。

`%1` 是指令的索引。当它后面跟着 `!` 时，意味着该指令未被使用或未被任何其他已知部分的 Zig 程序引用。在上面的示例中，加法对应的指令 `%0` 和 `%1` 用于构造 `%3` 指令，而 `%3` 则被返回指令使用。但是，调试语句 `%2` 和返回结果 `%4` 都未被使用。在编译器后端将 AIR 转换为最终格式时，可以按需使用这些信息。

> 原注：如前所述，有一些 AIR 是在文件范围而不是函数范围内生成的。例如，文件范围的变量初始化、编译时块等。目前无法打印此类 AIR 的内容。文件范围的 AIR 通常只是一系列常量指令，因为它总是在编译时求值。

## 剖析 AIR 结构

在讨论 ZIR 如何转换成 AIR 之前，我将首先介绍 AIR 的格式并剖析单条 AIR 指令。理解 AIR 的结构有助于理解 AIR 是如何构造的。

AIR 的结构和 ZIR 非常相似，但也有一些细微的差别：

```zig
pub const AIR = struct {
    instructions: std.MultiArrayList(Inst).Slice,
    extra: []const u32,
    values: []const Value,
};
```

跟 ZIR 一样，AIR 在 `instructions` 字段中存储了一系列指令。再有，跟 ZIR 和 AST 一样，指令可能在 `extra` 字段存储相关的额外数据。这两个字段的工作方式跟 ZIR 和 AST 中的同名字段一样。如果你对这部分知识还不熟悉，我建议你回顾前几篇文章相关的内容，尤其是 AST 构造是如何填充 `extra` 字段的细节。

> 原注：我略过了对 `MultiArrayList` 的介绍，因为这部分信息在前面的文章里已经详细解释过了。

`values` 是 AIR 结构独有的新字段。它包含了从 ZIR 的编译时执行中获得的已知值。AIR 指令可以引用编译时已知的值。例如，如果源文件中有一个 `const a = 42;` 语句，那么值 42 将存储在 values 列表中，因为它是编译时已知的。我们稍后将看到更多关于编译期值的例子。

请注意，诸如字符串常量的字符串表等字段不存在。AIR 构建过程和使用 AIR 的代码生成过程仍然可以访问 ZIR 指令序列，也就可以访问 ZIR 的字符串表中的数据。

### 剖析单条 AIR 指令

`Inst` 代表了单条 AIR 指令的结构：

```zig
pub const Inst = struct {
    tag: Tag,
    data: Data,
};
```

这个结构跟 ZIR 的 `Inst` 结构是一致的：枚举类型的 `tag` 字段 + 标签对应的 `data` 字段。AIR 的标签和数据类型不同于 ZIR 的类型，但在功能上是相同的。

让我们看一个简单的例子。当语义分析确定一个值是常量时，它创建了 `.constant` 指令。常量标记指令的数据是 `ty_pl` 字段，其中包含常量的类型，而有效载荷是一个索引，指向值数组中的编译时已知值。

```zig
const c = 42;
```

```
%0 = constant(comptime_int, 42)
```

```zig
Inst{
    .tag = .constant,
    .data = .{
        .ty_pl = . {
            .ty = Type.initTag(.comptime_int),
            .pl = 7, // index into values
        },
    },
};
```

上面的代码块展示了一段 Zig 代码，它对应的 AIR 文本表示和内部结构表示。注意在 AIR 中不存在 `c` 标识符，因为用于产生 AIR 的 ZIR 只包括赋值语句的右值。

## 值、类型和带类型的值

Sema 阶段经常使用以下三种类型：值（Value）、类型（Type）和带类型的值（TypedValue）。

Value 表示编译时已知的值，例如整数、结构体等。Type 是编译时已知的类型，例如 u8 等（注意，所有类型都是编译时已知的）。而 TypedValue 是一个具有确切已知类型的值：例如将值 42 与类型 u16 配对。

可能看起来有些奇怪的是，类型在 Zig 中也是有效的值。类型是类型为 type 的值。例如，在 Zig 中，可以编写 `const c = u8` 语句，其中 c 是类型为 type 的值，`u8` 是 c 的值。我们将在下面展示许多这些情况的示例，以使其更加直观。

### 值

`Value` 结构定义如下所示：

```zig
pub const Value = extern union {
    tag_if_small_enough: Tag,
    ptr_otherwise: *Payload,
}
```

一个类型（type）的值具有描述其值类型（kind）的标签。我在这里故意使用 kind 而不是 type 是因为一个值是无类型的。尽管在某些情况下，类型可以从值中直接推断出来。某些标签值没有有效载荷，而其他情况下则需要有效载荷。`ptr_otherwise` 字段是指向有效载荷的指针，其中包含获取该值所需的更多信息。

Payload 类型是指向更具体有效载荷类型的 `Payload-typed` 字段的指针。这是 Zig 中使用多态类型的一种方式。然后，Zig 代码可以使用 `@fieldParentPtr` 指令确定完整类型。这是 Zig 中常见的模式，详细解释超出了本文的范围。请搜索 `@fieldParentPtr` 指南以了解其工作原理。

> 译注：这段相关代码有一个大重构，可以查阅 [PR-15569](https://github.com/ziglang/zig/pull/15569) 了解细节。

### 整数

接下来看一个整数值的例子，`42` 可以被表示成一个 `Value` 结构的实例：

```zig
Value{
    .ptr_otherwise = &Payload.U64{
        .tag = .int_u64,
        .data = 42,
    },
};
```

> 原注：这个值不是完全正确的。`ptr_otherwise` 字段指向 Payload 结构而不是完整的 `Payload.U64` 结构。不过，这种表现形式能更好的展示指针背后的内容，所以我会在本文中一致使用这种形式。

可以看到，`42` 对应到 `int_u64` 标签。这是因为 `int_u64` 被用于表示所有可以用 `u64` 表示的值。这并不意味着实际使用的 `42` 是 `u64` 类型，它可能是 `u8` 或者 `u16` 或者其他。不与 `Type` 关联的 `Value` 是无类型的。或者，如果你觉得我们这里总归是有一个类型标签，你可以认为这个值没有对应到一个准确的类型。

### 类型的值

Zig 的类型也是值。例如，语句 `const c = u8` 是完全有效的 Zig 代码：它将类型 u8 赋值到常量 c 上，而 c 本身是 type 类型的。这可能会非常令人困惑，随着类型的值在实际语义分析中的使用，它会变得更加令人困惑。因此，我将在这里提前解释。

作为一个值，常量 u8 可以用下面的 Value 表示：

```zig
Value{
    .tag_if_small_enough = .u8_type,
};
```

这个值没有 payload 内容，因为它可以被 `.u8_type` 完全清楚的表示：值是 `u8` 类型。

这个值本身仍然是无类型的。在这个场景里，我们可以简单的知道值的类型，因为 `u8_type` 的类型除了 `type` 没有别的可能。但是，从技术上说，`u8` 对应的 Value 实例仍然是无类型的。

> 原注：例如，这个事实允许 Zig 在未来定义一个 `inttype` 关键字来代表所有整数类型，此时 `u8_type` 就可能被解释成 `type` 或 `inttype` 之一。

我们来看一个更复杂的类型的例子，`const c = [4]bool` 对应的 Value 表示如下：

```zig
Value{
    .ptr_otherwise = &Payload.Ty{
        .tag = .ty,
        .data = Type{
            // .tag = .array
            // type data including element type (bool), length (4), etc.
        },
    },
};
```

这个值具有 `.ty` 标签（type 的缩写），这代表这个值是某种类型。值的有效载荷是一个 Type 结构，其值描述了一个由四个 bool 元素组成的数组。我们将在下一节讨论 Type 结构的细节。这里的关键点是，上述 Value 实例的值是一个数组类型，而不是一个数组值。

如果还有不明白的地方，你可以查看源代码中 `Type` 结构的 `toValue` 函数。`Type` 实例总是可以被转变成一个 `Value` 实例，因为类型在 Zig 中总是一个值，但是值不一定总是类型。

> 译注：原文解释了很多，反而把事情搞得有点复杂了。应该说，在绝大多数语言里，类型都不是值，它们需要各种特殊的语法来进行类型计算和泛型标记。Zig 把类型作为编译时已知的值，暴露了一系列操作类型的函数，使得泛型和函数重载可以使用编译时求值技术编写 Zig 代码完成，而不需要独特的语法。

### 类型

Type 结构的定义和 Value 结构是一样的，但是定义成一个新的类型以做区分：

```zig
pub const Type = extern union {
    tag_if_small_enough: Tag,
    ptr_otherwise: *Payload,
}
```

这里我们没有太多补充，因为大部分内容跟 Value 结构一样。让我们看一看 `[4]bool` 类型是怎么表示的，免得我们完全不介绍一个具体例子：

```zig
Type{
    .ptr_otherwise = &Payload.Array{
        .tag = .array,
        .data = .{
            .len = 4,
            .elem_type = Type{.tag_if_small_enough = .bool},
        },
    }
}
```

### 带类型的值

TypedValue 其实就是一个 Type 和一个 Value 组成的结构，从而将值绑定到一个确切的类型上。只有这样，值的类型才是准确已知的：

```zig
pub const TypedValue = struct {
    ty: Type,
    val: Value,
};
```

## 剖析 Sema 结构

在 AstGen 阶段之后，Zig 编译器将进行 Sema 阶段，Sema 是语义分析（Semantic Analysis）的缩写。Sema 也是主要负责此阶段的结构体的名称。Sema 的源代码位于 [`src/Sema.zig`](https://github.com/ziglang/zig/blob/0.11.x/src/Sema.zig) 文件内。这是一个非常大的文件（在编写本文时超过 18000 行），它的文档注释自称为 “Zig 编译器的核心”。

> 译注：0.11 版本上，Sema.zig 已经超过 36000 行。

Sema 有许多公共接口，但最重要的是 `analyzeBody` 函数。Sema 结构体有许多用于内部状态的字段。我们不会列举所有字段，但下面列出了一些主要的字段。为了便于解释类似的字段，这些字段的顺序与源代码中的顺序不同。

```zig
pub const Sema = struct {
    mod: *Module,
    gpa: Allocator,
    arena: Allocator,
    perm_arena: Allocator,

    code: Zir,
    owner_decl: *Decl,
    func: ?*Module.Fn,
    fn_ret_ty: Type,

    air_instructions: std.MultiArrayList(Air.Inst) = .{},
    air_extra: std.ArrayListUnmanaged(u32) = .{},
    air_values: std.ArrayListUnmanaged(Value) = .{},
    inst_map: InstMap = .{},

    // other fields...
};
```

第一组字段是 Sema 过程的主要输入：

* `gpa` 用于分配在 Sema 过程和声明生命周期之后仍然存在的数据。
* `arena` 用于分配在 Sema 之后将被释放的临时数据。
* `perm_arena` 用于分配与正在进行语义分析的声明的生命周期相关联的数据。
* `mod` 是正在分析的模块。本文内容不涵盖模块，但模块封装了单个程序中的所有 Zig 代码。本文将忽略所有跟模块相关的接口。

第二组字段是 Sema 进行语义分析的输入：

* `code` 是包含正在分析的声明的文件的 ZIR 指令序列。
* `owner_decl` 通常是当前正在分析的声明，例如函数、comptime 块、测试等。

当分析函数时，`func` 和 `fn_ret_ty` 存储了可能得额外信息。

第三组字段是 Sema 过程的输出。这些输出主要是构建 `Air` 结构的字段。这些字段在整个 Sema 过程中被填充，并用于构建最终的 `Air` 结果。

其中，`inst_map` 字段最为重要。它是一个 ZIR 到 AIR 的映射，在整个 Sema 过程中都会使用。并非所有的 ZIR 指令都会产生 AIR 指令，但是 Sema 还是经常使用这个映射以使 AIR 指令可以引用稍后解析的特定 ZIR 指令：例如加法操作数、函数参数等。

## 分析函数体

Sema 结构上的核心接口是 analyzeBody 函数。这个函数用于分析函数体、循环体或代码块体等对应的 ZIR 指令序列，并产生对应的 AIR 指令序列。最简单的例子是函数体。下面是一个具体的例子：

```zig
export fn add() u32 {
    return 40 + 2;
}
```

```
# Begin Function AIR: add:
  %1 = constant(comptime_int, 40)
  %2 = constant(comptime_int, 2)
  %3 = constant(comptime_int, 42)
  %4 = constant(u32, 42)

  %0!= dbg_stmt(2:5)
  %5!= ret(%4!)
# End Function AIR: add
```

> 原注：可以使用 `zig build-obj --verbose-air example.zig` 指令打印导出函数的 AIR 指令序列。

从上述 AIR 指令序列中，我们可以直观地知道发生了什么事情。粗略地说，这些指令大致执行了以下步骤：

1. 我们看到一个无类型的整数常数 `40` - 对应 `%1` 指令。
2. 我们看到一个无类型的整数常数 `2` - 对应 `%2` 指令。
3. 我们执行了编译时求值，得到加法的结果：无类型的整数常数 `42` - 对应 `%3` 指令。
4. 常量 `42` 关联到类型 `u32` 上（`%4` 指令）。这不需要任何转换，因为值 `42` 可以自动匹配到 `u32` 类型上。这个类型关联是必要的，因为返回类型被定义成 `u32` 类型。
5. 返回 `%4` 输出的值 - 对应 `%5` 指令。

太棒了！这里有一些冗长之处，但很明显可以看出 add 函数的编译过程。此外，可以看到在这个阶段进行了编译时求值：`40 + 2` 对应的加法操作已经完成，因此结果已经预先知道。当这段代码最终被转换为机器代码时，实际的加法结果已经预先计算好了。

> 译注：在新版 Zig 编译器中，所有中间 AIR 都能被优化，最终只产生一条 `%4!= ret(<u32, 42>)` 指令。

接下来，让我们逐步了解这个 AIR 是如何生成的。

### 逐步分析函数

函数体 AIR 主要通过 `analyzeBodyInner` 生成。这个函数会按顺序迭代分析每个 ZIR 指令，并为每条 ZIR 指令生成零或多条 AIR 指令。

```zig
const result = while (true) {
    const inst = body[i];
    const air_inst: Air.Inst.Ref = switch (tags[inst]) {
        .alloc                        => try sema.zirAlloc(block, inst),
        .alloc_inferred               => try sema.zirAllocInferred(block, inst, Type.initTag(.inferred_alloc_const)),
        .alloc_inferred_mut           => try sema.zirAllocInferred(block, inst, Type.initTag(.inferred_alloc_mut)),
        .alloc_inferred_comptime      => try sema.zirAllocInferredComptime(inst, Type.initTag(.inferred_alloc_const)),
        .alloc_inferred_comptime_mut  => try sema.zirAllocInferredComptime(inst, Type.initTag(.inferred_alloc_mut)),
        .alloc_mut                    => try sema.zirAllocMut(block, inst),
        // hundreds more...
    };

    try sema.inst_map.put(sema.gpa, inst, air_inst);
    i += 1;
}
```

这段代码清楚展示了 ZIR 翻译成 AIR 的过程。你可以打印 Zig 程序对应的 ZIR 指令序列并逐个分析每个指令如何生成对应的 AIR 指令。上述 `add` 函数的 ZIR 指令序列如下：

```
%0 = extended(struct_decl(parent, Auto, {
  [25] export add line(6) hash(4ca8d4e33898374bdeee80480f698dad): %1 = block_inline({
    %10 = func(ret_ty={
      %2 = break_inline(%10, @Ref.u32_type)
    }, body={
      %3 = dbg_stmt(2, 5)
      %4 = extended(ret_type()) node_offset:8:5
      %5 = int(40)
      %6 = int(2)
      %7 = add(%5, %6) node_offset:8:15
      %8 = as_node(%4, %7) node_offset:8:15
      %9 = ret_node(%8) node_offset:8:5
    }) (lbrace=1:21,rbrace=3:1) node_offset:7:8
    %11 = break_inline(%1, %10)
  }) node_offset:7:8
}, {}, {})
```

其中，函数体从 `%3` 指令开始，到 `%9` 指令结束。因此，`analyzeBodyInner` 分析 `add` 函数体时，看到的第一条指令是 `%3` 指令。`%2` 和 `%10` 将会在早些时候被分析，我们会在后面讨论这个过程。

### `%3: dbg stmt`

第一条分析的指令是一个 `.dbg_stmt` 指令。在 `analyzeBodyInner` 的主循环代码中，我们可以看到这将引导向 `zirDbgStmt` 分支。该分支的代码经简化后如下所示：

```zig
fn zirDbgStmt(sema: *Sema, block: *Block, inst: Zir.Inst.Index) CompileError!void {
    const inst_data = sema.code.instructions.items(.data)[inst].dbg_stmt;
    _ = try block.addInst(.{
        .tag = .dbg_stmt,
        .data = .{ .dbg_stmt = .{
            .line = inst_data.line,
            .column = inst_data.column,
        } },
    });
}
```

这是一个很好的、简单的翻译 ZIR 到 AIR 的例子。没有比这更简单的了。在这种情况下，`dbg_stmt` ZIR 指令几乎一比一的被翻译成 `dbg_stmt` AIR 指令。这生成了之前显示的 `%0` AIR 指令：

```
%0!= dbg_stmt(2:5)
```

### `%4: extended(ret type())`

类似地，ZIR 指令 `.extended` 会引导调用 `zirExtended` 函数，其主循环分析子操作码（child opcode）并在遇到 `.ret_type` 时调用 `zirRetType` 函数。`zirRetType` 函数内容如下：

```zig
fn zirRetType(
    sema: *Sema,
    block: *Block,
    extended: Zir.Inst.Extended.InstData,
) CompileError!Air.Inst.Ref {
    const src: LazySrcLoc = .{ .node_offset = @bitCast(i32, extended.operand) };
    try sema.requireFunctionBlock(block, src);
    return sema.addType(sema.fn_ret_ty);
}
```

被分析函数中的返回类型可以在 Sema 的 fn_ret_ty 字段中找到。addType 函数将为类型定义添加一条指令。对于我们的函数，结果类型是 u32 类型。这是一个常用类型，因此不会生成额外的指令。

为了进行实验，如果您将返回值更改为一个不常用的类型 u9 那么 AIR 会生成以下指令：

```
%5 = const_ty(u9)
```

### `%5: int(40)`

下一条指令是对应常数 40 的 `%5` 指令。它会引导调用 `zirInt` 函数。`zirInt` 函数读取整数值，并调用 `addConstant` 函数。

```zig
fn zirInt(sema: *Sema, block: *Block, inst: Zir.Inst.Index) CompileError!Air.Inst.Ref {
    const int = sema.code.instructions.items(.data)[inst].int;
    return sema.addConstant(ty, try Value.Tag.int_u64.create(sema.arena, int));
}

pub fn addConstant(sema: *Sema, ty: Type, val: Value) SemaError!Air.Inst.Ref {
    const gpa = sema.gpa;
    const ty_inst = try sema.addType(ty);
    try sema.air_values.append(gpa, val);
    try sema.air_instructions.append(gpa, .{
        .tag = .constant,
        .data = .{ .ty_pl = .{
            .ty = ty_inst,
            .payload = @intCast(u32, sema.air_values.items.len - 1),
        } },
    });
    return Air.indexToRef(@intCast(u32, sema.air_instructions.len - 1));
}
```

`addConstant` 函数在 Sema 阶段的很多地方都会被调用，用于加入一个编译时已知的常量。其内部逻辑首先通过 `addType` 添加对应到最后一条指令的类型。对于我们这里的例子，它是 `comptime_int` 类型。因为它是一个常用类型，所以没有额外的指令产生。紧接着，常量值被加入到 air_values 中。最后，`constant` AIR 指令被加入到 air_instructions 中。最终结果就是下述 AIR 指令：

```
%1 = constant(comptime_int, 40)
```

需要注意的一点是，`.constant` 指令的有效负载引用了 air_values 中的索引。所有在编译时已知的值都存储在 air_values 中，指令中的任何引用都存储为 air_values 切片中的索引。

指令 `%6` 不做讨论，因为它跟 `%5` 基本相同，只是有一个不同的常量值。

### `%7: add(%5, %6)`

下一条指令是我们遇到的第一条有实际逻辑操作的指令：执行加法。`.add` 指令引导调用 `zirArithmetic` 函数。这个函数用于许多二元数学操作中，其函数体如下所示：

```zig
fn zirArithmetic(
    sema: *Sema,
    block: *Block,
    inst: Zir.Inst.Index,
    zir_tag: Zir.Inst.Tag,
) CompileError!Air.Inst.Ref {
    const inst_data = sema.code.instructions.items(.data)[inst].pl_node;
    sema.src = .{ .node_offset_bin_op = inst_data.src_node };
    const lhs_src: LazySrcLoc = .{ .node_offset_bin_lhs = inst_data.src_node };
    const rhs_src: LazySrcLoc = .{ .node_offset_bin_rhs = inst_data.src_node };
    const extra = sema.code.extraData(Zir.Inst.Bin, inst_data.payload_index).data;
    const lhs = sema.resolveInst(extra.lhs);
    const rhs = sema.resolveInst(extra.rhs);

    return sema.analyzeArithmetic(block, zir_tag, lhs, rhs, sema.src, lhs_src, rhs_src);
}
```

这段代码中，需要特别关注 lhs 和 rhs 的复制。resolveInst 函数用于查找给定 ZIR 指令的 AIR 指令索引。因此，对于给定的 `%5` 和 `%6` 这两条 ZIR 指令，分别将 lhs 和 rhs 设置为它们的结果 AIR 索引。这些 AIR 指令是在先前的循环迭代中创建 `.constant` 指令时设置的。

ZIR 到 AIR 的映射在 analyzeBodyInner 循环的 inst_map 字段中维护。虽然也有其他一些逻辑可以更新这个状态，但是 body 循环是主要的逻辑。

下一步，代码逻辑进到 analyzeArithmetic 函数里。这是一个很长的函数，几乎所有代码都用于确定是否能够对此算术操作进行编译时分析。下面是关键的代码行：

```zig
const maybe_lhs_val = try sema.resolveMaybeUndefVal(block, lhs_src, casted_lhs);
const maybe_rhs_val = try sema.resolveMaybeUndefVal(block, rhs_src, casted_rhs);

if (maybe_lhs_val) |lhs_val| {
    if (maybe_rhs_val) |rhs_val| {
        if (is_int) {
            return sema.addConstant(
                scalar_type,
                try lhs_val.intAdd(rhs_val, sema.arena),
            );
        }
    }
}

return block.addBinOp(.add, casted_lhs, casted_rhs);
```

这段代码首先调用 `resolveMaybeUndefVal` 函数。它接受一个 AIR 指令的索引，并尝试加载其编译时已知的值。这个表达式返回一个可空值，因为如果该值不能在编译时确定，则返回 `null` 值。

接下来，我们尝试解包这些可空值。如果我们能够找到 lhs 和 rhs 的编译时已知值，并且它们都是整数类型，那么我们可以进行编译时加法，得到最终的常量。这就是我们的程序生成结果为 42 的 `.constant` AIR 指令的过程：

```
%3 = constant(comptime_int, 42)
```

我在代码中包含了 `block.addBinOp` 语句，以避免值不是编译时已知的情况。这个语句将添加一个 `.add` AIR 指令进行运行时计算（而不是编译时）。为了进行实验：我们将常量 2 更改为变量，例如 `var b: u32 = 2` 语句，并将其用于加法运算。这将产生一个 `.add` 操作，因为变量不能在编译时操作。

### `%8: as_node(%4, %7)`

下一条指令实现了安全类型转换。从 ZIR 的角度来看，这将加法结果转换为返回类型的值。具体来说，根据已知信息，我们需要将编译时整数 42 转换为 u32 类型。

`.as_node` 指令引导调用 `zirAsNode` 函数，最终调用到 `coerce` 函数的核心逻辑。coerce 函数在 Sema 过程中被广泛用于执行从一种类型到另一种类型的安全类型转换。

我将让读者自行研究这个函数。逻辑相当直接，但由于需要处理许多类型转换情况，所以会比较冗长。对于 comptime_int 到 u32 的转换，他首先确定该值能被 u32 类型表示，并将该值原样返回。类型转换不需要进行额外的处理。

### `%9: ret_node(%8)`

最后，返回指令在 ZIR 中被编码为 `ret_node` 指令。这将引导调用 `zirRetNode` 函数，它创建一个带有结果的 `.ret` AIR 指令。创建该指令的所有相关知识点前面都已经讲过。

zirRetNode 函数始终返回 always_noreturn 值。这个值强制 analyzeBodyInner 循环退出，从而完成函数体 AIR 生成。

> 原注：返回语句是否总是完成函数体 AIR 生成？如果多个返回语句，又该怎么办？
>
> 返回语句总是完成当前块的 AIR 生成。不可达代码是非法的，并在 AstGen 期间被捕获，这意味着多个返回语句的唯一方式是它们位于不同的块中。因此，在函数的上下文中，多个返回语句是可以的，因为它将递归进入多个 analyzeBodyInner 调用。

### 编译时不可知

上面第一个示例有点无聊，因为所有的逻辑都是编译时可知的。编译时可知仅适用于 const 值，而不适用于 var 值，因此我们可以通过使用 var 来查看运行时加法的 AIR 指令序列：

```zig
export fn add() u32 {
    var b: u32 = 2;
    return 40 + b;
}
```

```
# Begin Function AIR: add:
  %2 = constant(comptime_int, 2)
  %3 = constant(u32, 2)
  %6 = constant(comptime_int, 40)
  %8 = constant(u32, 40)

  %0!= dbg_stmt(2:5)
  %1 = alloc(*u32)
  %4!= store(%1, %3!)
  %5!= dbg_stmt(3:5)
  %7 = load(u32, %1!)
  %9 = add(%8!, %7!)
  %10!= ret(%9!)
# End Function AIR: add
```

> 译注：新版 Zig 编译器会报错 `var b: u32 = 2` 应该是一个常量，需要其他手段来写一个真正的变量做这个实验。

将常量 2 更改为变量赋值的值 2 会产生更多的 AIR 指令！现在我们有了使用 `.alloc` 进行分配的指令、使用 `.store` 进行值存储的指令，还可以看到运行时的 `.add` 操作。

这是一个很好的程序，可以用来学习和追踪 AIR 指令的生成过程。由于它遵循了我们之前示例中的许多相同的代码路径，我将把这个函数编译过程的分析作为读者的练习。

### 编译时目标平台仿真

对于编译时计算的代码，Zig 编译器将在必要时模拟目标平台的特性。这是一个至关重要的功能，使得在 Zig 中进行编译时计算变得安全且可行。

在 `@floatCast` 的实现中可以看到这个功能的一个例子：

```zig
const target = sema.mod.getTarget();
const src_bits = operand_ty.floatBits(target);
const dst_bits = dest_ty.floatBits(target);
if (dst_bits >= src_bits) {
    return sema.coerce(block, dest_ty, operand, operand_src);
}

return block.addTyOp(.fptrunc, dest_ty, operand);
```

该函数通过 getTarget 获取有关目标平台的信息，然后确定目标平台上浮点数支持的位数。如果目标类型的位数多于源类型，可以安全地强制转换类型。否则，浮点数将被截断。

## 完成语义分析过程

Sema 过程为每个函数调用一次，且仅针对每个被引用的声明调用一次，而不是遍历每个声明。为了确定所有被引用的声明，Sema 从处理入口点函数开始查找。

这实现了 Zig 的延迟分析能力，意味着除非引用了声明，否则某些错误不会产生编译器错误。这个特性使 Zig 的编译过程非常快速，生成的代码更小，因为只编译了被引用的代码，但有时会导致令人困惑的行为。

> 译注：为了绕过这里的引用问题，Zig 有一个内部开洞的 `std.testing.refAllDecls` 函数。可以阅读 [ISSUE-12838](https://github.com/ziglang/zig/issues/12838#issuecomment-1435150336) 了解更多细节。

基于本文介绍的基本知识，你现在应该能够跟踪任何 Zig 程序并确定它如何转换为 AIR 指令序列。请记住经常使用 `zig ast-check` 和 `zig build-obj --verbose-air` 命令来查看 Zig 编译器生成的内容。

语义分析完成后，AIR 指令序列将传递给 CodeGen 过程，并在该过程中被转换为最终格式。CodeGen 是编译器前端和多个后端之间的边界。后端可以是 LLVM 或诸如 WASM 之类的本机后端。
