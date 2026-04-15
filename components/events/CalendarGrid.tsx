import type { CalendarEvent } from '@/lib/types'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TYPE_COLORS: Record<string, string> = {
  'Team Meeting': 'bg-chart-1',
  Social: 'bg-chart-2',
  'Org-Wide': 'bg-chart-3',
  Workshop: 'bg-chart-4',
  Recruiting: 'bg-chart-5',
  General: 'bg-muted-foreground',
}

function getDateOnly(dateStr: string): string {
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay()
}

type Props = {
  events: CalendarEvent[]
  month: string // "YYYY-MM"
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

export default function CalendarGrid({ events, month, selectedDate, onSelectDate }: Props) {
  const [year, monthNum] = month.split('-').map(Number)
  const daysInMonth = getDaysInMonth(year, monthNum)
  const firstDay = getFirstDayOfWeek(year, monthNum)
  const todayStr = new Date().toISOString().split('T')[0]

  // Build event map: date string → events on that day
  const eventsByDate = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const date = getDateOnly(event.start)
    const list = eventsByDate.get(date) ?? []
    list.push(event)
    eventsByDate.set(date, list)
  }

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(year, monthNum - 1 || 12)
  const trailingDays = Array.from({ length: firstDay }, (_, i) => ({
    day: prevMonthDays - firstDay + 1 + i,
    outside: true,
    dateStr: '',
  }))

  // Current month days
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { day, outside: false, dateStr }
  })

  // Next month leading days to fill the grid
  const totalCells = trailingDays.length + currentDays.length
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const leadingDays = Array.from({ length: remainingCells }, (_, i) => ({
    day: i + 1,
    outside: true,
    dateStr: '',
  }))

  const allDays = [...trailingDays, ...currentDays, ...leadingDays]

  return (
    <div className="brand-panel rounded-[1.75rem] p-4 sm:p-6">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((cell, i) => {
          const isToday = cell.dateStr === todayStr
          const isSelected = cell.dateStr === selectedDate
          const dayEvents = cell.dateStr ? eventsByDate.get(cell.dateStr) ?? [] : []

          return (
            <button
              key={i}
              disabled={cell.outside}
              onClick={() => {
                if (cell.outside) return
                onSelectDate(isSelected ? null : cell.dateStr)
              }}
              className={cn(
                'relative flex flex-col items-center rounded-xl py-2 min-h-[3.5rem] transition-all duration-150',
                cell.outside
                  ? 'text-muted-foreground/30 cursor-default'
                  : 'hover:bg-accent/40 cursor-pointer',
                isToday &&
                  !isSelected &&
                  'bg-primary/10 text-primary font-semibold ring-1 ring-primary/30',
                isSelected &&
                  'bg-primary text-primary-foreground ring-2 ring-primary shadow-[0_2px_8px_oklch(0.44_0.19_260/0.25)]'
              )}
            >
              <span className="text-sm">{cell.day}</span>
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event, j) => (
                    <span
                      key={j}
                      className={cn(
                        'size-1.5 rounded-full',
                        isSelected ? 'bg-primary-foreground/70' : (TYPE_COLORS[event.type] ?? TYPE_COLORS.General)
                      )}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span
                      className={cn(
                        'text-[8px] leading-none',
                        isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}
                    >
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
