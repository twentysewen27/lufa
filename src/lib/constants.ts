import type { Category, Vibe, Cost, Duration, LongtermPhase } from './types'

export const CATEGORIES: Category[] = [
  'date_night', 'trip', 'restaurant', 'hike', 'event', 'culture', 'learn', 'routine', 'other',
]

export const CAT_LABEL: Record<Category, string> = {
  date_night: 'Date night',
  trip:       'Trip',
  restaurant: 'Restaurant',
  hike:       'Hike',
  event:      'Event',
  culture:    'Culture',
  learn:      'Learn',
  routine:    'Routine',
  other:      'Other',
}

export const CAT_COLOR: Record<Category, string> = {
  date_night: '#b25a3c',
  trip:       '#2A6FDB',
  restaurant: '#c08a3e',
  hike:       '#3a7d5e',
  event:      '#8b3a8b',
  culture:    '#4a6741',
  learn:      '#2e7a8a',
  routine:    '#6b6359',
  other:      '#7a7064',
}

export const VIBES: Vibe[] = ['chill', 'adventurous', 'romantic', 'social', 'cozy', 'active']

export const COSTS: Cost[] = ['$', '$$', '$$$', '$$$$']

export const DURATIONS: Duration[] = ['<1h', '2-3h', 'half-day', 'full-day', 'weekend', 'longer']

export const USERS: Record<string, { id: string; name: string; short: string; color: string }> = {
  fab:  { id: 'fab',  name: 'Fabian', short: 'F', color: '#D97757' },
  luca: { id: 'luca', name: 'Luca',   short: 'L', color: '#2A6FDB' },
}

export const TIME_PRESETS: [string, string][] = [
  ['Morning', '09:30'],
  ['Lunch',   '12:30'],
  ['Afternoon','15:00'],
  ['Dinner',  '19:30'],
  ['Late',    '22:00'],
]

export const RATING_LABELS = ['', 'meh', 'fine', 'nice', 'great', 'unforgettable']

export const PHASE_LABEL: Record<LongtermPhase, string> = {
  'in-motion':      'In motion',
  'researching':    'Researching',
  'when-it-warms':  'When it warms',
  'someday':        'Someday',
}

export const PHASE_ORDER: LongtermPhase[] = [
  'in-motion', 'researching', 'when-it-warms', 'someday',
]
