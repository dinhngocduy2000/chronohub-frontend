import type { IEventListItem } from '@/interface/events'

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Calendar date (YYYY-MM-DD) from a backend datetime string (space-separated or ISO 8601). */
export function getEventDatePart(value: string | undefined): string {
  if (value == null || value === '') return ''
  const trimmed = value.trim()
  if (trimmed.includes('T')) {
    return trimmed.split('T')[0]
  }
  return trimmed.split(' ')[0]
}

/** Wall-clock HH:mm from a backend datetime; also accepts a bare "HH:mm" string. */
export function getEventTimePart(value: string): string {
  const trimmed = value.trim()
  if (trimmed.includes('T')) {
    const timePart = trimmed.split('T')[1] ?? ''
    const hhmmss = timePart.replace(/Z$/i, '').split('.')[0] ?? ''
    const [h = '0', m = '00'] = hhmmss.split(':')
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  }
  const spaceParts = trimmed.split(/\s+/)
  if (spaceParts.length >= 2) {
    const t = spaceParts[spaceParts.length - 1]
    const [h = '0', m = '00'] = t.split(':')
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  }
  const [h = '0', m = '00'] = trimmed.split(':')
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
}

export function parseDateString(dateString: string): Date {
  const dateOnly = getEventDatePart(dateString)
  const [year, month, day] = dateOnly.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatTime(timeString: string): string {
  const timePart = getEventTimePart(timeString)
  const [hours, minutes] = timePart.split(':')
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

/** Visible time segment for an event on a specific calendar day (week / overlap logic). */
export function getEventTimeRangeForDay(
  event: IEventListItem,
  dayDate: string,
): { start: string; end: string } {
  const startDate = getEventDatePart(event.start_time)
  const endDate = getEventDatePart(event.end_time)

  if (dayDate < startDate || dayDate > endDate) {
    return { start: '00:00', end: '00:00' }
  }

  if (startDate === endDate) {
    return {
      start: getEventTimePart(event.start_time),
      end: getEventTimePart(event.end_time),
    }
  }

  if (dayDate === startDate) {
    return { start: getEventTimePart(event.start_time), end: '23:59' }
  }
  if (dayDate === endDate) {
    return { start: '00:00', end: getEventTimePart(event.end_time) }
  }
  return { start: '00:00', end: '23:59' }
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

export function groupEventsByDate(events: Array<IEventListItem>) {
  const map = new Map<string, Array<IEventListItem>>()
  events.forEach((event) => {
    const key = getEventDatePart(event.start_time)
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)?.push(event)
  })
  return map
}

export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const startKey = getEventDatePart(startDate)
  const endKey = getEventDatePart(endDate)
  const current = new Date(parseDateString(startKey))
  const end = new Date(parseDateString(endKey))

  while (current <= end) {
    dates.push(formatDate(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export function expandMultiDayEvents(events: Array<IEventListItem>) {
  const expandedMap = new Map<string, Array<IEventListItem>>()

  events.forEach((event) => {
    const startKey = getEventDatePart(event.start_time)
    const endKey = getEventDatePart(event.end_time)
    const dates =
      endKey !== startKey ? getDatesBetween(event.start_time, event.end_time) : [startKey]

    dates.forEach((date) => {
      if (!expandedMap.has(date)) {
        expandedMap.set(date, [])
      }
      expandedMap.get(date)?.push(event)
    })
  })

  return expandedMap
}

export function isMultiDayEvent(event: { end_time?: string; start_time: string }): boolean {
  const end = getEventDatePart(event.end_time)
  const start = getEventDatePart(event.start_time)
  if (!end) return false
  return end !== start
}

export function isEventStartDay(event: IEventListItem, checkDate: string): boolean {
  return getEventDatePart(event.start_time) === checkDate
}

export function isEventEndDay(event: IEventListItem, checkDate: string): boolean {
  return getEventDatePart(event.end_time) === checkDate
}

export function eventsOverlapOnDay(
  event1: IEventListItem,
  event2: IEventListItem,
  dayDate: string,
): boolean {
  const r1 = getEventTimeRangeForDay(event1, dayDate)
  const r2 = getEventTimeRangeForDay(event2, dayDate)
  const e1Start = timeToMinutes(r1.start)
  const e1End = timeToMinutes(r1.end)
  const e2Start = timeToMinutes(r2.start)
  const e2End = timeToMinutes(r2.end)

  return e1Start < e2End && e2Start < e1End
}

export function getEventCollisions(events: Array<IEventListItem>, dayDate: string) {
  const collisionGroups: number[][] = []

  events.forEach((event, index) => {
    let foundGroup = false

    for (const group of collisionGroups) {
      if (group.some((i) => eventsOverlapOnDay(events[i], event, dayDate))) {
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
