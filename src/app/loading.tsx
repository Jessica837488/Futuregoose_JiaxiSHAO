/**
 * 首页 loading.tsx — 路由级骨架屏
 *
 * Next.js App Router 约定：
 * 同一目录下 `loading.tsx` 会自动包裹 `page.tsx`，
 * 路由加载期间 (Suspense 等待数据 / 客户端 hydration) 显示此组件
 */
import HomeContentSkeleton from "@/components/HomeContentSkeleton";

export default function Loading() {
  return <HomeContentSkeleton />;
}
