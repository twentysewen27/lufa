export type Category =
  | 'date_night'
  | 'trip'
  | 'restaurant'
  | 'hike'
  | 'event'
  | 'culture'
  | 'learn'
  | 'routine'
  | 'other'

export type Vibe = 'chill' | 'adventurous' | 'romantic' | 'social' | 'cozy' | 'active'
export type Cost = '$' | '$$' | '$$$' | '$$$$'
export type Duration = '<1h' | '2-3h' | 'half-day' | 'full-day' | 'weekend' | 'longer'
export type Status = 'backlog' | 'planned' | 'done'

export interface Activity {
  id: string
  title: string
  category?: Category
  vibe?: Vibe[]
  notes?: string
  link?: string
  location?: string
  est_cost?: Cost
  est_duration?: Duration
  status: Status
  scheduled_at?: string
  done_at?: string
  rating?: 1 | 2 | 3 | 4 | 5
  done_note?: string
  this_week: boolean
  longterm: boolean
  longterm_phase?: LongtermPhase
  created_by: string
  created_at: string
  updated_at: string
}

export type ActivityInsert = Omit<Activity, 'id' | 'updated_at'>
export type ActivityPatch = Partial<Omit<Activity, 'id' | 'created_at' | 'created_by'>>

export type LongtermPhase = 'in-motion' | 'researching' | 'when-it-warms' | 'someday'

export type Tab = 'backlog' | 'next' | 'calendar' | 'done'

export type SheetState =
  | { kind: 'capture' }
  | { kind: 'edit';     activityId: string }
  | { kind: 'detail';   activityId: string }
  | { kind: 'schedule'; activityId: string | null; defaultDate?: string }
  | { kind: 'done';     activityId: string }
  | null

export interface Filters {
  q: string
  cat: Category[]
  vibe: Vibe[]
}
