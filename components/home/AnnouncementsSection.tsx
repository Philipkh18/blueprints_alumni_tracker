import { getAnnouncements } from '@/lib/notion-home'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Announcement } from '@/lib/types'
import { Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(iso)
  )
}

const PRIORITY_BADGE: Record<Announcement['priority'], { label: string; variant: 'destructive' | 'secondary' | 'outline' }> = {
  high: { label: 'High', variant: 'destructive' },
  medium: { label: 'Medium', variant: 'secondary' },
  low: { label: 'Low', variant: 'outline' },
}

const TYPE_LABEL: Record<Announcement['type'], string> = {
  announcement: 'Announcement',
  update: 'Update',
}

function AnnouncementItem({ item }: { item: Announcement }) {
  const { label, variant } = PRIORITY_BADGE[item.priority]
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg p-3 border border-transparent transition-colors',
        item.priority === 'high' && 'bg-destructive/5 border-destructive/20'
      )}
    >
      <div className="mt-0.5 shrink-0">
        <Megaphone
          className={cn(
            'size-4',
            item.priority === 'high' ? 'text-destructive' : 'text-muted-foreground'
          )}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <div className="flex shrink-0 items-center gap-1.5">
            <Badge variant={variant} className="text-[10px]">
              {label}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {TYPE_LABEL[item.type]}
            </Badge>
          </div>
        </div>
        {item.body && (
          <p className="text-xs text-muted-foreground line-clamp-2">{item.body}</p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground">
            {item.author} · {formatDate(item.created_at)}
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
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Announcements & Updates</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {error ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Could not load announcements. Try refreshing.
          </p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No announcements right now.
          </p>
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
