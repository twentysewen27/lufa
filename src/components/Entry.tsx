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

export default function Entry({ activity: a, index, onTap }: Props) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      className="cursor-pointer active:bg-paper-2 transition-colors duration-100"
      style={{ borderBottom: '1px solid var(--hairline-soft)' }}
      onClick={onTap}
    >
      <div
        className="grid gap-3.5"
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
  )
}
