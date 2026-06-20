"use client";

import { useState } from "react";

// ============================================================
// Data Types
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

export type Section =
  | { id: "roles"; icon: string; title: string; desc: string; color: string; type: "roles"; content: RoleGroup[] }
  | { id: "timeline"; icon: string; title: string; desc: string; color: string; type: "timeline"; timeline: TimelineItem[] }
  | { id: "interview"; icon: string; title: string; desc: string; color: string; type: "interview"; content: StepGroup[] }
  | { id: "culture"; icon: string; title: string; desc: string; color: string; type: "culture"; items: CultureItem[] };

// ============================================================
// Client Component — handles expand/collapse state
// ============================================================
export default function KnowledgeAccordion({ sections }: { sections: Section[] }) {
  const [expanded, setExpanded] = useState<string | null>("timeline");

  return (
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
  );
}
