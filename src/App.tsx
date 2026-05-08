import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import type { Tab, SheetState, Filters, Activity, ActivityPatch } from './lib/types'
import { useActivities } from './hooks/useActivities'

import SignIn       from './screens/SignIn'
import Backlog      from './screens/Backlog'
import ThisWeek     from './screens/ThisWeek'
import CalendarView from './screens/CalendarView'
import DoneView     from './screens/DoneView'

import FastCaptureSheet from './sheets/FastCaptureSheet'
import DetailSheet      from './sheets/DetailSheet'
import ScheduleSheet    from './sheets/ScheduleSheet'
import MarkDoneSheet    from './sheets/MarkDoneSheet'

import TabBar   from './components/TabBar'
import Confetti from './components/Confetti'

export default function App() {
  const [session,    setSession]    = useState<Session | null>(null)
  const [demoMode,   setDemoMode]   = useState(false)
  const [tab,        setTab]        = useState<Tab>('backlog')
  const [sheet,      setSheet]      = useState<SheetState>(null)
  const [filters,    setFilters]    = useState<Filters>({ q: '', cat: [], vibe: [] })
  const [focusedMonth, setFocusedMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [confetti, setConfetti] = useState<number | null>(null)
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  const userId      = session?.user?.id ?? (demoMode ? 'fab' : null)
  const currentUser = session?.user?.email?.startsWith('luca') ? 'luca' : 'fab'

  const { activities, addActivity, updateActivity, deleteActivity } = useActivities(userId)

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  void setDarkMode // expose for future settings panel

  // Helper
  function findActivity(id: string | null): Activity | undefined {
    return id ? activities.find(a => a.id === id) : undefined
  }

  // ── Actions ──────────────────────────────────────────────────────────

  function openDetail(a: Activity) { setSheet({ kind: 'detail', activityId: a.id }) }
  function closeSheet()            { setSheet(null) }

  function handleDetailAction(
    a: Activity,
    action: 'schedule' | 'this_week' | 'done' | 'delete' | 'to_backlog',
  ) {
    switch (action) {
      case 'schedule':
        setSheet({ kind: 'schedule', activityId: a.id })
        break
      case 'done':
        setSheet({ kind: 'done', activityId: a.id })
        break
      case 'this_week':
        updateActivity(a.id, { this_week: !a.this_week })
        closeSheet()
        break
      case 'delete':
        deleteActivity(a.id)
        closeSheet()
        break
      case 'to_backlog':
        updateActivity(a.id, { status: 'backlog', done_at: undefined, rating: undefined, done_note: undefined })
        closeSheet()
        break
    }
  }

  function handleEntryAction(a: Activity, action: 'schedule' | 'done') {
    if (action === 'schedule') setSheet({ kind: 'schedule', activityId: a.id })
    if (action === 'done')     setSheet({ kind: 'done',     activityId: a.id })
  }

  function handleScheduleSave(iso: string, activityId: string | null) {
    if (activityId) {
      updateActivity(activityId, { status: 'planned', scheduled_at: iso, this_week: false })
    }
    closeSheet()
  }

  function handleDoneSave(a: Activity, patch: ActivityPatch) {
    updateActivity(a.id, { status: 'done', done_at: new Date().toISOString(), ...patch })
    closeSheet()
    fireConfetti()
  }

  function fireConfetti() {
    const month = new Date().toISOString().slice(0, 7)
    if (sessionStorage.getItem('lufa-conf-month') === month) return
    sessionStorage.setItem('lufa-conf-month', month)
    setConfetti(Date.now())
    setTimeout(() => setConfetti(null), 1400)
  }

  // ── Auth gate ─────────────────────────────────────────────────────────

  if (!session && !demoMode) {
    return (
      <div
        className="relative flex flex-col h-full app-bg"
        style={{ background: 'var(--paper)', color: 'var(--ink)' }}
      >
        <SignIn onDemoSignIn={() => setDemoMode(true)} />
      </div>
    )
  }

  // ── Sheet target ──────────────────────────────────────────────────────

  const detailActivity   = sheet?.kind === 'detail'   ? findActivity(sheet.activityId) : undefined
  const scheduleActivity = sheet?.kind === 'schedule' ? findActivity(sheet.activityId) : undefined
  const doneActivity     = sheet?.kind === 'done'     ? findActivity(sheet.activityId) : undefined
  const scheduleDefault  = sheet?.kind === 'schedule' ? sheet.defaultDate : undefined

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden app-bg"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* screens */}
      {tab === 'backlog' && (
        <Backlog
          activities={activities}
          filters={filters}
          setFilters={setFilters}
          currentUser={currentUser}
          onTap={openDetail}
          onAction={handleEntryAction}
        />
      )}
      {tab === 'week' && (
        <ThisWeek activities={activities} onTap={openDetail} />
      )}
      {tab === 'calendar' && (
        <CalendarView
          activities={activities}
          focusedMonth={focusedMonth}
          setFocusedMonth={setFocusedMonth}
          onTap={openDetail}
          onScheduleDay={(date) => setSheet({ kind: 'schedule', activityId: null, defaultDate: date })}
        />
      )}
      {tab === 'done' && (
        <DoneView activities={activities} onTap={openDetail} />
      )}

      {/* FAB */}
      <button
        onClick={() => setSheet({ kind: 'capture' })}
        aria-label="New idea"
        className="absolute z-40 flex items-center justify-center rounded-full transition-transform duration-150 active:scale-90"
        style={{
          right:     22,
          bottom:    96,
          width:     64,
          height:    64,
          background:'var(--ink)',
          color:     'var(--paper)',
          boxShadow: '0 12px 30px rgba(26,23,20,0.35), 0 4px 8px rgba(26,23,20,0.2)',
        }}
      >
        <span className="font-serif" style={{ fontSize: 36, lineHeight: 1, marginTop: -3 }}>+</span>
      </button>

      {/* tab bar */}
      <TabBar active={tab} onChange={setTab} />

      {/* sheets */}
      {sheet?.kind === 'capture' && (
        <FastCaptureSheet
          currentUser={currentUser}
          onClose={closeSheet}
          onSave={(insert) => { addActivity(insert); closeSheet() }}
        />
      )}
      {sheet?.kind === 'detail' && detailActivity && (
        <DetailSheet
          activity={detailActivity}
          onClose={closeSheet}
          onAction={(action) => handleDetailAction(detailActivity, action)}
        />
      )}
      {sheet?.kind === 'schedule' && (
        <ScheduleSheet
          activity={scheduleActivity ?? null}
          defaultDate={scheduleDefault}
          onClose={closeSheet}
          onSave={(iso) => handleScheduleSave(iso, sheet.activityId)}
        />
      )}
      {sheet?.kind === 'done' && doneActivity && (
        <MarkDoneSheet
          activity={doneActivity}
          onClose={closeSheet}
          onSave={(patch) => handleDoneSave(doneActivity, patch)}
        />
      )}

      {/* confetti */}
      {confetti && <Confetti key={confetti} />}
    </div>
  )
}
