export interface Event {
  id: string
  title: string
  date: string // YYYY-MM-DD format (start date)
  endDate?: string // YYYY-MM-DD format (end date for multi-day events)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  location: string
  description: string
  category: 'work' | 'personal' | 'meeting' | 'deadline'
  color: string
  isAllDay?: boolean // For all-day events
}

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: '2025-02-03',
    startTime: '09:00',
    endTime: '09:30',
    location: 'Conference Room A',
    description: 'Daily team synchronization meeting',
    category: 'meeting',
    color: '#FF6B35',
  },
  {
    id: '2',
    title: 'Design Review',
    date: '2025-02-03',
    startTime: '09:00',
    endTime: '09:30',
    location: 'Design Studio',
    description: 'Review latest design mockups and gather feedback',
    category: 'work',
    color: '#004E89',
  },
  {
    id: '3',
    title: 'Project Deadline',
    date: '2025-02-07',
    startTime: '23:59',
    endTime: '23:59',
    location: 'Submit online',
    description: 'Final submission deadline for Q1 project',
    category: 'deadline',
    color: '#D62828',
  },
  {
    id: '4',
    title: 'Lunch with Client',
    date: '2025-02-10',
    startTime: '12:00',
    endTime: '13:30',
    location: 'Downtown Restaurant',
    description: 'Discuss new features and roadmap',
    category: 'meeting',
    color: '#FF6B35',
  },
  {
    id: '5',
    title: 'Personal Training',
    date: '2025-02-12',
    startTime: '18:00',
    endTime: '19:00',
    location: 'Fitness Center',
    description: 'Weekly workout session',
    category: 'personal',
    color: '#06A77D',
  },
  {
    id: '6',
    title: 'Code Review Session',
    date: '2025-02-14',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Virtual - Zoom',
    description: 'Review pull requests from team members',
    category: 'work',
    color: '#004E89',
  },
  {
    id: '7',
    title: 'Birthday Party',
    date: '2025-02-17',
    startTime: '19:00',
    endTime: '22:00',
    location: 'Home',
    description: 'Celebrate with friends and family',
    category: 'personal',
    color: '#06A77D',
  },
  {
    id: '8',
    title: 'Q1 Planning Session',
    date: '2025-02-20',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Conference Room B',
    description: 'Plan quarterly objectives and milestones',
    category: 'work',
    color: '#004E89',
  },
  {
    id: '9',
    title: 'Dentist Appointment',
    date: '2025-02-22',
    startTime: '15:00',
    endTime: '15:30',
    location: 'Downtown Dental Clinic',
    description: 'Regular checkup and cleaning',
    category: 'personal',
    color: '#06A77D',
  },
  {
    id: '10',
    title: 'Sprint Review',
    date: '2025-02-27',
    startTime: '15:00',
    endTime: '16:30',
    location: 'Conference Room A',
    description: 'Demo features completed this sprint',
    category: 'meeting',
    color: '#FF6B35',
  },
  {
    id: '11',
    title: 'Client Presentation',
    date: '2025-02-28',
    startTime: '11:00',
    endTime: '12:00',
    location: 'Client Office',
    description: 'Present project progress and updates',
    category: 'work',
    color: '#004E89',
  },
  {
    id: '12',
    title: 'Company Offsite',
    date: '2025-02-18',
    endDate: '2025-02-20',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Mountain Resort',
    description: 'Team building and strategic planning retreat',
    category: 'work',
    color: '#004E89',
    isAllDay: true,
  },
  {
    id: '13',
    title: 'Product Launch Week',
    date: '2025-02-24',
    endDate: '2025-02-26',
    startTime: '08:00',
    endTime: '18:00',
    location: 'HQ and Remote',
    description: 'Product launch campaign and support',
    category: 'work',
    color: '#004E89',
  },
  {
    id: '14',
    title: 'Conference',
    date: '2025-02-15',
    endDate: '2025-02-17',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Convention Center',
    description: 'Annual tech conference and networking',
    category: 'meeting',
    color: '#FF6B35',
  },
]

// Category to color mapping
export const categoryColors: Record<Event['category'], string> = {
  work: '#004E89', // Blue
  personal: '#06A77D', // Green
  meeting: '#FF6B35', // Orange
  deadline: '#D62828', // Red
}
