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
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
        <section className="brand-panel brand-grid relative hidden overflow-hidden rounded-[2rem] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.88_0.1_252/0.22),transparent_36%)]" />
          <div className="brand-rings absolute inset-y-8 right-[-12%] aspect-square w-[32rem] opacity-80" />

          <div className="relative max-w-2xl space-y-6">
            <div className="brand-chip inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-brand-deep)]">
              Blueprints Network
            </div>
            <Image
              src="/brand/blueprints-logo.png"
              alt="Blueprints for Pangaea"
              width={936}
              height={556}
              priority
              className="h-auto w-[18rem]"
            />
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight text-balance">
                A shared alumni atlas for the people building across continents.
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                Keep the directory, opportunities, updates, and team asks in one place that
                actually looks like Blueprints for Pangaea.
              </p>
            </div>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
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
        </section>

        <section className="relative flex justify-center">
          <div className="brand-panel w-full max-w-md rounded-[2rem] p-6 sm:p-8">
            <div className="text-center">
              <div className="brand-chip mx-auto inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-brand-deep)]">
                Alumni Hub
              </div>
              <Image
                src="/brand/blueprints-logo.png"
                alt="Blueprints for Pangaea"
                width={936}
                height={556}
                priority
                className="mx-auto mt-4 h-auto w-[13.5rem]"
              />
              <h2 className="mt-6 text-2xl font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>

            <div className="mt-6">{children}</div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
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
