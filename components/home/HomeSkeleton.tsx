import { cn } from '@/lib/utils'

function Bone({ className }: { className?: string }) {
  return <div className={cn('rounded-lg skeleton-shimmer', className)} />
}

export function SectionSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border space-y-1.5">
        <Bone className="h-4 w-36" />
        <Bone className="h-3 w-52" />
      </div>
      {/* Content */}
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Bone className="h-4 w-3/5" />
              <Bone className="h-4 w-14 rounded-full" />
            </div>
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuickLinksSkeleton() {
  return (
    <div className="space-y-3">
      <Bone className="h-4 w-40" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <Bone className="size-9 rounded-xl" />
            <div className="space-y-1.5">
              <Bone className="h-3.5 w-3/4" />
              <Bone className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
