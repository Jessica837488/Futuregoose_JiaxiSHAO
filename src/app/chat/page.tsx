"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import ChatBox from "@/components/ChatBox";
import { undergraduateGrades, graduateGrades, overseasGrades } from "@/data/grades";
import GradeSelector from "@/components/GradeSelector";
import { getGradeLabel } from "@/data/grades";

function ChatContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("grade");
  const [grade, setGrade] = useState<string>(gradeParam || "");

  if (!grade) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            先告诉我你的阶段 🎓
          </h2>
          <p className="text-gray-500">
            这样我就能给你更贴切的建议啦～
          </p>
        </div>
        <GradeSelector
          onSelect={setGrade}
          selectedGrade={grade}
          grades={[...undergraduateGrades, ...graduateGrades, ...overseasGrades]}
        />
      </div>
    );
  }

  return (
    <ChatBox
      grade={grade}
      gradeLabel={getGradeLabel(grade)}
      placeholder={`作为${getGradeLabel(grade) || "当前阶段"}的同学，你想聊些什么？`}
    />
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-400">加载中...</div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
