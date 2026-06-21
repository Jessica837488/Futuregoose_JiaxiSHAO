"use client";

import { useEffect } from "react";
import type { ChatError } from "@/lib/errors";

/**
 * ErrorToast — 顶部错误提示横幅
 *
 * 特性：
 *  - 自动 8 秒后淡出消失
 *  - 用户可手动关闭
 *  - 可选 onRetry 重试按钮（仅 retryable 错误）
 *  - 错误类型 → 不同图标 + 配色
 */
interface ErrorToastProps {
  error: ChatError | null;
  onDismiss: () => void;
  onRetry?: () => void;
}

const ICON_MAP: Record<ChatError["type"], string> = {
  NETWORK: "📡",
  UNAUTHORIZED: "🔐",
  RATE_LIMIT: "⏳",
  SERVER: "🛠️",
  EMPTY: "🤔",
  TOO_LONG: "✂️",
  UNKNOWN: "⚠️",
};

const COLOR_MAP: Record<ChatError["type"], string> = {
  NETWORK: "bg-orange-50 border-orange-200 text-orange-800",
  UNAUTHORIZED: "bg-red-50 border-red-200 text-red-800",
  RATE_LIMIT: "bg-yellow-50 border-yellow-200 text-yellow-800",
  SERVER: "bg-red-50 border-red-200 text-red-800",
  EMPTY: "bg-blue-50 border-blue-200 text-blue-800",
  TOO_LONG: "bg-purple-50 border-purple-200 text-purple-800",
  UNKNOWN: "bg-gray-100 border-gray-200 text-gray-800",
};

export default function ErrorToast({ error, onDismiss, onRetry }: ErrorToastProps) {
  // 自动消失
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [error, onDismiss]);

  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`mx-4 mt-3 flex items-start gap-3 px-4 py-3 rounded-xl border ${COLOR_MAP[error.type]} animate-slideDown`}
    >
      <span className="text-xl flex-shrink-0" aria-hidden="true">
        {ICON_MAP[error.type]}
      </span>
      <div className="flex-1 text-sm leading-relaxed">
        {error.userMessage}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs font-medium rounded-md bg-white border border-current hover:bg-current hover:text-white transition-colors"
          >
            重试
          </button>
        )}
        <button
          onClick={onDismiss}
          aria-label="关闭提示"
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
