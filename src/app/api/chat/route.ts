// ============================================================
// /api/chat — 智谱 AI 中转路由
// ============================================================
// 设计目的：
//   1. API Key 只在服务端（不在前端 JS 暴露）
//   2. 接收前端传来的年级+历史+用户输入
//   3. 调用智谱 GLM-4-Flash，返回 AI 回复
//
// 数据流：
//   前端 ChatBox → /api/chat (本路由) → 智谱 API → 返回 AI 回复
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt } from "@/lib/prompts";

// 强制此路由在服务端运行，不被静态化
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// 类型定义
// ============================================================
interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  grade: string;
  userInput: string;
  history?: HistoryMessage[];
}

interface ZhipuChoice {
  message: {
    role: string;
    content: string;
  };
}

interface ZhipuResponse {
  choices: ZhipuChoice[];
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// ============================================================
// 智谱 API 配置
// ============================================================
const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const ZHIPU_MODEL = "glm-4-flash";

// ============================================================
// POST /api/chat
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // ── 1. 解析请求体 ──
    const body: ChatRequest = await request.json();
    const { grade, userInput, history = [] } = body;

    // ── 2. 校验参数 ──
    if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
      return NextResponse.json(
        { error: "userInput 不能为空" } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    if (userInput.length > 2000) {
      return NextResponse.json(
        { error: "userInput 太长（限制 2000 字符）" } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    if (history.length > 20) {
      return NextResponse.json(
        { error: "history 太长（限制 20 轮）" } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // ── 3. 读取服务端 API Key ──
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) {
      console.error("[api/chat] GLM_API_KEY 未配置");
      return NextResponse.json(
        { error: "服务端未配置 API Key，请联系管理员" } satisfies ErrorResponse,
        { status: 500 }
      );
    }

    // ── 4. 构造 messages 数组 ──
    const messages: HistoryMessage[] = [
      { role: "user", content: getSystemPrompt(grade) },
      ...history,
      { role: "user", content: userInput.trim() },
    ];

    // ── 5. 调用智谱 API ──
    const res = await fetch(ZHIPU_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ZHIPU_MODEL,
        messages,
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[api/chat] 智谱 API 错误 (${res.status}):`, errText);
      return NextResponse.json(
        {
          error: `智谱 API 调用失败 (${res.status})`,
          details: errText.slice(0, 500),
        } satisfies ErrorResponse,
        { status: 502 }
      );
    }

    // ── 6. 解析响应 ──
    const data: ZhipuResponse = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[api/chat] 智谱返回内容为空:", JSON.stringify(data).slice(0, 200));
      return NextResponse.json(
        { error: "智谱 API 返回为空" } satisfies ErrorResponse,
        { status: 502 }
      );
    }

    // ── 7. 返回成功响应 ──
    return NextResponse.json({
      success: true,
      response: content.trim(),
      usage: {
        // 智谱 API 会在响应中包含 usage 信息，但为了简单先省略
      },
    });
  } catch (err) {
    // ── 异常处理 ──
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[api/chat] 路由异常:", errorMessage);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        details: errorMessage,
      } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/chat — 健康检查（可选）
// ============================================================
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "未来鹅 AI 中转路由运行中",
    model: ZHIPU_MODEL,
    timestamp: new Date().toISOString(),
  });
}
