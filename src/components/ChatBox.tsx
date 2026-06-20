"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getResponse, type ChatContext } from "@/lib/chatResponses";
import { getGradeConfig, getQuickPrompts } from "@/data/grades";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  grade: string;
  gradeLabel: string;
  placeholder?: string;
}

// ============================================================
// localStorage persistence helpers
// ============================================================
const STORAGE_KEY_PREFIX = "futuregoose-chat";

function getStorageKey(grade: string) {
  return `${STORAGE_KEY_PREFIX}-${grade}`;
}

interface PersistedState {
  messages: Message[];
  context: ChatContext;
}

function loadPersisted(grade: string): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getStorageKey(grade));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function savePersisted(grade: string, state: PersistedState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(grade), JSON.stringify(state));
  } catch {
    // quota exceeded or privacy mode — silently ignore
  }
}


export default function ChatBox({ grade, gradeLabel, placeholder }: ChatBoxProps) {
  // ── Server-safe defaults (must match SSR output exactly) ──
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [chatContext, setChatContext] = useState<ChatContext>({
    lastTopic: null,
    lastTopicTier: 0,
    isDefaultTopic: false,
    topicExhausted: false,
  });
  const [hydrated, setHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Track whether user is scrolled near bottom (for smart auto-scroll)
  const [isAtBottom, setIsAtBottom] = useState(true);

  const config = getGradeConfig(grade);
  const prompts = getQuickPrompts(grade);

  // ── Hydrate from localStorage once after mount ──
  useEffect(() => {
    const saved = loadPersisted(grade);
    if (saved) {
      setMessages(saved.messages);
      setChatContext(saved.context);
      setShowPrompts(saved.messages.length === 0);
    }
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Rehydrate when grade prop changes ──
  const prevGradeRef = useRef(grade);
  useEffect(() => {
    if (prevGradeRef.current === grade) return;
    prevGradeRef.current = grade;
    const saved = loadPersisted(grade);
    if (saved) {
      setMessages(saved.messages);
      setChatContext(saved.context);
      setShowPrompts(saved.messages.length === 0);
    } else {
      setMessages([]);
      setChatContext({
        lastTopic: null,
        lastTopicTier: 0,
        isDefaultTopic: false,
        topicExhausted: false,
      });
      setShowPrompts(true);
    }
  }, [grade]);

  // Persist messages + context to localStorage on every meaningful change
  useEffect(() => {
    if (!hydrated) return; // don't persist until after initial hydration
    if (!loading) {
      // don't persist while streaming (placeholder message)
      savePersisted(grade, { messages, context: chatContext });
    }
  }, [messages, chatContext, loading, grade, hydrated]);

  // ── Smart auto-scroll: only scroll to bottom if user was already near it ──
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Within 80px of bottom = "at bottom"
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 80);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Only auto-scroll when new messages arrive AND user is at bottom (or initial load)
    if (!isAtBottom && messages.length > 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAtBottom]);

  // ── Auto-resize textarea based on content ──
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`; // max ~5 lines
  }, [input]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const assistantPlaceholder: Message = { role: "assistant", content: "" };

    // Batch 1: add both messages, clear input, set loading, hide prompts
    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setInput("");
    setLoading(true);
    setShowPrompts(false);

    // Simulate API call delay (1-2s for realism)
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const { response, context: newContext } = getResponse(grade, text, chatContext);
    const topicExhausted = newContext.topicExhausted;
    const finalResponse = topicExhausted
      ? response
      : response + "\n\n试试追问我「还有呢」";

    // Batch 2: update assistant message, context, show prompts, loading
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        content: finalResponse,
      };
      return updated;
    });
    setChatContext(newContext);
    if (topicExhausted) {
      setShowPrompts(true);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

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
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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

        {messages.map((msg, i) => (
          <div
            key={i}
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
              {msg.content || (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: "400ms" }}
                  />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
