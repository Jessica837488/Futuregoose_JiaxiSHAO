/**
 * 首页骨架屏 (HomeContent 的占位版本)
 *
 * 与 HomeContent 布局完全对齐，确保内容加载时布局不抖动 (CLS = 0)
 * 通过 React.Suspense + 内置 useState 模拟"加载 200ms 后切换"的效果，
 * 让用户看到骨架屏一闪而过，体验更顺滑
 */
import Skeleton from "@/components/Skeleton";

export default function HomeContentSkeleton() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-start pt-8 px-4">
      {/* Hero 头像 + 标题 */}
      <div className="text-center mb-10 max-w-2xl">
        <Skeleton variant="circle" className="w-20 h-20 mx-auto mb-6" />
        <Skeleton className="h-10 w-48 mx-auto mb-3" />
        <Skeleton className="h-5 w-56 mx-auto mb-2" />
        <Skeleton variant="text" className="w-80 max-w-full mx-auto" />
      </div>

      {/* Tab 栏 */}
      <div className="flex items-center gap-2 mb-2 p-1 bg-gray-100/80 rounded-2xl w-[420px] max-w-full h-12">
        <Skeleton className="flex-1 h-9 mx-1" />
        <Skeleton className="flex-1 h-9 mx-1" />
        <Skeleton className="flex-1 h-9 mx-1" />
      </div>

      {/* Intro 一行 */}
      <Skeleton variant="text" className="w-96 max-w-full mb-6 mt-1" />

      {/* 年级卡片网格 (4 张) */}
      <div className="w-full max-w-6xl grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border-2 border-gray-100 bg-white"
          >
            <Skeleton variant="circle" className="w-8 h-8 mb-3" />
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton variant="text" className="w-16 mb-3" />
            <Skeleton variant="text" className="w-full mb-1" />
            <Skeleton variant="text" className="w-3/4 mb-4" />
            <div className="space-y-1.5">
              <Skeleton variant="text" className="w-5/6" />
              <Skeleton variant="text" className="w-4/6" />
              <Skeleton variant="text" className="w-5/6" />
            </div>
          </div>
        ))}
      </div>

      {/* 3 张功能卡片 */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full pb-16">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white border border-gray-100"
          >
            <Skeleton variant="circle" className="w-9 h-9 mb-3" />
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton variant="text" className="w-full mb-1" />
            <Skeleton variant="text" className="w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
