import type { Activity } from '../lib/types'
import { dayKey, getMondayOfWeek, fmtTime } from '../lib/utils'
import CatDot from '../components/CatDot'
import StatusDot from '../components/StatusDot'

interface Props {
  activities: Activity[]
  onTap:      (a: Activity) => void
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ThisWeek({ activities, onTap }: Props) {
  const today  = new Date()
  const monday = getMondayOfWeek(today)
  const days   = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const inWeek = activities.filter(a => {
    if (a.status === 'planned' && a.scheduled_at) {
      const s = new Date(a.scheduled_at)
      return s >= monday && s < new Date(monday.getTime() + 7 * 86_400_000)
    }
    return a.this_week && a.status !== 'done'
  })

  function byDay(d: Date) {
    return inWeek.filter(
      a => a.scheduled_at && dayKey(new Date(a.scheduled_at)) === dayKey(d)
    )
  }
  const anytime = inWeek.filter(a => a.this_week && !a.scheduled_at)

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* header */}
      <div className="flex items-end justify-between" style={{ padding: '70px 22px 12px' }}>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)' }}>
            No. 02 — The Week
          </div>
          <h1 className="font-serif" style={{ fontSize: 48, lineHeight: 0.95, margin: '8px 0 0', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            <em>This</em> week.
          </h1>
        </div>
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
          {monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →
        </span>
      </div>

      <div className="rule-double" style={{ margin: '0 22px 0' }} />

      {/* anytime strip */}
      {anytime.length > 0 && (
        <div style={{ padding: '14px 22px 0' }}>
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)', marginBottom: 8 }}>
            Sometime this week
          </div>
          <div className="flex flex-col gap-2">
            {anytime.map(a => <WeekCard key={a.id} a={a} onTap={() => onTap(a)} />)}
          </div>
        </div>
      )}

      {/* horizontal day scroller */}
      <div
        className="flex overflow-x-auto hide-scrollbar"
        style={{ scrollSnapType: 'x mandatory', marginTop: 16, borderTop: '1px solid var(--hairline)' }}
      >
        {days.map((d, i) => {
          const items   = byDay(d)
          const isToday = dayKey(d) === dayKey(today)
          return (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col gap-2.5"
              style={{
                width: 220,
                scrollSnapAlign: 'start',
                borderRight: '1px solid var(--hairline)',
                padding: '16px 14px 24px',
                minHeight: '100%',
              }}
              data-drop-id={`weekday:${dayKey(d)}`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <div
                    className="font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: '0.12em', color: isToday ? 'var(--fab)' : 'var(--mute)' }}
                  >
                    {DAY_NAMES[i]}
                  </div>
                  <div
                    className="font-serif"
                    style={{ fontSize: 30, lineHeight: 1, marginTop: 4, color: isToday ? 'var(--fab)' : 'var(--ink)' }}
                  >
                    {d.getDate()}
                  </div>
                </div>
                <span className="font-mono" style={{ fontSize: 9, color: 'var(--mute)' }}>
                  {items.length || ''}
                </span>
              </div>
              <div className="rule-soft" />
              {items.length === 0 ? (
                <div
                  className="flex-1 flex items-center justify-center font-serif italic text-center"
                  style={{ fontSize: 18, color: 'var(--mute-2)', padding: 12 }}
                >
                  open
                </div>
              ) : (
                items.map(a => <WeekCard key={a.id} a={a} onTap={() => onTap(a)} />)
              )}
            </div>
          )
        })}
      </div>

      <div style={{ height: 100 }} />
    </div>
  )
}

function WeekCard({ a, onTap }: { a: Activity; onTap: () => void }) {
  return (
    <div
      onClick={onTap}
      className="cursor-pointer"
      style={{ border: '1px solid var(--hairline)', borderRadius: 10, padding: '12px 14px', background: 'var(--paper)' }}
    >
      <div className="flex justify-between items-start" style={{ marginBottom: 6 }}>
        <CatDot category={a.category} />
        <StatusDot userId={a.created_by} />
      </div>
      <div className="font-serif" style={{ fontSize: 17, lineHeight: 1.15, color: 'var(--ink)' }}>
        {a.title}
      </div>
      {a.scheduled_at && (
        <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--mute)', marginTop: 8 }}>
          {fmtTime(a.scheduled_at)}
        </div>
      )}
    </div>
  )
}
