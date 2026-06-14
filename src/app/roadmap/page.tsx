"use client";

import { useState } from "react";

// ============================================================
// Data: Growth Roadmap per stage
// ============================================================
type Task = { label: string; done?: boolean };
type Phase = { name: string; emoji: string; tasks: Task[]; tip: string };
type Stage = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  phases: Phase[];
};

const stages: Stage[] = [
  {
    id: "freshman",
    title: "大一 · 探索期",
    subtitle: "刚入学的小萌新",
    emoji: "🌱",
    color: "from-blue-500 to-indigo-500",
    phases: [
      {
        name: "打好基础",
        emoji: "📐",
        tasks: [
          { label: "学好数学三件套：线代、概率、离散" },
          { label: "精通一门编程语言（Python/Java/C++）" },
          { label: "了解数据结构与算法基础" },
          { label: "提高英语阅读和听力水平" },
        ],
        tip: "大一的核心任务不是学得多深，而是建立起「计算机思维」。不用焦虑进度慢，扎实就好。",
      },
      {
        name: "建立认知",
        emoji: "🔍",
        tasks: [
          { label: "关注腾讯招聘公众号和官网" },
          { label: "每周花30分钟浏览科技行业资讯" },
          { label: "加入学校的技术/互联网社团" },
          { label: "和学长学姐聊聊专业和职业" },
        ],
        tip: "信息差是最大的差距。大一就开始建立行业认知，你就已经领先大多数人了。",
      },
      {
        name: "初次尝试",
        emoji: "🛠️",
        tasks: [
          { label: "搭建个人博客/GitHub主页" },
          { label: "参加一次蓝桥杯或校赛编程比赛" },
          { label: "完成1个迷你项目（Todo App/个人主页等）" },
        ],
        tip: "不需要做得完美。第一次动手的体验比结果重要100倍。把代码放GitHub上，这将是简历的起点。",
      },
    ],
  },
  {
    id: "sophomore",
    title: "大二 · 定向期",
    subtitle: "开始思考方向",
    emoji: "🌿",
    color: "from-purple-500 to-violet-500",
    phases: [
      {
        name: "方向探索",
        emoji: "🧭",
        tasks: [
          { label: "选2-3个技术方向各花1-2周浅尝" },
          { label: "了解前端/后端/算法/客户端/游戏各方向" },
          { label: "去腾讯校招官网读目标岗位的JD" },
          { label: "确定1个主攻方向" },
        ],
        tip: "选方向时考虑三个维度：你喜欢的、你擅长的、市场需要的。取三者的交集就是最优解。",
      },
      {
        name: "项目实践",
        emoji: "💻",
        tasks: [
          { label: "完成1个完整的个人项目（前后端/AI等）" },
          { label: "学习Git/GitHub协作流程" },
          { label: "把项目代码规范地提交到GitHub" },
          { label: "写一篇技术博客总结项目经验" },
        ],
        tip: "一个深度项目 > 十个浅尝辄止的Demo。选一个能讲5分钟的项目，把它做到极致。",
      },
      {
        name: "能力提升",
        emoji: "📈",
        tasks: [
          { label: "系统学习数据结构与算法" },
          { label: "掌握Linux基本操作和命令行" },
          { label: "了解计算机网络/OS/数据库原理" },
          { label: "参加ACM/黑客松等竞赛锻炼" },
        ],
        tip: "这时候学的计算机基础，在面试和工作中会被反复用到。不是应付考试，是真正的装备升级。",
      },
    ],
  },
  {
    id: "junior",
    title: "大三 · 积累期",
    subtitle: "实习冲刺阶段",
    emoji: "🌳",
    color: "from-orange-500 to-amber-500",
    phases: [
      {
        name: "实习准备",
        emoji: "📝",
        tasks: [
          { label: "打磨简历（STAR法则+量化成果）" },
          { label: "刷LeetCode热题100 + 剑指Offer" },
          { label: "准备2-3分钟中英文自我介绍" },
          { label: "在牛客网搜索面经了解面试风格" },
        ],
        tip: "简历不是写出来的，是你过去两年的项目经历「长」出来的。如果有空白，现在补还来得及。",
      },
      {
        name: "投递面试",
        emoji: "🎯",
        tasks: [
          { label: "2-3月密集投递暑期实习" },
          { label: "至少投3-5个不同BG的相似岗位" },
          { label: "找学长学姐要内推码" },
          { label: "每场面试后记录复盘" },
        ],
        tip: "不要等到「准备好了」才投。先投2-3家试试，根据反馈迭代。大部分人都是在实战中进步的。",
      },
      {
        name: "实习成长",
        emoji: "🚀",
        tasks: [
          { label: "前两周疯狂熟悉代码和工具链" },
          { label: "主动和导师1对1获取反馈" },
          { label: "完成一个有挑战性的核心任务" },
          { label: "准备转正答辩（总结成果+展示成长）" },
        ],
        tip: "腾讯实习转正比例很高。好好表现，这可能是你最快拿到offer的路。",
      },
    ],
  },
  {
    id: "senior",
    title: "大四 · 冲刺期",
    subtitle: "校招全力冲刺",
    emoji: "🌴",
    color: "from-green-500 to-emerald-500",
    phases: [
      {
        name: "提前批",
        emoji: "⚡",
        tasks: [
          { label: "7月第一时间投递提前批" },
          { label: "免笔试直接面试，充分准备" },
          { label: "即使没过也不影响正式批" },
        ],
        tip: "提前批是最大的「捡漏」机会。竞争小、免笔试、不影响正式批——不投就是亏！",
      },
      {
        name: "正式批",
        emoji: "🎪",
        tasks: [
          { label: "8-9月完成网申和笔试" },
          { label: "准备项目介绍（背景→方案→难点→成果）" },
          { label: "9-10月集中面试" },
          { label: "保持每日刷题和复习习惯" },
        ],
        tip: "校招是场马拉松不是百米冲刺。保持节奏，不要因为一两场面试的失利影响状态。",
      },
      {
        name: "收尾",
        emoji: "🏁",
        tasks: [
          { label: "收到offer后综合对比选择" },
          { label: "如果结果不理想，关注春招补录" },
          { label: "毕业设计/论文按计划推进" },
          { label: "为入职做技术和心态准备" },
        ],
        tip: "校招只是职业生涯的起点而非终点。先就业积累经验再跳大厂，是很多优秀工程师走过的路。",
      },
    ],
  },
  {
    id: "overseas",
    title: "留学生 · 专属路径",
    subtitle: "从海外到回国",
    emoji: "✈️",
    color: "from-cyan-500 to-teal-500",
    phases: [
      {
        name: "留学初期",
        emoji: "🛫",
        tasks: [
          { label: "关注国内行业动态（36氪/虎嗅/晚点）" },
          { label: "用课程项目积累可迁移的技术能力" },
          { label: "完善LinkedIn和GitHub个人主页" },
          { label: "联系回国校友建立人脉信息网" },
        ],
        tip: "你最大的优势是国际视野+独立能力。但你得主动把它们变成可展示的内容。",
      },
      {
        name: "留学中期",
        emoji: "🎓",
        tasks: [
          { label: "准备中英文两份简历" },
          { label: "熟悉远程面试流程和腾讯会议" },
          { label: "关注校招批次与毕业时间的匹配" },
          { label: "开始刷题维持技术手感" },
        ],
        tip: "腾讯面世支持远程面试。不用专程回国。提前确认你的毕业时间归属哪个校招批次。",
      },
      {
        name: "回国求职",
        emoji: "🏆",
        tasks: [
          { label: "毕业前一年投递秋招" },
          { label: "突出国际化经历与专业深度的结合" },
          { label: "了解目标城市落户政策" },
          { label: "给自己2-3个月回国适应缓冲期" },
        ],
        tip: "海归不要只强调「海归」身份，而要展示你从海外经历中获得的能力和视角。那是你区别于国内同学的独特价值。",
      },
    ],
  },
];

// ============================================================
// Component
// ============================================================
export default function RoadmapPage() {
  const [activeStage, setActiveStage] = useState("freshman");
  const stage = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center pt-8 px-4 pb-16">
      {/* Hero */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 shadow-xl shadow-green-500/25 mb-5">
          <span className="text-3xl">🗺️</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">成长路径规划</h1>
        <p className="text-gray-500 leading-relaxed">
          从新生到毕业，每个阶段该做什么、怎么准备，一张清晰的成长地图。
          选对节奏，每一步都算数。
        </p>
      </div>

      {/* Stage selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {stages.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStage(s.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeStage === s.id
                ? "bg-gray-900 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{s.emoji}</span>
            <span>{s.title.split("·")[0]}</span>
          </button>
        ))}
      </div>

      {/* Current stage header */}
      <div className="w-full max-w-4xl mb-8 animate-msg" key={activeStage}>
        <div
          className={`rounded-2xl bg-gradient-to-r ${stage.color} p-6 text-white shadow-xl`}
        >
          <div className="text-4xl mb-2">{stage.emoji}</div>
          <h2 className="text-2xl font-extrabold mb-1">{stage.title}</h2>
          <p className="text-white/80">{stage.subtitle}</p>
        </div>
      </div>

      {/* Phase cards */}
      <div className="w-full max-w-4xl space-y-4 animate-msg">
        {stage.phases.map((phase, i) => (
          <div
            key={i}
            className="relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Phase header */}
            <div className="px-6 py-4 flex items-center gap-3 bg-gray-50/50 border-b border-gray-50">
              {/* Step number */}
              <div className="w-8 h-8 rounded-full bg-brand-bg text-brand flex items-center justify-center font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{phase.emoji}</span>
                <h3 className="font-bold text-gray-800">{phase.name}</h3>
              </div>
            </div>

            {/* Tasks */}
            <div className="px-6 py-4">
              <div className="space-y-2">
                {phase.tasks.map((task, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-brand/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] text-brand/50">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
                <span className="text-amber-500 shrink-0 mt-0.5">💡</span>
                <p className="text-xs text-amber-800 leading-relaxed">{phase.tip}</p>
              </div>
            </div>

            {/* Connector */}
            {i < stage.phases.length - 1 && (
              <div className="flex justify-center pb-1">
                <svg width="24" height="20" viewBox="0 0 24 20" className="text-gray-200">
                  <line x1="12" y1="0" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                  <polyline points="6,10 12,16 18,10" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-400 mb-3">有了方向，试试和未来鹅聊聊具体怎么行动？</p>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-medium text-sm shadow-lg shadow-brand/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          🦢 开始 AI 对话
        </a>
      </div>
    </div>
  );
}
