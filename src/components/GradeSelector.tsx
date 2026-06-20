"use client";

import { useRouter } from "next/navigation";
import {
  type GradeInfo,
  type GradeId,
  undergraduateGrades,
  graduateGrades,
  overseasGrades,
} from "@/data/grades";

export type { GradeInfo, GradeId };

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

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 w-full max-w-6xl">
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
