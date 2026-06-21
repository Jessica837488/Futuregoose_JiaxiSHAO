# Changelog

All notable changes to **未来鹅 (FutureGoose)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- 流式输出（打字机效果）
- 首屏加载骨架屏
- AI 回复缓存
- 错误提示优化
- 对话导出（Markdown / PDF）
- RAG 知识库增强

---

## [1.0.0] - 2026-06-21

### 🎉 Major Release: 真 AI 对话能力

本次更新把"未来鹅"从**关键词匹配版**升级为**真实大模型 AI 对话**，是从 0.x 跃迁到 1.0 的里程碑版本。

### Added
- **真 AI 对话能力** —— 接入智谱 GLM-4-Flash 大模型，告别预设回复
- **10 个年级独立人设** —— 4 本科 + 3 研究生 + 3 留学生，每个年级有专属 system prompt
- **多轮对话上下文** —— AI 能记住最近 10 轮对话，追问"还有呢"更连贯
- **服务端 API 中转** —— 新建 `/api/chat` 路由保护 API Key 不暴露到前端
- **关键词 Fallback 机制** —— API 失败时自动用本地关键词版兜底，对话不中断
- **追问提示去重** —— 自动去重 AI 重复生成的"试试追问"提示
- **配置级 AI Key 管理** —— 通过 `GLM_API_KEY` 环境变量管理，便于部署

### Changed
- **部署迁移到 Vercel** —— 从 CloudStudio 迁移，享受免费 Hobby 计划 + 全球 CDN
- **`output: "export"` 静态导出移除** —— 改为 Vercel Serverless 部署，支持 API Route
- **AI 优先 + Fallback 兜底** —— getResponse 改为 async，优先调用 API，失败自动降级
- **ChatBox 异步改造** —— 适配 async 流程，移除假延迟，loading 状态更准确

### Fixed
- **追问提示重复** —— AI 偶尔一次回复里加 2-3 次"试试追问"，已加 `dedupeFollowHints` 自动去重
- **Prompt 规则强化** —— 明确告诉 AI 只写 1 次"试试追问"

### Security
- **API Key 移至服务端** —— 通过 `/api/chat` 中转调用智谱 API，前端 JS 永远拿不到 Key
- **Sensitive 环境变量** —— Vercel 后台设置 `GLM_API_KEY` 为敏感变量，加密存储

---

## [0.7.0] - 2026-06-20

### Added
- 部署迁移到 Vercel，从 CloudStudio 切换
- 移动端汉堡菜单 + 移动端响应式优化

### Changed
- 合并 `feat/multi-turn-chat` 分支到 master，统一 10 个年级数据源
- ChatBox 重构：拆分为自定义 hooks（useChatPersistence / useAutoScroll）
- 知识库 / 成长路径改 Server Component + 全页面 SEO metadata

---

## [0.6.0] - 2026-06-14

### Added
- 追问引导提示 + 话题耗尽自动弹快捷提问
- 留学生 3 阶段（留学初期 / 中期 / 末期）数据
- 知识库和成长路径页面的 UX 优化

### Changed
- 多轮对话增强：3 层递进回复 + 追问检测 + 上下文追踪
- 替换 API 路由为本地智能回复库（关键词版）
- 年级选择网格自适应

---

## [0.5.0] - 2026-06-13

### Added
- 扩展至 3 大群体：本科生 / 研究生 / 海外留学生（共 7 个阶段）
- 年级选择器支持多群体切换
- Tab 系统使用纯 CSS radio 实现

---

## [0.1.0] - 2026-06-13

### Added
- 🎉 项目初始化
- 基础对话功能（关键词匹配版）
- 4 个本科年级阶段（大一大二大三大四）
- Next.js 16 + React 19 + TypeScript 5 + Tailwind 4 技术栈

---

## 版本号说明

本项目使用 [语义化版本](https://semver.org/)：

- **MAJOR（主版本）** - 重大架构变更（如本次 1.0 接入真 AI）
- **MINOR（次版本）** - 新功能（如新增年级、组件重构）
- **PATCH（修订号）** - Bug 修复和小改动

---

## 链接

- [GitHub Repository](https://github.com/Jessica837488/Futuregoose_JiaxiSHAO)
- [线上访问](https://futuregoose-jiaxi-shao.vercel.app/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
