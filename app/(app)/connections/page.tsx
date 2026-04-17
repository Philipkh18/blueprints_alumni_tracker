import Link from 'next/link'
import ConnectionsExplorer from '@/components/connections/ConnectionsExplorer'
import { getAllProfiles } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export default async function ConnectionsPage() {
  const profiles = await getAllProfiles()

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Connections
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Mentor and mentee families</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This page maps the big-little lines that hold institutional memory together across the
            alumni network.
          </p>
        </div>

        <Link
          href="/profile/edit"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white/70 px-5 text-sm font-medium text-foreground transition-colors hover:bg-white"
        >
          Update my connections
        </Link>
      </div>

      <ConnectionsExplorer profiles={profiles} />
    </div>
  )
}
