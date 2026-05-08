import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Activity } from '../lib/types'
import { CAT_LABEL, CAT_COLOR } from '../lib/constants'
import { dayKey, fmtTime } from '../lib/utils'
import CatDot from '../components/CatDot'
import StatusDot from '../components/StatusDot'

interface Props {
  activities:        Activity[]
  focusedMonth:      { year: number; month: number }
  setFocusedMonth:   (m: { year: number; month: number }) => void
  onTap:             (a: Activity) => void
  onScheduleDay:     (dateStr: string) => void
}

export default function CalendarView({ activities, focusedMonth, setFocusedMonth, onTap, onScheduleDay }: Props) {
  const today = new Date()
  const { year: y, month: m } = focusedMonth

  const first    = new Date(y, m, 1)
  const startDow = (first.getDay() + 6) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()

  const cells: { date: Date; out: boolean }[] = []
  const prevDays = new Date(y, m, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--)
    cells.push({ date: new Date(y, m - 1, prevDays - i), out: true })
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ date: new Date(y, m, i), out: false })
  while (cells.length % 7 !== 0)
    cells.push({ date: new Date(y, m + 1, cells.length - daysInMonth - startDow + 1), out: true })

  const todayKey = dayKey(today)
  const planned  = activities.filter(a => a.status === 'planned' && a.scheduled_at)

  const byDay = useMemo(() => {
    const map: Record<string, Activity[]> = {}
    planned.forEach(a => {
      const k = new Date(a.scheduled_at!).toISOString().slice(0, 10)
      ;(map[k] ??= []).push(a)
    })
    return map
  }, [planned])

  const [selectedDay, setSelectedDay] = useState(todayKey)
  const dayPlans = byDay[selectedDay] ?? []

  function prev() {
    setFocusedMonth(m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 })
  }
  function next() {
    setFocusedMonth(m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 })
  }

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* header */}
      <div className="flex items-end justify-between" style={{ padding: '70px 22px 14px' }}>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)' }}>
            No. 03 — The Calendar
          </div>
          <h1 className="font-serif" style={{ fontSize: 44, lineHeight: 0.95, margin: '8px 0 0', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            {first.toLocaleDateString('en-US', { month: 'long' })}{' '}
            <em style={{ color: 'var(--mute)' }}>{y}</em>
          </h1>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prev}
            className="flex items-center justify-center rounded-pill border"
            style={{ width: 40, height: 40, borderColor: 'var(--hairline)', color: 'var(--ink-2)' }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="flex items-center justify-center rounded-pill border"
            style={{ width: 40, height: 40, borderColor: 'var(--hairline)', color: 'var(--ink-2)' }}
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="rule-double" style={{ margin: '0 22px 14px' }} />

      {/* DOW header */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 0 6px' }}>
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="font-mono text-center" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--mute)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* calendar grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--hairline)' }}>
        {cells.map((c, i) => {
          const k     = dayKey(c.date)
          const items = byDay[k] ?? []
          const isToday = k === todayKey
          const isSel   = k === selectedDay
          return (
            <div
              key={i}
              className="cal-cell cursor-pointer"
              style={{
                minHeight: 78,
                padding: '8px 6px',
                borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--hairline-soft)',
                borderBottom: '1px solid var(--hairline-soft)',
                background: isSel ? 'var(--paper-2)' : undefined,
                opacity: c.out ? 0.4 : 1,
              }}
              data-drop-id={`cal:${k}`}
              onClick={() => setSelectedDay(k)}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: isToday ? 14 : 18,
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                  color: isToday ? 'var(--paper)' : 'var(--ink)',
                  background: isToday ? 'var(--ink)' : undefined,
                  borderRadius: isToday ? '50%' : undefined,
                  display: isToday ? 'inline-flex' : undefined,
                  alignItems: isToday ? 'center' : undefined,
                  justifyContent: isToday ? 'center' : undefined,
                  width: isToday ? 26 : undefined,
                  height: isToday ? 26 : undefined,
                  marginLeft: isToday ? -3 : undefined,
                  marginTop: isToday ? -2 : undefined,
                }}
              >
                {c.date.getDate()}
              </span>
              <div className="flex gap-1 flex-wrap" style={{ marginTop: 4 }}>
                {items.slice(0, 3).map(a => (
                  <span
                    key={a.id}
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: a.category ? CAT_COLOR[a.category] : '#7a7064' }}
                  />
                ))}
                {items.length > 3 && (
                  <span className="font-mono" style={{ fontSize: 8, color: 'var(--mute)' }}>
                    +{items.length - 3}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* selected day plans */}
      <div style={{ padding: '20px 22px 8px' }}>
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
          {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div className="rule-soft" style={{ margin: '0 22px' }} />

      {dayPlans.length === 0 ? (
        <div style={{ padding: '20px 22px', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--mute)', fontSize: 18 }}>
          Nothing planned.{' '}
          <button
            onClick={() => onScheduleDay(selectedDay)}
            style={{ color: 'var(--ink)', textDecoration: 'underline' }}
          >
            Schedule one
          </button>
          .
        </div>
      ) : (
        dayPlans.map(a => (
          <div
            key={a.id}
            onClick={() => onTap(a)}
            className="flex items-baseline gap-3 cursor-pointer"
            style={{ padding: '14px 22px', borderBottom: '1px solid var(--hairline-soft)' }}
          >
            <span className="font-mono flex-shrink-0" style={{ fontSize: 12, color: 'var(--mute)', minWidth: 56 }}>
              {fmtTime(a.scheduled_at!)}
            </span>
            <div className="flex-1">
              <div className="font-serif" style={{ fontSize: 18, lineHeight: 1.2, color: 'var(--ink)' }}>
                {a.title}
              </div>
              <div className="flex items-center flex-wrap font-mono uppercase" style={{ gap: '8px 14px', marginTop: 4, fontSize: 10, letterSpacing: '0.1em', color: 'var(--mute)' }}>
                <span className="inline-flex items-center gap-1.5">
                  <CatDot category={a.category} />
                  {a.category ? CAT_LABEL[a.category] : ''}
                </span>
                {a.location && <span>{a.location}</span>}
              </div>
            </div>
            <StatusDot userId={a.created_by} />
          </div>
        ))
      )}

      <div style={{ height: 120 }} />
    </div>
  )
}
