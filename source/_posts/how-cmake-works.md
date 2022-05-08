---
title: CMake 是怎么工作的？
date: 2022-04-15
tags:
    - CMake
    - 软件构建
categories:
    - 天工开物
---

> 关于开源软件的发布相关的内容还在构思当中，先摆烂重发部分以前讨论过的关于构建系统的文章。构建和发布密不可分，可以认为都是持续交付流水线的一环。
>
> 我会分多篇文章讨论软件发布和开源软件发布的各个方面，文章内容再加以提炼放到编撰当中的《开源指南》里。

构建系统是软件开发的重要组成部分，生产环境中的绝大多数软件都由多个组件所组成，由一系列依赖和分散的编译单元聚合而成，而自动化这些组件的集成的系统，就是构建系统。

笼统地说，构建系统负责除了应用代码编写以外的，所有从代码到可执行文件的步骤的自动化。其中，查找、编译和链接等具体执行由其他工具支持。构建系统本身处理的内容分为两大部分，第一部分是构建过程各个步骤的编排，第二部分是包管理或说第三方依赖管理。这两者的区别可以参考 Java 生态中 Ant 和 Ivy 的区别和联系。狭义的构建系统仅包括第一部分，因为狭义的构建过程只关心有某种方法可以取得依赖并将其引入构建，而不关心依赖本身是怎么管理和获取的。

那么，本文主角 CMake 是哪一种或者两者都是呢？

<!-- more -->

## CMake 是构建系统生成器

CMake 两者都不是，作为 C/C++ 生态构建系统事实标准的 CMake 其实是一个构建系统生成器。CMake 的主要功能是描述项目结构，表达模块依赖，从而以人类友好的方式表达构建过程步骤编排的需求，最终从声明式的 CMake 代码中生成实际的构建系统，比如生成一系列 GNU Make 构建需要的文件。

举个例子，假设我们有一个 hello world 代码文件 main.cpp 和对应的 CMake 项目描述文件 CMakeLists.txt 如下。

```text
$ (root) tree
.
├── CMakeLists.txt
└── main.cpp
$ (root) cat CMakeLists.txt
cmake_minimum_required(VERSION 3.19)
project (hello_cmake)
add_executable(hello_cmake_exe main.cpp)

$ (root) mkdir build && cd build && cmake .. && make
$ (root/build) ls
CMakeCache.txt      Makefile            hello_cmake_exe
CMakeFiles          cmake_install.cmake
$ (root/build) ./hello_cmake_exe
Hello CMake!
```

可以看到，CMakeLists.txt 里关键的内容是 add_executable 一行。这行表达了我们希望在项目中创建一个名为 hello_cmake_exe 的可执行文件，它的构建要素是 main.cpp 文件。

我们通过 `cmake` 命令在当前目录下创建了 GNU Make 构建需要的 Makefile 文件及其依赖，随后执行 `make` 命令实际完成构建。

## CMake 围绕构建目标声明

刚开始接触 CMake 的同学往往会被它茫茫多的指令吓到，尤其是神秘的结构化语法、没有命名规律的声明、不知所云的参数列表和复杂的命令行参数，让人不知道从何入手。

其实，CMake 尤其是现代化的 CMake 核心是围绕构建目标来组织声明，上一节例子中 add_executable 一行里的 hello_cmake_exe 就是一个构建目标。此外，add_library 定义的库也是一种构建目标。可执行文件和库是构建最终对用户可见的产物，CMake 对项目模块依赖的声明就是围绕着这两种目标来展开的。

add_executable 和 add_library 的第一个参数说明了构建目标的名称，它必须是全局唯一的符号，并且随后全局可访问；紧跟着是各自专有的控制参数，例如可以指定库是静态链接还是动态链接等；再之后是一个可变长度的源文件数组，用于描述直接参与构建当前目标的源文件。

CMake 的声明参数是一系列空格隔开的符号或字符串，同时每个命令都可以有自己的参数列表，这些参数列表没有统一的风格，同时仅通过位置区分而没有命名参数，可以说是 CMake 最为用户不友好的一点了。

定义了构建目标之后，就是描述构建目标的各种特性。上面两个命令列出了构建目标所需的源文件，但是还有链接时的库依赖，这就需要 target_link_library 来声明目标构建依赖的库。构建目标可以是 add_executable 或 add_library 声明的，库可以是 add_library 声明的构建目标，也可以是库文件等。

此外，构建目标可能还需要包含头文件等 include 预编译命令依赖的文件，除了在 add_executable 和 add_library 中加入以外，还可以随后通过 target_sources 逐个包含，或者更常见的，通过 target_include_directories 包含目录下的文件。

最后，构建目标在编译时还可能有一系列编译选项和宏定义等，可以通过 target_compile_options 和 target_compile_definitions 来声明。

可以看到，链接、文件包含和编译选项的命令都以 target_xxx 的形式出现，第一个参数是 add_executable 或 add_library 声明的构建目标。这就是现代化的 CMake 围绕构建目标声明的含义。

值得一提的是，旧版的 CMake 不支持 target_xxx 形式的命令，而是通过不带 target_ 前缀的命令来表达相似的含义，但是旧版的命令是通过修改全局状态和获取全局状态来声明的，而非按照构建目标所构成的命名空间区分开的。举例来说，include_directories 命令将导致之后及子项目中的所有构建目标在编译时都带上此命令引入的路径下的文件。显然，这很容易导致声明的泄漏，尤其在项目层次复杂，引入其他子项目或作为子项目被其他项目引入时，容易出现难以排查的非预期构建结果，也就限制了项目规模的扩大。

现代 CMake 的最佳实践是牢记围绕构建目标组织声明，不仅能避免意外的声明泄漏，还能获得更好的表达力。

## CMake 灵活地支持三方库

一开始我们就提到，广义的构建系统包括三方库的依赖管理。即使是狭义的只处理构建步骤编排的构建系统，也需要有某种方式引入三方库的依赖。

程序设计实践发展至今，引入三方库依赖的方式无非是 systemwise 安装依赖，vendor 方式携带依赖和利用依赖管理系统的接口与专门的依赖管理系统协作。CMake 支持以上三种形式的三方库依赖引入方式，并且抽象了自己统一的 find_package 接口。

我们先介绍 find_package 接口，它的主要使用形式如下。

```text
find_package(<PackageName> [version] [REQUIRED] [[COMPONENTS] [components...]])
```

后面都是可选项，最基础的使用形式就是 find_package 加一个 PackageName 信息。CMake 会在约定路径和通过选项指定的路径下搜索名为 FindPackageName.cmake 的文件，并执行其中的逻辑以设置一些关键的变量。约定的 PackageName_FOUND 标识是否找到对应的依赖以进行差别处理逻辑，其他的变量则根据不同 FindPackageName.cmake 的策略有所不同，通常包括该依赖暴露的头文件信息，可供链接的库的信息，以及库的构建目标等等，并可能按照模块进行划分以获得更细粒度的导出控制。

不少成熟的三方库都得到了 CMake 的原生支持或者提供了可移植的 Find 脚本，例如 Protobuf 和 Boost 等。这些 Find 脚本通常被写成仅搜索系统级路径的形式，也就是原生支持了查找 systemwise 安装的第三方依赖的方法。换个角度看，也就是把 `/usr/` 和 `/usr/local/` 等经典安装路径等同于 Maven 当中的 `.m2` 路径来处理。

然而，systemwise 的方式对运行环境的侵入性明显，很容易影响 PATH 环境变量和实际使用的三方库，同时容易产生难以解决的版本冲突问题。通常只在临时开发或者隔离性较强的容器环境中才考虑采用这种方法。

为了避免 systemwise 的安装依赖，另一种方案是 vendor 方式携带依赖，也就是常说的 third party 或 contrib 或 submodule 等等。ClickHouse 重度使用了这种模式，几乎 vendor 了它的所有依赖。C / C++ / Scheme 广泛流行的库通常也是通过此种形式来组织的，Go 语言在 go mod 面世之前乃至现在都广泛使用了 vendor 的依赖引入模式。

具体地说，vendor 的含义就是依赖库和根项目在源代码层面一起分发，从而在下载根项目源代码时同步就绪了所有依赖库的代码。前面提到原生的 Find 脚本通常只搜索系统级路径，因此 vendor 通常也需要手动编写 CMake 脚本引入依赖项的问题。

最理想的情况是三方库已经充分考虑了作为子项目被外部引入的情况，例如 GoogleTest 或 gRPC 等。它们在项目的根目录下有 CMakeLists.txt 文件来定义和导出项目的构建目标和头文件、静态链接库等信息，只需要在父项目中通过 add_subdirectory 声明引入三方库，就可以在 CMake 的解析框架下导出所有需要的符号。

然而，现实往往是更复杂的。有些三方库未曾想过跟其他项目协作，有些三方库并不支持 CMake 或者实现的 CMake 脚本有问题，例如典型的 Poco 项目的 ENABLE_TESTS 选项命名很容易冲突，又未启用相应的 CMake Policy 以允许上层临时屏蔽选项。诸如此类的细节问题常常引出难以排查的非预期构建结果，所以富余人力的项目研发团队倾向于撰写一个轻量级的 CMake 层来管理三方库。

典型的例如 ClickHouse 项目，它几乎对所有的项目都配备了一组 CMake 脚本，并且精心裁剪了依赖库的文件，仅保留构建相关的文件。在根项目的 CMake 文件中，通过 include 执行来执行这组配置三方库依赖的 CMake 脚本，从而达到和 find_package 或者丝滑的 add_subdirectory 类似的符号导出效果。

不过，上面提到的手写 CMake 脚本跟直接调用 find_package 的方式并不冲突，从导出符号的角度看，效果是一样的。但是，我们还能做得更加一致，即利用 find_package 提供的机制，将 vendor 的依赖作为 systemwise 依赖的前置或后置候选被挑选和导入。通过自定义 Find 脚本的逻辑，兼容 systemwise 的引入方法，再修改 CMake 查找 Find 脚本的配置，就可以实现 CMake 脚本里一致的使用 find_package 声明来引入三方库依赖了。

最后讨论的引入三方库依赖的方式是与其他专门的依赖管理系统协作，例如 vcpkg 或 conan 等。这两者都有自己的中央仓库，类似于 Maven Central 或 JCenter 等，来管理三方库，包括版本、平台、名称和库的具体内容等。

vcpkg 通过 CMake 原生的 TOOLCHAIN 机制 Hook 了 CMake 执行前的阶段，以配置好 CMake 随后 find_package 的环境从而能够正确的找到依赖。conan 则在 CMake 对构建系统的一层抽象的基础上再做一层抽象，支持生成 CMake 生成构建系统所需要的文件，加一层套娃，在生成 CMake Binary 路径的内容的时候把依赖库的内容也拷贝过去支持 CMake 索引到。

可惜由于 C++ 的跨平台构建太过复杂，并且一直以来的习惯都是 vendor + 魔改三方库，因此这两种已经是最流行的专门的依赖管理系统并没有大范围的获得采用。

顺带一提，CMake 本身还提供了 ExternalProject 和 FetchContent 等内容来支持 vendor 以外的模式，在生成构建系统期间拉取或者根据配置寻找三方库依赖并复制到构建路径下，最终以相对路径生成构建系统文件。不过这两个方案非常难用，而且没有类似于 `.m2` 或 `.ivy` 这样全局的依赖管理目录，其实每次构建的时候还是要每项目的重新拉依赖，比起 vendor 来说并不少多少力气，反而失去了 vendor 魔改的灵活性。实际采用的人少之又少。

## CMake 新时代的最佳实践

上面只讨论了 CMake 的两个最为关键且值得的内容，其他诸如指定 CMake 版本、指定 C++ 标准兼容、设置 CMake Policy 开关、添加变量和定义宏及函数等等内容，要么非常显而易见，要么比较少见，需要的时候自然可以弄懂，不做过多展开。

文字的讨论只是帮助厘清概念和建立感性认识，CMake 作为构建系统还有丰富的细节，熟悉实际系统也需要从实践出发。CMake 介绍的最后附上我在接触这个构建系统的过程中最受启发的几份最佳实践的材料。

- [Effective CMake - a random seletion of best practices](https://www.youtube.com/watch?v=bsXLMQ6WgIk)([slides](https://github.com/boostcon/cppnow_presentations_2017/blob/master/05-19-2017_friday/effective_cmake__daniel_pfeifer__cppnow_05-19-2017.pdf))
- [Using Modern CMake Patterns to Enforce a Good Modular Design](https://www.youtube.com/watch?v=eC9-iRN2b04)([slides](https://github.com/CppCon/CppCon2017/blob/master/Tutorials/Using%20Modern%20CMake%20Patterns%20to%20Enforce%20a%20Good%20Modular%20Design/Using%20Modern%20CMake%20Patterns%20to%20Enforce%20a%20Good%20Modular%20Design%20-%20Mathieu%20Ropert%20-%20CppCon%202017.pdf))

这两个演讲和 Slides 是近年来比较有代表性的讲 Modern CMake 的材料。不多说，主要也是围绕构建目标和模块化项目来介绍的。

- [CMake Examples](https://github.com/ttroy50/cmake-examples)

简练又恰到好处的 CMake 实例，新手跟着实践一遍 01 和 02 就差不多了，其他的可以按需阅读。

- [How CMake Is Implemented](http://www.aosabook.org/en/cmake.html)

CMake 实现上的原理，包括解析声明和生成构建系统的步骤以及一些执行细节，富有黑客精神的同学可以看一看。
