/**
 * /knowledge 路由 loading.tsx
 * 知识库页面 (4 大模块手风琴) 的骨架占位
 */
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center pt-8 px-4 pb-16">
      {/* Hero */}
      <div className="text-center mb-10 max-w-2xl flex flex-col items-center">
        <Skeleton variant="circle" className="w-16 h-16 mb-5" />
        <Skeleton className="h-9 w-56 mb-3" />
        <Skeleton variant="text" className="w-96 max-w-full" />
      </div>

      {/* 4 个手风琴模块骨架 */}
      <div className="w-full max-w-3xl space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="w-9 h-9" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton variant="text" className="w-2/3" />
              </div>
              <Skeleton className="w-6 h-6 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
