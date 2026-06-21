import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 API Route 用于智谱 API 中转（保护 API Key）
  // 从静态导出 (output: "export") 改为 Vercel Serverless 部署
  // 这样智谱 API Key 只在服务端使用，不会暴露到前端
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
