import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeEvent, WEEK_DAYS } from '@/tests/test-utils'
import { CalendarWeek } from '../../../components/reusable/calendar/calendar-week'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: Record<string, unknown>) => (
    <a href={to as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}))

describe('CalendarWeek', () => {
  // Wed Feb 12, 2025 → displays the week Sun Feb 9 – Sat Feb 15
  const wedFeb12 = new Date(2025, 1, 12)

  describe('rendering', () => {
    it('renders the "Time" column label and all 7 weekday headers', () => {
      render(<CalendarWeek currentDate={wedFeb12} events={[]} />)
      expect(screen.getByText('Time')).toBeInTheDocument()
      for (const day of WEEK_DAYS) {
        expect(screen.getByText(day)).toBeInTheDocument()
      }
    })

    it('renders the correct date numbers for the week (Feb 9–15)', () => {
      render(<CalendarWeek currentDate={wedFeb12} events={[]} />)
      for (let d = 9; d <= 15; d++) {
        expect(screen.getByText(String(d))).toBeInTheDocument()
      }
    })

    it('renders 24-hour time labels', () => {
      render(<CalendarWeek currentDate={wedFeb12} events={[]} />)
      expect(screen.getByText('00:00')).toBeInTheDocument()
      expect(screen.getByText('12:00')).toBeInTheDocument()
      expect(screen.getByText('23:00')).toBeInTheDocument()
    })
  })

  describe('event display', () => {
    it('renders an event that falls within the week', () => {
      render(
        <CalendarWeek
          currentDate={wedFeb12}
          events={[makeEvent({ title: 'Monday Meeting', date: '2025-02-10' })]}
        />,
      )
      expect(screen.getByText('Monday Meeting')).toBeInTheDocument()
    })

    it('does not render events outside the displayed week', () => {
      render(
        <CalendarWeek
          currentDate={wedFeb12}
          events={[makeEvent({ title: 'Far Away', date: '2025-03-01' })]}
        />,
      )
      expect(screen.queryByText('Far Away')).not.toBeInTheDocument()
    })

    it('links an event to /events/:id', () => {
      render(
        <CalendarWeek
          currentDate={wedFeb12}
          events={[makeEvent({ id: 'wk-42', title: 'Linked', date: '2025-02-10' })]}
        />,
      )
      expect(screen.getByRole('link')).toHaveAttribute('href', '/events/wk-42')
    })

    it('shows event time range when there is no collision', () => {
      render(
        <CalendarWeek
          currentDate={wedFeb12}
          events={[
            makeEvent({ title: 'Solo', date: '2025-02-10', startTime: '09:00', endTime: '10:00' }),
          ]}
        />,
      )
      expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument()
    })

    it('applies event color as background', () => {
      render(
        <CalendarWeek
          currentDate={wedFeb12}
          events={[makeEvent({ title: 'Colored', date: '2025-02-10', color: '#D62828' })]}
        />,
      )
      const block = screen.getByText('Colored').closest('div[style]')
      expect(block).toHaveStyle({ backgroundColor: '#D62828' })
    })
  })

  describe('multi-day events', () => {
    it('appears on each day it spans within the week', () => {
      render(
        <CalendarWeek
          currentDate={wedFeb12}
          events={[
            makeEvent({ id: 'multi-1', title: 'Multi', date: '2025-02-10', endDate: '2025-02-12' }),
          ]}
        />,
      )
      const multiLinks = screen
        .getAllByRole('link')
        .filter((el) => el.getAttribute('href') === '/events/multi-1')
      expect(multiLinks).toHaveLength(3)
    })
  })

  describe('overlapping events', () => {
    const overlapping = [
      makeEvent({
        id: '1',
        title: 'Overlap A',
        date: '2025-02-10',
        startTime: '09:00',
        endTime: '10:00',
      }),
      makeEvent({
        id: '2',
        title: 'Overlap B',
        date: '2025-02-10',
        startTime: '09:30',
        endTime: '10:30',
      }),
    ]

    it('renders both overlapping events', () => {
      render(<CalendarWeek currentDate={wedFeb12} events={overlapping} />)
      expect(screen.getByText('Overlap A')).toBeInTheDocument()
      expect(screen.getByText('Overlap B')).toBeInTheDocument()
    })

    it('reduces each to 50% width for side-by-side layout', () => {
      render(<CalendarWeek currentDate={wedFeb12} events={overlapping} />)
      const linkA = screen.getByText('Overlap A').closest<HTMLAnchorElement>('a')
      const linkB = screen.getByText('Overlap B').closest<HTMLAnchorElement>('a')
      expect(linkA?.style.width).toContain('50%')
      expect(linkB?.style.width).toContain('50%')
    })
  })

  describe('re-rendering with different props', () => {
    it('updates visible dates when the week changes', () => {
      const { rerender } = render(<CalendarWeek currentDate={wedFeb12} events={[]} />)
      expect(screen.getByText('9')).toBeInTheDocument()

      rerender(<CalendarWeek currentDate={new Date(2025, 1, 19)} events={[]} />)
      expect(screen.getByText('16')).toBeInTheDocument()
      expect(screen.queryByText('9')).not.toBeInTheDocument()
    })
  })
})
