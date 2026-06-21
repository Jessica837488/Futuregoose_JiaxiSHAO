// ============================================================
// RAG 检索 —— 从知识库中找出最相关的 chunks
// ============================================================
// 算法：BM25 简化版 + 关键词加权
//
// 设计理由：
//   1. 中文短文本，BM25 精度足够
//   2. 0 外部依赖（不需要 embedding API / 向量数据库）
//   3. 浏览器端运行，0 服务器成本
//   4. 关键词完全匹配加权 3x，title 命中加权 2x
//
// 流程：
//   1. 分词（中文按字符 + 提取已定义的 keywords）
//   2. 对每个 chunk 计算 BM25 分数
//   3. 关键词命中额外加分
//   4. 返回 top-K
// ============================================================

import { allKnowledgeChunks, type KnowledgeChunk } from "@/data/knowledgeChunks";

export interface RetrievedChunk extends KnowledgeChunk {
  /** 检索分数（越大越相关） */
  score: number;
}

export interface SearchOptions {
  /** 返回数量，默认 3 */
  topK?: number;
  /** 分数阈值，低于此分数的丢弃 */
  minScore?: number;
}

// ============================================================
// 工具：中文分词（简化：单字 + 二元 + 关键词匹配）
// ============================================================

/**
 * 简易分词：把文本切成 token 数组
 * - 保留所有单字（中文字符）
 * - 提取已定义的关键词（来自 chunks.keywords）
 * - 提取英文单词
 */
function tokenize(text: string, allKeywords: string[]): string[] {
  const tokens = new Set<string>();

  // 1. 单字（中文字符，2-3 字连续）
  const cleaned = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, " ");
  // 二元组合（bigram）—— 捕捉常见词
  for (let i = 0; i < cleaned.length - 1; i++) {
    const c1 = cleaned[i];
    const c2 = cleaned[i + 1];
    if (/[\u4e00-\u9fa5]/.test(c1) && /[\u4e00-\u9fa5]/.test(c2)) {
      tokens.add(c1 + c2);
    }
  }
  // 单词
  cleaned.split(/\s+/).forEach((w) => {
    if (w.length > 1) tokens.add(w);
  });

  // 2. 已定义关键词（高优先级）
  for (const kw of allKeywords) {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      tokens.add(`__kw__${kw}`);
    }
  }

  return Array.from(tokens);
}

// ============================================================
// 收集所有已定义关键词
// ============================================================
const ALL_KEYWORDS = Array.from(
  new Set(allKnowledgeChunks.flatMap((c) => c.keywords))
);

// ============================================================
// BM25 简化版
// ============================================================
function bm25Score(
  queryTokens: string[],
  docTokens: string[],
  avgDocLen: number,
  idf: Map<string, number>
): number {
  const k1 = 1.5;
  const b = 0.75;
  const docLen = docTokens.length;
  let score = 0;

  // 词频
  const tf = new Map<string, number>();
  for (const t of docTokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }

  for (const qt of queryTokens) {
    const tfVal = tf.get(qt) || 0;
    if (tfVal === 0) continue;
    const idfVal = idf.get(qt) || 0;
    const numerator = tfVal * (k1 + 1);
    const denominator = tfVal + k1 * (1 - b + (b * docLen) / avgDocLen);
    score += idfVal * (numerator / denominator);
  }

  return score;
}

// ============================================================
// 预计算：所有 chunks 的 token 列表 + 词频统计
// ============================================================
interface IndexData {
  chunkTokens: Map<string, string[]>;
  avgDocLen: number;
  idf: Map<string, number>;
  /** 关键词 → chunks 索引的倒排表（用于关键词命中加分） */
  keywordIndex: Map<string, string[]>;
}

function buildIndex(): IndexData {
  const chunkTokens = new Map<string, string[]>();
  const df = new Map<string, number>(); // 文档频率
  const keywordIndex = new Map<string, string[]>();

  for (const chunk of allKnowledgeChunks) {
    const text = `${chunk.title} ${chunk.content}`;
    const tokens = tokenize(text, ALL_KEYWORDS);
    chunkTokens.set(chunk.id, tokens);

    // 统计 df
    const seen = new Set<string>();
    for (const t of tokens) {
      if (!seen.has(t)) {
        df.set(t, (df.get(t) || 0) + 1);
        seen.add(t);
      }
    }

    // 关键词倒排
    for (const kw of chunk.keywords) {
      if (!keywordIndex.has(kw)) keywordIndex.set(kw, []);
      keywordIndex.get(kw)!.push(chunk.id);
    }
  }

  // 计算 IDF
  const N = allKnowledgeChunks.length;
  const idf = new Map<string, number>();
  for (const [term, freq] of df) {
    idf.set(term, Math.log(1 + (N - freq + 0.5) / (freq + 0.5)));
  }

  // 平均文档长度
  let totalLen = 0;
  for (const tokens of chunkTokens.values()) totalLen += tokens.length;
  const avgDocLen = totalLen / N;

  return { chunkTokens, avgDocLen, idf, keywordIndex };
}

// 懒加载索引
let _index: IndexData | null = null;
function getIndex(): IndexData {
  if (!_index) _index = buildIndex();
  return _index;
}

// ============================================================
// 公开 API：检索 top-K 相关 chunks
// ============================================================
export function searchKnowledge(
  query: string,
  options: SearchOptions = {}
): RetrievedChunk[] {
  const { topK = 3, minScore = 0.5 } = options;

  if (!query.trim()) return [];

  const index = getIndex();
  const queryTokens = tokenize(query, ALL_KEYWORDS);

  // 计算每个 chunk 的分数
  const scored: RetrievedChunk[] = [];

  for (const chunk of allKnowledgeChunks) {
    const docTokens = index.chunkTokens.get(chunk.id) || [];
    let score = bm25Score(queryTokens, docTokens, index.avgDocLen, index.idf);

    // 关键词命中额外加分（基于 chunk.keywords）
    let keywordHits = 0;
    for (const kw of chunk.keywords) {
      if (query.toLowerCase().includes(kw.toLowerCase())) {
        keywordHits++;
        score += 2.0; // 关键词命中 +2
      }
    }
    // 标题命中额外加分
    if (query.toLowerCase().includes(chunk.title.toLowerCase().slice(0, 4))) {
      score += 1.5;
    }

    if (score >= minScore) {
      scored.push({ ...chunk, score });
    }
  }

  // 按分数降序
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

// ============================================================
// 工具：把检索结果格式化为可注入 prompt 的字符串
// ============================================================
export function formatRAGContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  const lines: string[] = [
    "【知识库检索结果（请基于以下信息回答，必要时引用编号）】",
    "",
  ];

  chunks.forEach((c, i) => {
    lines.push(`[${i + 1}] ${c.title}`);
    lines.push(c.content);
    lines.push(`（来源：${c.source}）`);
    lines.push("");
  });

  lines.push("【回答要求】");
  lines.push("- 优先基于上述检索结果回答");
  lines.push("- 在回答末尾用「📚 参考：来源1, 来源3」格式标注引用");
  lines.push("- 如果检索结果与问题无关，请忽略并按你原本的知识回答");

  return lines.join("\n");
}
