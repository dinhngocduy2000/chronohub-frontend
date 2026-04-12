import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { CalendarGrid } from '@/components/reusable/calendar/calendar-grid'
import { CalendarHeader } from '@/components/reusable/calendar/calendar-header'
import { CalendarWeek } from '@/components/reusable/calendar/calendar-week'
import { useCalendar } from '@/hooks/use-calendar'
import { useProfileQuery } from '@/queries/use-auth-query'
import { useEventsCalendarQuery } from '@/queries/use-events-calendar-query'

export const Route = createFileRoute('/_authenticated/')({ component: HomePage })

function HomePage() {
  const { currentDate, view, navigatePrevious, navigateNext, goToToday, changeView } = useCalendar()
  const { data: profileResponse } = useProfileQuery()
  const groupId = profileResponse?.data.group_id ?? ''

  const calendarParams = useMemo(
    () => ({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      group_id: groupId,
    }),
    [currentDate, groupId],
  )

  const { data: calendarResponse, isLoading } = useEventsCalendarQuery(calendarParams)

  const allEvents = useMemo(() => {
    const rows = calendarResponse?.data ?? []
    return rows.flatMap((row) => row.events)
  }, [calendarResponse?.data])

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="w-full mx-auto">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onPrevious={navigatePrevious}
          onNext={navigateNext}
          onToday={goToToday}
          onViewChange={changeView}
        />

        {isLoading && groupId ? (
          <p className="text-sm text-muted-foreground px-4 py-6 text-center">Loading events…</p>
        ) : view === 'month' ? (
          <CalendarGrid currentDate={currentDate} events={allEvents} />
        ) : (
          <CalendarWeek currentDate={currentDate} events={allEvents} />
        )}
      </div>
    </main>
  )
}
