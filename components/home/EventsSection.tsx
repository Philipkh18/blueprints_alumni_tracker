import { getUpcomingEvents } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { HomeEvent } from '@/lib/types'
import { MapPin } from 'lucide-react'

function formatEventDate(dateStr: string): { month: string; day: string; weekday: string } {
  // Append T00:00:00 to treat as local date, not UTC
  const d = new Date(dateStr + 'T00:00:00')
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.toLocaleDateString('en-US', { day: 'numeric' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

function isTomorrow(dateStr: string): boolean {
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0]
  return dateStr === tomorrow
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
    <div className="flex gap-3 items-start">
      <div
        className={`flex w-12 shrink-0 flex-col items-center rounded-lg py-1.5 text-center ring-1 ${
          today ? 'bg-primary text-primary-foreground ring-primary' : 'ring-border'
        }`}
      >
        <span className={`text-[10px] uppercase tracking-wide ${today ? 'opacity-80' : 'text-muted-foreground'}`}>
          {month}
        </span>
        <span className="text-lg font-bold leading-none">{day}</span>
        <span className={`text-[10px] ${today ? 'opacity-80' : 'text-muted-foreground'}`}>
          {weekday}
        </span>
      </div>
      <div className="min-w-0 flex-1 py-0.5 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-medium leading-snug">{event.title}</p>
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
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {error ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Could not load events. Try refreshing.
          </p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No upcoming events scheduled.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
