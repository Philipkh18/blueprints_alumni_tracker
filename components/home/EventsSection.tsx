import { getUpcomingEvents } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { HomeEvent } from '@/lib/types'
import { Calendar, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatEventDate(dateStr: string): { month: string; day: string; weekday: string } {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.toLocaleDateString('en-US', { day: 'numeric' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0]
}

function isTomorrow(dateStr: string): boolean {
  return dateStr === new Date(Date.now() + 86_400_000).toISOString().split('T')[0]
}

function dateLabel(dateStr: string): string | null {
  if (isToday(dateStr)) return 'Today'
  if (isTomorrow(dateStr)) return 'Tomorrow'
  return null
}

function EventItem({ event }: { event: HomeEvent }) {
  const { month, day, weekday } = formatEventDate(event.date)
  const label = dateLabel(event.date)
  const today = isToday(event.date)

  return (
    <div className="group flex gap-3 items-start transition-colors duration-150 rounded-lg p-1.5 -mx-1.5 hover:bg-accent/40">
      <div
        className={cn(
          'flex w-12 shrink-0 flex-col items-center rounded-xl py-1.5 text-center ring-1 transition-shadow duration-200',
          today
            ? 'bg-primary text-primary-foreground ring-primary shadow-[0_2px_8px_oklch(0.44_0.19_260/0.25)]'
            : 'ring-border group-hover:ring-border/80'
        )}
      >
        <span className={cn('text-[10px] uppercase tracking-wide', today ? 'opacity-80' : 'text-muted-foreground')}>
          {month}
        </span>
        <span className="text-lg font-bold leading-none">{day}</span>
        <span className={cn('text-[10px]', today ? 'opacity-80' : 'text-muted-foreground')}>
          {weekday}
        </span>
      </div>
      <div className="min-w-0 flex-1 py-0.5 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-semibold leading-snug">{event.title}</p>
          {label && (
            <Badge variant={today ? 'default' : 'secondary'} className="text-[10px]">
              {label}
            </Badge>
          )}
        </div>
        {event.event_type && (
          <Badge variant="outline" className="text-[10px]">
            {event.event_type}
          </Badge>
        )}
        {event.location && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="size-3" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function EventsSection() {
  let events: HomeEvent[] = []
  let error = false

  try {
    events = await getUpcomingEvents()
  } catch {
    error = true
  }

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>What&apos;s on the calendar</CardDescription>
      </CardHeader>
      <CardContent className="pt-3">
        {error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Could not load events.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try refreshing the page.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="mx-auto size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
