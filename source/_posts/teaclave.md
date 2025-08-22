---
title: 孵化六年，一夕毕业：Apache Teaclave 的最速传说
date: 2025-08-22
tags:
    - 开源
    - Apache
categories:
    - 夜天之书
---

2019 年，当时的 Baidu Security X-Lab 团队将自己研发的安全计算框架 MesaTEE 捐赠到 Apache 孵化器，并更名为 Apache Teaclave 开始孵化。

时过境迁，当时的 X-Lab 早已不复存在，其[孵化提案](https://lists.apache.org/thread/3l3bc5k9247typs25kms2flfc330rry1)中引用的 MesaTEE 网站也被其他实体申请占用。甚至，初始成员大多已经离开百度公司，前往新的团队开发新的安全软件。

很长一段时间里，Teaclave 都是所谓“源自中国”的 Apache 孵化项目当中孵化时间最长的项目：

![今年 6 月的不完全统计](projects.png)

不过，六年过去后的 2025 年，也就是今年，Teaclave 突然复苏。从三月开始时隔两年再次提名新的 Committer 到七月开始筹备毕业，就在一个月后，本周的 Apache 董事会议上，Teaclave 就完成所有流程正式成为 Apache 顶级项目。

![一致通过 Teaclave 的毕业决议](resolution.png)

本文从这样一个不太常见的开源项目演化历程出发，谈一谈开源生态里的“长期主义”以及如何在开源社群中取得进展。

<!-- more -->

---

我第一次了解 Teaclave 项目，是在 2023 年中 ASF 项目交流的微信群里偶然看到的。

![](wechat-group-1.jpg)
![](wechat-group-2.jpg)
![](wechat-group-3.jpg)

当时群里也有其他的群友表示看不懂 Teaclave 是干嘛的，我也没能花时间搞明白，于是后来也就不了了之没怎么关注这个项目了。

其实，从今年 Teaclave 筹备毕业期间做的[仓库结构重构](https://lists.apache.org/thread/9kfbl5m7z841z6kwxflx0bbl333g3zp4)，我就明白了这里的问题所在。

整个 Teaclave 现在核心的价值，其实是一组开发工具（SDKs）：

* [Apache Teaclave SGX SDK](https://github.com/apache/incubator-teaclave-sgx-sdk)
* [Apache Teaclave TrustZone SDK](https://github.com/apache/incubator-teaclave-trustzone-sdk)
* [Apache Teaclave Java TEE SDK](https://github.com/apache/incubator-teaclave-java-tee-sdk)

这些开发工具被更上层的可信计算框架等软件所依赖，比如内存安全的 LibOS [Occlum](https://github.com/occlum/occlum) 和智能合约方案 [Secret Network](https://github.com/scrtlabs/SecretNetwork) 等。Teaclave SDKs 提供底层的接口，例如 SGX SDK 封装了 Intel SGX 扩展的能力，TrustZone SDK 封装了 OP-TEE 设计接口的能力。总的来说，目的是保证只有可信的代码才能访问特定存储空间的数据。

对于数据系统工程师来说，你可以简单地理解成类似为不同体系结构 SIMD 能力提供统一封装的 API 的开源库，也就是生活在体系结构无关的 APIs 之上的程序员永远也不用关心的那些事情。

话说回来，之所以之前 Teaclave 的定位和文档让人看不懂，是因为之前的 Teaclave 有一个很大的梦想。它的主仓库放了一个“未来可期”的所谓通用安全计算平台，简单来说就是一个垂直分类下的函数即服务（FaaS）平台，这也符合 2020 年前后的技术风潮。

显然，这个梦想从来没有实现过。这个“未来可期”的超级平台，也从未破壳而出，从未在线上环境运行过。这也符合我在[《大厂开源之殇》](https://mp.weixin.qq.com/s/KLh6kP9IpyyV-AP58rp7Gg)里提到的，大厂开源（百度自然也还是大厂）总想搞全家桶式套件开源，不做平台吃干抹净所有份额就不舒服。但是实际投入的人力，又远远达不到能够触及梦想的百分之一。

如今，Teaclave 的[主仓库](https://github.com/apache/incubator-teaclave)已经替换为更加务实的纯门户仓库，旨在介绍项目定位和路线图，不同可信执行环境（TEE）平台 SDK 的使用指南和真实应用程序示例。应该说，在大厂影响退出后，当 Teaclave 再次被务实的工程师接管激活的时候，社群成员是知道应该怎么安排内容和设置预期，才是真正合理可落地的。

![注重实际的重新定位](reposition.png)

---

我们完整地看一下 Teaclave 项目发展的时间线：

![Teaclave 时间线](timeline.png)

可以看到，项目从 2019 年中进入孵化器，到 2023 年初应该都算有序发展。今年重提项目毕业事项的时候，项目管理委员会（PMC）的成员也反思到，其实在 2022 年底，项目的状态就已经达到毕业的标准，应该在那个时候筹备毕业事项，也就不至于拖成孵化时间最久，耗时六年的“奇葩”项目。

可以想见，从 2023 年或更早的时间点开始，Baidu Security X-Lab 团队必然发生了巨大的人员调整，团队成员主动或被动离职，走向新的职业生涯的过程里，显然会面临大量比维护 Teaclave 更重要的事情。从结果上看，这次把 Teaclave 项目重新激活并带往毕业的陈兆丰，就是当时 X-Lab 的团队成员，也是 Teaclave 开始孵化时的创始成员。我不负责任的猜测，或许就是在两年的新职业适应期后，他发现自己的工作还是有依赖 Teaclave 的地方，也发现在可信计算这个细分领域里，还有不少 [Teaclave 的用户](https://teaclave.apache.org/powered-by/)依赖这个停滞的项目。于是，既然大家都有对 TEE SDK 的需求，比起另起炉灶，为什么不把原先就有的，开发得还不错的，某种程度上也算自己的项目的 Teaclave 再激活呢？

客观来说，面临相似问题的 Apache 项目并不罕见。例如众所周知的孵化失败项目 Apache Weex (Incubating) 就是在团队失去公司支持以后艰难维持，最终无以为继只能退休。

![Weex 挣扎数年后退休](weex.png)

在上面引用的“源自中国”的 Apache 孵化项目，有些项目的发展前景也很危险。

例如，小米捐赠的 Pegasus 似乎已被公司遗弃，上一次版本发布已经要追溯到 2023 年底。例如，阿里巴巴捐赠的 GraphAr 也因公司人员变动，自第一个 Apache 版本发布以来，已经近一年没有新版本发布。不过似乎随着人员变动的影响安定下来，GraphAr 在本月有望发出第二个版本。

例如，虽然蚂蚁集团捐赠的 Fury 项目，在上个月经过重命名后以 Apache Fory 的名字[毕业成为顶级项目](https://mp.weixin.qq.com/s/q9K7sHAo3oSrNyDsoSp4dA)，但是同一时期捐赠的另一个项目 HoraeDB 却举步维艰。同样因为公司人员变动，项目自今年起已经基本没有任何动静。我作为 HoraeDB 项目的导师，不得不发起孵化终止的退休提案。

从我作为 ASF 孵化器导师的经验来看，带有个人项目色彩的孵化项目是比较容易坚持下去的，例如上面提到的 Apache Fory 项目，我指导孵化的 Apache StreamPark 和 Apache OpenDAL 等等。因为项目作者对项目的热情和投入，往往不会随着工作的变化而轻易动摇。对于项目作者来说，这个项目是他引以为傲的一个开源作品，做好这个项目事关**自己**的声誉。如果项目成功了，毋庸讳言其原作者将得到项目声誉绝大部分益处；如果项目失败了，原作者也会承担相应的议论和影响。

此外，社群维护启动的项目，大多也能具备长久的活力。例如 Apache Kvrocks 就是开发者们在离开美图秀秀后，仍然独立运营了两三年的项目。项目进入 ASF 孵化器的动机，就是希望通过学习 The Apache Way 进一步提升社群韧性。Kvrocks 的参与者早就习惯在日常工作之外花费一些时间看看 Kvrocks 社群的进展。例如，我正在担任导师的 Apache Iggy (Incubating) 就是一群开源爱好者组起来的项目。它目前看起来活力十足。虽然我不太喜欢它的技术设计，但是从社群发展的角度评价，绝对是稳中向好。

另外一种能够长期发展的项目，在开始阶段就得到公司的大力支持。例如围绕 Apache Flink 项目，阿里巴巴投入人力开发后捐赠了包括 Paimon 和 Fluss 在内的一众项目。由于项目作者大多在 Flink 项目里已经掌握了开源开发的技能，以及如何遵循 The Apache Way 在基金会中发展项目，再加上开发这些项目本身是公司战略的一部分，此类项目往往能够在公司的加持下持续发展，如期毕业。

ASF 强调供应商中立和个人（Individuals）参与社群而非公司参与社群。但是，孵化器不会拒绝单一背景的开发者（Homogenous Developers）或依赖公司员工（Reliance on Salaried Developers）的项目。这些已知风险都应该在[孵化提案](https://cwiki.apache.org/confluence/display/INCUBATOR/New+Podling+Proposal)中披露。应该说，ASF 孵化器恰好是为初具规模的开源项目，提供以 The Apache Way 运营社群，实现社群长青的指导的机构。孵化项目想要成为顶级项目，需要做一份[项目成熟度报告](https://community.apache.org/apache-way/apache-project-maturity-model.html)，其中就包括了社群多样性和供应商中立的要求。

当然，孵化项目毕业成为顶级项目并不是终点。因为各种各样的原因，ASF 顶级项目停止运营收入阁楼也是常有的事。例如今年 ASF 就归档了风靡一时的 MXNet 和 Mesos 等顶级项目。关于 [Apache Attic](https://attic.apache.org/projects-index.html) 的故事，留待我以后有时间再说吧。

> 每个孵化器导师选择自己指导的孵化项目有各自的偏好。例如，据我所知，Xuanwo 就不怎么考虑不是 Rust 语言写成的项目，尤其是 Java 项目。我会重点考察项目的可持续性，以及看看我对这个项目的技术方案是否感兴趣。不过，这些标准和考察方式也在不断迭代。
> 
> 例如，我之前帮助蚂蚁集团捐赠 HoraeDB 进入孵化器，考虑的是蚂蚁集团内部高度依赖 HoraeDB 这套代码支撑一些关键业务，所以这个项目只要内外是同一套代码，或者说内部系统是 Apache HoraeDB (Incubating) 的衍生产品，那么 HoraeDB 就不至于死去。可惜最终内外合版这件事情没有得到重视并未完成，天翻地覆式的人员变动也切断了项目的生命之源。
>
> 对于孵化标准的判断，我目前关注 GraphAr 和 Iggy 这两个项目。我想看看对于 GraphAr 这样一个公司一度抽离支持但是又多少还有投入的项目，对于 Iggy 这样一个技术方案和社群运营模式我不完全赞同的项目，能不能坚持发展，达到孵化器的毕业标准，以及如果项目达到底线要求成功毕业，是否符合我对一个优秀开源项目的判断。

---

回到 Teaclave 的话题上来，是时候讲讲最速传说的故事了。

自从今年初 Teaclave 复活，我认为，新上任 PMC Chair 陈兆丰做了三个非常正确的选择：

1. 马上发版。从上面的时间线可以看到，Teaclave 在六月和七月各发了一个新版本。这是 ASF 孵化器对项目健康程度最为实际的判断：只要能发出符合 Apache 要求的新版本，那就是一个至少还算健康的项目。
2. 重新定位。前面已经讲过了，抛弃大厂开源的迷思，回归 Teaclave 实际的核心价值。
3. 找到现在有空的 Sponsor 推动毕业。具体来说，就是找到了 Xuanwo、姜宁老师和我成为项目的新导师，推进毕业流程。

前面两步是从今年初开始做的，第三步其实是在今年 Community Over Code Asia 前后，线上线下面对面交流建立信任实现的。长时间孵化的项目，其最初的 Sponsor 即项目导师，很可能也有自己的职业或人生发展，不再有时间关注项目的进展。这类事情也不是第一次发生，例如 Apache Inlong 在毕业前也遇到了类似的问题。这个时候，找到新的 Sponsor 就至关重要。这件事情有点像哥伦布立起鸡蛋的寓言：说破了很简单，但是没想到之前就是想不到。

Xuanwo 从 2023 年带着 OpenDAL 进入孵化器孵化，凭借他成熟的社群运营经验和高涨的热情活力，在十个月后即促成 OpenDAL 开始毕业流程，最终不到一年就从孵化器中毕业成为顶级项目。今天，Xuanwo 已经是四个孵化项目的导师，其中 Fory 和 Teaclave 都已顺利毕业。

姜宁老师是知名的开源领路人，指导孵化的项目不计其数。同时，他也有担任 Apache 基金会董事的经验，对项目毕业的全流程都非常熟悉。

当然，我也算是经验丰富的孵化器导师了，指导孵化的项目到今年已经超过十个。我是今年的基金会董事，在最后 Teaclave 毕业提案上会表决的流程里，我能帮助它在当周达成孵化器内毕业共识后，以最快速度走完整个毕业流程。

从 For Fun 的角度说，这就是我的视角下，Teaclave 用“一个月”的时间完成毕业的几个重要因素（笑）。

不过，从项目发展而言，我并不认为 Teaclave 会成为一个“很大”的开源社群。一方面，项目活跃的开发者目前基本都是闲时投入，维持项目的基本维护工作，或许心情好或者工作有需求的时候，完成部分路线图上的工作。另一方面，可信计算是个很小众的领域，用户和开发者基数决定了项目和社群的规模。

然而，这不意味着 Teaclave 不好。一个著名的 [Meme 图](https://xkcd.com/2347/)生动地展示了这类项目对社群的价值：

![商业应用的大厦或许就依赖在一个无人知晓的开源项目上](dependency.png)

衷心祝愿 Teaclave 能够在未来的发展中继续保持活力，为可信计算领域创造出独属于自己的价值 :D
