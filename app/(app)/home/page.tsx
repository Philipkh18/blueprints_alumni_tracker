import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnnouncementsSection from '@/components/home/AnnouncementsSection'
import EventsSection from '@/components/home/EventsSection'
import QuickLinksSection from '@/components/home/QuickLinksSection'
import IdeaBoardSection from '@/components/home/IdeaBoardSection'
import OrgNeedsSection from '@/components/home/OrgNeedsSection'
import { SectionSkeleton, QuickLinksSkeleton } from '@/components/home/HomeSkeleton'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { Globe, Lightbulb, Network } from 'lucide-react'

export const metadata = { title: 'Home — Blueprints for Pangaea' }

const HERO_PILLARS = [
  {
    icon: Globe,
    title: 'Shared visibility',
    copy: 'Profiles, roles, and alumni context stay easy to discover.',
  },
  {
    icon: Network,
    title: 'Network coordination',
    copy: 'Announcements, events, and org needs stay in one operating layer.',
  },
  {
    icon: Lightbulb,
    title: 'Momentum',
    copy: 'Ideas and opportunities stay attached to the Blueprints identity.',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="brand-panel brand-grid relative overflow-hidden rounded-[2rem] p-6 animate-fade-up sm:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,oklch(0.88_0.1_252/0.22),transparent_58%)] lg:block" />
        <div className="absolute inset-y-6 right-[-8%] hidden aspect-square w-[26rem] brand-rings opacity-80 lg:block" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:items-center">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="brand-chip w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-brand-deep)]"
            >
              Global Alumni Atlas
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Make the <span className="text-brand-gradient">Blueprints</span> network feel
                connected, visible, and unmistakably on-brand.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                This hub brings alumni profiles, org updates, events, and live needs into one
                place with the same global energy as the Blueprints for Pangaea mark.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className={buttonVariants({ size: 'lg' })}>
                Browse Members
              </Link>
              <Link
                href="/profile/edit"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Update Your Profile
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {HERO_PILLARS.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-[0_12px_32px_oklch(0.22_0.07_257/0.08)] backdrop-blur"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_12px_24px_oklch(0.5_0.18_257/0.22)]">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="brand-panel relative w-full max-w-sm overflow-hidden rounded-[2rem] p-6">
              <div className="brand-grid absolute inset-0 opacity-35" />
              <div className="relative flex flex-col items-center gap-5">
                <Image
                  src="/brand/blueprints-logo.png"
                  alt="Blueprints for Pangaea"
                  width={936}
                  height={556}
                  priority
                  className="h-auto w-full max-w-[18rem]"
                />
                <div className="flex flex-wrap justify-center gap-2">
                  {['Directory', 'Events', 'Org Needs', 'Ideas'].map((label) => (
                    <span
                      key={label}
                      className="brand-chip rounded-full px-3 py-1 text-xs font-medium text-[var(--color-brand-deep)]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 1: Announcements (2/3) + Events (1/3) */}
      <div id="updates" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up stagger-1">
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
