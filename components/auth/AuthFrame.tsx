import type { ReactNode } from 'react'
import Image from 'next/image'
import { BriefcaseBusiness, Globe, Handshake, type LucideIcon } from 'lucide-react'

const HIGHLIGHTS: Array<{ icon: LucideIcon; title: string; copy: string }> = [
  {
    icon: Globe,
    title: 'Global directory',
    copy: 'Keep alumni, teams, and context discoverable across the network.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Shared opportunities',
    copy: 'Surface events, roles, and projects in one branded home base.',
  },
  {
    icon: Handshake,
    title: 'Live org needs',
    copy: 'Make it obvious where members can step in and help right now.',
  },
]

export default function AuthFrame({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px]">
        <section className="relative hidden overflow-hidden rounded-[2.5rem] px-8 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,oklch(0.985_0.012_245),transparent_62%)]" />

          <div className="relative max-w-2xl space-y-7">
            <div className="brand-chip inline-flex rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.02em] text-foreground">
              Blueprints Network
            </div>
            <Image
              src="/brand/blueprints-logo.png"
              alt="Blueprints for Pangaea"
              width={936}
              height={556}
              priority
              className="h-auto w-[16rem]"
            />
            <div className="space-y-4">
              <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-balance text-foreground">
                Sign in to a quieter home for the Blueprints network.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed tracking-[-0.01em] text-muted-foreground">
                Alumni context, live org requests, and shared opportunities in a cleaner interface
                that keeps the focus on the people and the work.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-border bg-white/70 p-5 shadow-[0_16px_30px_oklch(0.23_0.015_255/0.06)] backdrop-blur"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <p className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex justify-center">
          <div className="brand-panel w-full max-w-md rounded-[2.25rem] p-7 sm:p-9">
            <div className="text-center">
              <div className="brand-chip mx-auto inline-flex rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.02em] text-foreground">
                Alumni Hub
              </div>
              <Image
                src="/brand/blueprints-logo.png"
                alt="Blueprints for Pangaea"
                width={936}
                height={556}
                priority
                className="mx-auto mt-5 h-auto w-[12.5rem]"
              />
              <h2 className="mt-7 text-[2rem] font-semibold tracking-[-0.03em] text-foreground">
                {title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            </div>

            <div className="mt-7">{children}</div>

            <p className="mt-7 text-center text-xs text-muted-foreground">
              Need public context first?{' '}
              <a
                href="https://www.blueprintsforpangaea.org/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Visit the main site
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
