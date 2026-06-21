// ============================================================
// 错误类型体系 —— 把后端/网络的"技术语言"翻译成"用户语言"
// ============================================================
// 设计思路：
//   1. 单一来源：所有错误都归一为 ChatError
//   2. 类型化：每种错误有 type + userMessage + retryable
//   3. UI 友好：直接拿 userMessage 展示给用户
//   4. 可重试：retryable=true 时 UI 显示"重试"按钮
//
// 错误类型清单：
//   - NETWORK       网络问题（断网/超时/DNS 失败）
//   - UNAUTHORIZED  API Key 失效（401）
//   - RATE_LIMIT    触发限流（429）
//   - SERVER        服务端 5xx 错误
//   - EMPTY         AI 返回空内容
//   - TOO_LONG      输入过长
//   - UNKNOWN       其他未知错误
// ============================================================

export type ChatErrorType =
  | "NETWORK"
  | "UNAUTHORIZED"
  | "RATE_LIMIT"
  | "SERVER"
  | "EMPTY"
  | "TOO_LONG"
  | "UNKNOWN";

export interface ChatError {
  type: ChatErrorType;
  /** 面向用户的中文提示（可直接展示） */
  userMessage: string;
  /** 是否可重试 */
  retryable: boolean;
  /** 技术详情（仅打 log 用，不展示给用户） */
  technicalDetail?: string;
}

// ============================================================
// 用户友好文案配置
// ============================================================
const ERROR_MESSAGES: Record<ChatErrorType, { text: string; retryable: boolean }> = {
  NETWORK: {
    text: "网络好像走神了～ 请检查网络连接后重试 🌐",
    retryable: true,
  },
  UNAUTHORIZED: {
    text: "服务授权出问题啦，管理员正在赶来的路上 🛠️",
    retryable: false,
  },
  RATE_LIMIT: {
    text: "请求太频繁啦，让我喘口气～ 几秒后再试试 ⏳",
    retryable: true,
  },
  SERVER: {
    text: "AI 服务打了个盹，请稍后再试 ☕",
    retryable: true,
  },
  EMPTY: {
    text: "AI 这会儿脑袋空空，换个问法试试？🤔",
    retryable: true,
  },
  TOO_LONG: {
    text: "问题太长啦（超过 2000 字），分几次问我吧～ ✂️",
    retryable: false,
  },
  UNKNOWN: {
    text: "出错了，请重试一下～ 🦢",
    retryable: true,
  },
};

// ============================================================
// 工厂函数
// ============================================================
export function createChatError(
  type: ChatErrorType,
  technicalDetail?: string
): ChatError {
  return {
    type,
    userMessage: ERROR_MESSAGES[type].text,
    retryable: ERROR_MESSAGES[type].retryable,
    technicalDetail,
  };
}

// ============================================================
// 错误分类器：把 HTTP status / 网络异常 翻译成 ChatError
// ============================================================
export function classifyHttpError(status: number, technicalDetail?: string): ChatError {
  if (status === 401 || status === 403) {
    return createChatError("UNAUTHORIZED", technicalDetail);
  }
  if (status === 429) {
    return createChatError("RATE_LIMIT", technicalDetail);
  }
  if (status >= 500) {
    return createChatError("SERVER", technicalDetail);
  }
  if (status === 400) {
    return createChatError("TOO_LONG", technicalDetail);
  }
  return createChatError("UNKNOWN", technicalDetail);
}

/** 把 fetch 抛出的异常（断网/超时）归类为网络错误 */
export function classifyNetworkError(err: unknown): ChatError {
  const technicalDetail = err instanceof Error ? err.message : String(err);
  return createChatError("NETWORK", technicalDetail);
}
