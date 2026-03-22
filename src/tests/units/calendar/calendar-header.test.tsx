import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CalendarHeader } from '../../../components/reusable/calendar/calendar-header'

describe('CalendarHeader', () => {
  const onPrevious = vi.fn()
  const onNext = vi.fn()
  const onToday = vi.fn()
  const onViewChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  function renderHeader(overrides: Partial<Parameters<typeof CalendarHeader>[0]> = {}) {
    return render(
      <CalendarHeader
        currentDate={new Date(2025, 1, 15)}
        view="month"
        onPrevious={onPrevious}
        onNext={onNext}
        onToday={onToday}
        onViewChange={onViewChange}
        {...overrides}
      />,
    )
  }

  describe('rendering', () => {
    it('renders Previous, Today, and Next navigation buttons', () => {
      renderHeader()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('renders Month and Week view toggle buttons', () => {
      renderHeader()
      expect(screen.getByRole('button', { name: /month/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /week/i })).toBeInTheDocument()
    })

    it('displays month and year in month view', () => {
      renderHeader({ view: 'month' })
      expect(screen.getByText('February 2025')).toBeInTheDocument()
    })

    it('displays week range in week view', () => {
      renderHeader({ view: 'week' })
      expect(screen.getByText(/Feb/)).toBeInTheDocument()
    })
  })

  describe('navigation callbacks', () => {
    it('fires onPrevious when Previous is clicked', async () => {
      const user = userEvent.setup()
      renderHeader()
      await user.click(screen.getByRole('button', { name: /previous/i }))
      expect(onPrevious).toHaveBeenCalledOnce()
    })

    it('fires onNext when Next is clicked', async () => {
      const user = userEvent.setup()
      renderHeader()
      await user.click(screen.getByRole('button', { name: /next/i }))
      expect(onNext).toHaveBeenCalledOnce()
    })

    it('fires onToday when Today is clicked', async () => {
      const user = userEvent.setup()
      renderHeader()
      await user.click(screen.getByRole('button', { name: /today/i }))
      expect(onToday).toHaveBeenCalledOnce()
    })
  })

  describe('view toggle callbacks', () => {
    it('fires onViewChange("month") when Month is clicked', async () => {
      const user = userEvent.setup()
      renderHeader({ view: 'week' })
      await user.click(screen.getByRole('button', { name: /month/i }))
      expect(onViewChange).toHaveBeenCalledWith('month')
    })

    it('fires onViewChange("week") when Week is clicked', async () => {
      const user = userEvent.setup()
      renderHeader({ view: 'month' })
      await user.click(screen.getByRole('button', { name: /week/i }))
      expect(onViewChange).toHaveBeenCalledWith('week')
    })
  })

  describe('active view styling', () => {
    it('marks the Month button as active in month view', () => {
      renderHeader({ view: 'month' })
      expect(screen.getByRole('button', { name: /month/i })).toHaveAttribute(
        'data-variant',
        'default',
      )
      expect(screen.getByRole('button', { name: /week/i })).toHaveAttribute(
        'data-variant',
        'outline',
      )
    })

    it('marks the Week button as active in week view', () => {
      renderHeader({ view: 'week' })
      expect(screen.getByRole('button', { name: /week/i })).toHaveAttribute(
        'data-variant',
        'default',
      )
      expect(screen.getByRole('button', { name: /month/i })).toHaveAttribute(
        'data-variant',
        'outline',
      )
    })
  })

  describe('re-rendering with different props', () => {
    it('updates the heading when currentDate changes', () => {
      const { rerender } = renderHeader({ currentDate: new Date(2025, 0, 1) })
      expect(screen.getByText('January 2025')).toBeInTheDocument()

      rerender(
        <CalendarHeader
          currentDate={new Date(2025, 11, 1)}
          view="month"
          onPrevious={onPrevious}
          onNext={onNext}
          onToday={onToday}
          onViewChange={onViewChange}
        />,
      )
      expect(screen.getByText('December 2025')).toBeInTheDocument()
    })
  })
})
