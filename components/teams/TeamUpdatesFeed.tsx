import type { TeamUpdate, TeamUpdateStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Flag,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))
}

const STATUS_META: Record<
  TeamUpdateStatus,
  { icon: typeof Activity; className: string; label: string }
> = {
  'In Progress': {
    icon: Loader2,
    className: 'text-sky-600 bg-sky-500/10 border-sky-500/20',
    label: 'In Progress',
  },
  Milestone: {
    icon: Flag,
    className: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
    label: 'Milestone',
  },
  Blocker: {
    icon: CircleAlert,
    className: 'text-rose-600 bg-rose-500/10 border-rose-500/20',
    label: 'Blocker',
  },
  Done: {
    icon: CheckCircle2,
    className: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    label: 'Done',
  },
}

function UpdateItem({ update }: { update: TeamUpdate }) {
  const meta = update.status ? STATUS_META[update.status] : null
  const Icon = meta?.icon ?? Activity

  return (
    <li className="group relative flex gap-3 rounded-xl p-3 transition-colors hover:bg-accent/40">
      <div
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border',
          meta?.className ?? 'text-muted-foreground bg-muted/40 border-border/60'
        )}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {update.title}
          </p>
          {meta && (
            <Badge variant="outline" className={cn('h-5 text-[10px]', meta.className)}>
              {meta.label}
            </Badge>
          )}
        </div>
        {update.body && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {update.body}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {update.author && <span>{update.author}</span>}
          {update.author && update.date && <span>·</span>}
          {update.date && <span>{formatDate(update.date)}</span>}
          {update.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="h-4 px-1.5 text-[10px]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </li>
  )
}

export default function TeamUpdatesFeed({
  updates,
}: {
  updates: TeamUpdate[]
}) {
  if (updates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center">
        <Activity className="mx-auto mb-2 size-5 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">
          No updates yet. Post one in Notion to see it here.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {updates.map((u) => (
        <UpdateItem key={u.id} update={u} />
      ))}
    </ul>
  )
}
