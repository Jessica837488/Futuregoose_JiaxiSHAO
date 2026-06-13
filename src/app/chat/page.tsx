"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import ChatBox from "@/components/ChatBox";
import GradeSelector from "@/components/GradeSelector";

const gradeLabels: Record<string, string> = {
  freshman: "大一 · 探索期",
  sophomore: "大二 · 定向期",
  junior: "大三 · 积累期",
  senior: "大四/研 · 冲刺期",
};

function ChatContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("grade");
  const [grade, setGrade] = useState<string>(gradeParam || "");

  if (!grade) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            先告诉我你的年级 🎓
          </h2>
          <p className="text-gray-500">
            这样我就能给你更贴切的建议啦～
          </p>
        </div>
        <GradeSelector onSelect={setGrade} selectedGrade={grade} />
      </div>
    );
  }

  return (
    <ChatBox
      grade={grade}
      gradeLabel={gradeLabels[grade] || ""}
      placeholder={`作为${gradeLabels[grade]}的同学，你想聊些什么？`}
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
