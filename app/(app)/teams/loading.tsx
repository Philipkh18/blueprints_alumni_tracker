import TeamsSkeleton from '@/components/teams/TeamsSkeleton'

export default function TeamsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl skeleton-shimmer" />
          <div className="h-7 w-24 rounded-lg skeleton-shimmer" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          <div className="h-5 w-16 rounded-full skeleton-shimmer" />
        </div>
      </div>
      <TeamsSkeleton />
    </div>
  )
}
