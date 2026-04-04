import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getCategoryColor } from '@/lib/sample-events'
import { makeEvent } from '@/tests/test-utils'
import { EventItem } from '../../../components/reusable/calendar/event-item'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: Record<string, unknown>) => (
    <a href={to as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}))

describe('EventItem', () => {
  const event = makeEvent({
    id: 'evt-1',
    title: 'Team Standup',
    date: '2025-02-03',
    startTime: '09:00',
    endTime: '09:30',
    category: 'meeting',
  })

  it('renders event name and formatted start time', () => {
    render(<EventItem event={event} />)
    expect(screen.getByText('Team Standup')).toBeInTheDocument()
    expect(screen.getByText('9:00 AM')).toBeInTheDocument()
  })

  it('applies category color as background', () => {
    render(<EventItem event={event} />)
    const block = screen.getByTitle('Team Standup')
    expect(block).toHaveStyle({ backgroundColor: getCategoryColor('meeting') })
  })

  it('links to the event detail page', () => {
    render(<EventItem event={event} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/events/evt-1')
  })

  it('sets a title attribute with the event name', () => {
    render(<EventItem event={event} />)
    expect(screen.getByTitle('Team Standup')).toBeInTheDocument()
  })

  it('renders PM times correctly', () => {
    render(<EventItem event={makeEvent({ startTime: '14:30' })} />)
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })
})
