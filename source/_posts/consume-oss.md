---
title: 如何安心使用开源软件？
date: 2025-08-11
tags:
    - 开源
    - 构件仓库
categories:
    - 夜天之书
---

上周，我在视频号（啸飞吟声）上做了一期连线直播，讨论包含企业开源软件变更协议在内的商业开源相关问题。其中，有一个重要的内容，就是作为开源软件的使用者，面对上游开源软件无法持续维护，或者企业开源的软件修改协议等潜在风险时，如何保障自己的使用安全。

在此前的一篇博文[《开源软件有断供的风险吗？》](https://mp.weixin.qq.com/s/vSxWUcFgbS3D_0tZnBIfdg)当中，我已经说明了开源协议**不可撤销地**授予接收者使用、复制、修改和分发软件的权利，以及作为开源软件的使用者，如何判断开源依赖需要自己付出哪些投入。不过，这篇文章主要是讨论抽象的依赖分类，以及开源协议在源码授权上的不可撤销性。最近 KubeSphere 删除软件文档、已发布镜像等行为，实际上受影响的主要是开源制品，即基于开源软件源代码构建的二进制软件包等等。

本文讨论开源软件使用者如何可靠地依赖开源制品。

<!-- more -->

---

首先，Callback 一下前一篇文章对开源软件不可撤销地授予使用者相关权限的论点。即使在青云删除前端开源代码，我们仍然能找到其在突然删库前其他开源开发者 Fork 出来的代码库，其中最新的应该是 [donniean/ks-console](https://github.com/donniean/ks-console) 仓库，而在 KubeSphere 上游删库以后，新产生的 Fork 树的根 [FeynmanZhou/console](https://github.com/FeynmanZhou/console) 的作者，正好也是[《辩证看待 KubeSphere 闭源删库，前核心团队成员的解读》](https://mp.weixin.qq.com/s/QC1P8OPSYzC4mFmKIB9daQ)的作者。这下实锤前核心团队成员了 :D

保险起见，我也从这个仓库又 Fork 出来一份，保证相关代码不会遗失：

![我的 KubeSphere Console Fork 仓库](tisonkun-kubesphere.png)

互联网上，也出现了对 KubeSphere 截至变更协议和删库前的代码整理：

![自发形成的 openksc 组织](openksc-org.png)

因为青云此前发布 KubeSphere 相关代码使用的是原版的 Apache License 2.0 协议，所以这些代码的使用者仍然可以在 Apache License 2.0 协议下继续使用、修改和分发这些代码。这也是之前 ElasticSearch 变更协议之后，AWS 可以用 Apache License 2.0 协议继续维护 OpenSearch 的原因。同样的例子还包括 HashiCorp 和 OpenTofu，Redis 和 Valkey，以及 Akka 和 Apache Pekko 等等。

应当说，出于种种原因变更自有产权的软件的许可协议，并不违法，也不是不能理解的，但是想要通过删除来掩耳盗铃，着实毁坏自己的口碑。当然，客观上不得不承认，很多人在搜索 KubeSphere Console 并点击第一个链接看到 404 以后，可能也就放弃寻找，不会知道其实还有其他的 Fork 存在。但是，只要这个项目创造出了相当的价值，就会有 openksc 这样的组织出现做一个复刻版本。而如果没人愿意做这件事情，岂不恰好说明删库的项目其实也没有那么重要？

---

话说回来，为了安心使用开源软件，一言以蔽之，就是针对核心依赖进行 Fork 和自行打包。

开源协议并不包括承诺作者必须永久提供各种衍生二进制格式的免费下载方式。因此，KubeSphere 删除相关镜像，尽管会极大地破坏开发者对项目方的信任，但是并没有违反和开源用户达成的书面协议。

我一向建议对开源软件有强依赖的用户，不直接依赖上游的链接，而是维护一个自己的 Fork 并构建对应的打包流水线。这样做的好处，其一自然是在上游整出幺蛾子的时候，避免自己的业务收到影响；其二是在需要针对业务需要，或者立即修复问题的时候，能够绕开上游的审议、发布流程，直接推出一个 hotfix 以供使用。这样的例子在 Apache 软件基金会里比比皆是，大多数应用型开源软件的供应商都会有自己的打包版本，当他们向客户提供自己的打包版本时，对应的商业协议就会约束对应打包版本不能动辄断供。

当然，这里所说的维护一个自己的 Fork 并不是跟上游硬分叉。在没有自研力量的情况下，定期与上游同步，只是自建打包发布流程，跟紧急情况做临时修复和发布，并且再后续把自己的修改推回上游合并，减少和上游的差异，是一个典型的 Upstream First 的做法。

更进一步地，对于需要更加严格管控开源制品消费的公司来说，可以在企业内部自建一个软件制品的仓库（Repository）。例如，自建 OCI 镜像仓库、Nexus 软件管理仓库，以及企业内的 NPM 和 Cargo 注册表等等。这样，企业所使用的所有软件都在自有的环境里管理，甚至从开源生态当中引入依赖，也需要 Repository Manager 审计，保证只有可靠的版本才能进入到内部依赖当中。因为有了自建的镜像仓库，自然 KubeSphere 删除 Docker Hub 上的镜像也就不会对企业内部的使用造成影响。

不过，这样的方案需要一个完整的团队来实施，而且每增加一个自建仓库的类别，就需要新的人才或稀少的复合型人才。因此在之前的经历当中，我也只在中大型企业跟对软件依赖有严格要求的企业里看到过这样的做法。

那么，直接在开源生态当中依赖开源软件就是危险的吗？其实也不然。

例如，在 [left-pad 删库](https://en.wikipedia.org/wiki/Npm_left-pad_incident)造成互联网大风暴之后，NPM 手动恢复了最后一个用开源协议发布的版本，并在此后更新了平台协议，严格约定了可以删库的条件。对于被广泛使用的软件库，不允许作者删除。

无独有偶，Rust 生态的 Crates.io 中央仓库也对删除公开发布的软件库有具体的[约束](https://crates.io/policies)：软件库发布不超过 72 小时；或者，软件库仅有一个管理员，并且没有被其他库所依赖，并且自发布后每个月的下载量都不超过 500 次。

至于 Java 生态下主要的中央仓库，ASF 的 Nexus 仓库直接不允许删除已发布的内容，[Sonatype 的开源仓库](https://central.sonatype.org/faq/can-i-change-a-component/)也是如此。

对于 GitHub 上的源代码仓库，Fork 按钮可以一键备份，随后你可以写一个定时作业每天同步一次；对于 Docker Hub 上的镜像，同样可以用 [`docker buildx imagetools create`](https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/) 等多种方式进行备份。

所以，了解你所依赖的开源制品平台的用户政策，并根据公司对具体开源制品的依赖程度，以及公司当前发展阶段，综合考虑投入资源，是开源软件消费方应当采取的正确态度。

此外，还有一种可能此前未曾想过的方式，是自研替代方案。类似地，这个方案需要考虑替代后的收益，后续维护的成本，以及开源方案后期的预估发展。是否自己投入替代方案，只是 [NIH 症候群](https://en.wikipedia.org/wiki/Not_invented_here)发作？别过段时间上游发展得比替代方案更好，还得再迁移回去。

我在上周的视频号直播当中，也讨论到了现实世界当中成本和收益的平衡。对于初创公司来说，选择可靠的依赖，赌在自己草创阶段不要遇到上游整活的情况，是更符合商业逻辑的做法。等到公司生存下来，有足够的资源和精力来处理这些潜在的风险，再考虑自建仓库等方式来规避风险。

---

最后，不得不吐槽 KubeSphere 社群发布的[公开信](https://mp.weixin.qq.com/s/hm0MUiS9rZNvFTHWIpeBKQ)，其中：

1. 没有对删库行为和删除镜像的行为做出解释，假装无事发生。
2. 经典“合规企业用户无影响”。为什么呢？原来是“可选择购买商业版”。

该文所引用的例子大多也在我此前撰写的系列文章当中有过解读，各位读者可以参考：

* [《企业开源的软件协议模型实践》](https://mp.weixin.qq.com/s/iSR1sryhmp_wQxf5cvrxOA)
* [《商业源码协议为何得到 HashiCorp 等企业的垂青？》](https://mp.weixin.qq.com/s/hYfw7HoBr-cm8cxyQIXLgw)
* [《诱导转向的伪开源战略》](https://mp.weixin.qq.com/s/HsgoUoBzsyXSmDfV00DlgQ)
* [《我应该将产品开源吗？》](https://mp.weixin.qq.com/s/e_9P4npQpjM2vItQAPOSWw)
* [《企业实践开源的动机》](https://mp.weixin.qq.com/s/NYC_beiBvsxCjkocA1FUZA)
* [《开源不是商业模式》](https://mp.weixin.qq.com/s/VIKlKIthvYaHaBl6ALqtSA)
