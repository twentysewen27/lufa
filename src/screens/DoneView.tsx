import { useMemo } from 'react'
import type { Activity } from '../lib/types'
import { CAT_LABEL } from '../lib/constants'
import { fmtDate } from '../lib/utils'
import CatDot from '../components/CatDot'
import StatusDot from '../components/StatusDot'
import { StarsSmall } from '../components/Stars'

interface Props {
  activities: Activity[]
  onTap:      (a: Activity) => void
}

export default function DoneView({ activities, onTap }: Props) {
  const items = activities
    .filter(a => a.status === 'done')
    .sort((a, b) => new Date(b.done_at!).getTime() - new Date(a.done_at!).getTime())

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; items: Activity[] }>()
    items.forEach(a => {
      const d = new Date(a.done_at!)
      const k = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      if (!map.has(k)) map.set(k, { label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), items: [] })
      map.get(k)!.items.push(a)
    })
    return Array.from(map.values())
  }, [items])

  const ratings = items.filter(a => a.rating).map(a => a.rating!)
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* header */}
      <div style={{ padding: '70px 22px 12px' }}>
        <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)' }}>
          No. 04 — The Memory Log
        </div>
        <div className="font-serif" style={{ fontSize: 64, lineHeight: 0.95, margin: '8px 0 0', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          <em>{items.length}</em>
          <br />
          <span style={{ fontSize: 30, color: 'var(--mute)' }}>things done<br />together.</span>
        </div>
      </div>

      <div className="rule-double" style={{ margin: '0 22px 14px' }} />

      {/* stats */}
      <div className="flex justify-between" style={{ padding: '0 22px 18px' }}>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>Average rating</div>
          <div className="font-serif" style={{ fontSize: 22, marginTop: 4, color: 'var(--ink)' }}>
            {avg > 0 ? avg.toFixed(1) : '—'}
            {avg > 0 && <em className="font-serif" style={{ color: 'var(--mute)', marginLeft: 4 }}>/ 5</em>}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>Last together</div>
          <div className="font-serif" style={{ fontSize: 22, marginTop: 4, color: 'var(--ink)' }}>
            {items[0] ? fmtDate(items[0].done_at!) : '—'}
          </div>
        </div>
      </div>

      <div className="rule-soft" style={{ margin: '0 22px' }} />

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-3.5" style={{ padding: '48px 32px' }}>
          <p className="font-serif italic m-0" style={{ fontSize: 22, color: 'var(--ink)' }}>
            Nothing yet — but soon.
          </p>
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
            Mark something done and it'll live here.
          </span>
        </div>
      ) : (
        groups.map((g, gi) => (
          <div key={gi}>
            <div className="flex items-baseline gap-2" style={{ padding: '20px 22px 8px' }}>
              <span className="font-serif italic" style={{ fontSize: 24, color: 'var(--ink)' }}>{g.label}</span>
              <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
                — {g.items.length}
              </span>
            </div>
            <div className="rule-soft" style={{ margin: '0 22px' }} />
            {g.items.map(a => (
              <div
                key={a.id}
                onClick={() => onTap(a)}
                className="grid cursor-pointer"
                style={{
                  padding: '16px 22px',
                  gridTemplateColumns: '52px 1fr auto',
                  gap: 12,
                  borderBottom: '1px solid var(--hairline-soft)',
                }}
              >
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--mute)', paddingTop: 6 }}>
                  {new Date(a.done_at!).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                </span>
                <div>
                  <div className="font-serif" style={{ fontSize: 19, lineHeight: 1.2, color: 'var(--ink)' }}>
                    {a.title}
                  </div>
                  {a.done_note && (
                    <div className="font-serif italic" style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--mute)', marginTop: 4 }}>
                      "{a.done_note}"
                    </div>
                  )}
                  <div className="flex items-center flex-wrap font-mono uppercase" style={{ gap: '8px 14px', marginTop: 8, fontSize: 10, letterSpacing: '0.1em', color: 'var(--mute)' }}>
                    {a.rating && <StarsSmall rating={a.rating} />}
                    {a.category && (
                      <span className="inline-flex items-center gap-1.5">
                        <CatDot category={a.category} />
                        {CAT_LABEL[a.category]}
                      </span>
                    )}
                  </div>
                </div>
                <StatusDot userId={a.created_by} />
              </div>
            ))}
          </div>
        ))
      )}

      <div style={{ height: 120 }} />
    </div>
  )
}
