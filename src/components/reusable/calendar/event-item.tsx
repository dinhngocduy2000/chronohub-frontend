'use client'

import { Link } from '@tanstack/react-router'
import type { IEventListItem } from '@/interface/events'
import { formatTime } from '@/lib/calendar-utils'
import { getCategoryColor } from '@/lib/sample-events'

interface EventItemProps {
  event: IEventListItem
}

export function EventItem({ event }: EventItemProps) {
  return (
    <Link to={`/events/${event.id}` as string}>
      <div
        className="p-2 mb-1 rounded text-xs cursor-pointer hover:opacity-90 transition-opacity truncate group"
        style={{
          backgroundColor: getCategoryColor(event.category),
          color: '#fff',
        }}
        title={`${event.name}`}
      >
        <div className="font-semibold truncate group-hover:underline">{event.name}</div>
        <div className="flex items-center gap-1 text-xs opacity-90">
          <span>{formatTime(event.start_time)}</span>
        </div>
        {/* <div className="flex items-center gap-1 text-xs opacity-90 truncate">
          <span className="truncate">{event.start_time} - {event.end_time}</span>
        </div> */}
      </div>
    </Link>
  )
}
