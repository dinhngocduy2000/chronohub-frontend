import { useCallback, useState } from 'react'

type ViewType = 'month' | 'week'

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth()),
  ) // today's month
  const [view, setView] = useState<ViewType>('month')

  const navigatePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (view === 'month') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setDate(prev.getDate() - 7)
      }
      return newDate
    })
  }, [view])

  const navigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (view === 'month') {
        newDate.setMonth(prev.getMonth() + 1)
      } else {
        newDate.setDate(prev.getDate() + 7)
      }
      return newDate
    })
  }, [view])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const changeView = useCallback((newView: ViewType) => {
    setView(newView)
  }, [])

  return {
    currentDate,
    view,
    navigatePrevious,
    navigateNext,
    goToToday,
    changeView,
  }
}
