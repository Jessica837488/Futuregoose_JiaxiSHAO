
<div align="center">


# 🦢 未来鹅 (FutureGoose)

**大学生职业成长 AI 陪伴体**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

</div>

---

## 🎯 项目简介

未来鹅是一只会陪你成长的 AI 鹅，生活在腾讯的大家庭里。它面向**在校大学生**（本科生 / 研究生 / 海外留学生），提供个性化的职业规划建议、行业认知和校招指导——从大一到毕业，一路陪伴，助你成为更好的自己。

### 核心理念

> 大学生的求职焦虑源于**信息不对称**——不知道企业要什么、不知道每个阶段该做什么、不知道自己的经历怎么讲成故事。未来鹅用**结构化知识库 + 多轮追问对话**，把散落的信息变成可交互的成长陪伴体验。

---

## ✨ 功能特性

### 💬 智能多轮对话

- **年级感知**：覆盖 10 个细分阶段（大一 ~ 大四、研一 ~ 研三、留学初/中/末期），每个阶段有独立的知识库和回复策略
- **关键词匹配 + 3 层递进**：识别用户意图（实习、简历、面试、校招……），每层回复逐层深入，从概览到实操
- **追问引导**：每轮回复末尾自动提示「试试追问我"还有呢"」，引导用户深挖话题
- **话题耗尽恢复**：当知识耗尽时自动弹出快捷提问按钮，保持对话连续性，避免"对话死亡"

### 📚 鹅厂知识库

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
| [Next.js](https://nextjs.org/) | 16.2 | App Router + 静态导出 (`output: "export"`) |
| [React](https://react.dev/) | 19.2 | 纯客户端组件（`"use client"`） |
| [TypeScript](https://www.typescriptlang.org/) | 5 | 严格类型检查，`ChatContext` 接口保障对话状态可追溯 |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | CSS-first 主题配置 (`@theme inline`) |
| [CloudStudio](https://www.codebuddy.ai/) | — | 免费静态托管，零配置部署 |

### 架构特点

- **零后端依赖**：AI 对话由本地回复库 `src/lib/chatResponses.ts` 驱动，无需 API Key
- **纯静态站点**：`next build` 输出 `out/` 目录，可部署到任意静态托管
- **响应式设计**：移动端优先，支持 PWA 级体验

---

## 🏗️ 对话系统架构

```
用户输入
    │
    ▼
┌─────────────────────────────────┐
│         getResponse()            │
│  src/lib/chatResponses.ts       │
│                                 │
│  ① 追问检测 (isFollowUp)        │
│     ├─ 是 → 进入第②步           │
│     └─ 否 → 进入第③步           │
│                                 │
│  ② 递进回复                      │
│     ├─ 关键词话题 → tier+1      │
│     ├─ 默认话题 → tier+1        │
│     └─ 话题耗尽 → exhausted     │
│                                 │
│  ③ 关键词匹配                    │
│     ├─ 命中 → tier=1 新话题     │
│     └─ 未命中 → 默认回复        │
│                                 │
│  ④ 返回 ChatContext             │
│     ├─ lastTopic / lastTopicTier│
│     └─ topicExhausted 标记      │
└─────────────────────────────────┘
    │
    ▼
ChatBox.tsx
    ├─ topicExhausted=false → 追加「试试追问我"还有呢"」
    └─ topicExhausted=true  → 弹出快捷提问按钮
```

---

## 📁 项目结构

```
src/
├── app/
│   ├── layout.tsx            # 根布局（Navbar + Geist 字体 + SEO）
│   ├── globals.css           # Tailwind 主题 + 动画
│   ├── page.tsx              # 首页（三栏 CSS Tab + 年级选择卡片）
│   ├── chat/
│   │   └── page.tsx          # AI 对话页（年级选择 → ChatBox）
│   ├── knowledge/
│   │   └── page.tsx          # 鹅厂知识库（岗位/时间线/面试/文化）
│   └── roadmap/
│       └── page.tsx          # 成长路径规划（阶段任务清单）
├── components/
│   ├── Navbar.tsx            # 全局导航栏
│   ├── GradeSelector.tsx     # 年级选择卡片（通用组件）
│   └── ChatBox.tsx           # AI 对话核心组件
└── lib/
    └── chatResponses.ts      # 本地智能回复库（~360 行）
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

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建部署

```bash
npm run build   # 生成 out/ 目录（纯静态文件）
```

将 `out/` 目录部署到任意静态服务器即可。

---

## 🌐 在线访问

**🔗 [http://ff1fdcf7ccf34643bb1aea32616cfc3d.codebuddy.cloudstudio.run](http://ff1fdcf7ccf34643bb1aea32616cfc3d.codebuddy.cloudstudio.run)**

部署于 CloudStudio，全球可访问，零成本运行。

---

## 🗓️ 迭代记录

| 版本 | 日期 | 关键变更 |
|:---|:---|:---|
| v0.5 | 06/2026 | 追问引导提示 + 话题耗尽快捷提问恢复 |
| v0.4 | 06/2026 | 多轮对话增强：3 层递进回复 + 追问检测 + 上下文追踪 |
| v0.3 | 06/2026 | 年级选择网格自适应 + CSS 纯 Radio Tab 切换 |
| v0.2 | 06/2026 | 扩展至 3 大群体 10 个阶段；替换 API 路由为本地回复库 |
| v0.1 | 06/2026 | 项目初始化，基础对话功能 |

---

## 📄 许可

[MIT License](./LICENSE)

## 作者
邵家曦
---

<div align="center">
  <sub>Made with 🦢 by Jiaxi SHAO</sub>
</div>
