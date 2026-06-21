"use client";

import { useState, useRef, useEffect } from "react";
import { getResponse, type ChatContext } from "@/lib/chatResponses";
import { getGradeConfig, getQuickPrompts } from "@/data/grades";
import { useChatPersistence, type Message } from "@/hooks/useChatPersistence";
import { useAutoScroll } from "@/hooks/useAutoScroll";

// ============================================================
// Constants
// ============================================================
const TEXTAREA_MAX_HEIGHT = 120; // px, ~5 lines of text

// ============================================================
// Types
// ============================================================
interface ChatBoxProps {
  grade: string;
  gradeLabel: string;
  placeholder?: string;
}

// ============================================================
// Component
// ============================================================

export default function ChatBox({ grade, gradeLabel, placeholder }: ChatBoxProps) {
  // ── Hooks ──
  const {
    messages,
    setMessages,
    chatContext,
    setChatContext,
    showPrompts,
    setShowPrompts,
  } = useChatPersistence({ grade });

  const { containerRef, sentinelRef } = useAutoScroll({ dep: messages });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Derived data ──
  const config = getGradeConfig(grade);
  const prompts = getQuickPrompts(grade);

  // ── Auto-resize textarea ──
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [input]);

  // ── Send message logic ──
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const placeholderMsg: Message = { role: "assistant", content: "" };

    // Batch 1: add both messages, clear input, set loading, hide prompts
    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setInput("");
    setLoading(true);
    setShowPrompts(false);

    try {
      // ── 构造历史消息（最近 10 条，避免 token 过多） ──
      // 不包含当前 userMsg（已经作为最新 user input 传给 getResponse）
      const recentMessages = messages.slice(-10);
      const history = recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // ── 调用 AI（真 API 调用，~1-3 秒） ──
      const { response, context: newContext, fromAI, error } = await getResponse(
        grade,
        text,
        chatContext,
        { history }
      );

      // ⚠️ 不再追加"试试追问"提示
      // AI 在 prompt 中已经被要求自己追加"试试追问"，这里追加会重复
      const finalResponse = response;

      // Batch 2: update assistant message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: finalResponse };
        return updated;
      });
      setChatContext(newContext);
      if (newContext.topicExhausted) setShowPrompts(true);
    } catch (err) {
      // ── 异常处理（理论上 fallback 已处理，这里是兜底） ──
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[ChatBox] 异常:", errorMessage);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "抱歉，出了点小问题，请重试一下～ 🦢",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Event handlers ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  // ── Render ──
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] max-w-3xl mx-auto">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white/60 backdrop-blur-sm">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
        >
          {config.emoji} {config.label}
        </span>
      </div>

      {/* Messages area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🦢</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              你好！我是未来鹅 🦢
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              {gradeLabel || "我是一只会陪伴你成长的鹅，关于大学规划、职业方向、鹅厂的那些事儿，你都可以问问我～"}
            </p>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => {
          // AI 占位消息（content 为空 + loading 中）→ 显示 3 行骨架气泡
          const isAssistantPlaceholder =
            msg.role === "assistant" && !msg.content;
          return (
            <div
              key={`${msg.role}-${i}`}
              className={`flex animate-msg ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-brand text-white rounded-br-md"
                    : "bg-white border border-gray-100 shadow-sm text-gray-700 rounded-bl-md"
                }`}
              >
                {isAssistantPlaceholder ? (
                  <MessageBubbleSkeleton />
                ) : msg.content ? (
                  msg.content
                ) : (
                  <TypingIndicator />
                )}
              </div>
            </div>
          );
        })}
        <div ref={sentinelRef} />
      </div>

      {/* Quick prompts */}
      {showPrompts && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2 text-center">
            {messages.length === 0 ? "💡 试试问我这些：" : "💡 换个话题继续聊："}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="px-4 py-2 rounded-full text-sm border border-brand/20 text-brand bg-brand-bg/50 hover:bg-brand-bg transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white/60 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "输入你的问题，按 Enter 发送..."}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-none text-sm bg-white transition-all min-h-[40px] max-h-[120px]"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand text-white font-medium text-sm hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-brand/20 active:scale-95"
          >
            {loading ? "思考中..." : "发送"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          未来鹅 AI 陪伴体 · 你的职业成长伙伴 🦢
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

/** Animated typing dots shown while AI is "thinking" */
function TypingIndicator() {
  return (
    <span className="flex items-center gap-1.5 py-1">
      {[0, 200, 400].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

/** AI 回复中的骨架占位 (3 行气泡) */
function MessageBubbleSkeleton() {
  return (
    <div className="flex justify-start animate-msg">
      <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-sm space-y-2">
        <span className="block h-3 w-64 max-w-full rounded bg-gray-200/70 animate-shimmer" />
        <span className="block h-3 w-56 max-w-full rounded bg-gray-200/70 animate-shimmer" />
        <span className="block h-3 w-40 max-w-full rounded bg-gray-200/70 animate-shimmer" />
      </div>
    </div>
  );
}
