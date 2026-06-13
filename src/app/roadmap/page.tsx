const roadmapData = [
  {
    year: "大一",
    emoji: "🌱",
    subtitle: "探索期 · 认识大学、认识自己",
    color: "border-l-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    items: [
      {
        title: "打好专业基础",
        desc: "认真学习专业课，尤其是数学、编程、数据结构等基础课程。GPA 虽然不是唯一标准，但好的成绩单永远是加分项。",
        tip: "💡 绩点保持在 3.0/4.0 以上是比较理想的状态",
      },
      {
        title: "探索兴趣方向",
        desc: "多尝试不同的东西：前端？后端？AI？产品？设计？参加社团、旁听课、看行业资讯，找到你真正感兴趣的方向。",
        tip: "💡 推荐关注「腾讯招聘」公众号，提前感受企业氛围",
      },
      {
        title: "培养信息获取习惯",
        desc: "关注科技媒体（36氪、虎嗅、InfoQ），了解互联网行业动态。培养对技术和产品的敏感度。",
        tip: "💡 每周花 1-2 小时浏览行业资讯，建立认知框架",
      },
      {
        title: "学好英语",
        desc: "技术文档、论文、开源社区……英语是程序员的必修课。大一把四六级过了，有余力可以准备托福/雅思。",
        tip: "💡 每天 30 分钟英语阅读，长期积累效果惊人",
      },
    ],
  },
  {
    year: "大二",
    emoji: "🌿",
    subtitle: "定向期 · 确定方向、积累能力",
    color: "border-l-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    items: [
      {
        title: "选择一个方向深入",
        desc: "在技术栈中选择一条主线深入（例如 Java + Spring，或 C++ + 网络编程），同时保持对其他技术的好奇心。",
        tip: "💡 T 型人才：一专多能，有一条深入的主线 + 宽广的技术视野",
      },
      {
        title: "动手做项目",
        desc: "课程设计、个人作品、开源贡献……把学到的东西用起来。一个好项目胜过十张证书。把代码放到 GitHub 上。",
        tip: "💡 做一个完整的项目（从需求到上线），这是面试中最好的谈资",
      },
      {
        title: "参加竞赛/大创",
        desc: "ACM、数学建模、互联网+、挑战杯……竞赛经历不仅能锻炼能力，也是简历上的亮点。",
        tip: "💡 不求获奖，参与本身就是成长",
      },
      {
        title: "开始关注实习信息",
        desc: "大二下学期就可以开始看看实习 JD，了解企业对不同岗位的能力要求，有针对地准备。",
        tip: "💡 鹅厂的「犀牛鸟」专项就是为低年级同学准备的技术实践项目",
      },
    ],
  },
  {
    year: "大三",
    emoji: "🌳",
    subtitle: "积累期 · 实习实战、备战校招",
    color: "border-l-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    items: [
      {
        title: "争取一份好实习",
        desc: "大三是最佳的实习窗口。鹅厂的暑期实习通常在 3-4 月开始招聘，提前准备好简历和作品集，勇敢投递！",
        tip: "💡 一份好的实习经历 = 最好的校招敲门砖",
      },
      {
        title: "系统刷算法题",
        desc: "LeetCode 中等难度的题目至少刷 100-200 道，重点覆盖数组、链表、树、DP、回溯等高频题型。",
        tip: "💡 按专题刷，每周保持 3-5 题的节奏，重在理解思路",
      },
      {
        title: "打磨简历和面试技巧",
        desc: "简历不是经历堆砌，而是能力展示。用 STAR 法则描述项目经验，突出你的贡献和成果。找同学互相模拟面试。",
        tip: "💡 一份好简历应该能在 10 秒内让人看到你的核心亮点",
      },
      {
        title: "建立行业人脉",
        desc: "参加技术交流会、线上分享、校园宣讲会。和学长学姐、行业前辈多交流。很多机会来自信息差。",
        tip: "💡 加入鹅厂官方校招交流群，获取第一手信息",
      },
    ],
  },
  {
    year: "大四/研",
    emoji: "🌴",
    subtitle: "冲刺期 · 全力以赴、收获 offer",
    color: "border-l-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    items: [
      {
        title: "把握提前批机会",
        desc: "鹅厂提前批通常在 7-8 月开启，可以免笔试直接进入面试环节。这是上岸的最佳时机，一定要尽早投递！",
        tip: "💡 提前批即使没过也不影响正式批，相当于多一次机会",
      },
      {
        title: "面试冲刺",
        desc: "密集准备面试：技术面（项目深挖 + 算法题 + 基础八股文）、HR 面（职业规划 + 综合素质）。把常见问题都准备一遍。",
        tip: "💡 准备 3 分钟自我介绍，背到滚瓜烂熟但听起来自然",
      },
      {
        title: "多线程投递",
        desc: "不要只投一家公司。合理安排投递节奏，把最想去的一两家放在前面练手，积累面试经验。",
        tip: "💡 制作投递进度表，避免错过重要时间节点",
      },
      {
        title: "心态管理",
        desc: "求职是马拉松不是短跑。收到拒信很正常，每一次面试都是一次学习。保持自信，相信属于你的 offer 终会到来。",
        tip: "💡 未来鹅会一直陪着你，加油！🦢",
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          🗺️ 大学四年成长地图
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          从大一到大四，每个阶段都有自己该做的事。
          这份路径图，希望能帮你少走弯路。
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 via-orange-400 to-green-400" />

        <div className="space-y-10">
          {roadmapData.map((phase, pi) => (
            <div key={pi} className="relative pl-0 sm:pl-20">
              {/* Year badge */}
              <div className="hidden sm:flex absolute left-4 top-3 -translate-x-1/2 z-10">
                <span className="text-3xl">{phase.emoji}</span>
              </div>

              {/* Phase header */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="sm:hidden text-2xl">{phase.emoji}</span>
                  <h2 className={`text-2xl font-extrabold ${phase.textColor}`}>
                    {phase.year}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm ml-9 sm:ml-0">
                  {phase.subtitle}
                </p>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phase.items.map((item, ii) => (
                  <div
                    key={ii}
                    className={`${phase.bgColor} border-l-4 ${phase.color} rounded-xl p-5 hover:shadow-md transition-shadow`}
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {item.desc}
                    </p>
                    <p className="text-xs text-gray-500 italic">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-16 pb-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 mb-6">
          <span className="text-2xl">🦢</span>
          <span className="text-sm text-gray-600 font-medium">
            成长路上，未来鹅一直陪你
          </span>
        </div>
        <div>
          <a
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
          >
            💬 和未来鹅聊聊你的规划
          </a>
        </div>
      </div>
    </div>
  );
}
