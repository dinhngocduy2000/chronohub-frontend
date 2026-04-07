import { useQuery } from '@tanstack/react-query'
import { getEventsCalendar } from '@/api/events'
import { EVENTS_ENDPOINTS } from '@/enum/endpoints'
import type { IEventCalendarRequest } from '@/interface/events'

export const getEventsCalendarQueryKey = (params: IEventCalendarRequest) =>
  [EVENTS_ENDPOINTS.EVENT_CALENDAR, params] as const

export const useEventsCalendarQuery = (params: IEventCalendarRequest) => {
  return useQuery({
    queryKey: getEventsCalendarQueryKey(params),
    queryFn: ({ signal }) => getEventsCalendar(params, signal),
    enabled: Boolean(params.group_id),
  })
}
