"use client";

import { useRef, useState, useCallback } from "react";
import type { HistoryMessage } from "@/lib/chatResponses";

/**
 * useChatStream — 封装与 /api/chat 流式端点的交互
 *
 * 使用场景：
 *   组件挂载时调用 hook 拿到 { stream, isStreaming, error, abort }
 *   用户发消息时调用 stream(grade, userInput, history, onDelta)
 *   onDelta(delta) 会在每个 SSE chunk 到达时被调用
 *   调用 abort() 可以中止当前请求
 *
 * SSE 数据格式（来自 /api/chat stream=true）：
 *   data: {"delta": "你", "done": false}\n\n
 *   data: {"delta": "好", "done": false}\n\n
 *   ...
 *   data: {"done": true}\n\n
 *   data: {"error": "...", "done": true}\n\n
 */
export interface UseChatStreamResult {
  /** 是否正在流式接收 */
  isStreaming: boolean;
  /** 错误信息（流式过程中出错时） */
  error: string | null;
  /**
   * 发起一次流式请求
   * @param grade 年级 ID
   * @param userInput 用户输入
   * @param history 历史消息
   * @param onDelta 每收到一段 delta 文本时回调
   * @returns Promise<{ fullText: string, error?: string }> 完整文本
   */
  stream: (
    grade: string,
    userInput: string,
    history: HistoryMessage[],
    onDelta: (delta: string) => void
  ) => Promise<{ fullText: string; error?: string }>;
  /** 中止当前请求 */
  abort: () => void;
}

export function useChatStream(): UseChatStreamResult {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 用 ref 持有 AbortController，让 abort 可以在闭包外访问
  const abortRef = useRef<AbortController | null>(null);

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
    ): Promise<{ fullText: string; error?: string }> => {
      setError(null);
      setIsStreaming(true);

      // 创建新的 AbortController
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
          // 尝试解析错误信息
          const errData = await res.json().catch(() => ({}));
          const errMsg =
            (errData as { error?: string }).error ||
            `HTTP ${res.status}`;
          setError(errMsg);
          return { fullText: "", error: errMsg };
        }

        if (!res.body) {
          const errMsg = "响应为空";
          setError(errMsg);
          return { fullText: "", error: errMsg };
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // 逐 chunk 读取
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // 按 \n\n 分割 SSE 事件
          const events = buffer.split("\n\n");
          buffer = events.pop() || ""; // 最后一段不完整，留到下次

          for (const event of events) {
            // 提取 data: 后面的内容
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
                };

                if (data.error) {
                  setError(data.error);
                  return { fullText, error: data.error };
                }
                if (data.done) {
                  // 正常结束
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

        // 正常关闭
        return { fullText };
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // 用户主动中止，不算错误
          return { fullText };
        }
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(errMsg);
        return { fullText, error: errMsg };
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    []
  );

  return { isStreaming, error, stream, abort };
}
