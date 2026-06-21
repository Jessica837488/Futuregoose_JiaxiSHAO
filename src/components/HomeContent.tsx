"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GradeSelector from "@/components/GradeSelector";
import HomeContentSkeleton from "@/components/HomeContentSkeleton";
import {
  undergraduateGrades,
  graduateGrades,
  overseasGrades,
} from "@/data/grades";

const tabs = [
  { key: "undergraduate", label: "本科生", emoji: "🎓", desc: "大一 ~ 大四" },
  { key: "graduate", label: "研究生", emoji: "📚", desc: "研一 ~ 研三" },
  { key: "overseas", label: "海外留学生", emoji: "✈️", desc: "留学初期 ~ 求职期" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const gradeDataMap = {
  undergraduate: undergraduateGrades,
  graduate: graduateGrades,
  overseas: overseasGrades,
} satisfies Record<TabKey, (typeof undergraduateGrades)>;

const categoryIntro = {
  undergraduate:
    "无论你现在是哪个年级，关于大学规划、职业方向、鹅厂的那些事儿，我都会一一讲给你听。",
  graduate:
    "研究生阶段是深耕和定向的关键时期。科研 or 就业？实习怎么找？论文和面试怎么平衡？我来帮你理清思路。",
  overseas:
    "身在海外心系国内。海归怎么规划回国求职？远程面试要注意什么？国内互联网行业的最新动态和机会，鹅都帮你盯着～",
} satisfies Record<TabKey, string>;

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState<TabKey>("undergraduate");
  const [isReady, setIsReady] = useState(false);

  // 首屏先渲染骨架屏，浏览器下一帧再切到真实内容
  // 避免首屏空白 + 避免直接渲染导致 LCP 抖动
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isReady) return <HomeContentSkeleton />;

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-start pt-8 px-4">
      {/* Hero section */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-xl shadow-brand/30 mb-6">
          <span className="text-4xl">🦢</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          未来<span className="text-brand">鹅</span>
        </h1>
        <p className="text-lg text-gray-500 mb-2">
          大学生职业成长 AI 陪伴体
        </p>
        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          我是一只会陪你成长的鹅～ 无论你来自哪里、在读哪个阶段，
          关于大学规划、职业方向、鹅厂的那些事儿，我都会一一讲给你听。
        </p>
      </div>

      {/* Tab buttons */}
      <div className="flex items-center gap-2 mb-2 p-1 bg-gray-100/80 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-base">{tab.emoji}</span>
            <span>{tab.label}</span>
            <span className="hidden sm:inline text-xs text-gray-400 font-normal">
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Intro text for active tab */}
      <p className="text-sm text-gray-400 text-center mb-6 max-w-lg">
        {categoryIntro[activeTab]}
      </p>

      {/* Grade panel — conditionally render only the active tab */}
      <div className="w-full flex flex-col items-center mb-6">
        <GradeSelector grades={gradeDataMap[activeTab]} />
      </div>

      {/* Feature highlights */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full pb-16">
        {[
          {
            icon: "💬",
            title: "AI 对话陪伴",
            desc: "根据你的阶段，提供个性化的职业规划建议和行业认知，像朋友一样陪你聊聊未来。",
            href: "/chat",
          },
          {
            icon: "📚",
            title: "鹅厂知识库",
            desc: "岗位介绍、企业文化、校招时间线、培养体系……关于鹅厂你想知道的一切。",
            href: "/knowledge",
          },
          {
            icon: "🗺️",
            title: "成长路径规划",
            desc: "从新生到毕业，每个阶段该做什么、怎么准备，清晰的成长地图。",
            href: "/roadmap",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-center block cursor-pointer hover:-translate-y-0.5"
          >
            <span className="text-3xl mb-3 block">{item.icon}</span>
            <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
