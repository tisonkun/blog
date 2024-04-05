---
title: 我的 Linux 开发机
date: 2023-02-11
tags:
    - Linux
    - Arch Linux
    - Garuda Linux
categories:
    - 天工开物
---

首先说一下结论：最终我选择了基于 [Arch Linux](https://archlinux.org/) 的 [Garuda Linux](http://garudalinux.org/) 发行版作为基础来搭建自己的 Linux 开发机。

![Neofetch 时刻](garuda-desktop.png)

<!-- more -->

## 发行版的选择

在上周末的这次折腾里，我一共尝试了 Garuda Linux 发行版，原教旨的 Arch Linux 发行版，以及众所周知的 [Ubuntu](https://ubuntu.com/) 发行版这三个选择。虽然最后做了逃兵直接摆烂 Garuda Linux 配好的图形桌面环境，算不上符合 [Arch 之道](https://wiki.archlinux.org/title/Arch_Linux#Principles)的玩法，但是该走的过场还是走了的。

### 机器的选择

我想配置一个纯粹的 Linux 环境的想法大概酝酿了一年多了。从接触 [io_uring](https://en.wikipedia.org/wiki/Io_uring) 相关功能的代码，到其他依赖 Linux 内核版本或生态工具的功能，我从前同事 [@w41ter](https://github.com/w41ter) 那里接受了一个理念：“开发机的环境最好跟生产环境是一致的这样也才好调试问题。”

配置一个原生的 Linux 环境（相较于虚拟机），最舒服的其实是公司提供高配的开发机。例如在某司时用上的 256 GB 内存 96 核 NVMe 盘的机器。毕竟对 Linux 的执念也不过是一个开发环境，而不是必须要一个桌面环境。可惜公司的机器跟特定公司绑定，而且不太适合开展一些未必跟公司工作紧密相关的工作和共享文件，更麻烦的是，往往访问公司机器还得连接内网，这就让“完全使用 Linux 开发”的目标难以实现。

另一个被否定的做法是个人购买云服务器。这个思路我在读书的时候就试过了，最近也还考察过目前的行情。结论就是：太贵。一台上面提到的公司级开发配置的机器，云厂商对个人是卖不到这个配置的。大约打个五折以上可以起卖，每个月少说五千块钱，多了上万。还别说这个机器只是租给你，上面的数据不在本地，而且机器在哪个区域联网都有不同的问题。个人装机花个小几万能配得比这配置好不少，还是自己的资产，用个几年不在话下。这么一看，个人用买云服务器纯属冤大头。

最后，办法就是自己买台机器装上 Linux 系统。由于国内几乎所有机器都预装了 Windows 系统，弃之可惜，所以只能麻烦点装双系统。硬件配置我自己是不会配的，找的好兄弟一揽子解决，这里就不介绍了。

装双系统这件事我在大学时候就做过，当时还干过替换内核和开发内核模块，还有利用显卡写 Lua Torch 之类的事情，所以做起来其实是轻车熟路的。但是一直以来都觉得同一块盘上分区逼死强迫症，也确实对使用多少有点影响，这次我就干脆加了一块 2TB NVMe 的盘来折腾 Linux 系统。

### Garuda Linux

我一开始选的就是 [@Manjusaka_Lee](https://twitter.com/Manjusaka_Lee) 在推特上介绍过的他为自家 HomeLab 选型的 Garuda Linux 发行版。在一个非常清晰的教学视频的帮助下，我很快就完成了安装。

[How to Dual Boot Garuda Linux and Windows 10 SAFELY](https://www.bilibili.com/video/BV1Yh411y7ab)

然后就发现 N 卡不愧是 Linux 的两大噩梦硬件之一。

![你知道我要说什么](torvalds-nvidia.jpeg)

我使用的是 GTX 4090 Ti 的显卡，毕竟这次是一揽子计划，估计一劳永逸个五年起步，而且买新不买旧嘛。但是 4090 确实是太新了，而黄老爷自然是不太在乎开源拖拉机能不能用上他的新卡的。Garuda Linux 在我的机器上，如果选择安装开源驱动，Live USB 都起不来；如果选择安装专有软件驱动，则会在安装完成后进入系统的时候起不来。

所幸 @Manjusaka_Lee 哥哥也遇到了这个问题，所以这个问题是可解的，咒语全文如下：

```bash
# 首先，选择专有驱动安装系统。此时，直接启动系统会进入 Color buffer .. 卡死
# 此时，重新进入 Boot 页面，选择从 Live USB 登录，在 Live USB 环境中完成修复：

# 1. chroot
# Find your system disk by `lsblk -f`
# https://forum.garudalinux.org/t/how-to-chroot-garuda-linux/4004
sudo mkdir -p /mnt/broken
sudo mount /dev/<your system disk partition (e.g. nvme0n1p1)> /mnt/broken
sudo garuda-chroot /mnt/broken/@

# 2. Remove nvidia-dkms
pacman -R garuda-nvidia-config
pacman -R nvidia-dkms

# 3. Install nvidia-open-dkms
pacman -S nvidia-open-dkms

# 重启系统，应该就可以正常登录了。
```

“咒语”这个词概括了我配置 Linux 开发机早期阶段的主要心情：一下子接触到一大堆 Linux 图形桌面操作系统的知识，这些以前都是厂商搞定的，现在是个问题都得我自己理解解决，很多时候我是似懂非懂念完找到的咒语能灵就赶紧跑路了。

从这个角度讲，Garuda Linux 基于 Arch Linux 的基本工具和软件库，把一些关键的应用选择全做了，然后开发出了非常漂亮的图形桌面，连 N 卡驱动这种事情都有舒适的路径，细节处用好了 btrfs 和 linux-zen 内核，确实是一个优秀的面向极客的发行版。

这些体会，也是我写《{% post_link hackers-and-customers %}》的背后动因。

### Ubuntu

那么为什么我还会尝试 Ubuntu 呢？直接原因是一个很小的事情：绘文字（emoji）在 Garuda Linux 上显示有问题😅

具体技术上怎么出这个问题的后面再谈，总之在输入法提示框和 JetBrains 系 IDE 上不能正确显示 emoji 逼死强迫症，加上一开始尝试时乱安装了一堆依赖早就想清清了的动机下，反正机器上也没啥大不了的数据（甚至我数据全都丢一个分区摆大烂），我就开始了堵死自己逃生路口之旅，验证一下其他发行版确实不行，免得真过两天个人数据记录起来了心里总觉得可能还有更好的沉没成本太高。

> 兄弟姐妹们，下载 Ubuntu 安装镜像记得从国内镜像站下载，直接从官网下载慢死个人。

Garuda Linux 在官网提供了 Garuda Installer 轻松愉快的点两下就能制作 Live USB 介质，Ubuntu 还得自己搜索工具准备。从这点看，Garuda Linux 的用户体验确实是做得相当不错。不过话说回来，Ubuntu 的 Live USB 网店有人做，Garuda Linux 这种小众货色还得自己买 USB 设备，从这个角度看，是 Ubuntu 赢了。

放弃 Ubuntu 的速度比闪电战还快：它还是我熟悉的配方，每个操作都充满了一卡一卡的摸鱼气息。别说 GNOME 的美工和 UI 确实不如 KDE 了，Ubuntu 这老小子居然也对 4090 水土不服，N 卡果然是噩梦。花了几十分钟试图解决 N 卡驱动问题未果，直接选择和解跑路。

![梅开二度](torvalds-nvidia.jpeg)

其实不选 Ubuntu 这种超重量级的发行版是有原因的。

Arch Linux 系的发行版，遵循所谓 Arch 之道的情况下，整体比较简洁，没有太多不需要的东西。虽然这样很多内容是用户作为开发者自己去调配的，但是到底怎么出的问题，用户一般还调试得了。

Ubuntu 走的是 Windows 和 Mac OS X 的道路，也就是虽然用了 Linux 内核，但是试图提供的是开箱即用的用户体验，可惜我只能称之为其他两者的低配版。这样的产品完成度下，极客或黑客玩家的体验就是：我开箱即用的效果不好，改还不知道咋改，麻了。

不过，抛开 Ubuntu Desktop 的问题不谈，Canonical 公司为 Ubuntu 上软件的正确性测试投入还是很值得肯定的。对于追求稳定可靠版本的 Linux 环境和生态完善经过验证的 apt 系软件库的场景，比如找个合适的基础 Docker 镜像摆烂的情况，Ubuntu 还是个不错的选择的。但是 Ubuntu Desktop 确实大可不必。

### Arch Linux

人不 Arch 枉少年！在歌单名《中二少年的轨迹》的加成下，年过半半百的小 tison 还是打算炫一把 Arch Linux 发行版。毕竟可以肯定的是 Garuda Linux 就是基于 Arch Linux 配出来的，emoji 的问题肯定也是做了啥不该做的定制才出现的。我遵循 Arch 之道从头来一把，总能折腾好这个环境。

后来的事实证明确实是做多了事情导致的 emoji 不能在 Garuda Linux 上正常显示，但是从裸的 Arch Linux 上配环境确实也挺折腾人。

有一说一，装一个基础的 Arch Linux 系统并不难。Arch Linux Wiki 的[安装指南](https://wiki.archlinux.org/title/Installation_guide)加上[坊间指南](https://arch.icekylin.online/)对一些关键细节的补充和选择困难症的终结，装一遍 Arch Linux 应该不到三十分钟就能搞定。

整个安装过程完成后的感想就是：[@Xuanwo](https://twitter.com/OnlyXuanwo) 哥哥说得对，走完一遍 Arch Linux 的安装，Linux 操作系统的引导、磁盘分区和挂载、网卡的交互和基本的用户模型就都懂了。推荐新玩家在玩过编译替换 Linux 内核的游戏以后也来整一次 Arch Linux 发行版的安装。

然后这个过程就卡死在装好系统以后设置了 KDE 桌面却打不开了。KDE 桌面的安装和 SDDM (Simple Desktop Display Manager) 服务应该都是好的，还是 N 卡拉了胯。

![帽子戏法](torvalds-nvidia.jpeg)

试过几个驱动方案无果后和解。

过程里几次通过 Arch Linux 的 Live USB 环境使用类似前文解决 Garuda Linux 驱动问题的手段 `arch-chroot` 到主系统关闭 systemd 上的 SDDM 服务，这是一个避免机器变砖的逃生出口。

另外 `os-prober` 安装后必须运行一遍以发现原系统的引导信息，不然你刷了 GRUB 可能突然就看不到启动 Windows 的选项了，万一手忙脚乱出点啥错 Windows 系统丢了，修起来也是个麻烦事。

### Emoji 问题的解决

Emoji 已经被收录到 Unicode 编码里了，所以 emoji 的显示问题其实就是字体问题。

不过无论是 Garuda Linux 还是 Ubuntu 都有图形化界面管理字体，所以整体配置环境跟纯粹 Linux 最小集是不一样的。这也是我前面评价 Ubuntu 是低配版 macOS 的一个佐证，这种额外的封装和开箱不即用的体验会伤害黑客玩家的信心。当然在这点上，Garuda Linux 也没好到哪里去。

解决问题的办法隐约中跟 Arch 之道也是呼应的：少即是多。最后查明问题的触发点是我在成功安装 Garuda Linux 以后，按照系统提示的定制化建议勾了几个输入法和语言字体的选项，其中安装了 ttf-google-font-git 这个包，而这个包和系统的 adobe 字体包冲突，导致了一些字体加载、解析和回退方面的问题。不做这个安装就能解决问题，也不会引入新问题。

此外，解决这个问题期间我还试过 Garuda Linux 发行版的其他图形桌面主题。结论是只能说旗舰就是旗舰，其他版本就是大学生课程作业的水平。如果要我一句话评价，那就是：别用。

## 输入法和字体

先说结论：输入法我选择了 Fcitx5 + Rime 的解决方案，字体我在全局用了 Noto fonts 解决中英文加 emoji 的所有问题，代码显示和终端环境里则是用 Source Code Pro 字体。

字体的问题不用多说，各有各的偏爱。我用 Source Code Pro 的历史开始于大二实验室实习期间学到了 CTF 世界冠军 [@Atum](https://netsec.ccert.edu.cn/people/atum) 老板的配置。

输入法我在 macOS 和 iOS 上七年来都是搜狗拼音摆烂，然而搜狗拼音自己[顾不上兼容 Fcitx5 新框架](https://bugs.launchpad.net/ubuntu/+source/language-selector/+bug/1928360)。强迫症让我拒绝回退到旧版本，这也不是 Arch Linux 这种滚动更新天天最新的玩家的做法，我也没那个时间去折腾，尤其是搜狗代码还是闭源的，这基本表明你除了祈祷以外什么也做不了（RMS 打印机的翻版）。

所以入乡随俗，我确实对输入法的定制还是有点需求的，就用了 [Rime](http://rime.im/) 中州韵输入法，配置过程大抵可以参考 Arch Linux Wiki 上的 [Fcitx5](https://wiki.archlinux.org/title/fcitx5) 页面。

第一步，安装一大堆相关的库，比如：

* `fcitx5`
* `fcitx5-rime`
* `fcitx5-chinese-addons`
* `fcitx5-configtool`

这几个搞完，其他的基本都在依赖里也装上了。然后最重要的就是告诉 X 窗口管理器记得用上 Fcitx5 做输入法，配置方式是在 `$HOME/.xprofile` 里写上：

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```

随后就是在 Fcitx5 的默认配置目录 `$HOME/.local/share/fcitx5` 里定制了。直接改配置文件容易出错，所以我是下载了 Rime 的管理工具 [plum](https://github.com/rime/plum) 来做这件事的。

随便找个地方下载好 plum 工具，然后执行以下命令配置双拼和 emoji 候选词：

```bash
rime_frontend=fcitx5-rime bash rime-install double_pinyin
rime_frontend=fcitx5-rime bash rime-install emoji
rime_frontend=fcitx5-rime bash rime-install emoji:customize:schema=double_pinyin_flypy
```

再到配置目录下做一些微调。

添加 `$HOME/.local/share/fcitx5/rime/default.custom.yaml` 文件：

```yaml
patch:
    # 去掉其他不需要的候选输入法
    schema_list:
        - schema: double_pinyin_flypy
    # 候选词界面支持 Tab 键翻页
    key_binder:
        bindings:
            - { when: has_menu, accept: Tab, send: Page_Down }
```

原地修改 `$HOME/.local/share/fcitx5/rime/double_pinyin_flypy.schema.yaml` 文件：

1. 把 switches 西文的部分 reset 改成 1 以默认启用英文输入。主要工作是开发，所以默认英文会方便很多。
2. 把 switches 汉字的部分 reset 改成 1 以默认启用简体字输入。

我也趁着这次换工作机器的契机把输入法切换到了小鹤双拼，确实第一天对着键位图打个几小时就能记住了，打了几天以后虽然不算流畅，但是双拼本身键程短，误输入概率低，所以我的输入速度已经恢复到原来的 80% 有余。误输入的典型案例是，全拼很容易把“时间”（shijian）输入成“时间爱你”（shijain），由于双拼多韵母也是一个键输入，就不会出现这种多韵母字母错位带来的误输入，从而提高打字效率。

![双拼键位图](flypy.png)

## Dotfiles

技术上，图形桌面系统也是以 Linux 操作系统为内核的。而 Linux 的特点就是一切皆文件，而且配置也都是一堆文件。

一旦用上 Linux 系统，你就会知道为啥 GitHub 上那么多人分享或者说单纯是备份自己的配置文件。比如上面对 Fcitx5 和 Rime 的这一通配置，不记下来下次再来一遍还得累死人。

我从 macOS 时期就一直需要带着的配置文件是 Git 的配置和 Vim 的配置，所幸我不做复杂的配置，所以迁移起来不怎么费时间。这也是因为越少的配置越能跨平台的缘故，否则定制化太多，真的除了自己的机器，换个环境生产力就跌零了。

Git 可公开配置如下：

```ini
[user]
    email = wander4096@gmail.com
    name = tison
    signingkey = ...
[pull]
    rebase = true
[core]
    excludesfile = /home/tison/.gitignore
    editor = vim
    pager = less --mouse
[tag]
    forceSignAnnotated = true
[init]
    defaultBranch = main
[gpg]
    program = /usr/bin/gpg
[commit]
    gpgsign = true
```

主要是支持自动 GPG 签名的问题，以及引用一个全局的 gitignore 规则：

```
# JetBrains
.idea
*.iml

# Visual Studio Code
.vscode

# Apache Maven
.mvn

# macOS
.DS_Store
```

Vim 的配置如下：

```
syntax on
syntax enable

filetype plugin indent on

set nocompatible
set number
set ruler

set tabstop=2
set softtabstop=2
set expandtab
set backspace=indent,eol,start

inoremap jk <ESC>
```

其中最后一行是减少 ESC 键的键程。同样的道理，我还会总是把 CapsLock 即大写锁定键映射成 Control 键。高级点的键盘在硬件层面就可以设置，macOS 修饰键配置可以改，Windows 有 [Ctrl2Cap](https://learn.microsoft.com/en-us/sysinternals/downloads/ctrl2cap) 工具，而 Linux 就得根据环境各显神通了。Garuda Linux 发行版的配置下，可以通过在 `/etc/profile` 里加这一个指令来实现：

```bash
# Map CapsLock to Control
setxkbmap -option caps:ctrl_modifier
```

另外，我把默认的 shell 从 Garuda Linux 发行版配的 fish 程序换成了 zsh 程序，不过没有用 oh my zsh 终端，它跟发行版已经给 zsh 配的默认风格不是特别搭。但是 oh my zsh 在 `ls` 命令上的一些 alias 还是不错的，我给 pick 了过来：

```bash
# User-defined alias
alias ls='ls --color=auto'
alias l='ls -lah'
```

## 应用软件

Garuda Linux 发行版默认使用了以下 AUR 源：

* garuda
* core
* extra
* community
* multilib
* chaotic-aur

其中 `garuda` 包括了发行版的桌面环境、定制化配置和专用软件。接下来三个是基础源。`multilib` 包含了一系列兼容模式的 32 位软件。`chaotic-aur` 则是闻名的二进制应用源。

因此，大部分应用软件在 Garuda Linux 上也可以直接从 AUR 上安装。我的主要应用软件是：

* Google Chrome
* Visual Studio Code
* JetBrains Toolbox
* LogSeq
* QQ
* Telegram

另外，Notion 和 Slack 也很重要，不过能用的 Desktop 应用体验很差，所幸网页版功能是全的，直接遁入网页版完事儿。JetBrains 全家桶走 JetBrains Toolbox 这个门户应用全都能安装下来。其他一些基本应用比如 Konsole 和 Latter Docker 这些都在 Garuda Linux 发行版的预装里。

国民应用[微信](https://wiki.archlinux.org/title/WeChat)，可以通过 Wine 使用 Windows 的版本，或者直接安装 AUR 上基于统信 UOS 版魔改的 Linux 原生版本，但是使用体验均不佳，遂放弃。微信移动端以外做得最好的还得是 macOS 平台，而直接下线了网页版则完全体现出了垄断巨头的不讲理。

最后，祝各位每天 `yay -Syyu` 都顺利 :)
