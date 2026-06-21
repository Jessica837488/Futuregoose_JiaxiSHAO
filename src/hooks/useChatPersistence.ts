"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatContext } from "@/lib/chatResponses";

// ============================================================
// Re-export Message type so consumers don't need to redefine it
// ============================================================
export interface Message {
  role: "user" | "assistant";
  content: string;
  /** 是否错误消息（用于错误卡渲染） */
  isError?: boolean;
  /** 错误类型 */
  errorType?: string;
  /** 引用的知识库来源（RAG 检索结果） */
  sources?: Array<{ id: string; title: string; source: string }>;
}

// ============================================================
// localStorage persistence — SSR-safe
// ============================================================
const STORAGE_KEY_PREFIX = "futuregoose-chat";

function getStorageKey(grade: string) {
  return `${STORAGE_KEY_PREFIX}-${grade}`;
}

export interface PersistedState {
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

/** Default empty chat context */
const EMPTY_CONTEXT: ChatContext = {
  lastTopic: null,
  lastTopicTier: 0,
  isDefaultTopic: false,
  topicExhausted: false,
};

// ============================================================
// Hook: useChatPersistence
// Manages chat messages + context persistence to localStorage.
//
// - Uses lazy hydration (useEffect) to avoid SSR mismatch.
// - Auto-persists on change with 300ms debounce.
// - Switches sessions when `grade` prop changes.
// - Suppresses persist while `loading` is true (avoids saving placeholder).
// ============================================================

export interface UseChatPersistenceOptions {
  /** Current grade ID — used as localStorage key suffix and triggers session switch */
  grade: string;
  /** When true, persistence is suppressed (e.g. streaming placeholder message) */
  loading?: boolean;
}

export interface UseChatPersistenceReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatContext: ChatContext;
  setChatContext: React.Dispatch<React.SetStateAction<ChatContext>>;
  showPrompts: boolean;
  setShowPrompts: React.Dispatch<React.SetStateAction<boolean>>;
  /** Whether initial localStorage hydration has completed */
  hydrated: boolean;
}

export function useChatPersistence({
  grade,
  loading = false,
}: UseChatPersistenceOptions): UseChatPersistenceReturn {
  // ── Server-safe defaults ──
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatContext, setChatContext] = useState<ChatContext>({ ...EMPTY_CONTEXT });
  const [showPrompts, setShowPrompts] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const prevGradeRef = useRef(grade);

  // ── Hydrate once after mount ──
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
      setChatContext({ ...EMPTY_CONTEXT });
      setShowPrompts(true);
    }
  }, [grade]);

  // ── Debounced persist (suppressed during loading) ──
  useEffect(() => {
    if (!hydrated || loading) return;
    const timer = setTimeout(() => {
      savePersisted(grade, { messages, context: chatContext });
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [messages, chatContext, loading, grade, hydrated]);

  return { messages, setMessages, chatContext, setChatContext, showPrompts, setShowPrompts, hydrated };
}
