import { EVENTS_ENDPOINTS } from '@/enum/endpoints'
import type { IResponseData } from '@/interface/api-response'
import type { ICalendarItem } from '@/interface/calendar'
import type { IEventCalendarRequest } from '@/interface/events'
import axiosConfig from '.'

export const getEventsCalendar = async (
  params: IEventCalendarRequest,
  signal?: AbortSignal,
): Promise<IResponseData<ICalendarItem[]>> => {
  return await axiosConfig.get(EVENTS_ENDPOINTS.EVENT_CALENDAR, { params, signal })
}
