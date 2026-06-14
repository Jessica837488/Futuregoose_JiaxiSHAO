"use client";

import { useRouter } from "next/navigation";

export interface GradeInfo {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  bgColor: string;
  emoji: string;
  concerns: string[];
}

export const undergraduateGrades: GradeInfo[] = [
  {
    id: "freshman",
    title: "大一 · 探索期",
    subtitle: "Freshman",
    tagline: "刚入学的小萌新，对互联网世界充满好奇",
    color: "#1a6eff",
    bgColor: "from-blue-50 to-indigo-50 border-blue-200",
    emoji: "🌱",
    concerns: ["互联网行业是什么？", "腾讯在做什么有趣的事？", "大学四年该怎么规划？"],
  },
  {
    id: "sophomore",
    title: "大二 · 定向期",
    subtitle: "Sophomore",
    tagline: "开始思考专业方向，想试试自己的可能性",
    color: "#6c63ff",
    bgColor: "from-purple-50 to-violet-50 border-purple-200",
    emoji: "🌿",
    concerns: ["我的专业能做什么？", "需要学哪些技能？", "鹅厂有什么技术方向？"],
  },
  {
    id: "junior",
    title: "大三 · 积累期",
    subtitle: "Junior",
    tagline: "准备找实习了！想了解真实的鹅厂什么样",
    color: "#ff6b35",
    bgColor: "from-orange-50 to-amber-50 border-orange-200",
    emoji: "🌳",
    concerns: ["鹅厂有哪些岗位？", "实习生日常是怎样的？", "简历和面试怎么准备？"],
  },
  {
    id: "senior",
    title: "大四 · 冲刺期",
    subtitle: "Senior",
    tagline: "校招进行中，希望有人陪自己走完这程",
    color: "#52c41a",
    bgColor: "from-green-50 to-emerald-50 border-green-200",
    emoji: "🌴",
    concerns: ["校招流程和时间线？", "如何提升面试通过率？", "offer 怎么选？"],
  },
];

export const graduateGrades: GradeInfo[] = [
  {
    id: "master1",
    title: "研一 · 适应期",
    subtitle: "Master Y1",
    tagline: "从本科到研究生，身份转变中，开始关注行业",
    color: "#0891b2",
    bgColor: "from-cyan-50 to-teal-50 border-cyan-200",
    emoji: "🔬",
    concerns: ["研究生如何规划求职？", "科研还是就业怎么选？", "腾讯对研究生有什么期待？"],
  },
  {
    id: "master2",
    title: "研二 · 积累期",
    subtitle: "Master Y2",
    tagline: "科研深入的同时，开始为实习和校招做准备",
    color: "#7c3aed",
    bgColor: "from-violet-50 to-fuchsia-50 border-violet-200",
    emoji: "📑",
    concerns: ["如何平衡科研和实习？", "研究生简历怎么写？", "技术岗位对研究生的要求？"],
  },
  {
    id: "master3",
    title: "研三 · 冲刺期",
    subtitle: "Master Y3",
    tagline: "论文答辩和校招双线作战，需要精准发力",
    color: "#dc2626",
    bgColor: "from-rose-50 to-red-50 border-rose-200",
    emoji: "🎯",
    concerns: ["校招关键时间节点？", "论文和面试如何兼顾？", "研究方向和岗位怎么匹配？"],
  },
];

export const overseasGrades: GradeInfo[] = [
  {
    id: "overseas-early",
    title: "留学初期 · 探索期",
    subtitle: "Early Stage",
    tagline: "刚出国不久，开始了解国内互联网行业动态",
    color: "#0d9488",
    bgColor: "from-teal-50 to-emerald-50 border-teal-200",
    emoji: "🛫",
    concerns: ["留学生如何了解国内行业？", "海归的求职优势是什么？", "需要提前做哪些准备？"],
  },
  {
    id: "overseas-mid",
    title: "留学中期 · 规划期",
    subtitle: "Mid Stage",
    tagline: "学业稳步推进，开始规划回国求职路线",
    color: "#ca8a04",
    bgColor: "from-yellow-50 to-amber-50 border-yellow-200",
    emoji: "🎓",
    concerns: ["海外经历如何写到简历里？", "远程面试要注意什么？", "腾讯有哪些海归专属项目？"],
  },
  {
    id: "overseas-final",
    title: "留学末期 · 求职期",
    subtitle: "Final Stage",
    tagline: "即将毕业，全力冲刺国内校招和社招机会",
    color: "#0284c7",
    bgColor: "from-sky-50 to-blue-50 border-sky-200",
    emoji: "🏆",
    concerns: ["海归校招时间线有什么不同？", "落户和签证政策？", "如何拿到满意的offer？"],
  },
];

interface GradeSelectorProps {
  selectedGrade?: string;
  onSelect?: (gradeId: string) => void;
  showAll?: boolean;
  grades?: GradeInfo[];
}

export default function GradeSelector({
  selectedGrade,
  onSelect,
  showAll = true,
  grades,
}: GradeSelectorProps) {
  const router = useRouter();
  const displayGrades = grades || undergraduateGrades;

  const handleClick = (gradeId: string) => {
    if (onSelect) {
      onSelect(gradeId);
    } else {
      router.push(`/chat?grade=${gradeId}`);
    }
  };

  // 根据选项数量动态设置列数，保证自适应窗口宽度
  const colCount = displayGrades.length;
  const lgCols = colCount === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const maxW = colCount === 4 ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${lgCols} gap-4 w-full ${maxW}`}>
      {displayGrades.map((grade) => {
        const isSelected = selectedGrade === grade.id;
        const show = showAll || isSelected;
        if (!show) return null;

        return (
          <button
            key={grade.id}
            onClick={() => handleClick(grade.id)}
            className={`group relative p-5 rounded-2xl border-2 bg-gradient-to-br ${grade.bgColor} 
              transition-all duration-300 cursor-pointer text-left
              ${isSelected 
                ? "ring-2 ring-offset-2 scale-[1.02]" 
                : "hover:scale-[1.02] hover:shadow-lg"
              }
              hover:-translate-y-1`}
            style={
              isSelected
                ? {
                    borderColor: grade.color,
                    boxShadow: `0 0 0 2px ${grade.color}40`,
                  }
                : {}
            }
          >
            {/* Grade emoji */}
            <span className="text-3xl mb-3 block">{grade.emoji}</span>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {grade.title}
            </h3>
            <p className="text-xs text-gray-400 mb-3">{grade.subtitle}</p>

            {/* Tagline */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {grade.tagline}
            </p>

            {/* Quick concerns */}
            <div className="space-y-1.5">
              {grade.concerns.map((concern, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  {concern}
                </div>
              ))}
            </div>

            {/* Hover hint */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-medium text-brand">
                开始对话 →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
