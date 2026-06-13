import GradeSelector from "@/components/GradeSelector";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4">
      {/* Hero section */}
      <div className="text-center mb-12 max-w-2xl">
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
          我是一只会陪你成长的鹅～ 无论你现在是哪个年级，
          关于大学规划、职业方向、鹅厂的那些事儿，我都会一一讲给你听。
        </p>
      </div>

      {/* Grade selection */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-5">
          👇 选择你的年级，开始对话
        </h2>
        <GradeSelector />
      </div>

      {/* Feature highlights */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full pb-16">
        {[
          {
            icon: "💬",
            title: "AI 对话陪伴",
            desc: "根据你的年级，提供个性化的职业规划建议和行业认知，像朋友一样陪你聊聊未来。",
          },
          {
            icon: "📚",
            title: "鹅厂知识库",
            desc: "岗位介绍、企业文化、校招时间线、培养体系……关于鹅厂你想知道的一切。",
          },
          {
            icon: "🗺️",
            title: "成长路径规划",
            desc: "从大一到大四，每个阶段该做什么、怎么准备，清晰的大学四年成长地图。",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <span className="text-3xl mb-3 block">{item.icon}</span>
            <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
