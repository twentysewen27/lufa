import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Activity, ActivityInsert, ActivityPatch } from '../lib/types'

export function useActivities(userId: string | null) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    async function load() {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setActivities(data as Activity[])
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('activities-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setActivities(prev => {
              if (prev.some(a => a.id === (payload.new as Activity).id)) return prev
              return [payload.new as Activity, ...prev]
            })
          } else if (payload.eventType === 'UPDATE') {
            setActivities(prev =>
              prev.map(a => a.id === (payload.new as Activity).id ? payload.new as Activity : a)
            )
          } else if (payload.eventType === 'DELETE') {
            setActivities(prev => prev.filter(a => a.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const addActivity = useCallback(async (insert: ActivityInsert) => {
    const optimistic: Activity = {
      ...insert,
      id:         crypto.randomUUID(),
      this_week:  insert.this_week ?? false,
      updated_at: new Date().toISOString(),
    }
    setActivities(prev => [optimistic, ...prev])

    const { data, error } = await supabase
      .from('activities')
      .insert({ ...insert, this_week: insert.this_week ?? false })
      .select()
      .single()

    if (error) {
      setActivities(prev => prev.filter(a => a.id !== optimistic.id))
    } else if (data) {
      setActivities(prev => prev.map(a => a.id === optimistic.id ? data as Activity : a))
    }
  }, [])

  const updateActivity = useCallback(async (id: string, patch: ActivityPatch) => {
    setActivities(prev =>
      prev.map(a => a.id === id ? { ...a, ...patch, updated_at: new Date().toISOString() } : a)
    )
    await supabase
      .from('activities')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
  }, [])

  const deleteActivity = useCallback(async (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id))
    await supabase.from('activities').delete().eq('id', id)
  }, [])

  return { activities, loading, addActivity, updateActivity, deleteActivity }
}
