---
title: 软件自由到自由软件
date: 2023-01-21
tags:
    - 自由软件
categories:
    - 夜天之书
---

自由软件运动已经发展了近四十年。从最初的 GNU 工具集，到 Linux 操作系统，再到 OpenJDK 和 Telegram 等软件，使用 [GNU GPL 系列许可证](https://www.gnu.org/licenses/licenses.html)的自由软件在许多领域当中发挥了关键乃至不可提到的作用。

然而，GPL 系列许可证本身，尤其是 3.0 版本经由律师之手重新修订发布以后，其内容已经很难为开发者所理解。尤其是具体条款的拟定背景，GPL 系列许可证不同的版本的区别机器动机，单从条款本身去分析，很容易让人摸不清头脑。

其实，贯穿 GPL 系列许可证的理念，是每个版本都包含或隐式包含的讨论软件自由的序章。自由软件运动的发起人 Richard Stallman 正是出于对软件自由的追求，才撰写了 GNU 通用公共许可证（General Public License, GPL）。从软件自由的角度出发，我们才能更好地理解自由软件运动的目标，以及 GPL 系列许可证条款的意义。

<!-- more -->

## 软件自由

自由软件基金会对[自由软件的解释](https://www.gnu.org/philosophy/free-sw.en.html)当中包含了对四种关键的软件自由的定义：

* The freedom to run the program as you wish, for any purpose (freedom 0).
* The freedom to study how the program works, and change it so it does your computing as you wish (freedom 1). Access to the source code is a precondition for this.
* The freedom to redistribute copies so you can help others (freedom 2).
* The freedom to distribute copies of your modified versions to others (freedom 3). By doing this you can give the whole community a chance to benefit from your changes. Access to the source code is a precondition for this.

逐条翻译如下：

* 第 0 条，出于任何目的运行程序的自由。
* 第 1 条，理解程序是如何运行的，从而能够修改程序满足需要的自由。**获取源码是这种自由的前提**。
* 第 2 条，分发程序的拷贝以帮助他人的自由。
* 第 3 条，改进该程序，并分发改进后的程序以惠及社会的自由。**获取源码是这种自由的前提**。

其中，第 0 条和第 2 条是相对静态的，软件使用层面的自由。用户可以出于任何目的自由地运行程序，可以自由地再次分发程序未经修改的拷贝，无需取得他人或公司的许可，自然也就打破了专有软件收取许可费或额外购买密钥的惯例。

第 1 条和第 3 条是动态的，软件开发和发布层面的自由。它允许用户获取源码以理解程序运行的原理，进而根据自己的需要做定制化，同时允许用户将自己改进过的程序向社会继续分发以帮助他人。

这两条动态的自由，赋予了自由软件开放给全社会不仅共同使用，而且能够共同改进的灵魂。众所周知，软件尤其是通用软件很少一经写成就不再修改，而是在用户使用的过程中不断修改以适应不同的场景。

对于专有软件来说，用户想要实现这类定制化，几乎只能向掌握源代码和授权权限的供应商提工单请求支持。即使供应商响应支持了用户需求，用户通常也无权将这一修改后的版本向其他人分发。而自由软件允许用户获取其源码，用户也就有了自己修改软件以满足自己需求的可能性。进一步的，自由软件允许用户分发改进后的程序，以使得其他人也可以自由的使用修改后的版本，最终促进自由软件本身的迭代发展。

Stallman 在自传《若为自由故》当中提到，他发起自由软件运动最初的动机，是在遇到打印机故障的时候，却由于打印机驱动程序是专有软件而束手无策。这种无力感和对软件源码保密的怀疑，促使了 Stallman 思考如何保卫在学术型黑客当中公开和交换源代码的习惯，并最终发起了自由软件运动。

值得注意的是，赋予自由软件运动活力与灵魂的第 1 条和第 3 条软件自由，Stallman 都强调了**获取源码是这种自由的前提**。后来的开放源码运动就是抓住这一特征，以一种实用主义的态度，首先让这一重要前提深入人心。然而，开放源码或说源代码公开，终究不能包括上面这四条软件自由的所有内涵。尽管[开源定义](https://opensource.org/osd)的表述与软件自由有很大的相似之处，但是“开放源码”经常被理解成单纯的“可以获得其源代码文件的拷贝”。近年来出现的源码公开但是使用受限的软件许可证，包括 Elastc License 2.0 和 Business Source License 1.1 等，就是这种潜在风险落到实处的体现。

对于 Stallman 来说，促进所有软件都成为自由软件，让自由软件统治整个软件领域，是自由软件运动的最终目的，也是解决“非自由软件”这一社会问题的正解。Stallman 撰写 GPL 许可证，也是为了实现这一目标。

## 自由软件

满足上一节提到的四种软件自由的软件，就是自由软件。

根据这个解释，跟直觉有所不同的是，并不只有以 GPL 系列许可证或其他 Copyleft 式许可证发布的软件，才是自由软件。宽松软件许可证例如 MIT LICENSE 和 Apache License 2.0 许可的软件，同样允许用户自由地使用、复制和分发，同样确保本软件源代码公开可得，并允许用户根据自己的需要修改软件和分发修改后的版本。自由软件基金会的页面明确提到，[Apache License 2.0 是自由软件许可证](https://www.gnu.org/licenses/license-list.en.html#apache2)。

## GPL 系列许可证

如果 Stallman 只是需要一个赋予用户取得软件自由的许可证，很有可能他会写出类似 MIT LICENSE 的内容。

然而，Stallman 的目标是促进所有软件都成为自由软件。为此，他创造性地使用为软件专利提供保护的版权制度，在授予用户上述四项软件自由的同时，要求分发软件的复制或派生作品的复制，也需要遵循对应的 GPL 系列许可证的条款，也就保证在自由软件分发和修订后分发的过程里，软件自由不可修改地被传递下去。

### GPLv3

GPL 系列许可证的发端自然是 GPL 本身，其最新版本是 [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) 版本。

其中，实现这种软件自由传递的主要条款是第 2 条“基本许可”：

> You may make, run and propagate covered works that you do not convey, without conditions so long as your license otherwise remains in force. You may convey covered works to others for the sole purpose of having them make modifications exclusively for you, or provide you with facilities for running those works, provided that you comply with the terms of this License in conveying all material for which you do not control copyright. Those thus making or running the covered works for you must do so exclusively on your behalf, under your direction and control, on terms that prohibit them from making any copies of your copyrighted material outside their relationship with you.

上文要求，原封不动地分发软件或分发修改后的软件，不能再许可成其他协议，只能使用 GPLv3 许可证。同时，上文还授予了用户无条件的复制、运行和修改程序权利，这就满足了自由软件运动所追求的四条软件自由。

进一步的，GPLv3 在第 10 条明确说明了，分发作品带有本许可证，因此接收者得到本许可证，也就自动获得初始许可人依据 GPLv3 所给予的各项许可。这样，软件自由就随着 GPLv3 的传播而交到了每一个用户的手中。对于受保护作品，用户再分发时不可以对接收者增加更多限制。比如，不可以索要版权费、版税、专利许可费、或针对授权而收费；也不能发起专利诉讼（包括交互诉讼和反诉），宣称对本程序（或其中一部分）的制作、使用、零售、批发、进口，侵犯了任何专利。这就保证了软件自由不会由于再分发过程中的新增条款而收到侵害。

为了实现修改软件的自由，获取程序源码是必须的。GPLv3 在第 4 条、第 5 条和第 6 条针对分发未经修改源码、修改后的源码和非源码形式的程序的情况做了详细讨论和要求，确保用户无论以何种形式收到程序的拷贝，都有权取得程序的源码。同时，修改后的程序仍然需要以 GPLv3 许可证发布。

Stallman 在 GPL 许可证当中建立起的这套完整的体系，确保用户享有软件自由，并且这种软件自由不会随着其他用户的修改或传播而损失，而是随着 GPL 许可的软件的传播使得越来越多的软件成为（具有传染性的）自由软件。

我认为，这就是 Stallman 撰写发布 GPL 协议最初也是最重要的目的。至于在后来的实践当中被用户解释成“互惠性”，或是 Linus 因为能够实现“我给你程序源码，你回馈我对软件的修改”的模式而选择 GPLv2 许可证，这都不是 GPL 许可证本身的目标。其实，“回馈上游”更多的是一个下游策略，上游社群也并不总是接受来自下游的回馈。

这种对软件自由的追求，还体现在 GPLv3 序言用相当长的篇幅讨论软件自由的概要、重要性和 GPL 如何保证用户的软件自由。此外，第 12 条表明，如果用户分发软件或修改后的软件时，由于种种原因必须损害软件自由，那么他能采取的遵守本许可证唯一的方式就是不分发软件。这体现出 GPL 对软件自由毫不让步的追求。

关于 GPLv3 全文详细的解读，可以阅读卫 sir 说的[人话解读 GPLv3](https://mp.weixin.qq.com/s/muPDVThX5S4vsXuM5PEoIw)。

### LGPLv3

[LGPLv3](https://www.gnu.org/licenses/lgpl-3.0.html) 全文篇幅较短，这是因为它开篇就说明了自己只是在 GPLv3 的基础上补充一些权限条款。

LGPLv3 以这种方式写成，需要结合 GPLv3 的条款理解，相当于读者自己需要做一个 GPLv3 “程序”和 LGPLv3 “补丁”的合并工作，加上 LGPLv3 本身行文晦涩难懂，其实也体现出 Stallman 不希望其他人首先考虑采用 LGPLv3 的初衷：

> Stallman 在 GNU 网站上说：“这就是为什么我们对 GNU C 库使用 LGPL 的原因。毕竟，世界上有那么多的 C 函数库；让我们的 C 库使用 GPL 许可证会迫使专有软件的开发者去使用其他的 C 库：这对他们可能不是问题，对我们则是。然而，当一个函数库提供了一个重要并独一无二的功能的时候，像 GNU Readline 这样，那又是另一回事了。”

LGPLv3 里 Stallman 让步的条款，主要是第 4 条和第 5 条。这两条说的是，应用程序调用 LGPLv3 许可的库的情况，应用程序本身可以按照用户选择的条款发布，自然也就包括专有软件条款，不公开源码，不允许特定使用方式的情形。

不过，在这种情况下，LGPLv3 仍然有两个对软件自由传递的要求。

第一个，是 LGPLv3 许可的库本身仍然需要以 LGPLv3 发布。如果在应用程序组合过程中，修改了这个库的代码，那就要把“最小对应源码”，也即组合作品中剔除单纯是基于应用程序的源码，同样按照 LGPLv3 发布。一般理解，就是仅当只是链接 LGPLv3 许可的库的情形，才不受 LGPLv3 的“传染”。

第二个，是调用 LGPLv3 许可的库的应用程序，需要保证对库的兼容性，即作为库的开发者或用户，我在不改变库的公共接口的情况下，修改库代码以后，应该能够直接替换应用程序里原先依赖该库的部分。为了保证库用户这种自由，应用程序要么是通过动态链接的方式链接库，要么在静态链接的情形下，需要提供能够和库的静态库版本一起链接成组合作品的其他部分。

从软件自由的角度看，这其实是在软件边界上做出了退让。回到 Stallman 打印机的故事，故事里讲的是如果我用的软件里有自由软件的部分，我应该有自由修改的权利。对于和 LGPLv3 库组合的软件来说，至少这个软件要保证我修改了作为自由软件的库以后，还能和你一起工作。

最后，LGPLv3 的第 3 条允许用户在只是引用头文件的情况下，按照用户选择的条款发布。这或许是以前的 C 程序开发惯例里，头文件只有一些宏定义和结构定义的缘故。但是对于越来越多的 header-only 模式开发和发布的库来说，我想这个条款会导致软件自由的传递出现新的未曾想到的漏洞。

关于 LGPLv3 全文详细的解读，可以阅读卫 sir 说的[人话解读 LGPLv3](https://mp.weixin.qq.com/s/nO2FqY3krB1uVi1C5BAR1g)。我参与了这篇文章的审校。

### AGPLv3

[AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html) 的出现，就是为了补上 GPLv3 的一个“漏洞”：GPLv3 对于修改后的程序不做分发的情形，没有额外的要求，然而运行程序并通过网络向用户提供云服务，由于用户没有获得程序源码或二进制的拷贝，并不构成 GPLv3 定义下的分发。这就使得云厂商直接使用 GPLv3 许可的软件，修改后提供云服务，用户却无权获得源代码，也就无从谈起其他软件自由。

AGPLv3 因此添加了一个第 13 条来授予这种情形下用户以 AGPLv3 许可获取源代码的权利：

> Notwithstanding any other provision of this License, if you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network (if your version supports such interaction) an opportunity to receive the Corresponding Source of your version by providing access to the Corresponding Source from a network server at no charge, through some standard or customary means of facilitating copying of software. This Corresponding Source shall include the Corresponding Source for any work covered by version 3 of the GNU General Public License that is incorporated pursuant to the following paragraph.

我个人的看法是，随着计算机开发和分发形式的发展，GPL 系列许可证当中关于“组合作品”和“分发”的定义越来越经受挑战，这是捍卫软件自由的新形势和新挑战。然而，由于自由软件基金会近年来没有令人瞩目的新成就，它在相关领域的话语权和影响力减弱，这使得 AGPLv3 许可证和 [Web 页面的软件自由](https://www.gnu.org/philosophy/javascript-trap.html)等促进倡议推进受阻。选择 AGPLv3 的软件，例如 MongoDB 和 JuiceFS 等，在司法实践支持不足，社群认识也相对落后的情形下，选择替换成专有软件许可证，或是为了市场占有率选择替换成宽松软件许可证，更加打击了这些促进倡议的发展。

## 自由文化

自由软件基金会的文章 [Why Open Source Misses the Point of Free Software](https://www.gnu.org/philosophy/open-source-misses-the-point.html) 提到：

> 开源运动认为，软件是否应该开源是一个实际的问题，而不是道德诉求。正如有人指出，“开源是一种开发的方法；自由软件是一场社会运动。”对开源运动来说，非自由软件不是最佳答案。对自由软件运动来说，非自由软件是社会问题，而自由软件是正解。

自由软件运动很大程度上是自由文化的体现，是 Stallman 对软件自由是天赋人权的认识和实践。Richard Stallman 近四十年来从未改变过他的观点，并且在所有公开场合都拒绝使用非自由软件。这样一位从不动摇的领袖，根据红帽公司联合创始人罗伯特·杨的评论，“以一人之力，改变了整个世界对技术的看法”。同时，他的理念和一如既往的行为，也鼓舞促进了自由文化下其他的探索实践。

《代码 2.0》的作者，知识共享（CC）协议的作者 Lawrence Lessig 在《自由文化》一书中就写到：

> 本书从标题到内容的大部分灵感都来自 Richard Stallman 以及自由软件基金会的启发。事实上，当我读到 Stallman 的著作，尤其是《自由软件，自由社会》里一系列文章的时候，我深切地认识到，今天我所阐释的理论观点，Stallman 早在几十年前就已经想到了。因此，读者们大可以把这本书定义为一本纯粹的“衍生”作品。

维基百科的胜利，生物领域的基因组等知识共享，某种程度上也是自由文化在新时代其他领域的星星之火。

最后，以万维网的主要创始人蒂姆·博纳斯-李对 Stallman 的评价结束本文：

> 理查德是第一位奋起反抗的人。如今，他的抗争演变成了更大规模的行动。他指出了软件专利背后的荒谬逻辑：哪怕只有一行的代码，仅仅因为这行代码的作者是第一个想到这代码的人，就可以宣称对这种方法的完全所有权。当年，理查德曾孤独一人为我们战斗。他曾警告过我们，软件业现有的知识产权模式不仅不会帮助从业者，反而会让开发人员倍受折磨。如今，软件专利肆虐，已不再是推动行业进步的动力，而这一切，早就被理查德言中了。

## 推荐阅读

* [《Free as in Freedom》](https://book.douban.com/subject/26314527/)
* [《Free Culture》](https://book.douban.com/subject/4050757/)
* [《Open Source for Business》](https://book.douban.com/subject/35309516/)
* [《Open Source Law, Policy and Practice》](https://academic.oup.com/book/44727)
* [《The Open Revolution》](https://book.douban.com/subject/36110380/)
* [《挑战知识产权》](https://book.douban.com/subject/4214651/)
