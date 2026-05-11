import { Calendar, Check } from 'lucide-react'
import Sheet from '../components/Sheet'
import Avatar from '../components/Avatar'
import CatDot from '../components/CatDot'
import { StarsSmall } from '../components/Stars'
import type { Activity } from '../lib/types'
import { CAT_LABEL, USERS } from '../lib/constants'
import { fmtDate, fmtTime } from '../lib/utils'

interface Props {
  activity: Activity
  onClose:  () => void
  onAction: (action: 'edit' | 'schedule' | 'this_week' | 'longterm' | 'done' | 'delete' | 'to_backlog') => void
}

export default function DetailSheet({ activity: a, onClose, onAction }: Props) {
  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--mute)',
  }

  const statusColors: Record<string, string> = {
    backlog: 'var(--paper-2)',
    planned: 'var(--ink)',
    done:    'var(--done)',
  }
  const statusTextColors: Record<string, string> = {
    backlog: 'var(--mute)',
    planned: 'var(--paper)',
    done:    'var(--paper)',
  }

  return (
    <Sheet onClose={onClose}>
      {/* header */}
      <div className="flex justify-between items-center" style={{ padding: '4px 22px 0' }}>
        <button onClick={onClose} style={eyebrow}>Close</button>
        <span
          style={{
            ...eyebrow,
            padding: '3px 8px',
            borderRadius: 4,
            background: statusColors[a.status],
            color: statusTextColors[a.status],
          }}
        >
          {a.status}
        </span>
        <button onClick={() => onAction('edit')} style={{ ...eyebrow, color: 'var(--ink)' }}>
          Edit
        </button>
      </div>

      <div className="rule-soft" style={{ margin: '14px 0' }} />

      {/* title + meta */}
      <div style={{ padding: '4px 22px 12px' }}>
        <h2 className="font-serif m-0" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {a.title}
        </h2>
        <div className="flex flex-wrap items-center font-mono uppercase" style={{ gap: '8px 14px', marginTop: 14, fontSize: 10, letterSpacing: '0.1em', color: 'var(--mute)' }}>
          <span className="inline-flex items-center gap-1.5">
            <CatDot category={a.category} />
            {a.category ? CAT_LABEL[a.category] : 'no category'}
          </span>
          {a.vibe?.map(v => <span key={v}>· {v}</span>)}
        </div>
      </div>

      <div className="rule-soft" />

      {/* 2×2 meta grid */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--hairline-soft)' }}>
        <MetaCell label="Where"    value={a.location}     />
        <MetaCell label="When"     value={a.scheduled_at ? `${fmtDate(a.scheduled_at)}, ${fmtTime(a.scheduled_at)}` : undefined} border="left" />
        <MetaCell label="Cost"     value={a.est_cost}     border="top" />
        <MetaCell label="Duration" value={a.est_duration} border="top-left" />
      </div>

      {a.notes && (
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--hairline-soft)' }}>
          <div style={eyebrow}>Notes</div>
          <p className="font-serif italic m-0" style={{ fontSize: 17, lineHeight: 1.4, marginTop: 6, color: 'var(--ink-2)' }}>
            "{a.notes}"
          </p>
        </div>
      )}

      {a.link && (
        <a
          href={a.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
          style={{ padding: '12px 22px', color: 'var(--luca)', fontSize: 14, textDecoration: 'underline', borderBottom: '1px solid var(--hairline-soft)' }}
        >
          {a.link.replace(/^https?:\/\//, '')}
        </a>
      )}

      {a.status === 'done' && (a.done_note || a.rating) && (
        <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--hairline-soft)' }}>
          <div style={eyebrow}>How was it</div>
          {a.rating && <div style={{ marginTop: 6 }}><StarsSmall rating={a.rating} /></div>}
          {a.done_note && (
            <p className="font-serif italic m-0" style={{ fontSize: 17, lineHeight: 1.4, marginTop: 6, color: 'var(--ink-2)' }}>
              "{a.done_note}"
            </p>
          )}
        </div>
      )}

      {/* added by */}
      <div className="flex items-center gap-2" style={{ padding: '14px 22px' }}>
        <Avatar userId={a.created_by} />
        <span style={eyebrow}>
          added by {USERS[a.created_by]?.name?.toLowerCase() ?? a.created_by} · {fmtDate(a.created_at)}
        </span>
      </div>

      {/* action buttons */}
      <div className="flex flex-wrap gap-2" style={{ padding: '6px 16px 0' }}>
        {a.status !== 'done' && (
          <>
            <button
              onClick={() => onAction('schedule')}
              className="inline-flex items-center gap-2 h-12 rounded-pill font-sans font-medium text-[15px] active:scale-[0.97] transition-transform"
              style={{ padding: '0 22px', background: 'var(--ink)', color: 'var(--paper)', letterSpacing: '-0.01em' }}
            >
              <Calendar size={16} strokeWidth={1.5} /> Schedule
            </button>
            <button
              onClick={() => onAction('this_week')}
              className="inline-flex items-center h-10 rounded-pill border text-sm active:bg-paper-2 transition-colors"
              style={{ padding: '0 16px', borderColor: 'var(--hairline)', color: a.this_week ? 'var(--fab)' : 'var(--ink-2)' }}
            >
              {a.this_week ? '✓ On deck' : 'Add to Next'}
            </button>
            <button
              onClick={() => onAction('longterm')}
              className="inline-flex items-center h-10 rounded-pill border text-sm active:bg-paper-2 transition-colors"
              style={{ padding: '0 16px', borderColor: 'var(--hairline)', color: a.longterm ? 'var(--luca)' : 'var(--ink-2)' }}
            >
              {a.longterm ? '✓ Long-term' : 'Mark long-term'}
            </button>
            <button
              onClick={() => onAction('done')}
              className="inline-flex items-center gap-1.5 h-10 rounded-pill border text-sm active:bg-paper-2 transition-colors"
              style={{ padding: '0 16px', borderColor: 'var(--hairline)', color: 'var(--ink-2)' }}
            >
              <Check size={14} strokeWidth={1.5} /> Mark done
            </button>
          </>
        )}
        {a.status === 'done' && (
          <button
            onClick={() => onAction('to_backlog')}
            className="inline-flex items-center h-10 rounded-pill border text-sm"
            style={{ padding: '0 16px', borderColor: 'var(--hairline)', color: 'var(--ink-2)' }}
          >
            ← Back to backlog
          </button>
        )}
      </div>

      {/* delete — bottom right */}
      <div className="flex justify-end" style={{ padding: '10px 22px 0' }}>
        <button
          onClick={() => onAction('delete')}
          style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--warn)' }}
        >
          Delete
        </button>
      </div>
    </Sheet>
  )
}

function MetaCell({ label, value, border }: { label: string; value?: string; border?: string }) {
  const borders: React.CSSProperties = {}
  if (border?.includes('top'))  borders.borderTop  = '1px solid var(--hairline-soft)'
  if (border?.includes('left')) borders.borderLeft = '1px solid var(--hairline-soft)'

  return (
    <div style={{ padding: '14px 22px', ...borders }}>
      <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--mute)' }}>
        {label}
      </div>
      <div className="font-serif" style={{ fontSize: 17, marginTop: 4, color: value ? 'var(--ink)' : 'var(--mute-2)' }}>
        {value ?? '—'}
      </div>
    </div>
  )
}
