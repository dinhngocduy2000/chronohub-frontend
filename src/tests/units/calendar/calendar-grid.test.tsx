import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeEvent, WEEK_DAYS } from '@/tests/test-utils'
import { CalendarGrid } from '../../../components/reusable/calendar/calendar-grid'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: Record<string, unknown>) => (
    <a href={to as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}))

describe('CalendarGrid', () => {
  /** Fixed month so event dates (`2025-02-*`) align with the grid (not the machine clock). */
  const February2025 = new Date(2025, 1, 1)

  describe('rendering', () => {
    it('renders all 7 weekday headers', () => {
      render(<CalendarGrid currentDate={February2025} events={[]} />)
      for (const day of WEEK_DAYS) {
        expect(screen.getByText(day)).toBeInTheDocument()
      }
    })

    it('renders every day of February 2025 (1 through 28)', () => {
      render(<CalendarGrid currentDate={February2025} events={[]} />)
      for (let d = 1; d <= 28; d++) {
        expect(screen.getByText(String(d))).toBeInTheDocument()
      }
    })

    it('does not render day 29 in a non-leap February', () => {
      render(<CalendarGrid currentDate={February2025} events={[]} />)
      expect(screen.queryByText('29')).not.toBeInTheDocument()
    })

    it('renders day 29 in a leap-year February', () => {
      render(<CalendarGrid currentDate={new Date(2024, 1, 1)} events={[]} />)
      expect(screen.getByText('29')).toBeInTheDocument()
    })
  })

  describe('single-day events', () => {
    it('displays an event on its date', () => {
      render(
        <CalendarGrid
          currentDate={February2025}
          events={[makeEvent({ title: 'Morning Meeting', date: '2025-02-10' })]}
        />,
      )
      expect(screen.getByText('Morning Meeting')).toBeInTheDocument()
    })

    it('displays multiple events on the same date', () => {
      const events = [
        makeEvent({ id: '1', title: 'Event A', date: '2025-02-10' }),
        makeEvent({ id: '2', title: 'Event B', date: '2025-02-10' }),
      ]
      render(<CalendarGrid currentDate={February2025} events={events} />)
      expect(screen.getByText('Event A')).toBeInTheDocument()
      expect(screen.getByText('Event B')).toBeInTheDocument()
    })

    it('shows "+N more" when a day has more than 3 events', () => {
      const events = Array.from({ length: 5 }, (_, i) =>
        makeEvent({ id: String(i), title: `E${i}`, date: '2025-02-10' }),
      )
      render(<CalendarGrid currentDate={February2025} events={events} />)
      expect(screen.getByText('+2 more')).toBeInTheDocument()
    })

    it('does not show "+N more" when a day has 3 or fewer events', () => {
      const events = Array.from({ length: 3 }, (_, i) =>
        makeEvent({ id: String(i), title: `E${i}`, date: '2025-02-10' }),
      )
      render(<CalendarGrid currentDate={February2025} events={events} />)
      expect(screen.queryByText(/more/)).not.toBeInTheDocument()
    })

    it('ignores events that belong to a different month', () => {
      render(
        <CalendarGrid
          currentDate={February2025}
          events={[makeEvent({ title: 'March Event', date: '2025-03-05' })]}
        />,
      )
      expect(screen.queryByText('March Event')).not.toBeInTheDocument()
    })
  })

  describe('multi-day events', () => {
    it('renders a multi-day event bar', () => {
      const events = [
        makeEvent({ id: '12', title: 'Offsite', date: '2025-02-18', endDate: '2025-02-20' }),
      ]
      render(<CalendarGrid currentDate={February2025} events={events} />)
      expect(screen.getByText('Offsite')).toBeInTheDocument()
    })

    it('does not render multi-day events outside the displayed month', () => {
      const events = [makeEvent({ title: 'March Trip', date: '2025-03-01', endDate: '2025-03-05' })]
      render(<CalendarGrid currentDate={February2025} events={events} />)
      expect(screen.queryByText('March Trip')).not.toBeInTheDocument()
    })
  })

  describe('event links', () => {
    it('links each event to /events/:id', () => {
      const events = [makeEvent({ id: 'abc-123', title: 'Linked', date: '2025-02-10' })]
      render(<CalendarGrid currentDate={February2025} events={events} />)

      const link = screen
        .getAllByRole('link')
        .find((el) => el.getAttribute('href') === '/events/abc-123')
      expect(link).toBeDefined()
    })

    it('links a multi-day event to its detail page', () => {
      const events = [
        makeEvent({ id: 'multi-1', title: 'Multi', date: '2025-02-18', endDate: '2025-02-20' }),
      ]
      render(<CalendarGrid currentDate={February2025} events={events} />)

      const link = screen
        .getAllByRole('link')
        .find((el) => el.getAttribute('href') === '/events/multi-1')
      expect(link).toBeDefined()
    })
  })
})
