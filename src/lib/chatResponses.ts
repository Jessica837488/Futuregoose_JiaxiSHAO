// AI 对话核心模块 —— 通过 Next.js API Route 调用智谱大模型
// 设计思路：
//   1. 优先调用 /api/chat（Next.js 中转，保护 API Key）
//   2. API 失败时 fallback 到原有的关键词匹配
//   3. 保留 3 层递进 + 追问检测 + 上下文追踪的本地逻辑
//
// 数据模块：
//   - defaultResponses.ts  — 各年级默认回复（3层递进）
//   - keywordResponses.ts   — 关键词多层级回复
//   - genericFollowUps.ts   — 追问兜底回复
//   - prompts.ts            — 各年级 AI system prompt

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
// 话题已耗尽时的兜底回复（API 失败时也用这个）
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

const EMPTY_CONTEXT: ChatContext = {
  lastTopic: null,
  lastTopicTier: 0,
  isDefaultTopic: false,
  topicExhausted: false,
};

// ============================================================
// 工具：去重"试试追问"提示
// ============================================================
/**
 * AI 偶尔会在一次回复里加 2-3 次"试试追问"提示
 * 这个函数把重复的提示去重，只保留第一次出现的
 */
function dedupeFollowHints(text: string): string {
  // 匹配常见的"试试追问"提示行
  // 匹配以"试试追问"开头，到行尾（不含换行符）
  const lines = text.split("\n");

  // 找出所有"试试追问"行的索引
  const hintIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/试试追问/.test(lines[i])) {
      hintIndices.push(i);
    }
  }

  // 如果只有 0 或 1 个，无需去重
  if (hintIndices.length <= 1) {
    return text;
  }

  // 保留第一次出现的提示行
  // 把它移到文末（在最后一个非空行之后）
  const firstHintLine = lines[hintIndices[0]];

  // 移除所有"试试追问"行
  const filteredLines = lines.filter((_, idx) => !hintIndices.includes(idx));

  // 找到最后一个非空行的位置
  let lastNonEmptyIdx = filteredLines.length - 1;
  while (lastNonEmptyIdx >= 0 && filteredLines[lastNonEmptyIdx].trim() === "") {
    lastNonEmptyIdx--;
  }

  // 在最后一个非空行之后插入提示（保持前面有空行隔开）
  filteredLines.splice(lastNonEmptyIdx + 1, 0, "", firstHintLine);

  return filteredLines.join("\n");
}

// ============================================================
// 导入数据模块
// ============================================================
import { defaultResponses } from "@/data/defaultResponses";
import { keywordResponses } from "@/data/keywordResponses";
import { genericFollowUps } from "@/data/genericFollowUps";

// ============================================================
// 历史消息类型
// ============================================================
export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// ============================================================
// API 路由调用函数（通过 Next.js 中转调智谱）
// ============================================================
const API_ROUTE = "/api/chat";

interface ApiResponse {
  success?: boolean;
  response?: string;
  error?: string;
  details?: string;
}

async function callChatAPI(
  grade: string,
  userInput: string,
  history: HistoryMessage[] = []
): Promise<string> {
  const res = await fetch(API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grade,
      userInput,
      history,
    }),
  });

  if (!res.ok) {
    const errData: ApiResponse = await res.json().catch(() => ({}));
    throw new Error(
      `API 路由错误 (${res.status}): ${errData.error || "未知错误"}`
    );
  }

  const data: ApiResponse = await res.json();

  if (!data.success || !data.response) {
    throw new Error(data.error || "API 返回内容为空");
  }

  return data.response;
}

// ============================================================
// Fallback：关键词匹配（API 失败时使用）
// ============================================================
function getFallbackResponse(
  grade: string,
  userInput: string,
  context: ChatContext
): { response: string; context: ChatContext } {
  const isFollowUpInput = isFollowUp(userInput);

  // --- 情况1：追问（在已有话题上深入） ---
  if (isFollowUpInput && context.lastTopic) {
    if (context.isDefaultTopic) {
      const followUps = genericFollowUps[grade];
      if (followUps && context.lastTopicTier < followUps.length) {
        return {
          response: followUps[context.lastTopicTier],
          context: {
            ...context,
            lastTopicTier: context.lastTopicTier + 1,
            topicExhausted: false,
          },
        };
      }
    } else {
      const gradeKeywords = keywordResponses[grade];
      if (gradeKeywords) {
        const topicResponses = gradeKeywords[context.lastTopic];
        if (topicResponses && context.lastTopicTier < topicResponses.length) {
          return {
            response: topicResponses[context.lastTopicTier],
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
      context: { ...EMPTY_CONTEXT, topicExhausted: true },
    };
  }

  // --- 情况2：新问题 —— 关键词匹配 ---
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

  // --- 情况3：默认回复 ---
  const defaultTiers = defaultResponses[grade] || defaultResponses.freshman;
  return {
    response: defaultTiers[0],
    context: {
      lastTopic: grade,
      lastTopicTier: 1,
      isDefaultTopic: true,
      topicExhausted: false,
    },
  };
}

// ============================================================
// 核心函数：获取 AI 回复（async + API 中转 + Fallback 兜底）
// ============================================================
export interface GetResponseOptions {
  /** 历史对话（用于多轮上下文） */
  history?: HistoryMessage[];
}

export interface GetResponseResult {
  /** AI 回复内容（已处理"试试追问"等附加文案） */
  response: string;
  /** 更新后的上下文（用于本地追踪） */
  context: ChatContext;
  /** 是否走了 AI（false = 走了 fallback） */
  fromAI: boolean;
  /** 错误信息（如果 fallback 触发） */
  error?: string;
}

/**
 * 异步获取 AI 回复
 *
 * 调用流程：
 * 1. 调用 Next.js /api/chat 路由（服务端中转调智谱）
 * 2. 成功 → 返回 AI 回复
 * 3. 失败 → fallback 到关键词匹配
 *
 * @param grade 年级 ID
 * @param userInput 用户输入
 * @param context 当前对话上下文
 * @param options.history 历史消息（用于 AI 多轮对话）
 */
export async function getResponse(
  grade: string,
  userInput: string,
  context: ChatContext,
  options: GetResponseOptions = {}
): Promise<GetResponseResult> {
  const { history = [] } = options;

  // ── 1️⃣ 调用 /api/chat 路由（服务端中转智谱） ──
  try {
    const aiResponse = await callChatAPI(grade, userInput, history);

    // ⚠️ 保险措施：去重"试试追问"提示
    // 即使 prompt 说了只加 1 次，AI 偶尔还是会加 2-3 次
    // 这里把"试试追问"相关的句子去重，只保留第一次出现的
    const finalResponse = dedupeFollowHints(aiResponse);

    return {
      response: finalResponse,
      context: {
        ...context,
        // AI 模式下不更新 topicExhausted，让用户可以自由追问
        topicExhausted: false,
      },
      fromAI: true,
    };
  } catch (err) {
    // ── 2️⃣ Fallback 到关键词匹配 ──
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn("[chatResponses] API 路由调用失败,fallback 到关键词匹配:", errorMessage);

    const fallback = getFallbackResponse(grade, userInput, context);

    return {
      ...fallback,
      fromAI: false,
      error: errorMessage,
    };
  }
}
