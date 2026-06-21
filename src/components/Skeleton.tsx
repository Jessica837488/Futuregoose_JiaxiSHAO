/**
 * 通用骨架屏组件
 *
 * 使用方式：
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton variant="circle" className="w-10 h-10" />
 *   <Skeleton variant="text" className="w-full" />  // 文本行
 */
type SkeletonVariant = "rect" | "circle" | "text";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

export default function Skeleton({
  variant = "rect",
  className = "",
}: SkeletonProps) {
  // 文本行默认窄高 + 胶囊圆角
  const variantClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "text"
        ? "rounded h-3"
        : "rounded-md";

  return (
    <div
      className={`bg-gray-200/70 animate-shimmer ${variantClass} ${className}`}
      aria-hidden="true"
    />
  );
}
