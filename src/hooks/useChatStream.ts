"use client";

import { useRef, useState, useCallback } from "react";
import type { HistoryMessage } from "@/lib/chatResponses";
import {
  type ChatError,
  type ChatErrorType,
  classifyHttpError,
  classifyNetworkError,
  createChatError,
} from "@/lib/errors";

/**
 * useChatStream — 封装与 /api/chat 流式端点的交互
 *
 * 使用场景：
 *   const { isStreaming, error, stream, abort, clearError } = useChatStream();
 *   await stream(grade, input, history, onDelta);
 *   onDelta(delta) 会在每个 SSE chunk 到达时被调用
 *
 * SSE 数据格式（来自 /api/chat stream=true）：
 *   data: {"delta": "你", "done": false}\n\n
 *   ...
 *   data: {"done": true}\n\n
 *   data: {"error": "...", "type": "RATE_LIMIT", "done": true}\n\n
 */
export interface UseChatStreamResult {
  /** 是否正在流式接收 */
  isStreaming: boolean;
  /** 当前的错误状态（null = 无错误） */
  error: ChatError | null;
  /**
   * 发起一次流式请求
   * @param grade 年级 ID
   * @param userInput 用户输入
   * @param history 历史消息
   * @param onDelta 每收到一段 delta 文本时回调
   * @returns Promise<{ fullText, chatError? }> 完整文本 + 错误信息
   */
  stream: (
    grade: string,
    userInput: string,
    history: HistoryMessage[],
    onDelta: (delta: string) => void
  ) => Promise<{ fullText: string; chatError?: ChatError }>;
  /** 中止当前请求 */
  abort: () => void;
  /** 清除错误状态（用于 Toast 关闭） */
  clearError: () => void;
}

export function useChatStream(): UseChatStreamResult {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const stream = useCallback(
    async (
      grade: string,
      userInput: string,
      history: HistoryMessage[],
      onDelta: (delta: string) => void
    ): Promise<{ fullText: string; chatError?: ChatError }> => {
      setError(null);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      let fullText = "";

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade, userInput, history, stream: true }),
          signal: controller.signal,
        });

        if (!res.ok) {
          // 尝试解析 { error, type, details }
          const errData = await res.json().catch(() => ({}));
          const technicalDetail =
            (errData as { error?: string; details?: string }).error ||
            (errData as { details?: string }).details ||
            `HTTP ${res.status}`;
          const errType = (errData as { type?: ChatErrorType }).type;

          const chatError = errType
            ? createChatError(errType, technicalDetail)
            : classifyHttpError(res.status, technicalDetail);

          setError(chatError);
          return { fullText: "", chatError };
        }

        if (!res.body) {
          const chatError = createChatError("EMPTY", "响应为空");
          setError(chatError);
          return { fullText: "", chatError };
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            const lines = event.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (!payload) continue;

              try {
                const data = JSON.parse(payload) as {
                  delta?: string;
                  done?: boolean;
                  error?: string;
                  type?: ChatErrorType;
                };

                if (data.error) {
                  const errType = data.type || "SERVER";
                  const chatError = createChatError(errType, data.error);
                  setError(chatError);
                  return { fullText, chatError };
                }
                if (data.done) {
                  return { fullText };
                }
                if (data.delta) {
                  fullText += data.delta;
                  onDelta(data.delta);
                }
              } catch {
                // 忽略解析失败的 chunk
              }
            }
          }
        }

        return { fullText };
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return { fullText };
        }
        const chatError = classifyNetworkError(err);
        setError(chatError);
        return { fullText, chatError };
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    []
  );

  return { isStreaming, error, stream, abort, clearError };
}
