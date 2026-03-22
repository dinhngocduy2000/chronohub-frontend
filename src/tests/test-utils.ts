import type { Event } from '@/lib/sample-events'

export function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: '1',
    title: 'Test Event',
    date: '2025-02-10',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Test Location',
    description: 'A test event',
    category: 'work',
    color: '#004E89',
    ...overrides,
  }
}

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
