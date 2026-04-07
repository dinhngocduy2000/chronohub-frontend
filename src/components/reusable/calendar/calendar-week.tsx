/** biome-ignore-all lint/suspicious/noArrayIndexKey: hour is unique enough*/
'use client'

import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { IEventListItem } from '@/interface/events'
import {
  formatDate,
  getEventCollisions,
  getEventPositionInGroup,
  getEventPositionStyle,
  getEventTimeRangeForDay,
  getWeekDates,
  getWeekDays,
  isToday,
  parseDateString,
} from '@/lib/calendar-utils'
import { getCategoryColor } from '@/lib/event-category'
import { cn } from '@/lib/utils'

interface CalendarWeekProps {
  currentDate: Date
  events: IEventListItem[]
}

export function CalendarWeek({ currentDate, events }: CalendarWeekProps) {
  const weekDays = getWeekDays()

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

  // For week view, show all events (both single and multi-day) in their time positions
  const eventsByDate = useMemo(() => {
    const allEventsExpandedMap = new Map<string, IEventListItem[]>()

    events.forEach((event) => {
      const startDate = parseDateString(event.start_time)
      const endDate = parseDateString(event.end_time || event.start_time)

      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        const dateStr = formatDate(currentDate)
        if (!allEventsExpandedMap.has(dateStr)) {
          allEventsExpandedMap.set(dateStr, [])
        }
        allEventsExpandedMap.get(dateStr)?.push(event)
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    return allEventsExpandedMap
  }, [events])

  return (
    <div className="bg-background rounded-lg border overflow-hidden">
      {/* Week day headers with dates */}
      <div className="grid grid-cols-8 gap-0 border-b sticky top-0 z-20">
        <div className="w-16 bg-muted border-r flex items-end justify-center pb-2">
          <span className="text-xs text-muted-foreground font-medium">Time</span>
        </div>
        {weekDates.map((date, index) => {
          const today = isToday(formatDate(date))
          const dayNum = date.getDate()
          return (
            <div
              key={index}
              className={cn('p-4 text-center border-r last:border-r-0', today && 'bg-primary/10')}
            >
              <div className="font-semibold text-foreground text-sm">{weekDays[index]}</div>
              <div
                className={cn(
                  'text-lg font-bold mt-1 inline-block w-8 h-8 items-center justify-center rounded-full',
                  today ? 'bg-primary text-primary-foreground' : 'text-foreground',
                )}
              >
                {dayNum}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hours and events grid */}
      <div className="grid grid-cols-8 gap-0 relative">
        {/* Time column */}
        <div className="w-16 bg-muted border-r">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div
              key={`time-${hour}`}
              className="h-24 border-b last:border-b-0 flex items-start justify-center pt-1"
            >
              <span className="text-xs text-muted-foreground font-medium">
                {String(hour).padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Day columns with events */}
        {weekDates.map((date, dayIndex) => {
          const dateString = formatDate(date)
          const dayEvents = eventsByDate.get(dateString) || []
          const today = isToday(dateString)
          const collisionGroups = getEventCollisions(dayEvents, dateString)

          return (
            <div
              key={dayIndex}
              className={cn('relative border-r last:border-r-0', today && 'bg-primary/5')}
            >
              {/* Hour rows */}
              {Array.from({ length: 24 }).map((_, hour) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className="h-24 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                />
              ))}

              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {dayEvents.map((event, eventIndex) => {
                  const collisionGroup = collisionGroups.find((group) => group.includes(eventIndex))
                  const position = collisionGroup
                    ? getEventPositionInGroup(eventIndex, collisionGroup)
                    : { left: 0, width: 100 }

                  return (
                    <WeekEventBlock
                      key={`${event.id}-${dateString}`}
                      event={event}
                      dayDate={dateString}
                      position={position}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface WeekEventBlockProps {
  event: IEventListItem
  dayDate: string
  position?: { left: number; width: number }
}

function WeekEventBlock({
  event,
  dayDate,
  position = { left: 0, width: 100 },
}: WeekEventBlockProps) {
  const range = getEventTimeRangeForDay(event, dayDate)
  const style = getEventPositionStyle(range.start, range.end)
  const hasCollision = position.width < 100

  return (
    <Link
      to={`/events/${event.id}` as string}
      className="absolute pointer-events-auto group"
      style={{
        top: style.top,
        height: style.height,
        left: `calc(${position.left}% + 2px)`,
        right: `calc(${100 - position.left - position.width}% + 2px)`,
        width: `calc(${position.width}% - 4px)`,
      }}
    >
      <div
        className="w-full h-full rounded px-2 py-1 text-white text-xs font-medium overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-start"
        style={{
          backgroundColor: getCategoryColor(event.category),
          opacity: hasCollision ? 0.85 : 0.9,
          fontSize: hasCollision ? '10px' : '12px',
        }}
      >
        <div className="font-semibold truncate leading-tight">{event.name}</div>
        {!hasCollision && (
          <div className="text-xs opacity-90 truncate leading-tight">
            {range.start} - {range.end}
          </div>
        )}
      </div>
    </Link>
  )
}
