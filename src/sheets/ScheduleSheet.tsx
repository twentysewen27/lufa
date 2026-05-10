import { useState } from 'react'
import Sheet from '../components/Sheet'
import type { Activity } from '../lib/types'
import { TIME_PRESETS } from '../lib/constants'
import { dayKey } from '../lib/utils'

interface Props {
  activity?:    Activity | null
  defaultDate?: string
  onClose:      () => void
  onSave:       (iso: string) => void
}

export default function ScheduleSheet({ activity: a, defaultDate, onClose, onSave }: Props) {
  const today = new Date()
  const init  = a?.scheduled_at
    ? new Date(a.scheduled_at)
    : defaultDate ? new Date(defaultDate) : today

  const [date, setDate] = useState(dayKey(init))
  const [time, setTime] = useState(
    a?.scheduled_at ? new Date(a.scheduled_at).toTimeString().slice(0, 5) : '19:30'
  )

  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  function save() {
    const dt = new Date(`${date}T${time}`)
    onSave(dt.toISOString())
  }

  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--mute)',
  }

  return (
    <Sheet onClose={onClose}>
      {/* header */}
      <div className="flex justify-between items-center" style={{ padding: '4px 22px 0' }}>
        <button onClick={onClose} style={eyebrow}>Cancel</button>
        <span style={eyebrow}>Schedule</span>
        <button onClick={save} style={{ ...eyebrow, color: 'var(--ink)' }}>Set ↵</button>
      </div>

      <div className="rule-soft" style={{ margin: '14px 0' }} />

      {a && (
        <>
          <div style={{ padding: '0 22px 12px' }}>
            <div className="font-serif italic" style={{ fontSize: 14, color: 'var(--mute)' }}>You're scheduling</div>
            <div className="font-serif" style={{ fontSize: 22, lineHeight: 1.15, marginTop: 4, color: 'var(--ink)' }}>
              {a.title}
            </div>
          </div>
          <div className="rule-soft" />
        </>
      )}

      {/* day picker */}
      <div style={{ padding: '14px 22px' }}>
        <div style={eyebrow}>Pick a day</div>
        <div
          className="overflow-x-auto hide-scrollbar"
          style={{ marginTop: 10, marginLeft: -22, marginRight: -22, padding: '0 22px' }}
        >
          <div className="flex gap-2">
            {days.map((d, i) => {
              const k   = dayKey(d)
              const sel = k === date
              return (
                <button
                  key={i}
                  onClick={() => setDate(k)}
                  className="flex flex-col items-center gap-1 border transition-all"
                  style={{
                    minWidth: 56, padding: '10px 6px', borderRadius: 12,
                    border: `1px solid ${sel ? 'var(--ink)' : 'var(--hairline)'}`,
                    background: sel ? 'var(--ink)' : 'transparent',
                  }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: sel ? 'var(--paper)' : 'var(--mute)' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="font-serif" style={{ fontSize: 22, lineHeight: 1, color: sel ? 'var(--paper)' : 'var(--ink)' }}>
                    {d.getDate()}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: sel ? 'var(--paper)' : 'var(--mute)' }}>
                    {d.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rule-soft" />

      {/* time picker */}
      <div style={{ padding: '14px 22px' }}>
        <div style={eyebrow}>At what time</div>
        <div className="flex items-baseline gap-3.5" style={{ marginTop: 12 }}>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="font-serif"
            style={{ background: 'transparent', border: 0, outline: 0, fontSize: 36, color: 'var(--ink)', letterSpacing: '-0.01em' }}
          />
          <span className="font-serif italic" style={{ fontSize: 18, color: 'var(--mute)' }}>
            on {(() => { const [sy, sm, sd] = date.split('-').map(Number); return new Date(sy, sm - 1, sd).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) })()}
          </span>
        </div>
        {/* quick-time presets */}
        <div className="flex flex-wrap gap-2" style={{ marginTop: 14 }}>
          {TIME_PRESETS.map(([label, t]) => (
            <button
              key={label}
              onClick={() => setTime(t)}
              className="inline-flex items-center h-[30px] px-3 rounded-pill border transition-all font-mono text-[11px] uppercase"
              style={{
                letterSpacing: '0.06em',
                background:  time === t ? 'var(--ink)' : 'transparent',
                color:       time === t ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: time === t ? 'var(--ink)' : 'var(--hairline)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  )
}
