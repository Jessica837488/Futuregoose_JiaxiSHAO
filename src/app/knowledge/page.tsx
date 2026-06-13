const knowledgeData = [
  {
    category: "🏢 关于腾讯",
    items: [
      {
        q: "腾讯是一家什么样的公司？",
        a: "腾讯成立于1998年，总部位于深圳，是中国领先的互联网科技公司。业务涵盖社交（微信/QQ）、游戏、金融科技、企业服务、云计算、AI等多个领域。腾讯以「用户为本，科技向善」为使命，致力于用技术改善人们的生活。",
      },
      {
        q: "腾讯的核心文化是什么？",
        a: "腾讯文化关键词：\n• 用户为本——一切以用户价值为依归\n• 科技向善——用科技推动社会进步\n• 正直、进取、协作、创造\n• 开放包容，鼓励创新\n• 内部倡导「瑞雪」（专业）精神",
      },
      {
        q: "腾讯的业务版图有哪些？",
        a: "主要业务线：\n🎮 互动娱乐（游戏）\n💬 微信生态（社交/支付/小程序）\n☁️ 云与智慧产业（企业服务）\n📺 平台与内容（视频/音乐/阅读）\n🤖 AI与前沿技术\n🌐 国际业务",
      },
    ],
  },
  {
    category: "🎯 岗位与方向",
    items: [
      {
        q: "腾讯有哪些技术岗位？",
        a: "技术类岗位包括：\n• 后端开发（C++/Go/Java/Python）\n• 前端开发（React/Vue/小程序）\n• 客户端开发（iOS/Android）\n• 算法/机器学习工程师\n• 数据科学/数据分析\n• 测试开发/运维开发\n• 安全工程师\n• 游戏开发（Unity/Unreal）",
      },
      {
        q: "非技术岗有哪些？",
        a: "非技术类岗位：\n• 产品经理/产品策划\n• 产品运营\n• 游戏策划/运营\n• 市场/品牌\n• 设计（UI/UX/视觉/交互）\n• 人力资源\n• 财务/法务\n• 商业分析",
      },
      {
        q: "实习生需要具备什么能力？",
        a: "鹅厂实习生核心能力要求：\n• 扎实的基础知识（计算机基础/专业理论）\n• 实际项目经验（课程项目/竞赛/开源）\n• 学习能力和好奇心\n• 沟通协作能力\n• 对产品的热情和思考\n• 有相关实习经历是加分项",
      },
    ],
  },
  {
    category: "📅 校招时间线",
    items: [
      {
        q: "腾讯校招的完整流程是什么？",
        a: "腾讯校招标准流程：\n① 网申投递（8-9月）\n② 在线笔试（9月）\n③ 技术面试 2-3轮（9-10月）\n④ HR面试（10月）\n⑤ Offer发放（10-11月）\n⑥ 签约入职\n\n提前批通常在 7-8 月开始，可以提前投递！",
      },
      {
        q: "实习招聘时间线？",
        a: "腾讯实习生招聘：\n• 暑期实习：每年 3-4 月启动，面向大三/研二\n• 日常实习：全年滚动招聘\n• 犀牛鸟专项：针对特定技术方向\n• 海外留学生专场：每年春秋两季\n\n建议大三下学期 3 月就开始关注！",
      },
      {
        q: "技术笔试考什么？",
        a: "笔试内容通常包括：\n• 编程题（2-4道，考察算法和数据结构）\n• 选择题（计算机基础、网络、OS等）\n• 开放题（系统设计、技术方案）\n\n重点复习：\n• 数据结构：数组、链表、树、图\n• 算法：排序、搜索、DP、贪心\n• 计算机网络、操作系统、数据库基础",
      },
    ],
  },
  {
    category: "💡 面试宝典",
    items: [
      {
        q: "技术面试一般问什么？",
        a: "技术面试常见考察点：\n• 项目经历深挖（为什么这么做？遇到什么困难？）\n• 基础算法题（手写代码）\n• 系统设计思路\n• 技术视野和深度\n• 沟通表达和逻辑思维\n\n小技巧：用 STAR 法则（情境-任务-行动-结果）组织你的回答。",
      },
      {
        q: "产品岗位面试怎么准备？",
        a: "产品面试重点：\n• 准备 1-2 个深度产品分析（为什么好/不好/怎么改进）\n• 了解常用的产品方法论\n• 逻辑题/估算题练习\n• 对腾讯产品的理解\n• 群面中展现协作和推动力\n\n建议：用腾讯的产品练手，比如分析微信的一个功能。",
      },
      {
        q: "面试后多久收到结果？",
        a: "通常面试后 3-7 个工作日内会有反馈。如果超过一周没有消息，可以礼貌地通过邮件询问 HR。\n\n温馨提醒：面试是双向选择，放平心态，每一次面试都是成长！🦢",
      },
    ],
  },
];

export default function KnowledgePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          📚 鹅厂知识库
        </h1>
        <p className="text-gray-500">
          关于腾讯你想知道的一切，都在这里
        </p>
      </div>

      {/* Knowledge cards */}
      <div className="space-y-8">
        {knowledgeData.map((section, si) => (
          <div key={si}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((item, ii) => (
                <details
                  key={ii}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all"
                >
                  <summary className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors list-none">
                    <span className="text-sm font-medium text-gray-700 pr-4">
                      {item.q}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1">
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {item.a}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12 pb-8">
        <p className="text-gray-400 text-sm mb-4">
          还有更多问题？去和未来鹅聊聊吧～
        </p>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
        >
          💬 开始 AI 对话
        </a>
      </div>
    </div>
  );
}
