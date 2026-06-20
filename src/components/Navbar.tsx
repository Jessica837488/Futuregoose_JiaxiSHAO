"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/chat", label: "AI 对话" },
  { href: "/knowledge", label: "知识库" },
  { href: "/roadmap", label: "成长路径" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 路由变化时自动关闭菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ESC 键关闭菜单
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    },
    []
  );

  useEffect(() => {
    if (menuOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, handleKeyDown]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-sm font-bold shadow-md shadow-brand/30 group-hover:scale-105 transition-transform">
            🦢
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-800">
            未来<span className="text-brand">鹅</span>
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-bg text-brand shadow-sm"
                    : "text-gray-600 hover:text-brand hover:bg-brand-bg/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={menuOpen}
        >
          {/* Hamburger icon */}
          <svg
            className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${menuOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-slideDown">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-bg text-brand"
                      : "text-gray-600 hover:text-brand hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
