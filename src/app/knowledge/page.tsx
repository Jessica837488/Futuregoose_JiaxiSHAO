"use client";

import { useState } from "react";

// ============================================================
// Data
// ============================================================
interface RoleGroup {
  title: string;
  roles: { name: string; skills: string; tip: string }[];
}
interface StepGroup {
  title: string;
  steps: { step: string; detail: string }[];
}
interface CultureItem {
  icon: string; title: string; detail: string;
}
interface TimelineItem {
  month: string; tag: string; events: string[];
}

type Section =
  | { id: "roles"; icon: string; title: string; desc: string; color: string; type: "roles"; content: RoleGroup[] }
  | { id: "timeline"; icon: string; title: string; desc: string; color: string; type: "timeline"; timeline: TimelineItem[] }
  | { id: "interview"; icon: string; title: string; desc: string; color: string; type: "interview"; content: StepGroup[] }
  | { id: "culture"; icon: string; title: string; desc: string; color: string; type: "culture"; items: CultureItem[] };

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
] as const;

// ============================================================
// Component
// ============================================================
export default function KnowledgePage() {
  const [expanded, setExpanded] = useState<string | null>("timeline");

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

      {/* Sections */}
      <div className="w-full max-w-4xl space-y-4">
        {sections.map((section) => {
          const isOpen = expanded === section.id;
          return (
            <div
              key={section.id}
              className={`rounded-2xl border-2 ${section.color} transition-all duration-300 overflow-hidden`}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : section.id)}
                className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-white/40 transition-colors"
              >
                <span className="text-2xl">{section.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.desc}</p>
                </div>
                <span
                  className={`text-gray-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-6 pb-6 animate-msg">
                  {/* Timeline section */}
                  {section.type === "timeline" && (
                    <div className="relative">
                      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand via-purple-500 to-orange-400" />
                      <div className="space-y-4">
                        {section.timeline.map((item, i) => (
                          <div key={i} className="flex gap-4 pl-1">
                            <div className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-brand flex items-center justify-center text-xs font-bold text-brand shrink-0 mt-0.5"
                              style={{ borderColor: ["#1a6eff","#6c63ff","#f59e0b","#10b981","#ef4444","#8b5cf6"][i] || "#1a6eff" }}>
                              {item.month.includes("-") ? item.month.slice(0,2) : item.month}
                            </div>
                            <div className="pb-2 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-800">{item.month}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-bg text-brand">
                                  {item.tag}
                                </span>
                              </div>
                              <ul className="space-y-0.5">
                                {item.events.map((e, j) => (
                                  <li key={j} className="text-sm text-gray-600 flex items-start gap-1.5">
                                    <span className="text-brand mt-0.5">•</span>
                                    {e}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role content grid */}
                  {section.type === "roles" && section.content.map((group, i) => (
                    <div key={i} className="mb-5 last:mb-0">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 px-1">{group.title}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.roles.map((role, j) => (
                          <div key={j} className="p-3 rounded-xl bg-white/60 border border-gray-100 hover:border-brand/30 transition-colors">
                            <div className="font-semibold text-gray-800 text-sm">{role.name}</div>
                            <div className="text-xs text-brand/70 mt-0.5">{role.skills}</div>
                            <div className="text-xs text-gray-400 mt-1">💡 {role.tip}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Interview steps */}
                  {section.type === "interview" && section.content.map((group, i) => (
                    <div key={i} className="mb-5 last:mb-0">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 px-1">🔹 {group.title}</h4>
                      <div className="space-y-2">
                        {group.steps.map((s, j) => (
                          <div key={j} className="p-3 rounded-xl bg-white/60 border border-gray-100">
                            <div className="text-sm font-semibold text-gray-800 mb-0.5">{s.step}</div>
                            <div className="text-xs text-gray-500 leading-relaxed">{s.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Culture items */}
                  {section.type === "culture" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.items.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/60 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-semibold text-sm text-gray-800">{item.title}</span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-gray-400 text-center max-w-md">
        💡 知识库持续更新中。有想了解的内容？回到 AI 对话页面直接问我吧～
      </p>
    </div>
  );
}
