# LexiPair

LexiPair 是一个面向考研英语的易混词记忆工具，重点解决“长得像、意思近、搭配容易混”的单词记忆问题。项目采用 Web First 架构：React + Vite 负责 Web/PWA 体验，Capacitor 负责打包 iOS App。

## 核心能力

- 红宝书词库：已导入考研英语红宝书词条，包含 6545 个单词卡片与 1111 组易混词组。
- 今日学习：按词书选择、每日数量、到期复习和新词队列安排学习。
- 间隔复习：认识、模糊、不认识分别进入不同复习间隔。
- 学习卡片：翻面、拖拽、发音入口、收藏、笔记、正确答案反馈。
- 形近对比：只找词形相近的单词，避免同页但不像的词混入。
- AI 辅助：接入 Mimo API，生成固定 JSON 结构的记忆口诀、差异总结、词形差异、搭配、小测提示。
- AI 预生成：开始今日学习队列时，后台批量预生成最多 20 组 AI 解释。
- 多端同步：支持 Supabase Auth + Postgres；未配置时自动退回本地文件同步。
- 桌面工作台：右侧统计、搜索、同步、快捷复习入口已可交互。
- iOS 图标：已设计 LexiPair App Icon，并提供自动生成图标脚本。

## 技术栈

- Frontend: React, Vite, Framer Motion, Lucide React
- Native Shell: Capacitor 7
- Backend: Express
- AI: Mimo OpenAI-compatible Chat Completions API
- Auth & Sync: Supabase Auth, Postgres, local file fallback
- Icons: SVG source + Sharp asset generation

## 本地运行

```bash
npm install --cache ./.npm-cache
cp .env.example .env
npm run dev:all
```

`npm run dev:all` 会同时启动：

- Web: `http://localhost:5173`
- API: `http://localhost:8787`

如果 Vite 自动换端口，请以终端输出为准。

## 环境变量

默认使用 Mimo：

```env
AI_PROVIDER=mimo
AI_BASE_URL=https://api.xiaomimimo.com/v1
AI_MODEL=mimo-v2-flash
MIMO_API_KEY=your-mimo-key-here
OPENAI_TIMEOUT_MS=30000
PORT=8787
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://YOUR_MAC_LAN_IP:8787
```

Key 只放在 `.env`，不要提交到 GitHub。`.gitignore` 已忽略 `.env`。

`VITE_API_BASE_URL` 是 iOS/Capacitor 真机包访问后端的地址。Web 开发时可以继续用 Vite 的 `/api` 代理；打包 IPA 前要把它改成运行 `npm run dev:api` 那台电脑的局域网地址，例如 `http://172.20.10.4:8787`，然后重新执行 `npm run cap:sync` 和 IPA 打包。

Supabase 配置后会启用邮箱 Magic Link 登录、Bearer token 校验、Postgres 快照同步和学习日志；未配置时仍可使用本地文件 fallback。

## 常用命令

```bash
npm run dev          # 只启动 Web
npm run dev:api      # 只启动 API
npm run dev:all      # 同时启动 Web + API
npm run build        # 构建 Web 静态资源
npm run icons        # 生成 Web/iOS 图标资源
npm run cap:sync     # 构建并同步到 iOS
npm run cap:open     # 打开 Xcode 工程
```

## AI 接口

### Health

```http
GET /api/health
```

返回 provider、model、Key 是否配置、代理状态。

### AI Insight

```http
POST /api/ai/insight
```

输入当前词组与形近词候选，返回：

- `summary`: 记忆重点
- `mnemonic`: 口诀或联想
- `contrast`: 与形近词的差异
- `shapeDiff`: 词形差异
- `rootTip`: 词根或最短记忆抓手
- `collocations`: 高频搭配
- `trap`: 易错警告
- `quiz`: 自测提示
- `examples`: 例句或填空

前端会缓存 AI 结果，下次打开同一词组不需要重复生成。

### AI Batch Prefetch

```http
POST /api/ai/batch-insights
```

输入最多 20 个词组，后台批量生成 AI 缓存，用于今日学习队列预热。

如果 iPhone 上显示 AI fallback 或同步失败，先确认：

- Mac 和 iPhone 在同一局域网。
- Mac 已运行 `npm run dev:api`。
- `.env` 里的 `VITE_API_BASE_URL` 是 Mac 当前局域网 IP。
- 改完 `.env` 后已经重新构建并同步 iOS 工程。

## 同步接口

配置 Supabase 后，同步接口会校验 `Authorization: Bearer <access_token>`，并写入 `account_snapshots` 与 `study_events`。未配置 Supabase 时使用本地文件 fallback。

```http
GET  /api/sync/:email
POST /api/sync/:email
```

同步内容包括：

- 学习进度
- 收藏
- 自建词库
- AI 生成结果
- 词书选择
- 每日学习量
- 离线缓存设置

数据默认存放在：

```text
Supabase: account_snapshots, study_events
Fallback: server-data/accounts
```

## iOS 打包

首次创建 iOS 工程：

```bash
npx cap add ios
npm run icons
npm run cap:sync
npm run cap:open
```

打开 Xcode 后需要配置：

- Team
- Bundle Identifier
- Signing Certificate
- Provisioning Profile

没有 Apple Developer 证书时，无法导出可安装到真机的正式 IPA。

Xcode 中导出 IPA：

1. 选择 `Any iOS Device`
2. Product -> Archive
3. Distribute App
4. 选择 Development、Ad Hoc、TestFlight 或 App Store

## 图标设计

图标源文件：

```text
assets/lexipair-icon.svg
```

设计语言：

- Apple 风格蓝白渐变
- 圆角 Squircle
- 中心为 L/A 字母组合，代表 LexiPair 与词汇对比
- 星光符号代表 AI 辅助记忆

生成文件：

```text
public/icon-192.png
public/icon-512.png
public/icon-1024.png
ios/App/App/Assets.xcassets/AppIcon.appiconset
```

## 项目结构

```text
.
├── assets/                 # 品牌与图标源文件
├── docs/                   # 项目文档
├── public/                 # Web 静态资源
├── scripts/                # 工具脚本
├── server/                 # Express API
├── server-data/            # 开发版同步数据，不提交
├── src/
│   ├── data/               # 红宝书与内置词库
│   ├── main.jsx            # React 主应用
│   └── styles.css          # 全局样式
├── capacitor.config.json
├── package.json
└── vite.config.js
```
