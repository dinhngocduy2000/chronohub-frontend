import type { EventCategory } from '@/enum/event-category'

export const categoryColors: Record<EventCategory, string> = {
  hang_out: '#0D9488', // teal — casual / social
  date: '#DB2777', // pink — date night
  business: '#1D4ED8', // blue — work
  coffee: '#92400E', // brown — coffee
  food: '#EA580C', // orange — food
  gaming: '#7C3AED', // violet — gaming
  movie: '#4338CA', // indigo — film
  other: '#6B7280', // gray — fallback within enum
}

export function getCategoryColor(category: string): string {
  if (category in categoryColors) {
    return categoryColors[category as EventCategory]
  }
  return '#6B7280'
}
