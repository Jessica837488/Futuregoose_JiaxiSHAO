"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// Hook: useAutoScroll
// Smart auto-scroll for chat message containers.
//
// - Tracks scroll position: "at bottom" = within THRESHOLD px of end
// - Only auto-scrolls when new content arrives AND user is already near bottom
// - Prevents interrupting users who are scrolling up to read history
// ============================================================

const SCROLL_BOTTOM_THRESHOLD = 80; // pixels

export interface UseAutoScrollOptions {
  /** When this changes and user is at bottom, scroll into view */
  dep?: unknown;
}

export interface UseAutoScrollReturn {
  /** Attach this ref to the scrollable container div */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Attach this ref to the sentinel element (last child of messages) */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Programmatically force scroll to bottom */
  scrollToBottom: () => void;
}

export function useAutoScroll({ dep }: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // ── Track scroll position ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < SCROLL_BOTTOM_THRESHOLD);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Auto-scroll on dependency change ──
  useEffect(() => {
    if (!isAtBottom) return; // don't interrupt user reading history
    sentinelRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep, isAtBottom]);

  // ── Force scroll (e.g. after sending a message) ──
  const scrollToBottom = useCallback(() => {
    sentinelRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return { containerRef, sentinelRef, scrollToBottom };
}
