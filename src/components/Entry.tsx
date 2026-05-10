import { useState, useRef } from 'react'
import { MapPin, Clock, Euro } from 'lucide-react'
import type { Activity } from '../lib/types'
import { CAT_LABEL } from '../lib/constants'
import CatDot from './CatDot'
import StatusDot from './StatusDot'

interface Props {
  activity: Activity
  index:    number
  onTap:    () => void
  onAction: (action: 'schedule' | 'done') => void
  onLongPress?: () => void
}

export default function Entry({ activity: a, index, onTap, onAction }: Props) {
  const [swipeOpen, setSwipeOpen] = useState(false)
  const startX = useRef(0)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragging = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX
    dragging.current = false
    longPressTimer.current = setTimeout(() => {
      dragging.current = true
    }, 380)
  }

  function onPointerMove(e: React.PointerEvent) {
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 8 && longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (dragging.current) return
    const dx = e.clientX - startX.current
    if (dx < -40) { setSwipeOpen(true); return }
    if (swipeOpen) { setSwipeOpen(false); return }
    onTap()
  }

  const num = String(index + 1).padStart(2, '0')

  return (
    <div className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--hairline-soft)' }}>
      {/* swipe actions */}
      <div className="absolute right-0 top-0 bottom-0 flex z-10" style={{ width: 160 }}>
        <button
          className="flex-1 flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-widest text-paper"
          style={{ background: 'var(--ink)' }}
          onClick={() => { setSwipeOpen(false); onAction('schedule') }}
        >
          <span>Schedule</span>
        </button>
        <button
          className="flex-1 flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-widest text-paper"
          style={{ background: 'var(--done)' }}
          onClick={() => { setSwipeOpen(false); onAction('done') }}
        >
          <span>Done</span>
        </button>
      </div>

      {/* sliding row */}
      <div
        className="entry-slide"
        data-open={swipeOpen}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          className="grid gap-3.5 cursor-pointer active:bg-paper-2 transition-colors duration-100"
          style={{
            gridTemplateColumns: '32px 1fr auto',
            padding: '18px 22px 16px',
          }}
        >
          {/* index number */}
          <span
            className="font-mono text-[11px] tracking-widest uppercase pt-2"
            style={{ color: 'var(--mute-2)' }}
          >
            {num}
          </span>

          {/* content */}
          <div>
            <div
              className="font-serif leading-tight"
              style={{ fontSize: 24, letterSpacing: '-0.01em', color: 'var(--ink)' }}
            >
              {a.title}
            </div>
            {/* metadata row */}
            <div
              className="flex flex-wrap items-center font-mono uppercase"
              style={{ gap: '8px 14px', marginTop: 10, fontSize: 10, letterSpacing: '0.1em', color: 'var(--mute)' }}
            >
              {a.category && (
                <span className="inline-flex items-center gap-1.5">
                  <CatDot category={a.category} />
                  {CAT_LABEL[a.category]}
                </span>
              )}
              {a.vibe && a.vibe.length > 0 && (
                <span>
                  {a.vibe[0]}{a.vibe.length > 1 ? ` +${a.vibe.length - 1}` : ''}
                </span>
              )}
              {a.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={10} strokeWidth={1.5} />
                  {a.location}
                </span>
              )}
              {a.est_cost && (
                <span className="inline-flex items-center gap-1">
                  <Euro size={10} strokeWidth={1.5} />
                  {a.est_cost}
                </span>
              )}
              {a.est_duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={10} strokeWidth={1.5} />
                  {a.est_duration}
                </span>
              )}
            </div>
          </div>

          {/* right side */}
          <StatusDot userId={a.created_by} thisWeek={a.this_week} longterm={a.longterm} />
        </div>
      </div>
    </div>
  )
}
