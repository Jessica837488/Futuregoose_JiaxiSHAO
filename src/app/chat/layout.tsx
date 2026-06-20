import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 对话 | 未来鹅 — 聊聊你的大学与未来",
  description:
    "和未来鹅 AI 开始对话：选择你的年级（本科/研究生/留学生），获取个性化的大学规划建议、职业方向指导、腾讯校招信息。",
  openGraph: {
    title: "AI 对话 | 未来鹅",
    description: "根据你的阶段，提供个性化的职业规划建议和行业认知。",
    type: "website",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
