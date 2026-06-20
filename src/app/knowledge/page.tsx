import KnowledgeAccordion, { type Section } from "@/components/KnowledgeAccordion";

// ============================================================
// Data — static, server-rendered
// ============================================================
const sections: Section[] = [
  {
    id: "roles", icon: "💼", title: "岗位分类",
    desc: "了解鹅厂都有哪些岗位方向，找到与你最匹配的那一个。",
    color: "border-blue-200 bg-blue-50/50", type: "roles",
    content: [
      {
        title: "技术类",
        roles: [
          { name: "后端开发", skills: "Go / C++ / Java / Python", tip: "需求量最大，适合喜欢系统设计和逻辑的同学" },
          { name: "前端开发", skills: "React / Vue / TypeScript", tip: "贴近用户，快速看到效果" },
          { name: "客户端开发", skills: "Kotlin / Swift / Flutter", tip: "iOS/Android生态，移动端核心" },
          { name: "算法工程师", skills: "Python / PyTorch / 数学", tip: "AI/推荐/搜索/广告，研究和工程结合" },
          { name: "测试开发", skills: "Python / 自动化框架", tip: "质量保障，从代码层面保证产品稳定" },
          { name: "安全工程师", skills: "逆向/漏洞/密码学", tip: "攻防两端，腾讯安全是行业标杆" },
          { name: "游戏开发", skills: "C++ / Unity / UE", tip: "游戏引擎、图形学、网络同步" },
        ],
      },
      {
        title: "产品类",
        roles: [
          { name: "产品策划", skills: "需求分析 / 原型设计 / 数据分析", tip: "定义产品做什么、为什么做" },
          { name: "产品运营", skills: "活动策划 / 用户运营 / 增长", tip: "让更多人用、用得更好" },
          { name: "游戏策划", skills: "玩法设计 / 数值 / 关卡", tip: "创造好玩的世界，需要热爱游戏" },
        ],
      },
      {
        title: "设计类",
        roles: [
          { name: "视觉设计", skills: "Figma / PS / AI", tip: "界面的视觉表达和品牌调性" },
          { name: "交互设计", skills: "用户研究 / 原型 / 动效", tip: "让产品用起来顺畅自然" },
        ],
      },
      { title: "其他", roles: [
          { name: "市场/品牌", skills: "营销策划 / 内容 / 传播", tip: "让更多人知道和喜欢产品" },
          { name: "HR/财务/行政", skills: "专业领域能力", tip: "职能部门是公司运转的基石" },
      ]},
    ],
  },
  {
    id: "timeline", icon: "📅", title: "校招时间线",
    desc: "一张图看懂从投递到拿offer的全流程。",
    color: "border-orange-200 bg-orange-50/50", type: "timeline",
    timeline: [
      { month: "7月", tag: "提前批", events: ["免笔试直接面试", "未通过不影响正式批", "精准匹配，命中率高"] },
      { month: "8月", tag: "正式批启动", events: ["网申通道开放", "线上笔试通知陆续发出"] },
      { month: "9月", tag: "笔试&面试", events: ["统一笔试（编程+基础）", "一面：技术/项目深挖", "二面：交叉面/leader面"] },
      { month: "10月", tag: "面试&HR面", events: ["三面/四面：部门负责人面", "HR面：价值观+沟通能力"] },
      { month: "11月", tag: "Offer发放", events: ["意向书发放", "正式offer沟通", "签约"] },
      { month: "次年2-4月", tag: "春招补录", events: ["部分岗位补招", "秋招未上岸的同学再战"] },
    ],
  },
  {
    id: "interview", icon: "🎯", title: "面试流程详解",
    desc: "每一轮面试考察什么、怎么准备。",
    color: "border-purple-200 bg-purple-50/50", type: "interview",
    content: [
      {
        title: "技术岗面试流程",
        steps: [
          { step: "1. 在线笔试", detail: "编程题（2-3道）+ 基础知识选择题。中等难度为主，重点是正确率和代码风格。" },
          { step: "2. 技术一面", detail: "项目经历深挖 + 1-2道算法题 + 基础问答。面试官是未来同事，看的是基本功和沟通。" },
          { step: "3. 技术二面", detail: "更深入的项目讨论 + 系统设计（视岗位）+ 综合技术能力考察。面试官可能是组长或资深工程师。" },
          { step: "4. 交叉/三面", detail: "不同团队的面试官从另一个角度评估，有时是总监或负责人面。" },
          { step: "5. HR面", detail: "价值观匹配、职业规划、沟通表达、薪资期望。诚实坦诚，表达对团队的认同。" },
        ],
      },
      {
        title: "产品岗面试流程",
        steps: [
          { step: "1. 在线笔试", detail: "行测 + 产品题（需求分析、方案设计、数据分析），考察逻辑和产品感。" },
          { step: "2. 群面/业务面", detail: "案例讨论 + 方案输出。展示逻辑清晰、推动讨论的能力。" },
          { step: "3. 单面", detail: "产品思维、过往项目、行业理解。准备1-2个你深度思考过的产品问题。" },
          { step: "4. 总监面", detail: "全局视野、战略思考、价值观。" },
          { step: "5. HR面", detail: "综合素质和团队匹配度。" },
        ],
      },
    ],
  },
  {
    id: "culture", icon: "🏢", title: "企业文化",
    desc: "鹅厂是一家怎样的公司？进来感受一下。",
    color: "border-green-200 bg-green-50/50", type: "culture",
    items: [
      { icon: "💡", title: "使命愿景", detail: "「用户为本，科技向善」——不只是口号，是产品决策的底层逻辑。腾讯坚持用科技能力创造社会价值。" },
      { icon: "🤝", title: "工程师文化", detail: "开平（开放平等）、瑞雪（坦诚正直）、极客精神。内部有大量技术分享、开源项目，鼓励用数据说话。" },
      { icon: "📚", title: "新人培养", detail: "1对1导师制、新员工封闭培训、技术学院课程体系。入职后有完整的90天融入计划，帮你从学生平稳过渡到职场人。" },
      { icon: "🌍", title: "业务版图", detail: "六大事业群覆盖社交（WXG）、游戏（IEG）、云与产业（CSIG）、内容平台（PCG）、企业发展（CDG）、技术工程（TEG）。" },
      { icon: "🏆", title: "成长通道", detail: "双通道晋升（管理+专业），技术线从初级到专家，每个级别有清晰的能力标准。新人关注的是成长速度，而非起点。" },
    ],
  },
];

// ============================================================
// SEO Metadata
// ============================================================
export const metadata = {
  title: "鹅厂知识库 | 未来鹅 — 岗位介绍·校招时间线·面试流程·企业文化",
  description:
    "了解腾讯校招的全方位信息：技术/产品/设计等岗位分类、7-11月校招时间线详解、各岗位面试流程与准备建议、企业文化与新人培养体系。",
  openGraph: {
    title: "鹅厂知识库 | 未来鹅",
    description: "岗位介绍、校招时间线、面试流程、企业文化——关于鹅厂你想知道的一切。",
    type: "website",
  },
};

// ============================================================
// Server Component Page
// ============================================================
export default function KnowledgePage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center pt-8 px-4 pb-16">
      {/* Hero */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/25 mb-5">
          <span className="text-3xl">📚</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">鹅厂知识库</h1>
        <p className="text-gray-500 leading-relaxed">
          岗位介绍、校招时间线、面试流程、企业文化——关于鹅厂你想知道的一切，这里都有。
        </p>
      </div>

      {/* Interactive accordion (client component) */}
      <KnowledgeAccordion sections={sections} />

      {/* Footer note */}
      <p className="mt-10 text-xs text-gray-400 text-center max-w-md">
        💡 知识库持续更新中。有想了解的内容？回到 AI 对话页面直接问我吧～
      </p>
    </div>
  );
}
