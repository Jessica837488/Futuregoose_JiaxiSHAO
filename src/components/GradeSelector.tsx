"use client";

import { useRouter } from "next/navigation";

interface GradeInfo {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  bgColor: string;
  emoji: string;
  concerns: string[];
}

const grades: GradeInfo[] = [
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
    title: "大四/研 · 冲刺期",
    subtitle: "Senior & Graduate",
    tagline: "校招进行中，希望有人陪自己走完这程",
    color: "#52c41a",
    bgColor: "from-green-50 to-emerald-50 border-green-200",
    emoji: "🌴",
    concerns: ["校招流程和时间线？", "如何提升面试通过率？", "offer 怎么选？"],
  },
];

interface GradeSelectorProps {
  selectedGrade?: string;
  onSelect?: (gradeId: string) => void;
  showAll?: boolean;
}

export default function GradeSelector({
  selectedGrade,
  onSelect,
  showAll = true,
}: GradeSelectorProps) {
  const router = useRouter();

  const handleClick = (gradeId: string) => {
    if (onSelect) {
      onSelect(gradeId);
    } else {
      router.push(`/chat?grade=${gradeId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
      {grades.map((grade) => {
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
