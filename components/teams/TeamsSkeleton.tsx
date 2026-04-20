import { cn } from '@/lib/utils'

function Bone({ className }: { className?: string }) {
  return <div className={cn('rounded-lg skeleton-shimmer', className)} />
}

function TeamCardSkeleton() {
  return (
    <div className="brand-panel flex flex-col gap-5 rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Bone className="size-11 rounded-2xl" />
          <div className="space-y-2">
            <Bone className="h-4 w-32" />
            <Bone className="h-3 w-48" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Bone className="h-5 w-12 rounded-full" />
          <Bone className="h-5 w-12 rounded-full" />
        </div>
      </div>
      <Bone className="h-10 w-full rounded-2xl" />
      <div className="space-y-2">
        <Bone className="h-3 w-20" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Bone className="h-3 w-28" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-xl p-3">
            <Bone className="size-7 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Bone className="h-3 w-3/5" />
              <Bone className="h-2.5 w-full" />
              <Bone className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TeamsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <TeamCardSkeleton key={i} />
      ))}
    </div>
  )
}
