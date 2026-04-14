import { getAnnouncements } from '@/lib/notion-home'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Announcement } from '@/lib/types'
import { Megaphone, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(iso)
  )
}

const PRIORITY_BADGE: Record<
  Announcement['priority'],
  { label: string; variant: 'destructive' | 'secondary' | 'outline' }
> = {
  high: { label: 'Pinned', variant: 'destructive' },
  medium: { label: 'Medium', variant: 'secondary' },
  low: { label: 'Low', variant: 'outline' },
}

function AnnouncementItem({ item }: { item: Announcement }) {
  const { label, variant } = PRIORITY_BADGE[item.priority]
  const isPinned = item.priority === 'high'

  return (
    <div
      className={cn(
        'group flex gap-3 rounded-xl p-3 border transition-all duration-200',
        isPinned
          ? 'bg-primary/[0.04] border-primary/15 hover:border-primary/25 hover:bg-primary/[0.06]'
          : 'border-transparent hover:bg-accent/50'
      )}
    >
      <div className="mt-0.5 shrink-0">
        {isPinned ? (
          <Pin className="size-4 text-primary" />
        ) : (
          <Megaphone className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug">{item.title}</p>
          <div className="flex shrink-0 items-center gap-1.5">
            {isPinned && (
              <Badge variant={variant} className="text-[10px]">
                {label}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] capitalize">
              {item.type}
            </Badge>
          </div>
        </div>
        {item.body && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {item.body}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground">
            {item.author} &middot; {formatDate(item.created_at)}
          </span>
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1.5">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function AnnouncementsSection() {
  let announcements: Announcement[] = []
  let error = false

  try {
    announcements = await getAnnouncements()
  } catch {
    error = true
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="size-4 text-primary" />
          Announcements & Updates
        </CardTitle>
        <CardDescription>Latest news and updates from leadership</CardDescription>
      </CardHeader>
      <CardContent className="pt-3">
        {error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Could not load announcements.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try refreshing the page.</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-8 text-center">
            <Megaphone className="mx-auto size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No announcements right now.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {announcements.map((item) => (
              <AnnouncementItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
