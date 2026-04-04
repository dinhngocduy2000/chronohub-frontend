import type { IEventListItem } from '@/interface/events'

export const categoryColors = {
  work: '#004E89', // Blue
  personal: '#06A77D', // Green
  meeting: '#FF6B35', // Orange
  deadline: '#D62828', // Red
} as const satisfies Record<string, string>

export function getCategoryColor(category: string): string {
  return categoryColors[category as keyof typeof categoryColors] ?? '#6B7280'
}

export const sampleEvents: IEventListItem[] = [
  {
    id: '1',
    name: 'Team Standup',
    start_time: '2025-02-03 09:00',
    end_time: '2025-02-03 09:30',
    priority: 'high',
    category: 'meeting',
  },
  {
    id: '2',
    name: 'Design Review',
    start_time: '2025-02-03 09:00',
    end_time: '2025-02-03 09:30',
    priority: 'high',
    category: 'work',
  },
  {
    id: '3',
    name: 'Project Deadline',
    start_time: '2025-02-07 23:59',
    end_time: '2025-02-07 23:59',
    priority: 'high',
    category: 'deadline',
  },
  {
    id: '4',
    name: 'Lunch with Client',
    start_time: '2025-02-10 12:00',
    end_time: '2025-02-10 13:30',
    priority: 'high',
    category: 'meeting',
  },
  {
    id: '5',
    name: 'Personal Training',
    start_time: '2025-02-12 18:00',
    end_time: '2025-02-12 19:00',
    priority: 'high',
    category: 'personal',
  },
  {
    id: '6',
    name: 'Code R eview Session',
    start_time: '2025-02-14 14:00',
    end_time: '2025-02-14 15:00',
    priority: 'high',
    category: 'work',
  },
  {
    id: '7',
    name: 'Birthday Party',
    start_time: '2025-02-17 19:00',
    end_time: '2025-02-17 22:00',
    priority: 'high',
    category: 'personal',
  },
  {
    id: '8',
    name: 'Q1 Planning Session',
    start_time: '2025-02-20 10:00',
    end_time: '2025-02-20 12:00',
    priority: 'high',
    category: 'work',
  },
  {
    id: '9',
    name: 'Dentist Appointment',
    start_time: '2025-02-22 15:00',
    end_time: '2025-02-22 15:30',
    priority: 'high',
    category: 'personal',
  },
  {
    id: '10',
    name: 'Sprint Review',
    start_time: '2025-02-27 15:00',
    end_time: '2025-02-27 16:30',
    priority: 'high',
    category: 'meeting',
  },
  {
    id: '11',
    name: 'Client Presentation',
    start_time: '2025-02-28 11:00',
    end_time: '2025-02-28 12:00',
    priority: 'high',
    category: 'work',
  },
  {
    id: '12',
    name: 'Company Offsite',
    start_time: '2025-02-18 09:00',
    end_time: '2025-02-20 17:00',
    priority: 'high',
    category: 'work',
  },
  {
    id: '13',
    name: 'Product Launch Week',
    start_time: '2025-02-24 08:00',
    end_time: '2025-02-26 18:00',
    priority: 'high',
    category: 'work',
  },
  {
    id: '14',
    name: 'Conference',
    start_time: '2025-02-17 09:00',
    end_time: '2025-02-17 17:00',
    priority: 'high',
    category: 'meeting',
  },
]
