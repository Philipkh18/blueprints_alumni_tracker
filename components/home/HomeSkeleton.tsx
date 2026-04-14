import { cn } from '@/lib/utils'

export function SectionSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function QuickLinksSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-28 rounded-md bg-muted animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="size-8 rounded-lg bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
