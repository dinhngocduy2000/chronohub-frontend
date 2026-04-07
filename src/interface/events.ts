import type { EventCategory } from '@/enum/event-category'

export type IEventListItem = {
  id: string
  name: string
  start_time: string
  end_time: string
  priority: string
  /** Backend `EventCategory` value; `string` allows unknown values without breaking the UI. */
  category: EventCategory | string
}

export type IEventCalendarRequest = {
  month: number
  year: number
  group_id: string
  owner_id?: string
}
