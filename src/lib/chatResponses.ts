// Client-side fallback responses —— supports multi-turn conversation with follow-up detection
// Each topic has 3 tiers: primary → deeper dive → even more specifics
//
// 数据已拆分到 src/data/ 目录：
//   - defaultResponses.ts  — 各年级默认回复（3层递进）
//   - keywordResponses.ts   — 关键词多层级回复
//   - genericFollowUps.ts   — 追问兜底回复

// ============================================================
// 追问意图检测
// ============================================================
const followUpPhrases = [
  "还有呢", "还有吗", "继续说", "继续", "再详细点", "详细说说",
  "具体说说", "举个例子", "比如呢", "还有别的吗", "还有什么",
  "更多", "然后呢", "接着说", "再展开说说", "能不能具体一点",
  "再具体一点", "详细一点", "再讲讲", "能举个例子吗", "举个栗子",
  "能再说说吗", "再具体一些", "展开说说",
];

function isFollowUp(input: string): boolean {
  const cleaned = input.trim().replace(/[？?！!。，,～~…\s]/g, "");
  return followUpPhrases.some((phrase) => cleaned.includes(phrase));
}

// ============================================================
// 话题已耗尽时的兜底回复
// ============================================================
const exhaustedReplies = [
  "这个话题我们已经聊得比较深入了～要不换个角度，你还对鹅厂的哪些方面感兴趣呢？比如实习、面试、职业规划都可以聊聊 🦢",
  "关于这点我们挖得差不多了！你可以试试问我其他问题，我对鹅厂校招的方方面面都很熟悉～",
  "我把这个方向的核心都分享给你啦～还有什么其他想了解的吗？我随时都在！",
  "聊了这么多，相信你对这个话题已经有了比较立体的了解！还有什么好奇的尽管问我～",
];

// ============================================================
// ChatContext —— 追踪当前对话状态
// ============================================================
export interface ChatContext {
  lastTopic: string | null;
  lastTopicTier: number;
  isDefaultTopic: boolean;
  topicExhausted: boolean;
}

// ============================================================
// 导入数据模块
// ============================================================
import { defaultResponses } from "@/data/defaultResponses";
import { keywordResponses } from "@/data/keywordResponses";
import { genericFollowUps } from "@/data/genericFollowUps";

// ============================================================
// 核心函数：获取回复 + 更新上下文
// ============================================================
export function getResponse(
  grade: string,
  userInput: string,
  context: ChatContext
): { response: string; context: ChatContext } {
  const isFollowUpInput = isFollowUp(userInput);

  // --- 情况1：追问（在已有话题上深入） ---
  if (isFollowUpInput) {
    if (context.lastTopic) {
      if (context.isDefaultTopic) {
        // 追问默认话题
        const followUps = genericFollowUps[grade];
        if (followUps && context.lastTopicTier < followUps.length) {
          const response = followUps[context.lastTopicTier];
          return {
            response,
            context: {
              ...context,
              lastTopicTier: context.lastTopicTier + 1,
              topicExhausted: false,
            },
          };
        }
      } else {
        // 追问关键词话题
        const gradeKeywords = keywordResponses[grade];
        if (gradeKeywords) {
          const topicResponses = gradeKeywords[context.lastTopic];
          if (topicResponses && context.lastTopicTier < topicResponses.length) {
            const response = topicResponses[context.lastTopicTier];
            return {
              response,
              context: {
                ...context,
                lastTopicTier: context.lastTopicTier + 1,
                topicExhausted: false,
              },
            };
          }
        }
      }

      // 话题已耗尽
      const randomReply =
        exhaustedReplies[Math.floor(Math.random() * exhaustedReplies.length)];
      return {
        response: randomReply,
        context: { lastTopic: null, lastTopicTier: 0, isDefaultTopic: false, topicExhausted: true },
      };
    }

    // 追问但无上下文（首次就是追问）——当作新问题处理
  }

  // --- 情况2：新问题 —— 先尝试关键词匹配 ---
  const gradeKeywords = keywordResponses[grade];
  if (gradeKeywords) {
    for (const [keyword, responses] of Object.entries(gradeKeywords)) {
      if (userInput.includes(keyword)) {
        return {
          response: responses[0],
          context: {
            lastTopic: keyword,
            lastTopicTier: 1,
            isDefaultTopic: false,
            topicExhausted: false,
          },
        };
      }
    }
  }

  // --- 情况3：没有任何关键词匹配 —— 使用年级默认回复 ---
  const defaultTiers = defaultResponses[grade] || defaultResponses.freshman;
  return {
    response: defaultTiers[0],
    context: {
      lastTopic: grade, // 用 grade 标识默认话题
      lastTopicTier: 1,
      isDefaultTopic: true,
      topicExhausted: false,
    },
  };
}
