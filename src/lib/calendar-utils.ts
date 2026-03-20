import type { Event } from './sample-events'

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function getWeekDays(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

export function isToday(dateString: string): boolean {
  const today = new Date()
  return dateString === formatDate(today)
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

export function getCalendarDays(date: Date): (number | null)[] {
  const daysInMonth = getDaysInMonth(date)
  const firstDay = getFirstDayOfMonth(date)
  const days: (number | null)[] = []

  // Add empty slots for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

export function getDateForDay(monthDate: Date, day: number): string {
  const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
  return formatDate(date)
}

export function formatWeekRange(date: Date): string {
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - date.getDay())

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endMonth = weekEnd.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${startMonth} - ${endMonth}`
}

export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

export function getEventPositionStyle(startTime: string, endTime: string) {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  const duration = Math.max(endMinutes - startMinutes, 15) // Minimum 15 minutes

  const topPercent = (startMinutes / (24 * 60)) * 100
  const heightPercent = (duration / (24 * 60)) * 100

  return {
    top: `${topPercent}%`,
    height: `${heightPercent}%`,
  }
}

export function getWeekStart(date: Date): Date {
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - date.getDay())
  return weekStart
}

export function getWeekDates(date: Date): Date[] {
  const weekStart = getWeekStart(date)
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(weekStart)
    newDate.setDate(weekStart.getDate() + i)
    dates.push(newDate)
  }
  return dates
}

export function groupEventsByDate(events: Array<Event>) {
  const map = new Map<string, Array<Event>>()
  events.forEach((event) => {
    if (!map.has(event.date)) {
      map.set(event.date, [])
    }
    map.get(event.date)?.push(event)
  })
  return map
}

export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(parseDateString(startDate))
  const end = new Date(parseDateString(endDate))

  while (current <= end) {
    dates.push(formatDate(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export function expandMultiDayEvents(events: Array<Event>) {
  const expandedMap = new Map<string, Array<Event>>()

  events.forEach((event) => {
    const dates = event.endDate ? getDatesBetween(event.date, event.endDate) : [event.date]

    dates.forEach((date) => {
      if (!expandedMap.has(date)) {
        expandedMap.set(date, [])
      }
      expandedMap.get(date)?.push(event)
    })
  })

  return expandedMap
}

export function isMultiDayEvent(event: { endDate?: string; date: string }): boolean {
  return !!event.endDate && event.endDate !== event.date
}

export function isEventStartDay(event: Event, checkDate: string): boolean {
  return event.date === checkDate
}

export function isEventEndDay(event: { endDate?: string }, checkDate: string): boolean {
  return event.endDate === checkDate
}

export function eventsOverlap(
  event1: { startTime: string; endTime: string },
  event2: { startTime: string; endTime: string },
): boolean {
  const e1Start = timeToMinutes(event1.startTime)
  const e1End = timeToMinutes(event1.endTime)
  const e2Start = timeToMinutes(event2.startTime)
  const e2End = timeToMinutes(event2.endTime)

  return e1Start < e2End && e2Start < e1End
}

export function getEventCollisions(events: Array<{ startTime: string; endTime: string }>) {
  const collisionGroups: number[][] = []

  events.forEach((event, index) => {
    let foundGroup = false

    for (const group of collisionGroups) {
      if (group.some((i) => eventsOverlap(events[i], event))) {
        group.push(index)
        foundGroup = true
        break
      }
    }

    if (!foundGroup) {
      collisionGroups.push([index])
    }
  })

  return collisionGroups
}

export function getEventPositionInGroup(
  eventIndex: number,
  collisionGroup: number[],
): { left: number; width: number } {
  const groupSize = collisionGroup.length
  const positionInGroup = collisionGroup.indexOf(eventIndex)

  const width = 100 / groupSize
  const left = positionInGroup * width

  return { left, width }
}
