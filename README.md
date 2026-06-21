<div align="center">

<img src="public/favicon.svg" alt="未来鹅" width="80" />

# 🦢 未来鹅 (FutureGoose)

**大学生职业成长 AI 陪伴体**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://vercel.com/)
[![智谱 AI](https://img.shields.io/badge/%E6%99%BA%E8%B0%B1-GLM--4--Flash-1a6eff)](https://open.bigmodel.cn/)

</div>

---

## 🎯 项目简介

未来鹅是一只会陪你成长的 AI 鹅，面向**在校大学生**（本科生 / 研究生 / 海外留学生），提供个性化的职业规划建议、行业认知和校招指导——从大一到毕业，一路陪伴，助你成为更好的自己。

### 核心理念

> 大学生的求职焦虑源于**信息不对称**——不知道企业要什么、不知道每个阶段该做什么、不知道自己的经历怎么讲成故事。未来鹅用**真 AI 对话 + 轻量级 RAG 知识库**，把散落的信息变成可交互的成长陪伴体验。

---

## ✨ 功能特性

### 💬 真 AI 智能对话

- **年级感知**：覆盖 10 个细分阶段（大一 ~ 大四、研一 ~ 研三、留学初/中/末期），每个阶段有独立的人设 prompt 和回复策略
- **真 AI 生成**：接入智谱 GLM-4-Flash，128K 上下文，实时生成个性化回复（非预设模板）
- **流式输出**：首字 < 500ms，逐字打字机效果，支持随时停止生成
- **多轮对话**：自动传递最近 10 条历史消息，上下文连贯，追问自然
- **追问引导**：AI 自动在回复末尾提示「试试追问我"还有呢"」，引导用户深挖话题
- **话题耗尽恢复**：当知识耗尽时自动弹出快捷提问按钮，保持对话连续性

### 📚 轻量级 RAG 知识库

- **BM25 关键词检索**：18 个知识 chunks，零外部依赖，内存索引
- **引用卡片**：AI 回复自动标注知识来源，显示引用 chunk 标题与摘要
- **零额外成本**：无 Embedding API 调用，无向量数据库，Vercel 兼容
- **可平滑升级**：检索层接口抽象统一，未来可无缝替换为语义向量检索

知识库覆盖：

- 岗位分类详解（技术 / 产品 / 设计 / 市场 / 职能）
- 校招时间线（提前批 → 正式批 → 面试 → Offer）
- 面试流程拆解（群面 / 技术面 / HR 面）
- 企业文化与培养体系（瑞雪精神、开平文化、导师制度）

### 🗺️ 成长路径规划

- 每个阶段的任务清单（打好基础 → 建立认知 → 初次尝试 → 冲刺校招）
- 技能树拆解（编程语言 / 计算机基础 / 软技能）
- 时间线对照（学期 → 寒暑假 → 关键节点）

### 👥 三群体覆盖

| 群体 | 细分阶段 | 核心关切 |
|:---|:---|:---|
| 🎓 本科生 | 大一大二大三大四 | 方向探索 → 技能积累 → 实习求职 → 校招冲刺 |
| 📚 研究生 | 研一研二研三 | 科研 vs 就业、论文+求职平衡、深度岗位匹配 |
| ✈️ 海外留学生 | 留学初/中/末期 | 远程面试、海归优势、落户政策、时差投递策略 |

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|:---|:---|:---|
| [Next.js](https://nextjs.org/) | 16.2 | App Router + API Routes（服务端中转） |
| [React](https://react.dev/) | 19.2 | 客户端组件 + Hooks |
| [TypeScript](https://www.typescriptlang.org/) | 5 | 严格类型检查 |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | CSS-first 主题配置 |
| [智谱 AI](https://open.bigmodel.cn/) | GLM-4-Flash | 真 AI 对话 + 流式生成 |
| [Vercel](https://vercel.com/) | Hobby | 生产部署，自动 CI/CD |

### 架构演进

**v0.x（静态关键词版）**

- 本地回复库 `chatResponses.ts` 驱动
- 纯静态导出，零后端依赖

**v1.0（真 AI 版）**

- 接入智谱 GLM-4-Flash API
- 服务端 `/api/chat` 路由中转，保护 API Key
- SSE 流式输出，打字机效果
- 三层 Fallback：流式 → 非流式 JSON → 关键词兜底

**v1.1（RAG 增强版）**

- BM25 轻量检索引擎，18 个知识 chunks
- 引用卡片 UI，标注知识来源
- 零外部依赖，可平滑升级语义检索

---

## 🏗️ 系统架构

```
用户输入
    │
    ▼
┌─────────────────────────────────────────┐
│  ChatBox (React)                        │
│  ├─ useChatStream Hook                  │
│  │   ├─ fetch /api/chat (SSE stream)   │
│  │   └─ 逐 chunk 解析，setState 追加   │
│  └─ 引用卡片 + 错误 Toast + 重试按钮   │
└─────────────────────────────────────────┘
    │
    │ POST { grade, input, history, stream }
    ▼
┌─────────────────────────────────────────┐
│  /api/chat (Next.js API Route)          │
│  ├─ BM25 searchKnowledge()              │
│  │   └─ 返回 top-k 相关 chunks          │
│  ├─ 组装 prompt（人设 + 知识 + 历史）   │
│  ├─ fetch 智谱 GLM-4-Flash API          │
│  │   ├─ stream=true → TransformStream   │
│  │   └─ stream=false → JSON 响应        │
│  └─ 返回 SSE / JSON                     │
└─────────────────────────────────────────┘
    │
    │ HTTPS
    ▼
┌─────────────────────────────────────────┐
│  智谱 GLM-4-Flash (128K 上下文)          │
│  永久免费，国内直连，OpenAI 兼容         │
└─────────────────────────────────────────┘
```

---

## 📁 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局（Navbar + Geist 字体 + SEO）
│   ├── globals.css             # Tailwind 主题 + shimmer 动画
│   ├── page.tsx                # 首页（三栏 CSS Tab + 年级选择卡片）
│   ├── loading.tsx             # 首屏骨架屏（Next.js 自动包裹）
│   ├── api/chat/
│   │   └── route.ts            # AI 服务端中转 + SSE 流式 + RAG 注入
│   ├── chat/
│   │   ├── page.tsx            # AI 对话页
│   │   └── loading.tsx         # 对话页骨架屏
│   ├── knowledge/
│   │   ├── page.tsx            # 鹅厂知识库
│   │   └── loading.tsx         # 知识库骨架屏
│   └── roadmap/
│       ├── page.tsx            # 成长路径规划
│       └── loading.tsx         # 路径页骨架屏
├── components/
│   ├── Navbar.tsx              # 全局导航栏
│   ├── GradeSelector.tsx       # 年级选择卡片
│   ├── ChatBox.tsx             # AI 对话核心（流式 + 错误处理 + 引用卡片）
│   ├── ErrorToast.tsx          # 顶部错误提示（自动 8s 消失）
│   ├── Skeleton.tsx            # 通用骨架屏组件
│   ├── HomeContentSkeleton.tsx # 首页专属骨架屏
│   └── MessageBubbleSkeleton.tsx # AI 思考气泡骨架
├── hooks/
│   └── useChatStream.ts        # 流式 fetch 封装（Abortable + 错误处理）
├── lib/
│   ├── prompts.ts              # "未来鹅"人设 prompt（10 个年级）
│   ├── chatResponses.ts        # 本地回复库（Fallback 兜底）
│   ├── knowledge.ts            # 知识库 chunks（18 条）
│   ├── bm25.ts                 # BM25 轻量检索引擎
│   ├── errors.ts               # 错误类型体系 + 用户友好文案
│   └── defaultResponses.ts     # 默认回复语料
└── types/
    └── index.ts                # 共享类型定义
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 18
- **npm** ≥ 9

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Jessica837488/Futuregoose_JiaxiSHAO.git
cd Futuregoose_JiaxiSHAO

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 GLM_API_KEY

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看效果。

### 环境变量

| 变量名 | 必填 | 说明 |
|:---|:---|:---|
| GLM_API_KEY | ✅ | 智谱 AI API Key（[获取地址](https://open.bigmodel.cn/)） |

> ⚠️ 安全提示：`GLM_API_KEY` 为服务端变量，不要添加 `NEXT_PUBLIC_` 前缀，避免暴露到前端。

### 构建部署

```bash
npm run build   # 构建（含 API Routes，非纯静态）
```

部署到 Vercel 时，在 **Project Settings → Environment Variables** 中添加 `GLM_API_KEY`，保存后重新部署。

---

## 🌐 在线访问

🔗 **https://futuregoose-jiaxi-shao.vercel.app/**

部署于 Vercel Hobby 计划，每次 `git push` 到 `master` 分支自动触发部署。

---

## 🗓️ 迭代记录

| 版本 | 日期 | 关键变更 |
|:---|:---|:---|
| v1.1 | 2026-06-21 | 轻量级 RAG 知识库增强：BM25 检索 + 引用卡片 |
| v1.0 | 2026-06-21 | 🎉 接入智谱 GLM-4-Flash 真 AI；SSE 流式输出；错误处理体系；骨架屏 |
| v0.7 | 2026-06-20 | 部署迁移到 Vercel；移动端适配 |
| v0.6 | 2026-06-14 | 多轮对话 + 留学生 3 阶段 |
| v0.5 | 2026-06-13 | 扩展至 3 大群体 10 个阶段 |
| v0.1 | 2026-06-13 | 项目初始化，基础对话功能 |

完整变更日志见 [CHANGELOG.md](./CHANGELOG.md)。

---

## 🛡️ 安全与隐私

- **API Key 保护**：通过 Next.js API Route 服务端中转，前端 JS 不可见
- **零数据持久化**：对话历史仅存于浏览器内存，刷新即清空
- **无用户追踪**：无 Google Analytics、无埋点、无 Cookie

---

## 📄 许可

MIT License

<div align="center">
  <sub>Made with 🦢 by FutureGoose Team</sub>
</div>
