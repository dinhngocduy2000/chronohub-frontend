import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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
    location: 'Conference Room A',
    description: 'Daily sync',
    category: 'meeting',
    color: '#FF6B35',
  })

  it('renders event title, formatted time, and location', () => {
    render(<EventItem event={event} />)
    expect(screen.getByText('Team Standup')).toBeInTheDocument()
    expect(screen.getByText('9:00 AM')).toBeInTheDocument()
    expect(screen.getByText('Conference Room A')).toBeInTheDocument()
  })

  it('applies event color as background', () => {
    render(<EventItem event={event} />)
    const block = screen.getByTitle('Team Standup at Conference Room A')
    expect(block).toHaveStyle({ backgroundColor: '#FF6B35' })
  })

  it('links to the event detail page', () => {
    render(<EventItem event={event} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/events/evt-1')
  })

  it('sets a title attribute with event name and location', () => {
    render(<EventItem event={event} />)
    expect(screen.getByTitle('Team Standup at Conference Room A')).toBeInTheDocument()
  })

  it('renders PM times correctly', () => {
    render(<EventItem event={makeEvent({ startTime: '14:30' })} />)
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })
})
