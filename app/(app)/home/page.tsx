import { Suspense } from 'react'
import AnnouncementsSection from '@/components/home/AnnouncementsSection'
import EventsSection from '@/components/home/EventsSection'
import QuickLinksSection from '@/components/home/QuickLinksSection'
import IdeaBoardSection from '@/components/home/IdeaBoardSection'
import OrgNeedsSection from '@/components/home/OrgNeedsSection'
import { SectionSkeleton, QuickLinksSkeleton } from '@/components/home/HomeSkeleton'

export const metadata = { title: 'Home — Blueprints for Pangaea' }

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back — here&apos;s what&apos;s happening at Blueprints.
        </p>
      </div>

      {/* Row 1: Announcements (2/3) + Events (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up stagger-1">
        <div className="lg:col-span-2">
          <Suspense fallback={<SectionSkeleton rows={3} />}>
            <AnnouncementsSection />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<SectionSkeleton rows={4} />}>
            <EventsSection />
          </Suspense>
        </div>
      </div>

      {/* Row 2: Quick links (full width) */}
      <div className="animate-fade-up stagger-2">
        <Suspense fallback={<QuickLinksSkeleton />}>
          <QuickLinksSection />
        </Suspense>
      </div>

      {/* Row 3: Idea Board (1/2) + Org Needs (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up stagger-3">
        <Suspense fallback={<SectionSkeleton rows={3} />}>
          <IdeaBoardSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={3} />}>
          <OrgNeedsSection />
        </Suspense>
      </div>
    </div>
  )
}
