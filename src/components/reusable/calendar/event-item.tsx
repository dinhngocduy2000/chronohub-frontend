'use client'

import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { formatTime } from '@/lib/calendar-utils'
import type { Event } from '@/lib/sample-events'

interface EventItemProps {
  event: Event
}

export function EventItem({ event }: EventItemProps) {
  return (
    <Link to={`/events/${event.id}` as string}>
      <div
        className="p-2 mb-1 rounded text-xs cursor-pointer hover:opacity-90 transition-opacity truncate group"
        style={{
          backgroundColor: event.color,
          color: '#fff',
        }}
        title={`${event.title} at ${event.location}`}
      >
        <div className="font-semibold truncate group-hover:underline">{event.title}</div>
        <div className="flex items-center gap-1 text-xs opacity-90">
          <span>{formatTime(event.startTime)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-90 truncate">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </Link>
  )
}
