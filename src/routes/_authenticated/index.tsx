import { createFileRoute } from '@tanstack/react-router'
import { CalendarGrid } from '@/components/reusable/calendar/calendar-grid'
import { CalendarHeader } from '@/components/reusable/calendar/calendar-header'
import { CalendarWeek } from '@/components/reusable/calendar/calendar-week'
import { useCalendar } from '@/hooks/use-calendar'
import { multiDayEvents } from '@/lib/multi-day-events'
import { sampleEvents } from '@/lib/sample-events'
export const Route = createFileRoute('/_authenticated/')({ component: HomePage })

function HomePage() {
  const { currentDate, view, navigatePrevious, navigateNext, goToToday, changeView } = useCalendar()

  const allEvents = [...sampleEvents, ...multiDayEvents]

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

        {view === 'month' ? (
          <CalendarGrid currentDate={currentDate} events={allEvents} />
        ) : (
          <CalendarWeek currentDate={currentDate} events={allEvents} />
        )}
      </div>
    </main>
  )
}
