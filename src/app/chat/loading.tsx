/**
 * /chat 路由 loading.tsx
 * 进入对话页时先显示骨架，避免空屏闪烁
 */
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)] max-w-3xl mx-auto">
      {/* Header 占位 */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white/60 backdrop-blur-sm">
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>

      {/* 对话区占位 (4 条模拟消息) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* 居中欢迎位 */}
        <div className="text-center py-10 flex flex-col items-center gap-3">
          <Skeleton variant="circle" className="w-14 h-14" />
          <Skeleton className="h-6 w-44" />
          <Skeleton variant="text" className="w-80 max-w-full" />
        </div>

        {/* 用户消息 */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-56 rounded-2xl rounded-br-md" />
        </div>
        {/* AI 消息 */}
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-sm space-y-2">
            <Skeleton variant="text" className="w-72" />
            <Skeleton variant="text" className="w-60" />
            <Skeleton variant="text" className="w-48" />
          </div>
        </div>
        {/* AI 正在思考 */}
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-sm">
            <span className="flex items-center gap-1.5 py-1">
              {[0, 200, 400].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* 输入区占位 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white/60 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <Skeleton className="flex-1 h-10 rounded-xl" />
          <Skeleton className="h-10 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
