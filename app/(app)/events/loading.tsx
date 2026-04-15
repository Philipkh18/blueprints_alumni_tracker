export default function EventsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl skeleton-shimmer" />
        <div className="space-y-1.5">
          <div className="h-6 w-24 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-64 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      {/* Controls skeleton */}
      <div className="brand-panel rounded-[1.5rem] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-48 rounded-xl skeleton-shimmer" />
          <div className="flex-1" />
          <div className="h-8 w-40 rounded-xl skeleton-shimmer" />
        </div>
      </div>
      {/* Calendar grid skeleton */}
      <div className="brand-panel rounded-[1.75rem] p-6">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`h-${i}`} className="h-6 rounded-lg skeleton-shimmer" />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  )
}
