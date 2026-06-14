"use client";

import { useState, useRef, useEffect } from "react";
import { getResponse, type ChatContext } from "@/lib/chatResponses";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  grade: string;
  gradeLabel: string;
  placeholder?: string;
}

const gradeConfig: Record<string, { label: string; emoji: string; color: string }> = {
  freshman: { label: "大一 · 探索期", emoji: "🌱", color: "bg-blue-100 text-blue-700" },
  sophomore: { label: "大二 · 定向期", emoji: "🌿", color: "bg-purple-100 text-purple-700" },
  junior: { label: "大三 · 积累期", emoji: "🌳", color: "bg-orange-100 text-orange-700" },
  senior: { label: "大四 · 冲刺期", emoji: "🌴", color: "bg-green-100 text-green-700" },
  master1: { label: "研一 · 适应期", emoji: "🔬", color: "bg-cyan-100 text-cyan-700" },
  master2: { label: "研二 · 积累期", emoji: "📑", color: "bg-violet-100 text-violet-700" },
  master3: { label: "研三 · 冲刺期", emoji: "🎯", color: "bg-rose-100 text-rose-700" },
  "overseas-early": { label: "留学初期", emoji: "🛫", color: "bg-teal-100 text-teal-700" },
  "overseas-mid": { label: "留学中期", emoji: "🎓", color: "bg-amber-100 text-amber-700" },
  "overseas-final": { label: "留学末期", emoji: "🏆", color: "bg-sky-100 text-sky-700" },
};

const quickPrompts: Record<string, string[]> = {
  freshman: [
    "腾讯是一家什么样的公司？",
    "互联网行业有哪些热门岗位？",
    "大一应该怎么规划大学生活？",
  ],
  sophomore: [
    "学计算机可以做什么方向？",
    "鹅厂的技术栈有哪些？",
    "怎么找到自己感兴趣的方向？",
  ],
  junior: [
    "鹅厂实习生的日常是怎样的？",
    "简历怎么写才能脱颖而出？",
    "技术面试一般问什么？",
  ],
  senior: [
    "鹅厂校招的完整流程是什么？",
    "如何准备群面和HR面？",
    "收到多个offer怎么选？",
  ],
  master1: [
    "研究生如何规划求职？",
    "科研还是就业怎么选？",
    "腾讯对研究生有什么期待？",
  ],
  master2: [
    "如何平衡科研和实习？",
    "研究生简历怎么写？",
    "技术岗位对研究生的要求？",
  ],
  master3: [
    "校招关键时间节点？",
    "论文和面试如何兼顾？",
    "研究方向和岗位怎么匹配？",
  ],
  "overseas-early": [
    "留学生如何了解国内行业？",
    "海归的求职优势是什么？",
    "需要提前做哪些准备？",
  ],
  "overseas-mid": [
    "海外经历如何写进简历？",
    "远程面试要注意什么？",
    "腾讯有哪些海归专属项目？",
  ],
  "overseas-final": [
    "海归校招时间线有什么不同？",
    "落户和签证政策？",
    "如何拿到满意的offer？",
  ],
};

export default function ChatBox({ grade, gradeLabel, placeholder }: ChatBoxProps) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const config = gradeConfig[grade] || gradeConfig.freshman;
  const prompts = quickPrompts[grade] || quickPrompts.freshman;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setShowPrompts(false);

    // Add placeholder for streaming simulation
    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    // Simulate API call delay (1-2s for realism)
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const { response, context: newContext } = getResponse(grade, text, chatContext);
    setChatContext(newContext);

    // 话题未耗尽时追加追问提示，耗尽时弹出快捷提问
    const finalResponse = newContext.topicExhausted
      ? response
      : response + "\n\n试试追问我「还有呢」";
    if (newContext.topicExhausted) {
      setShowPrompts(true);
    }

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        content: finalResponse,
      };
      return updated;
    });
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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-none text-sm bg-white transition-all"
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
