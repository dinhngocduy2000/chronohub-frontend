'use client'

import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { IEventListItem } from '@/interface/events'
import {
  getCalendarDays,
  getDateForDay,
  getWeekDays,
  groupEventsByDate,
  isMultiDayEvent,
  isSameMonth,
  isToday,
  parseDateString,
} from '@/lib/calendar-utils'
import { getCategoryColor } from '@/lib/sample-events'
import { cn } from '@/lib/utils'
import { EventItem } from './event-item'

interface CalendarGridProps {
  currentDate: Date
  events: IEventListItem[]
}

export function CalendarGrid({ currentDate, events }: CalendarGridProps) {
  const weekDays = getWeekDays()
  const calendarDays = useMemo(() => getCalendarDays(currentDate), [currentDate])

  // Separate single-day and multi-day events
  const { singleDayEvents, multiDayEvents } = useMemo(() => {
    return {
      singleDayEvents: events.filter((e) => !isMultiDayEvent(e)),
      multiDayEvents: events.filter((e) => isMultiDayEvent(e)),
    }
  }, [events])

  const singleDayEventsByDate = useMemo(() => groupEventsByDate(singleDayEvents), [singleDayEvents])

  return (
    <div className="bg-background rounded-lg border overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-muted border-b">
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center font-semibold text-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 relative">
        {calendarDays.map((day, cellIndex) => {
          const dateString = day ? getDateForDay(currentDate, day) : ''
          const dayEvents = day ? singleDayEventsByDate.get(dateString) || [] : []
          const today = isToday(dateString)
          const isCurrentMonth = isSameMonth(currentDate, new Date())

          return (
            <div
              key={day !== null ? `day-${day}` : `empty-${cellIndex}`}
              className={cn(
                'min-h-32 p-3 border-r border-b hover:bg-accent/50 transition-colors relative',
                day === null && 'bg-muted/30',
                today && 'bg-primary/5',
                day && !isCurrentMonth && 'opacity-50',
              )}
            >
              {day && (
                <>
                  <div
                    className={cn(
                      'font-semibold mb-2 inline-block w-8 h-8 items-center justify-center rounded-full',
                      today ? 'bg-primary text-primary-foreground' : 'text-foreground',
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}

        {/* Multi-day event bars */}
        {multiDayEvents.map((event) => (
          <MultiDayEventBar
            key={event.id}
            event={event}
            calendarDays={calendarDays}
            currentDate={currentDate}
          />
        ))}
      </div>
    </div>
  )
}

interface MultiDayEventBarProps {
  event: IEventListItem
  calendarDays: (number | null)[]
  currentDate: Date
}

function MultiDayEventBar({ event, calendarDays, currentDate }: MultiDayEventBarProps) {
  const startDate = parseDateString(event.start_time)
  const endDate = parseDateString(event.end_time)

  // Find the index of the first day in calendar that falls within event range
  let startIndex = -1
  let endIndex = -1

  calendarDays.forEach((day, index) => {
    if (day !== null) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      if (cellDate >= startDate && cellDate <= endDate) {
        if (startIndex === -1) startIndex = index
        endIndex = index
      }
    }
  })

  if (startIndex === -1) return null // Event not in this month

  const width = ((endIndex - startIndex + 1) * 100) / 7
  const left = (startIndex * 100) / 7

  return (
    <Link
      to={`/events/${event.id}` as string}
      className="absolute pointer-events-auto group"
      style={{
        top: '8px',
        left: `${left}%`,
        width: `${width}%`,
        height: '24px',
      }}
    >
      <div
        className="w-full h-full rounded px-2 text-white text-xs font-medium overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer flex items-center whitespace-nowrap"
        style={{
          backgroundColor: getCategoryColor(event.category),
          opacity: 0.85,
        }}
      >
        <span className="truncate">{event.name}</span>
      </div>
    </Link>
  )
}
