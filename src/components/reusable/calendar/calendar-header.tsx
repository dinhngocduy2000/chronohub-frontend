'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatMonthYear, formatWeekRange } from '@/lib/calendar-utils'

interface CalendarHeaderProps {
  currentDate: Date
  view: 'month' | 'week'
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: 'month' | 'week') => void
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 bg-background p-4 rounded-lg border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="h-9 w-9 p-0"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday} className="h-9 px-3">
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            className="h-9 w-9 p-0"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {view === 'month' ? formatMonthYear(currentDate) : formatWeekRange(currentDate)}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('month')}
            className="h-9 px-3"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('week')}
            className="h-9 px-3"
          >
            Week
          </Button>
        </div>
      </div>
    </div>
  )
}
