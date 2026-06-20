import HomeContent from "@/components/HomeContent";

// ============================================================
// SEO Metadata (must be in Server Component)
// ============================================================
export const metadata = {
  title: "未来鹅 — 大学生职业成长 AI 陪伴体",
  description:
    "未来鹅是一只会陪你成长的 AI 伙伴。无论你是本科生、研究生还是留学生，关于大学规划、职业方向、腾讯校招的那些事儿，它都能给你个性化建议。",
  openGraph: {
    title: "未来鹅 — 大学生职业成长 AI 陪伴体",
    description: "大学规划、职业方向、腾讯校招——AI 陪你聊成长。",
    type: "website",
  },
};

export default function Home() {
  return <HomeContent />;
}
