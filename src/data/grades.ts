// ============================================================
// 统一年级数据源 — Single Source of Truth
// 所有年级配置（标签、颜色、emoji、快捷提示）在此定义一次，
// 其余组件从此文件导入派生数据。
// ============================================================

/** 所有合法的年级 ID 联合类型 */
export type GradeId =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "master1"
  | "master2"
  | "master3"
  | "overseas-early"
  | "overseas-mid"
  | "overseas-final";

/** 完整的年级信息（GradeSelector 卡片所需全部字段） */
export interface GradeInfo {
  id: GradeId;
  title: string;
  subtitle: string;
  tagline: string;
  /** Hex 颜色值，用于卡片选中态边框/阴影 */
  color: string;
  /** Tailwind 渐变+边框 class 组合 */
  bgColor: string;
  /** ChatBox 头部 badge 的 Tailwind 颜色 class（如 bg-blue-100 text-blue-700） */
  badgeColor: string;
  emoji: string;
  /** GradeSelector 卡片底部展示的关心话题 */
  concerns: string[];
  /** ChatBox 快捷提问按钮文字（与 concerns 类似但措辞略有不同） */
  quickPrompts: string[];
}

// ── 原始数据 ──────────────────────────────────────────────

const _allGrades: GradeInfo[] = [
  // ── 本科生 ──
  {
    id: "freshman",
    title: "大一 · 探索期",
    subtitle: "Freshman",
    tagline: "刚入学的小萌新，对互联网世界充满好奇",
    color: "#1a6eff",
    bgColor: "from-blue-50 to-indigo-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    emoji: "🌱",
    concerns: ["互联网行业是什么？", "腾讯在做什么有趣的事？", "大学四年该怎么规划？"],
    quickPrompts: [
      "腾讯是一家什么样的公司？",
      "互联网行业有哪些热门岗位？",
      "大一应该怎么规划大学生活？",
    ],
  },
  {
    id: "sophomore",
    title: "大二 · 定向期",
    subtitle: "Sophomore",
    tagline: "开始思考专业方向，想试试自己的可能性",
    color: "#6c63ff",
    bgColor: "from-purple-50 to-violet-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    emoji: "🌿",
    concerns: ["我的专业能做什么？", "需要学哪些技能？", "鹅厂有什么技术方向？"],
    quickPrompts: [
      "学计算机可以做什么方向？",
      "鹅厂的技术栈有哪些？",
      "怎么找到自己感兴趣的方向？",
    ],
  },
  {
    id: "junior",
    title: "大三 · 积累期",
    subtitle: "Junior",
    tagline: "准备找实习了！想了解真实的鹅厂什么样",
    color: "#ff6b35",
    bgColor: "from-orange-50 to-amber-50 border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
    emoji: "🌳",
    concerns: ["鹅厂有哪些岗位？", "实习生日常是怎样的？", "简历和面试怎么准备？"],
    quickPrompts: [
      "鹅厂实习生的日常是怎样的？",
      "简历怎么写才能脱颖而出？",
      "技术面试一般问什么？",
    ],
  },
  {
    id: "senior",
    title: "大四 · 冲刺期",
    subtitle: "Senior",
    tagline: "校招进行中，希望有人陪自己走完这程",
    color: "#52c41a",
    bgColor: "from-green-50 to-emerald-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
    emoji: "🌴",
    concerns: ["校招流程和时间线？", "如何提升面试通过率？", "offer 怎么选？"],
    quickPrompts: [
      "鹅厂校招的完整流程是什么？",
      "如何准备群面和HR面？",
      "收到多个offer怎么选？",
    ],
  },

  // ── 研究生 ──
  {
    id: "master1",
    title: "研一 · 适应期",
    subtitle: "Master Y1",
    tagline: "从本科到研究生，身份转变中，开始关注行业",
    color: "#0891b2",
    bgColor: "from-cyan-50 to-teal-50 border-cyan-200",
    badgeColor: "bg-cyan-100 text-cyan-700",
    emoji: "🔬",
    concerns: ["研究生如何规划求职？", "科研还是就业怎么选？", "腾讯对研究生有什么期待？"],
    quickPrompts: [
      "研究生如何规划求职？",
      "科研还是就业怎么选？",
      "腾讯对研究生有什么期待？",
    ],
  },
  {
    id: "master2",
    title: "研二 · 积累期",
    subtitle: "Master Y2",
    tagline: "科研深入的同时，开始为实习和校招做准备",
    color: "#7c3aed",
    bgColor: "from-violet-50 to-fuchsia-50 border-violet-200",
    badgeColor: "bg-violet-100 text-violet-700",
    emoji: "📑",
    concerns: ["如何平衡科研和实习？", "研究生简历怎么写？", "技术岗位对研究生的要求？"],
    quickPrompts: [
      "如何平衡科研和实习？",
      "研究生简历怎么写？",
      "技术岗位对研究生的要求？",
    ],
  },
  {
    id: "master3",
    title: "研三 · 冲刺期",
    subtitle: "Master Y3",
    tagline: "论文答辩和校招双线作战，需要精准发力",
    color: "#dc2626",
    bgColor: "from-rose-50 to-red-50 border-rose-200",
    badgeColor: "bg-rose-100 text-rose-700",
    emoji: "🎯",
    concerns: ["校招关键时间节点？", "论文和面试如何兼顾？", "研究方向和岗位怎么匹配？"],
    quickPrompts: [
      "校招关键时间节点？",
      "论文和面试如何兼顾？",
      "研究方向和岗位怎么匹配？",
    ],
  },

  // ── 海外留学生 ──
  {
    id: "overseas-early",
    title: "留学初期 · 探索期",
    subtitle: "Early Stage",
    tagline: "刚出国不久，开始了解国内互联网行业动态",
    color: "#0d9488",
    bgColor: "from-teal-50 to-emerald-50 border-teal-200",
    badgeColor: "bg-teal-100 text-teal-700",
    emoji: "🛫",
    concerns: ["留学生如何了解国内行业？", "海归的求职优势是什么？", "需要提前做哪些准备？"],
    quickPrompts: [
      "留学生如何了解国内行业？",
      "海归的求职优势是什么？",
      "需要提前做哪些准备？",
    ],
  },
  {
    id: "overseas-mid",
    title: "留学中期 · 规划期",
    subtitle: "Mid Stage",
    tagline: "学业稳步推进，开始规划回国求职路线",
    color: "#ca8a04",
    bgColor: "from-yellow-50 to-amber-50 border-yellow-200",
    badgeColor: "bg-amber-100 text-amber-700",
    emoji: "🎓",
    concerns: ["海外经历如何写到简历里？", "远程面试要注意什么？", "腾讯有哪些海归专属项目？"],
    quickPrompts: [
      "海外经历如何写进简历？",
      "远程面试要注意什么？",
      "腾讯有哪些海归专属项目？",
    ],
  },
  {
    id: "overseas-final",
    title: "留学末期 · 求职期",
    subtitle: "Final Stage",
    tagline: "即将毕业，全力冲刺国内校招和社招机会",
    color: "#0284c7",
    bgColor: "from-sky-50 to-blue-50 border-sky-200",
    badgeColor: "bg-sky-100 text-sky-700",
    emoji: "🏆",
    concerns: ["海归校招时间线有什么不同？", "落户和签证政策？", "如何拿到满意的offer？"],
    quickPrompts: [
      "海归校招时间线有什么不同？",
      "落户和签证政策？",
      "如何拿到满意的offer？",
    ],
  },
];

// ── 派生映射表（供各组件按需使用）──────────────────────

/** 全部年级列表 */
export const allGrades: readonly GradeInfo[] = _allGrades;

/** 按 ID 索引的 Map（O(1) 查找） */
export const gradeMap: ReadonlyMap<GradeId, GradeInfo> = new Map(
  _allGrades.map((g) => [g.id, g] as const),
);

/** 本科生年级 */
export const undergraduateGrades = _allGrades.filter(
  (g): g is Extract<GradeInfo, { id: "freshman" | "sophomore" | "junior" | "senior" }> =>
    ["freshman", "sophomore", "junior", "senior"].includes(g.id),
);

/** 研究生年级 */
export const graduateGrades = _allGrades.filter(
  (g): g is Extract<GradeInfo, { id: "master1" | "master2" | "master3" }> =>
    ["master1", "master2", "master3"].includes(g.id),
);

/** 海外留学生年级 */
export const overseasGrades = _allGrades.filter(
  (g): g is Extract<GradeInfo, { id: "overseas-early" | "overseas-mid" | "overseas-final" }> =>
    g.id.startsWith("overseas"),
);

// ── ChatBox 所需的精简映射 ─────────────────────────────

/** grade → { label, emoji, color(Tailwind badge class) } */
export const gradeConfigMap: Record<GradeId, { label: string; emoji: string; color: string }> =
  Object.fromEntries(
    _allGrades.map((g) => [g.id, { label: g.title, emoji: g.emoji, color: g.badgeColor }]),
  ) as Record<GradeId, { label: string; emoji: string; color: string }>;

/** grade → 快捷提示列表 */
export const quickPromptsMap: Record<GradeId, string[]> = Object.fromEntries(
  _allGrades.map((g) => [g.id, g.quickPrompts]),
) as Record<GradeId, string[]>;

/** grade → 标签文字 */
export const gradeLabelMap: Record<GradeId, string> = Object.fromEntries(
  _allGrades.map((g) => [g.id, g.title]),
) as Record<GradeId, string>;

/**
 * 安全地根据 grade ID 获取年级信息。
 * 传入未知 key 时返回 freshman 作为 fallback。
 */
export function getGradeConfig(grade: string): (typeof gradeConfigMap)[GradeId] {
  return gradeConfigMap[grade as GradeId] ?? gradeConfigMap.freshman;
}

export function getQuickPrompts(grade: string): string[] {
  return quickPromptsMap[grade as GradeId] ?? quickPromptsMap.freshman;
}

export function getGradeLabel(grade: string): string {
  return gradeLabelMap[grade as GradeId] ?? "";
}
