---
title: 给自己搭一个 Hacker News 收件箱和邮件提醒
date: 2026-11-23
tags:
    - 工程实践
    - Hacker News
    - Vercel
    - ScopeDB
categories:
    - 天工开物
---

平时偶尔会往 Hacker News 发点文章或开源项目，但我自己基本不刷 HN 网页。每次发完就扔一边了，过两天想起来点回去看，才发现其实有不少点赞，下面也躺着几条认真的评论，早就错过了刚发出去那几个小时最适合下场聊的时机。

Hacker News 站点本身非常克制，不提供任何邮件或站内通知，连别人回复你的评论也不会提醒。现成的办法其实不少，比如用 [hnrss.org](https://hnrss.org) 把回复转成 RSS 订阅，或者用 [F5Bot](https://f5bot.com) 盯关键词提及，GitHub 上也有自建的提醒项目。不过这些方案大多只管评论和关键词，不太管点赞涨势和首页排名，或者得自己维护一套常驻服务。

正好最近想试一下 Vercel 新出的 Schedules 调度能力，也顺手用一用 [ScopeDB](https://www.scopedb.io) 官方的 JavaScript SDK 工具包，我就自己写了个开源小工具 [tisonkun/hn-inbox](https://github.com/tisonkun/hn-inbox) 挂到了 Vercel 免费版上。如果你想给自己也挂一套 Hacker News 通知，直接 Fork 改几个环境变量就能跑起来，整套跑下来基本不要钱。

<!-- more -->

![Stories dashboard](stories.png)

## 几个简单的取舍

动手之前定下三条原则，尽量不把一个小工具搞重：

- **核心是自动巡检加发邮件**。平时既然不主动刷 HN 网页，单做个看板大概率还是会吃灰。主链路就是后台自动巡检，有新评论、点赞跨档、进了首页或者别人转发了你的域名，直接发邮件到收件箱；Web 看板只是辅助，拿来集中清未读、实时看帖子状态和翻日志。
- **只读不写**。Hacker News 的 Firebase 和 Algolia 只读接口免费、免鉴权又稳定，但官方故意不提供发评论的写接口。模拟 Cookie 登录自动回帖既脆弱又容易撞反垃圾风控，所以邮件和看板里只放一个 `news.ycombinator.com/reply?id=<id>` 直达按钮，点一下去官网回就行。
- **不要静态密码**。看板直接接 GitHub OAuth 授权，只申请最小的 `read:user` 权限，回调里校验用户名在不在 `GITHUB_ALLOWED_USERS` 白名单里，不在直接拒登，放行后签一个 14 天有效的 `HttpOnly` Cookie 凭证，省得记密码。

## 整体怎么拼起来的

整套东西跑在单个 Next.js 项目里，没有额外常驻进程，也几乎零开销：Vercel Hobby 免费、Resend 免费版每月 3,000 封、GitHub OAuth 免费，ScopeDB 目前也在免费公测阶段（不用绑信用卡，就算以后按量计费，个人每天几十条写入的量也几乎没什么成本）。

```text
Vercel Schedules
  └─ POST /api/schedules/poll (Bearer CRON_SECRET)
       ├─ Fetch HN Algolia & Firebase read-only APIs
       ├─ Query ScopeDB with ScopeQL to compute diff
       ├─ Append snapshots, comments, and events via scopedb SDK
       ├─ Dispatch email digest via Resend (or pluggable channels)
       └─ Flush runtime logs to ScopeDB inside Next.js after()
```

有三个细节顺手提一下：

1. **调度用新版 Vercel Schedules 能力**。Vercel 传统的 Cron Jobs 在 Hobby 免费版一天最多只能跑一次，但 Beta 阶段的 **Vercel Schedules** 放宽到了最短每 15 分钟一次（带 15 分钟抖动，每月 5,000 次免费额度，15 分钟跑一次一个月大概 2,976 次，稳稳够用）。在 `vercel.json` 里指到 `POST /api/schedules/poll` 路由，触发时会自动带 `Authorization: Bearer <CRON_SECRET>` 请求头。
2. **ScopeDB 全按追加事件流建模**。一共四张表：`hn_story_snapshots` 每次轮询记分数和首页排名（顺手画走势折线），`hn_comments` 存抓到的评论和直接子回复，`hn_events` 存通知审计、首轮基线 `baseline_seeded` 标记、评论已读已回以及日志确认水位线，`vercel_events` 存运行日志。首次上线自动打基线，不会把历史老评论一股脑发进邮箱；邮件偶发失败下轮自动补发。另外生产构建时会自动执行幂等的 `catalog().apply()` 对齐这四张表，不用手工跑建表脚本。
3. **通知层做成可插拔的**。抽了一个极简的 `NotificationChannel` 接口，同一轮抓到的多条事件会合并成一封邮件发出去，默认内置了 Resend 邮件通道和通用 JSON Webhook 通道，后面想加飞书、Slack 或 Telegram 补几十行代码就行。

## 怎么自己搭一套

### 1. 准备 ScopeDB 连接信息

先在 [ScopeDB](https://www.scopedb.io) 免费公测环境里拿到公网 HTTPS 地址和 API Key 凭据，建表不用管，后面部署时会自动对齐。

### 2. 配好 Resend 发信

去 [Resend](https://resend.com) 用 GitHub 登录。建议在 **Domains** 里绑一个独立发信子域（比如 `notify.example.com` 这种前缀），别直接用根域名，免得 `MX` 和 `SPF` 记录跟主域原有邮箱打架；验证变绿后去 **API Keys** 建一个权限为 `Sending access` 的 Key 即可。如果只想先试通，也可以跳过绑域名，发件人先填 `HN Inbox <onboarding@resend.dev>` 这种测试地址，收件邮箱填注册 Resend 时用的同一个邮箱就行。

### 3. 导入 Vercel 拿到线上域名

Fork [tisonkun/hn-inbox](https://github.com/tisonkun/hn-inbox) 后，打开 [Vercel Dashboard](https://vercel.com/dashboard) 导入仓库。第一次可以先不填环境变量直接点 Deploy 跑通构建，拿到生产域名（比如 `https://hn-inbox.vercel.app` 这样的地址）。

### 4. 在 GitHub 建 OAuth App

打开 [GitHub OAuth App 新建页面](https://github.com/settings/applications/new) 填两项地址：

- Homepage URL 填你的 Vercel 域名。
- Authorization callback URL 填 `https://<your-domain>/api/auth/github/callback` 这一固定路径。

记下 Client ID 和 Client Secret 凭据，再在终端随手生成两串随机密钥给 `CRON_SECRET` 和 `SESSION_SECRET` 使用：

```bash
echo "CRON_SECRET=$(openssl rand -hex 32)" && echo "SESSION_SECRET=$(openssl rand -hex 32)"
```

### 5. 填环境变量并 Redeploy

进 Vercel 项目的 **Settings → Environment Variables** 页面，把下面这组替换成真实值整块粘贴进第一个输入框（勾选 Production 即可）：

```text
HN_USERNAME=your-hn-username
HN_WATCH_DOMAINS=your-blog.com,your-project.dev
APP_BASE_URL=https://your-app.vercel.app
GITHUB_ALLOWED_USERS=your-github-username
CRON_SECRET=generated-random-hex-1
SESSION_SECRET=generated-random-hex-2
SCOPEDB_ENDPOINT=https://your-scopedb-endpoint.example.com
SCOPEDB_API_KEY=your-scopedb-api-key
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=HN Inbox <hn@notify.your-domain.com>
EMAIL_TO=you@example.com
```

其中 `HN_WATCH_DOMAINS` 可选，用来盯别人帮你把文章转到 HN 上的情况；不关心的话留空就行。保存后去 **Deployments** 点最新部署右侧菜单里的 **Redeploy** 让环境变量生效。

### 6. 登录并触发首轮同步

部署变绿后打开站点点 **Sign in with GitHub** 登录，再点右上角 **Sync Now** 完成首轮基线同步，看板里就会立刻刷出你最近的帖子和评论，之后就交给 Vercel Schedules 自动跑了。

## 把运行日志也直接写进 ScopeDB

小工具扔在云端跑，最怕偶发报错却翻不到现场。Vercel Hobby 免费版自带的日志只能实时看，过一会儿就刷没了，想排查昨天半夜的定时任务基本抓瞎。

好在 Next.js 自带了 `after()` 钩子，可以在返回 HTTP 响应之后异步把每次执行的耗时、`x-vercel-id` 请求编号、状态码和报错信息直接写进 ScopeDB 里（同时剥离 URL 查询参数，防止 OAuth 回调里的 `code` 和 `state` 落入日志）。跟 Hobby 原生只能看实时日志不同，写进 ScopeDB 之后日志是**持续留存**的，什么时候想起来都能直接回溯，而且这点日志量在 ScopeDB 免费公测下完全零成本。

![Logs dashboard](logs.png)

看板顶上专门加了第三个 **Logs** 页签，上面一条绿红健康条直接展示最近 24 次定时任务的结果，下面点开单条就能看完整错误上下文。排查完以后点一下右上角的 **Mark Errors Seen** 就能把标签上的红点消掉，同时历史记录照常留着方便回溯。

这套日志上线不到半天就派上了用场。就像上面截图里那样，第二天中午打开一看健康条里连续亮了三格红灯，点开 3 条报错的耗时全卡在 15.5 秒左右，一眼就定位到是代码里写死了 15 秒的查询超时，顺手还揪出轮询函数里一行没用的多余查询。砍掉多余请求、把超时放宽到 25 秒推上去之后，后面就全绿了。对这种丢在云端不管的小工具来说，能自己把报错留下来、打开页面三秒看懂原因，就已经很值了。
