import { useQuery } from '@tanstack/react-query'
import { EVENTS_ENDPOINTS } from '@/enum/endpoints'
import { getEvents } from '@/generated/api/events/events'
import type { ListCalendarEventsApiV1EventsGetParams } from '@/generated/types'

export const getEventsCalendarQueryKey = (params: ListCalendarEventsApiV1EventsGetParams) =>
  [EVENTS_ENDPOINTS.EVENT_CALENDAR, params] as const

export const useEventsCalendarQuery = (params: ListCalendarEventsApiV1EventsGetParams) => {
  return useQuery({
    queryKey: getEventsCalendarQueryKey(params),
    queryFn: ({ signal }) => getEvents().listCalendarEventsApiV1EventsGet(params, signal),
    enabled: Boolean(params.group_id),
  })
}
