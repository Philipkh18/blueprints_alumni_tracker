import { SectionSkeleton, QuickLinksSkeleton } from '@/components/home/HomeSkeleton'

export default function HomeLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <div className="h-7 w-16 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-56 rounded bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionSkeleton rows={3} />
        </div>
        <div className="lg:col-span-1">
          <SectionSkeleton rows={4} />
        </div>
      </div>
      <QuickLinksSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionSkeleton rows={3} />
        <SectionSkeleton rows={3} />
      </div>
    </div>
  )
}
