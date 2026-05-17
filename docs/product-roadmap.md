# LexiPair Roadmap

## 当前完成

- 可运行 Web App
- 移动端 iOS 风布局
- 桌面端三栏布局
- 本地登录与持久化
- 学习卡片、对比、词库、复习、统计、设置
- AI 辅助记忆：本地生成口诀、差异总结、小测提示
- 词书系统：内置考研、四六级、雅思、GRE 词书，支持安装与筛选
- Capacitor 配置
- Supabase 表结构草案

## 下一步接真实云同步

1. 创建 Supabase 项目。
2. 执行 `docs/supabase-schema.sql`。
3. 在前端加入 `@supabase/supabase-js`。
4. 用 Supabase Auth 替换当前本地登录。
5. 将 `localStorage` 数据迁移到 Supabase 表。
6. 增加冲突策略：本地更新时间大于云端时上传，否则拉取云端。
7. 将 AI 生成迁移到 Supabase Edge Function，避免前端暴露模型密钥。

## 下一步打 IPA

1. 安装 CocoaPods。
2. 执行 `npx cap add ios`。
3. 执行 `npm run cap:sync`。
4. 执行 `npm run cap:open`。
5. 在 Xcode 配置签名。
6. Archive 并导出 IPA 或上传 TestFlight。
