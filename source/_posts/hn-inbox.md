---
title: 基于 Vercel 和 ScopeDB 搭建 Hacker News 收件箱
date: 2026-11-23
tags:
    - 工程实践
    - Hacker News
    - Vercel
    - ScopeDB
categories:
    - 天工开物
---

过去两年，我偶尔会往 Hacker News 发点博客文章或开源项目，但我自己基本不刷 HN 网页，每次发完就扔一边。爆款出的比较随机，加上基本发布时间都很晚，往往等到我想起来检查帖子的时候，已经过了好几天。即使某个帖子上了首页，有不少点赞，下面躺着几条认真的评论，也早就错过了刚发出去、最适合下场聊的时机。

这里的问题主要是缺乏提醒机制。Hacker News 站点本身非常克制，不提供任何邮件或站内通知，连别人回复你的评论也不会提醒。

现成的办法其实不少，比如用 [hnrss.org](https://hnrss.org/) 把回复转成 RSS 订阅，或者用 [F5Bot](https://f5bot.com/) 盯关键词提及，GitHub 上也有自建的提醒项目。不过这些方案大多只管评论和关键词，不太管点赞增长和首页排名。如果只是自己使用，这些方案又显得有些过于通用了。

正好最近想试一下 Vercel 新出的 Schedules 调度能力，也顺手用一用 [ScopeDB](https://www.scopedb.io/) 的 JavaScript SDK 工具包，于是我自己写了个开源小工具 [tisonkun/hn-inbox](https://github.com/tisonkun/hn-inbox) 挂到了 Vercel Hobby 免费版上。

本文介绍该工具的设计要点及其实用效果。你可以直接 Fork 这个项目，改几个环境变量，就能部署一套自己的 Vercel 应用，实现 Hacker News 收件箱的能力。整套跑下来基本零开销。

<!-- more -->

![HN-Inbox 应用工具概览](stories.png)

## 主要设计原则

HN-Inbox 遵循三条原则，避免把一个小工具做得太重：

- 核心是自动巡检加发邮件。平时既然不主动刷 HN 网页，单做个看板大概率还是会吃灰。主链路就是后台自动巡检，有新评论、点赞跨档、进了首页或者别人转发了你的域名，直接发邮件到收件箱；Web 看板只是辅助，拿来集中清未读、实时看帖子状态和翻日志。
- 只读不写。Hacker News 的 Firebase 和 Algolia 只读接口免费、免鉴权又稳定，但官方故意不提供发评论的写接口。模拟 Cookie 登录自动回帖既脆弱又容易撞反垃圾风控，所以邮件和看板里只放一个跳转到帖子的按钮，点一下去官网回就行。
- 不存储静态密码。看板直接接 GitHub OAuth 授权，只申请最小的 `read:user` 权限，回调里校验用户名是否在 `GITHUB_ALLOWED_USERS` 白名单里，放行后签一个 14 天有效的 `HttpOnly` Cookie 凭证。不记密钥就没有泄密的风险。

## 基本结构要点

整个应用跑在单个 Next.js 项目里，没有额外常驻进程，也几乎零开销：Vercel Hobby 免费、Resend 免费版每月 3,000 封、GitHub OAuth 免费，ScopeDB 也有完全够用的免费额度。所有这些 SaaS 服务都不强制要求绑卡。

```text
Vercel Schedules
  └─ POST /api/schedules/poll (Bearer CRON_SECRET)
       ├─ Fetch HN Algolia & Firebase read-only APIs
       ├─ Query ScopeDB with ScopeQL to compute diff
       ├─ Append snapshots, comments, and events via scopedb SDK
       ├─ Dispatch email digest via Resend (or pluggable channels)
       └─ Flush runtime logs to ScopeDB inside Next.js after()
```

具体功能实现上有以下几个要点。

第一，使用新版 Vercel Schedules 功能做定期巡检。Vercel 传统的 Cron Jobs 在 Hobby 免费版中一天最多只能运行一次，但 Beta 阶段的 Vercel Schedules 已放宽至最短每 15 分钟一次。在 `vercel.json` 中设置 `POST /api/schedules/poll` 的发送规则，触发时会自动带上 `Authorization: Bearer <CRON_SECRET>` 请求头。

第二，ScopeDB 上按 Append-Only 事件流建模。一共四张表：

- `hn_story_snapshots` 每次轮询记分数和首页排名（顺手画走势折线）；
- `hn_comments` 存抓到的评论和直接子回复；
- `hn_events` 存通知审计、首轮基线 `baseline_seeded` 标记、评论已读已回以及日志确认水位线；
- `vercel_events` 存运行日志。

首次 Sync 时会自动设置基线，不会把历史老评论一股脑发进邮箱。邮件偶发失败下轮自动补发。另外，生产构建时会使用 ScopeDB 的 Catalog API 自动执行幂等的 `catalog().apply()` 对齐这四张表，不用手工跑建表脚本。

最后，通知层我做了一层抽象。我抽了一个极简的 `NotificationChannel` 接口：同一轮抓到的多条事件会合并成一封邮件发出去。默认内置了 Resend 邮件通道和通用 JSON Webhook 通道，后面想加飞书、Slack 或 Telegram 通知都可以简单 Landing 上来。

## 怎么自己搭一套

### 1. 准备 ScopeDB 连接信息

打开 [console.scopedb.cloud](https://console.scopedb.cloud/) 创建工作空间，获取公网 HTTPS 地址并创建 API Key 凭据，建表不用管，后面部署时会自动对齐。

### 2. 配好 Resend 发信

可以简单地使用 GitHub 身份创建 [Resend](https://resend.com/) 账号。

账号创建后，建议在 Domains 里绑定一个独立的发信子域。验证通过后在 API Keys 页面创建一个权限为 `Sending access` 的 API Key 即可。

### 3. 导入 Vercel 拿到线上域名

Fork [tisonkun/hn-inbox](https://github.com/tisonkun/hn-inbox) 后，打开 [Vercel Dashboard](https://vercel.com/dashboard) 导入仓库。

第一次可以先不填环境变量，直接点 Deploy 跑通构建，拿到生产域名。

### 4. 在 GitHub 建 OAuth App

打开 [GitHub OAuth App 新建页面](https://github.com/settings/applications/new) 填两项地址：

- Homepage URL 填你的 Vercel 域名。
- Authorization callback URL 填 `https://<your-domain>/api/auth/github/callback` 这一固定路径。

记下 Client ID 和 Client Secret 凭据，再在终端随手生成两串随机密钥给 `CRON_SECRET` 和 `SESSION_SECRET` 使用：

```bash
echo "CRON_SECRET=$(openssl rand -hex 32)" && echo "SESSION_SECRET=$(openssl rand -hex 32)"
```

### 5. 填环境变量并 Redeploy

打开 Vercel 项目的 **Settings → Environment Variables** 页面，把下面这组替换成真实值整块粘贴进第一个输入框（勾选 Production 即可）：

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

保存后去 **Deployments** 点最新部署右侧菜单里的 **Redeploy** 让环境变量生效。

### 6. 登录并触发首轮同步

部署变绿后打开站点，点击 **Sign in with GitHub** 登录，再点击右上角 **Sync Now** 完成首轮基线同步，看板里就会立刻刷出你最近的帖子和评论，之后就交给 Vercel Schedules 自动跑了。

## 把运行日志也直接写进 ScopeDB

小工具扔在云端跑，最怕偶发报错却翻不到现场。Vercel Hobby 免费版自带的日志只能实时查看，过一会儿就会刷掉，想排查昨天半夜的定时任务基本抓瞎。

好在 Next.js 自带了 `after()` 钩子，可以在返回 HTTP 响应之后异步把每次执行的耗时、`x-vercel-id` 请求编号、状态码和报错信息直接写进 ScopeDB 里。当然，敏感信息会自动脱敏。

不同于 Vercel Hobby 原生的日志功能只能看到打开页面后的有限的实时日志，写进 ScopeDB 的日志是长期持久化的，什么时候想起来都能直接回溯，而且这点日志量在 ScopeDB Cloud 环境下完全零成本。

![HN-Inbox 日志看板](logs.png)

页面上方的一条绿红健康条展示的是最近 24 次定时任务的结果，下面点开单条就能查看完整的错误上下文。点一下右上角的 **Mark Errors Seen** 按钮，就能把标签上的红点消掉，同时历史记录照常保留，方便回溯。

这套日志上线不到半天就派上了用场。如截图所示，第二天中午打开一看健康条里连续亮了三格红灯，点开 3 条报错的耗时全卡在 15.5 秒左右，丢给 Coding Agent 排查，一眼就定位到是代码里写死了 15 秒的查询超时，顺手还揪出轮询函数里一行没用的多余查询。于是让 Gemini 上去干活，砍掉多余的请求、把超时放宽到 25 秒后，后面就全绿了。

对这种丢在云端不管的小工具来说，Coding Agent 能同时访问源代码和线上实时运行日志，基本上线上出现什么问题，都能由 Agent 自主分析解决，完全不占用开发者的时间。

Just For Fun 😇
