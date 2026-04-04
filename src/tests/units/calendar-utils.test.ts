import { describe, expect, it } from 'vitest'
import {
  eventsOverlapOnDay,
  expandMultiDayEvents,
  formatDate,
  formatMonthYear,
  formatTime,
  formatWeekRange,
  getCalendarDays,
  getDateForDay,
  getDatesBetween,
  getDaysInMonth,
  getEventCollisions,
  getEventPositionInGroup,
  getEventPositionStyle,
  getFirstDayOfMonth,
  getWeekDates,
  getWeekDays,
  getWeekStart,
  groupEventsByDate,
  isEventEndDay,
  isEventStartDay,
  isMultiDayEvent,
  isSameMonth,
  isToday,
  parseDateString,
  timeToMinutes,
} from '@/lib/calendar-utils'
import { makeEvent } from '@/tests/test-utils'

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

describe('getDaysInMonth', () => {
  it.each([
    { date: new Date(2025, 1), expected: 28, label: 'Feb 2025 (non-leap)' },
    { date: new Date(2024, 1), expected: 29, label: 'Feb 2024 (leap)' },
    { date: new Date(2025, 0), expected: 31, label: 'January' },
    { date: new Date(2025, 3), expected: 30, label: 'April' },
  ])('returns $expected for $label', ({ date, expected }) => {
    expect(getDaysInMonth(date)).toBe(expected)
  })
})

describe('getFirstDayOfMonth', () => {
  it.each([
    { date: new Date(2025, 1), expected: 6, label: 'Feb 2025 (Saturday)' },
    { date: new Date(2025, 5), expected: 0, label: 'Jun 2025 (Sunday)' },
  ])('returns $expected for $label', ({ date, expected }) => {
    expect(getFirstDayOfMonth(date)).toBe(expected)
  })
})

describe('formatDate', () => {
  it('formats a local calendar date as YYYY-MM-DD', () => {
    expect(formatDate(new Date(2025, 1, 14))).toBe('2025-02-14')
  })

  it('zero-pads single-digit months and days', () => {
    expect(formatDate(new Date(2025, 0, 5))).toBe('2025-01-05')
  })

  it('always returns YYYY-MM-DD format', () => {
    expect(formatDate(new Date(2025, 11, 25))).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('parseDateString', () => {
  it('parses YYYY-MM-DD into correct local Date', () => {
    const date = parseDateString('2025-02-14')
    expect(date.getFullYear()).toBe(2025)
    expect(date.getMonth()).toBe(1)
    expect(date.getDate()).toBe(14)
  })
})

describe('formatMonthYear', () => {
  it('returns long month name and year', () => {
    expect(formatMonthYear(new Date(2025, 1))).toBe('February 2025')
  })
})

describe('formatTime', () => {
  it.each([
    ['09:30', '9:30 AM'],
    ['14:00', '2:00 PM'],
    ['00:00', '12:00 AM'],
    ['12:00', '12:00 PM'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatTime(input)).toBe(expected)
  })
})

describe('getWeekDays', () => {
  it('returns Sun through Sat', () => {
    const days = getWeekDays()
    expect(days).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })
})

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(formatDate(new Date()))).toBe(true)
  })

  it('returns false for a past date', () => {
    expect(isToday('2000-01-01')).toBe(false)
  })
})

describe('isSameMonth', () => {
  it('returns true for two dates in the same month', () => {
    expect(isSameMonth(new Date(2025, 1, 1), new Date(2025, 1, 28))).toBe(true)
  })

  it('returns false for dates in different months', () => {
    expect(isSameMonth(new Date(2025, 0), new Date(2025, 1))).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Calendar grid helpers
// ---------------------------------------------------------------------------

describe('getCalendarDays', () => {
  it('prefixes nulls to align with the first day of week', () => {
    // Feb 2025 starts on Saturday (index 6) → 6 leading nulls
    const days = getCalendarDays(new Date(2025, 1))
    expect(days.filter((d) => d === null)).toHaveLength(6)
  })

  it('includes every day of the month in order', () => {
    const dayNumbers = getCalendarDays(new Date(2025, 1)).filter(Boolean) as number[]
    expect(dayNumbers).toHaveLength(28)
    expect(dayNumbers.at(0)).toBe(1)
    expect(dayNumbers.at(-1)).toBe(28)
  })

  it('has no leading nulls when the month starts on Sunday', () => {
    expect(getCalendarDays(new Date(2025, 5))[0]).toBe(1)
  })
})

describe('getDateForDay', () => {
  it('returns a YYYY-MM-DD string for the given month', () => {
    expect(getDateForDay(new Date(2025, 1), 14)).toMatch(/^2025-02-\d{2}$/)
  })

  it('produces consecutive dates for consecutive days', () => {
    const a = getDateForDay(new Date(2025, 1), 10)
    const b = getDateForDay(new Date(2025, 1), 11)
    expect(new Date(b).getTime() - new Date(a).getTime()).toBe(86_400_000)
  })
})

describe('formatWeekRange', () => {
  const result = formatWeekRange(new Date(2025, 1, 12))

  it('contains the month abbreviation and a dash separator', () => {
    expect(result).toContain('Feb')
    expect(result).toContain('-')
  })

  it('contains the year', () => {
    expect(result).toContain('2025')
  })
})

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

describe('timeToMinutes', () => {
  it.each([
    ['00:00', 0],
    ['09:30', 570],
    ['23:59', 1439],
  ])('converts %s to %d minutes', (input, expected) => {
    expect(timeToMinutes(input)).toBe(expected)
  })
})

describe('getEventPositionStyle', () => {
  it('returns percentage-based top and height', () => {
    const style = getEventPositionStyle('09:00', '10:00')
    expect(style.top).toContain('%')
    expect(style.height).toContain('%')
  })

  it('enforces a minimum 15-minute visual height', () => {
    const fiveMin = getEventPositionStyle('09:00', '09:05')
    const fifteenMin = getEventPositionStyle('09:00', '09:15')
    expect(fiveMin.height).toBe(fifteenMin.height)
  })
})

// ---------------------------------------------------------------------------
// Week helpers
// ---------------------------------------------------------------------------

describe('getWeekStart', () => {
  it('returns the preceding Sunday', () => {
    const start = getWeekStart(new Date(2025, 1, 12)) // Wednesday
    expect(start.getDay()).toBe(0)
    expect(start.getDate()).toBe(9)
  })

  it('returns the same date when already Sunday', () => {
    expect(getWeekStart(new Date(2025, 1, 9)).getDate()).toBe(9)
  })
})

describe('getWeekDates', () => {
  it('returns 7 dates spanning Sunday to Saturday', () => {
    const dates = getWeekDates(new Date(2025, 1, 12))
    expect(dates).toHaveLength(7)
    expect(dates[0].getDay()).toBe(0)
    expect(dates[6].getDay()).toBe(6)
  })
})

// ---------------------------------------------------------------------------
// Event grouping and multi-day helpers
// ---------------------------------------------------------------------------

describe('groupEventsByDate', () => {
  it('groups events by their date string', () => {
    const events = [
      makeEvent({ id: '1', date: '2025-02-03' }),
      makeEvent({ id: '2', date: '2025-02-03' }),
      makeEvent({ id: '3', date: '2025-02-05' }),
    ]
    const map = groupEventsByDate(events)
    expect(map.get('2025-02-03')).toHaveLength(2)
    expect(map.get('2025-02-05')).toHaveLength(1)
  })
})

describe('getDatesBetween', () => {
  it('returns the correct count of consecutive dates', () => {
    const dates = getDatesBetween('2025-02-10', '2025-02-13')
    expect(dates).toHaveLength(4)

    for (let i = 1; i < dates.length; i++) {
      expect(new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()).toBe(86_400_000)
    }
  })

  it('returns a single date when start equals end', () => {
    expect(getDatesBetween('2025-02-10', '2025-02-10')).toHaveLength(1)
  })
})

describe('expandMultiDayEvents', () => {
  it('creates an entry for each day the event spans', () => {
    const map = expandMultiDayEvents([makeEvent({ date: '2025-02-18', endDate: '2025-02-20' })])
    expect(map.size).toBe(3)

    for (const [, dayEvents] of map) {
      expect(dayEvents).toHaveLength(1)
    }
  })

  it('keeps single-day events on a single date', () => {
    expect(expandMultiDayEvents([makeEvent()]).size).toBe(1)
  })
})

describe('isMultiDayEvent', () => {
  it.each([
    { date: '2025-02-18', endDate: '2025-02-20', expected: true },
    { date: '2025-02-18', endDate: undefined, expected: false },
    { date: '2025-02-18', endDate: '2025-02-18', expected: false },
  ])('returns $expected when date=$date endDate=$endDate', ({ date, endDate, expected }) => {
    expect(isMultiDayEvent({ start_time: date, end_time: endDate })).toBe(expected)
  })
})

describe('isEventStartDay / isEventEndDay', () => {
  const event = makeEvent({ date: '2025-02-18', endDate: '2025-02-20' })

  it('isEventStartDay matches the event start date', () => {
    expect(isEventStartDay(event, '2025-02-18')).toBe(true)
    expect(isEventStartDay(event, '2025-02-19')).toBe(false)
  })

  it('isEventEndDay matches the event end date', () => {
    expect(isEventEndDay(event, '2025-02-20')).toBe(true)
    expect(isEventEndDay(event, '2025-02-19')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Collision / positioning helpers
// ---------------------------------------------------------------------------

describe('eventsOverlapOnDay', () => {
  const day = '2025-02-10'

  it.each([
    { a: ['09:00', '10:00'], b: ['09:30', '11:00'], expected: true, label: 'partial overlap' },
    {
      a: ['09:00', '10:00'],
      b: ['10:00', '11:00'],
      expected: false,
      label: 'adjacent (no overlap)',
    },
    {
      a: ['08:00', '12:00'],
      b: ['09:00', '10:00'],
      expected: true,
      label: 'one contains the other',
    },
  ])('$label → $expected', ({ a, b, expected }) => {
    expect(
      eventsOverlapOnDay(
        {
          id: '1',
          name: 'Event 1',
          start_time: `${day} ${a[0]}`,
          end_time: `${day} ${a[1]}`,
          priority: 'high',
          category: 'work',
        },
        {
          id: '2',
          name: 'Event 2',
          start_time: `${day} ${b[0]}`,
          end_time: `${day} ${b[1]}`,
          priority: 'high',
          category: 'work',
        },
        day,
      ),
    ).toBe(expected)
  })
})

describe('getEventCollisions', () => {
  const day = '2025-02-10'

  it('groups overlapping events into the same collision group', () => {
    const groups = getEventCollisions(
      [
        {
          id: '1',
          name: 'Event 1',
          start_time: `${day} 09:00`,
          end_time: `${day} 10:00`,
          priority: 'high',
          category: 'work',
        },
        {
          id: '2',
          name: 'Event 2',
          start_time: `${day} 09:30`,
          end_time: `${day} 10:30`,
          priority: 'high',
          category: 'work',
        },
        {
          id: '3',
          name: 'Event 3',
          start_time: `${day} 14:00`,
          end_time: `${day} 15:00`,
          priority: 'high',
          category: 'work',
        },
      ],
      day,
    )
    expect(groups).toEqual([[0, 1], [2]])
  })

  it('gives each non-overlapping event its own group', () => {
    const groups = getEventCollisions(
      [
        {
          id: '1',
          name: 'Event 1',
          start_time: `${day} 09:00`,
          end_time: `${day} 10:00`,
          priority: 'high',
          category: 'work',
        },
        {
          id: '2',
          name: 'Event 2',
          start_time: `${day} 11:00`,
          end_time: `${day} 12:00`,
          priority: 'high',
          category: 'work',
        },
      ],
      day,
    )
    expect(groups).toHaveLength(2)
    expect(groups.every((g) => g.length === 1)).toBe(true)
  })
})

describe('getEventPositionInGroup', () => {
  it('splits width equally among group members', () => {
    const group = [0, 1]
    expect(getEventPositionInGroup(0, group)).toEqual({ left: 0, width: 50 })
    expect(getEventPositionInGroup(1, group)).toEqual({ left: 50, width: 50 })
  })

  it('gives full width to a solo event', () => {
    expect(getEventPositionInGroup(0, [0])).toEqual({ left: 0, width: 100 })
  })
})
