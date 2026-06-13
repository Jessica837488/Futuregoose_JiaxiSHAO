# 🦢 未来鹅 (FutureGoose)

> 大学生职业成长 AI 陪伴体 —— 从大一到大四，一路陪伴，助你成为更好的自己。

## 🎯 项目简介

未来鹅是一只会陪你成长的 AI 鹅，生活在腾讯的大家庭里。无论你来自哪里、在读哪个阶段，关于大学规划、职业方向、鹅厂的那些事儿，它都会一一讲给你听。

### 覆盖群体

| 群体 | 阶段细分 | 核心关切 |
|------|----------|----------|
| 🎓 本科生 | 大一 ~ 大四 | 专业方向、技能积累、实习、校招 |
| 📚 研究生 | 研一 ~ 研三 | 科研 vs 就业、暑期实习、论文+求职双线作战 |
| ✈️ 海外留学生 | 留学初期 ~ 求职期 | 回国求职、远程面试、海归优势、落户政策 |

### 核心功能

- **💬 AI 对话陪伴** — 根据你的群体和阶段，提供个性化的职业规划建议和行业认知
- **📚 鹅厂知识库** — 岗位介绍、企业文化、校招时间线、培养体系
- **🗺️ 成长路径规划** — 从新生到毕业，每个阶段该做什么、怎么准备的清晰地图

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 配置 AI 对话

在项目根目录创建 `.env.local` 文件：

```env
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
```

不配置 API Key 时，系统会使用内置的预设回复作为 Fallback。

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 16 | App Router + Turbopack |
| React 19 | 客户端/服务端组件混合 |
| TypeScript | 严格模式 |
| Tailwind CSS 4 | CSS-first 主题配置 |
| DeepSeek API | AI 对话模型（流式输出） |

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页（三栏 Tab 切换 + 年级选择）
│   ├── layout.tsx            # 根布局（Navbar + 字体）
│   ├── globals.css           # Tailwind 主题 + 全局样式
│   ├── chat/page.tsx         # AI 对话页
│   ├── knowledge/page.tsx    # 鹅厂知识库
│   ├── roadmap/page.tsx      # 成长路径规划
│   └── api/chat/route.ts     # DeepSeek 对话代理 API
└── components/
    ├── Navbar.tsx            # 全局导航栏
    ├── GradeSelector.tsx     # 年级选择卡片组（通用组件）
    └── ChatBox.tsx           # AI 对话核心组件
```

## 📄 许可

MIT License
