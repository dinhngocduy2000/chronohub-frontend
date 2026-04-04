import type { IEventListItem } from '@/interface/events'

/** Test helper: builds `IEventListItem` datetimes from convenient `date` / `endDate` / `startTime` / `endTime` / `title` fields. */
export type MakeEventOverrides = Partial<IEventListItem> & {
  title?: string
  date?: string
  endDate?: string
  startTime?: string
  endTime?: string
}

export function makeEvent(overrides: MakeEventOverrides = {}): IEventListItem {
  const startD = overrides.date ?? '2025-02-10'
  const endD = overrides.endDate ?? startD
  const startTime = overrides.startTime ?? '09:00'
  const endTime = overrides.endTime ?? '10:00'

  return {
    id: overrides.id ?? '1',
    name: overrides.name ?? overrides.title ?? 'Test Event',
    start_time: overrides.start_time ?? `${startD} ${startTime}`,
    end_time: overrides.end_time ?? `${endD} ${endTime}`,
    priority: overrides.priority ?? 'high',
    category: overrides.category ?? 'work',
  }
}

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
