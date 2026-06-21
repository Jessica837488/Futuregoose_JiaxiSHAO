// ============================================================
// 知识库 Chunks —— 把 /knowledge 页面的内容拆分成可检索的小段
// ============================================================
// 设计思路：
//   1. 每个 chunk 是一段独立的事实/信息
//   2. 包含 id/title/content/category/source（用于引用）
//   3. 粒度适中（50-300 字），方便向量检索
//   4. 用静态数据 + 脚本一次性向量化
//
// 数据来源：
//   - /knowledge 页面 4 大模块（岗位/时间线/面试/文化）
//   - /roadmap 页面 5 个阶段任务
// ============================================================

export interface KnowledgeChunk {
  id: string;
  /** 分类：knowledge / roadmap */
  category: "knowledge" | "roadmap";
  /** 标题（用于展示给用户） */
  title: string;
  /** 检索/喂给 AI 的内容 */
  content: string;
  /** 关键词（用于触发检索） */
  keywords: string[];
  /** 引用来源（用户可见） */
  source: string;
}

// ============================================================
// Knowledge 知识库 chunks
// ============================================================
export const knowledgeChunks: KnowledgeChunk[] = [
  // ── 岗位分类 ──
  {
    id: "kb-roles-tech",
    category: "knowledge",
    title: "技术类岗位",
    content:
      "技术类岗位包括：后端开发（Go/C++/Java/Python，需求量最大）、前端开发（React/Vue/TypeScript）、客户端开发（Kotlin/Swift/Flutter）、算法工程师（Python/PyTorch，研究和工程结合）、测试开发、安全工程师、游戏开发（C++/Unity/UE）。",
    keywords: ["岗位", "技术", "后端", "前端", "算法", "客户端", "测试", "安全", "游戏开发"],
    source: "鹅厂知识库 / 岗位分类 / 技术类",
  },
  {
    id: "kb-roles-product",
    category: "knowledge",
    title: "产品类岗位",
    content:
      "产品类岗位包括：产品策划（需求分析/原型设计/数据分析，定义产品做什么）、产品运营（活动策划/用户运营/增长）、游戏策划（玩法设计/数值/关卡）。",
    keywords: ["岗位", "产品", "运营", "游戏策划", "策划"],
    source: "鹅厂知识库 / 岗位分类 / 产品类",
  },
  {
    id: "kb-roles-design",
    category: "knowledge",
    title: "设计类岗位",
    content:
      "设计类岗位包括：视觉设计（Figma/PS/AI，界面视觉和品牌调性）、交互设计（用户研究/原型/动效，让产品用起来顺畅自然）。",
    keywords: ["岗位", "设计", "视觉", "交互", "UI", "UX"],
    source: "鹅厂知识库 / 岗位分类 / 设计类",
  },
  {
    id: "kb-roles-other",
    category: "knowledge",
    title: "其他岗位",
    content:
      "其他岗位包括：市场/品牌（营销策划/内容/传播）、HR/财务/行政等专业职能部门。",
    keywords: ["岗位", "市场", "品牌", "HR", "财务", "行政"],
    source: "鹅厂知识库 / 岗位分类 / 其他",
  },

  // ── 校招时间线 ──
  {
    id: "kb-timeline-summary",
    category: "knowledge",
    title: "校招时间线总览",
    content:
      "鹅厂校招时间线：7月提前批（免笔试，命中率高），8月正式批启动（网申开放），9月笔试+一面+二面，10月三面/四面+HR面，11月Offer发放，次年2-4月春招补录。",
    keywords: ["校招", "时间线", "提前批", "时间", "秋招", "春招", "什么时候"],
    source: "鹅厂知识库 / 校招时间线",
  },
  {
    id: "kb-timeline-advance",
    category: "knowledge",
    title: "提前批（7月）",
    content:
      "提前批是7月份的校招批次，特点是免笔试直接面试，未通过不影响正式批，精准匹配、命中率高。是最大的「捡漏」机会，竞争小，不投就是亏。",
    keywords: ["提前批", "7月", "校招", "免笔试"],
    source: "鹅厂知识库 / 校招时间线 / 提前批",
  },
  {
    id: "kb-timeline-spring",
    category: "knowledge",
    title: "春招补录",
    content:
      "春招补录在次年2-4月，部分岗位补招，给秋招未上岸的同学一次再战机会。",
    keywords: ["春招", "补录", "2月", "3月", "4月"],
    source: "鹅厂知识库 / 校招时间线 / 春招补录",
  },

  // ── 面试流程 ──
  {
    id: "kb-interview-tech",
    category: "knowledge",
    title: "技术岗面试流程",
    content:
      "技术岗面试流程：1.在线笔试（编程2-3道+基础题）；2.技术一面（项目深挖+1-2算法题+基础问答）；3.技术二面（深入项目+系统设计）；4.交叉/三面（不同团队评估）；5.HR面（价值观+沟通+薪资）。每轮都要诚实坦诚、表达对团队的认同。",
    keywords: ["面试", "流程", "技术", "笔试", "一面", "二面", "HR面"],
    source: "鹅厂知识库 / 面试流程 / 技术岗",
  },
  {
    id: "kb-interview-product",
    category: "knowledge",
    title: "产品岗面试流程",
    content:
      "产品岗面试流程：1.在线笔试（行测+产品题：需求分析、方案设计、数据分析）；2.群面/业务面（案例讨论+方案输出）；3.单面（产品思维+项目+行业理解）；4.总监面（全局视野+战略思考）；5.HR面（综合素质和团队匹配度）。",
    keywords: ["面试", "产品", "群面", "单面", "总监面"],
    source: "鹅厂知识库 / 面试流程 / 产品岗",
  },

  // ── 企业文化 ──
  {
    id: "kb-culture-mission",
    category: "knowledge",
    title: "鹅厂使命愿景",
    content:
      "鹅厂使命愿景是「用户为本，科技向善」——不只是口号，是产品决策的底层逻辑。腾讯坚持用科技能力创造社会价值。",
    keywords: ["文化", "使命", "愿景", "价值观", "科技向善"],
    source: "鹅厂知识库 / 企业文化 / 使命愿景",
  },
  {
    id: "kb-culture-engineer",
    category: "knowledge",
    title: "工程师文化",
    content:
      "工程师文化：开平（开放平等）、瑞雪（坦诚正直）、极客精神。内部有大量技术分享、开源项目，鼓励用数据说话。",
    keywords: ["文化", "工程师", "开平", "瑞雪", "极客"],
    source: "鹅厂知识库 / 企业文化 / 工程师文化",
  },
  {
    id: "kb-culture-training",
    category: "knowledge",
    title: "新人培养体系",
    content:
      "新人培养：1对1导师制、新员工封闭培训、技术学院课程体系。入职后有完整的90天融入计划，帮你从学生平稳过渡到职场人。新人关注的是成长速度，而非起点。",
    keywords: ["培养", "新人", "导师", "入职", "培训"],
    source: "鹅厂知识库 / 企业文化 / 新人培养",
  },
  {
    id: "kb-culture-biz",
    category: "knowledge",
    title: "鹅厂业务版图",
    content:
      "鹅厂六大事业群：WXG（微信）、IEG（互动娱乐/游戏）、CSIG（云与产业）、PCG（内容平台）、CDG（企业发展）、TEG（技术工程）。",
    keywords: ["事业群", "BG", "WXG", "IEG", "CSIG", "PCG", "CDG", "TEG"],
    source: "鹅厂知识库 / 企业文化 / 业务版图",
  },
  {
    id: "kb-culture-growth",
    category: "knowledge",
    title: "成长通道",
    content:
      "成长通道：双通道晋升（管理+专业），技术线从初级到专家，每个级别有清晰的能力标准。新人关注的是成长速度，而非起点。",
    keywords: ["晋升", "成长", "通道", "管理", "专业"],
    source: "鹅厂知识库 / 企业文化 / 成长通道",
  },
];

// ============================================================
// Roadmap 成长路径 chunks
// ============================================================
export const roadmapChunks: KnowledgeChunk[] = [
  {
    id: "rm-freshman",
    category: "roadmap",
    title: "大一 · 探索期",
    content:
      "大一核心任务：1.打好基础（数学三件套：线代、概率、离散；精通一门编程语言：Python/Java/C++；数据结构与算法基础；英语阅读听力）。2.建立认知（关注腾讯招聘公众号；每周30分钟浏览科技资讯；加入技术/互联网社团；和学长学姐聊天）。3.初次尝试（搭建个人博客/GitHub；参加蓝桥杯或校赛；完成1个迷你项目）。",
    keywords: ["大一", "freshman", "新生", "探索期", "基础"],
    source: "成长路径 / 大一",
  },
  {
    id: "rm-sophomore",
    category: "roadmap",
    title: "大二 · 定向期",
    content:
      "大二核心任务：1.方向探索（选2-3个技术方向各花1-2周浅尝；了解前端/后端/算法/客户端/游戏；读目标岗位JD；确定主攻方向）。2.项目实践（完成1个完整个人项目；学习Git/GitHub协作；规范提交到GitHub；写技术博客）。3.能力提升（系统学习数据结构与算法；掌握Linux基本操作；学习计网/OS/数据库原理；参加ACM/黑客松）。",
    keywords: ["大二", "sophomore", "方向", "项目", "定向"],
    source: "成长路径 / 大二",
  },
  {
    id: "rm-junior",
    category: "roadmap",
    title: "大三 · 积累期（实习冲刺）",
    content:
      "大三核心任务：1.实习准备（打磨简历：STAR法则+量化成果；刷LeetCode热题100+剑指Offer；准备2-3分钟中英文自我介绍；在牛客网搜索面经）。2.投递面试（2-3月密集投递暑期实习；至少投3-5个不同BG的相似岗位；找学长学姐要内推码；每场面试后记录复盘）。3.实习成长（前两周疯狂熟悉代码和工具链；主动和导师1对1获取反馈；完成有挑战性的核心任务；准备转正答辩）。",
    keywords: ["大三", "junior", "实习", "简历", "面试", "LeetCode", "内推"],
    source: "成长路径 / 大三",
  },
  {
    id: "rm-senior",
    category: "roadmap",
    title: "大四 · 冲刺期（校招）",
    content:
      "大四核心任务：1.提前批（7月第一时间投递；免笔试直接面试；即使没过也不影响正式批）。2.正式批（8-9月完成网申和笔试；准备项目介绍：背景→方案→难点→成果；9-10月集中面试；保持每日刷题和复习习惯）。3.收尾（收到offer后综合对比选择；如果不理想关注春招补录；毕业设计/论文按计划推进；为入职做技术和心态准备）。",
    keywords: ["大四", "senior", "校招", "冲刺", "秋招", "offer"],
    source: "成长路径 / 大四",
  },
  {
    id: "rm-overseas",
    category: "roadmap",
    title: "留学生 · 专属路径",
    content:
      "留学生路径：1.留学初期（关注国内行业动态：36氪/虎嗅/晚点；用课程项目积累可迁移技术能力；完善LinkedIn和GitHub主页；联系回国校友建立人脉信息网）。2.留学中期（准备中英文两份简历；熟悉远程面试流程和腾讯会议；关注校招批次与毕业时间的匹配；开始刷题维持技术手感）。3.回国求职（毕业前一年投递秋招；突出国际化经历与专业深度的结合；了解目标城市落户政策；给自己2-3个月回国适应缓冲期）。腾讯支持远程面试，不用专程回国。",
    keywords: ["留学生", "overseas", "海归", "回国", "远程面试", "LinkedIn"],
    source: "成长路径 / 留学生",
  },
];

// ============================================================
// 合并所有 chunks
// ============================================================
export const allKnowledgeChunks: KnowledgeChunk[] = [
  ...knowledgeChunks,
  ...roadmapChunks,
];
