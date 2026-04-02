// components/ui/Loading.tsx
import { cn } from "@/lib/utils" // ← optional: if you have a cn utility for classNames (from shadcn/ui or similar)

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  fullScreen?: boolean
  className?: string
}

/**
 * Simple reusable loading spinner with optional text
 */
export function LoadingSpinner({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  }[size]

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "animate-spin rounded-full border-t-black border-gray-200",
              sizeClasses,
              className
            )}
          />
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-black border-gray-200",
          sizeClasses
        )}
      />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )
}