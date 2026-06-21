// ============================================================
// /api/chat — 智谱 AI 中转路由（流式输出版本）
// ============================================================
// 设计目的：
//   1. API Key 只在服务端（不在前端 JS 暴露）
//   2. 接收前端传来的年级+历史+用户输入
//   3. 调用智谱 GLM-4-Flash 的 stream 模式
//   4. 把 AI 回复的每个 token 实时转发给前端（打字机效果）
//
// 数据流：
//   前端 ChatBox (fetch + ReadableStream) ← 本路由 (ReadableStream)
//                                          ← 智谱 stream API
//
// 请求体新增 stream 字段：
//   { grade, userInput, history, stream: true }
//   stream: true  → SSE 风格流式响应（每行: data: {delta: "..."}）
//   stream: false → 兼容老逻辑，返回 JSON
// ============================================================

import { NextRequest } from "next/server";
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
  stream?: boolean;
}

interface ZhipuStreamChunk {
  choices?: Array<{
    delta?: { content?: string };
    finish_reason?: string;
  }>;
}

// ============================================================
// 智谱 API 配置
// ============================================================
const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const ZHIPU_MODEL = "glm-4-flash";

// ============================================================
// 共享：构造 messages 数组
// ============================================================
function buildMessages(
  grade: string,
  userInput: string,
  history: HistoryMessage[]
): HistoryMessage[] {
  return [
    { role: "user", content: getSystemPrompt(grade) },
    ...history,
    { role: "user", content: userInput.trim() },
  ];
}

// ============================================================
// 共享：参数校验
// ============================================================
function validateRequest(body: ChatRequest):
  | { ok: true; data: ChatRequest }
  | { ok: false; status: number; error: string } {
  const { userInput, history = [], stream = false } = body;

  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    return { ok: false, status: 400, error: "userInput 不能为空" };
  }
  if (userInput.length > 2000) {
    return { ok: false, status: 400, error: "userInput 太长（限制 2000 字符）" };
  }
  if (history.length > 20) {
    return { ok: false, status: 400, error: "history 太长（限制 20 轮）" };
  }

  return { ok: true, data: { grade: body.grade, userInput, history, stream } };
}

// ============================================================
// POST /api/chat
// ============================================================
export async function POST(request: NextRequest) {
  // ── 1. 解析请求体 ──
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "请求体不是合法 JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 2. 校验参数 ──
  const validation = validateRequest(body);
  if (!validation.ok) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { status: validation.status, headers: { "Content-Type": "application/json" } }
    );
  }
  const { grade, userInput, history = [], stream = false } = validation.data;

  // ── 3. 读取服务端 API Key ──
  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    console.error("[api/chat] GLM_API_KEY 未配置");
    return new Response(
      JSON.stringify({ error: "服务端未配置 API Key，请联系管理员" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 4. 分支：流式 vs 非流式 ──
  if (stream) {
    return handleStream(grade, userInput, history, apiKey);
  }
  return handleNonStream(grade, userInput, history, apiKey);
}

// ============================================================
// 流式处理：调智谱 stream API → 实时转发 delta
// ============================================================
function handleStream(
  grade: string,
  userInput: string,
  history: HistoryMessage[],
  apiKey: string
): Response {
  const messages = buildMessages(grade, userInput, history);

  // 创建 TransformStream 用于把智谱的 chunk 转成 SSE 格式
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // 异步执行：不阻塞响应返回
  (async () => {
    let res: Response;
    try {
      res = await fetch(ZHIPU_API_URL, {
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
          stream: true, // 关键：开启流式
        }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[api/chat stream] 智谱连接失败:", msg);
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({ error: "AI 服务连接失败", done: true })}\n\n`
        )
      );
      await writer.close();
      return;
    }

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => "");
      console.error(`[api/chat stream] 智谱错误 (${res.status}):`, errText);
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({ error: `AI 服务错误 (${res.status})`, done: true })}\n\n`
        )
      );
      await writer.close();
      return;
    }

    // 解析 SSE 流（智谱返回的是 OpenAI 兼容 SSE 格式：data: {json}\n\n）
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 按双换行分割 SSE 事件
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // 最后一段可能不完整，留到下次

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;

          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            // 智谱/OpenAI 风格的结束标记
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
            );
            continue;
          }

          try {
            const chunk: ZhipuStreamChunk = JSON.parse(payload);
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              // 转发 delta 给前端
              await writer.write(
                encoder.encode(
                  `data: ${JSON.stringify({ delta, done: false })}\n\n`
                )
              );
            }
            // 检测到 finish_reason 也算结束
            if (chunk.choices?.[0]?.finish_reason) {
              await writer.write(
                encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
              );
            }
          } catch {
            // 忽略解析失败的行
          }
        }
      }

      // 流结束再发一次 done（兜底）
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[api/chat stream] 读取流异常:", msg);
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({ error: "AI 流中断", done: true })}\n\n`
        )
      );
    } finally {
      await writer.close();
    }
  })().catch((err) => {
    console.error("[api/chat stream] 未知异常:", err);
    writer.close().catch(() => {});
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // 禁用 Nginx 缓冲
    },
  });
}

// ============================================================
// 非流式处理：保留原 JSON 逻辑作为 fallback
// ============================================================
interface ZhipuChoice {
  message: {
    role: string;
    content: string;
  };
}

interface ZhipuResponse {
  choices: ZhipuChoice[];
}

async function handleNonStream(
  grade: string,
  userInput: string,
  history: HistoryMessage[],
  apiKey: string
): Promise<Response> {
  const messages = buildMessages(grade, userInput, history);

  try {
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
      return new Response(
        JSON.stringify({
          error: `智谱 API 调用失败 (${res.status})`,
          details: errText.slice(0, 500),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: ZhipuResponse = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error(
        "[api/chat] 智谱返回内容为空:",
        JSON.stringify(data).slice(0, 200)
      );
      return new Response(
        JSON.stringify({ error: "智谱 API 返回为空" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, response: content.trim() }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[api/chat] 路由异常:", errorMessage);
    return new Response(
      JSON.stringify({ error: "服务器内部错误", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ============================================================
// GET /api/chat — 健康检查（可选）
// ============================================================
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "未来鹅 AI 中转路由运行中（支持流式输出）",
      model: ZHIPU_MODEL,
      timestamp: new Date().toISOString(),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
