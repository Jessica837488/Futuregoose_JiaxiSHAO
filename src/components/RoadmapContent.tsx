"use client";

import { useState } from "react";

// ============================================================
// Data Types
// ============================================================
type Task = { label: string; done?: boolean };
type Phase = { name: string; emoji: string; tasks: Task[]; tip: string };
export type Stage = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  phases: Phase[];
};

// ============================================================
// Client Component — handles stage selection state
// ============================================================
export default function RoadmapContent({ stages }: { stages: Stage[] }) {
  const [activeStage, setActiveStage] = useState("freshman");
  const stage = stages.find((s) => s.id === activeStage) || stages[0];

  return (
    <>
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
    </>
  );
}
