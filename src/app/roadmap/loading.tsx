/**
 * /roadmap 路由 loading.tsx
 * 成长路径页面 (5 个阶段卡片) 的骨架占位
 */
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center pt-8 px-4 pb-16">
      {/* Hero */}
      <div className="text-center mb-8 max-w-2xl flex flex-col items-center">
        <Skeleton variant="circle" className="w-16 h-16 mb-5" />
        <Skeleton className="h-9 w-56 mb-3" />
        <Skeleton variant="text" className="w-[28rem] max-w-full" />
      </div>

      {/* 5 个阶段卡片骨架 (大一/大二/大三/大四/留学生) */}
      <div className="w-full max-w-3xl space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Skeleton variant="circle" className="w-10 h-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton variant="text" className="w-24" />
              </div>
            </div>
            {/* 3 个 phase 行 */}
            <div className="space-y-3 pl-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="space-y-1.5">
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton variant="text" className="w-5/6" />
                  <Skeleton variant="text" className="w-4/6" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
