export type IEventListItem = {
  id: string
  name: string
  start_time: string
  end_time: string
  priority: string
  category: string
}

export type IEventCalendarRequest = {
  month: number
  year: number
  group_id: string
  owner_id?: string
}
