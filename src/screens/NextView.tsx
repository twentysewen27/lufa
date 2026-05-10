import type { Activity, LongtermPhase } from '../lib/types'
import { CAT_LABEL, PHASE_LABEL, PHASE_ORDER } from '../lib/constants'
import CatDot from '../components/CatDot'
import StatusDot from '../components/StatusDot'

// ── helpers ──────────────────────────────────────────────────────────────────

function todayStart(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const today = todayStart()
  const diff = Math.round((d.setHours(0,0,0,0) - today.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'long' })
}

function timeStr(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function isLongterm(a: Activity): boolean {
  if (a.status === 'done') return false
  return (
    a.longterm === true ||
    a.category === 'trip' ||
    a.est_duration === 'weekend' ||
    a.est_duration === 'longer'
  )
}

function phaseLabel(a: Activity): string {
  if (a.longterm_phase && PHASE_LABEL[a.longterm_phase]) {
    return PHASE_LABEL[a.longterm_phase]
  }
  if (a.category === 'trip')            return 'A trip we’re plotting'
  if (a.est_duration === 'weekend')     return 'A weekend, eventually'
  if (a.est_duration === 'longer')      return 'A long arc'
  return 'Slowly building'
}

function phaseOrder(a: Activity): number {
  if (!a.longterm_phase) return PHASE_ORDER.length
  const idx = PHASE_ORDER.indexOf(a.longterm_phase as LongtermPhase)
  return idx === -1 ? PHASE_ORDER.length : idx
}

// ── sub-components ────────────────────────────────────────────────────────────

function NextCard({ activity: a, onTap }: { activity: Activity; onTap: () => void }) {
  const scheduled = !!a.scheduled_at
  return (
    <div
      onClick={onTap}
      className="cursor-pointer"
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 1fr auto',
        gap: 14,
        padding: 14,
        background: 'var(--paper-2)',
        borderRadius: 12,
        border: '1px solid var(--hairline-soft)',
      }}
    >
      {/* left: day */}
      <div style={{ borderRight: '1px solid var(--hairline-soft)', paddingRight: 12 }}>
        <div
          className="font-serif"
          style={{
            fontSize: 18, lineHeight: 1, letterSpacing: '-0.01em',
            color: scheduled ? 'var(--ink)' : 'var(--mute)',
            fontStyle: scheduled ? 'normal' : 'italic',
          }}
        >
          {scheduled ? dayLabel(a.scheduled_at!) : 'Soon'}
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 10, color: 'var(--mute)', marginTop: 4 }}
        >
          {scheduled ? timeStr(a.scheduled_at!) : 'unscheduled'}
        </div>
      </div>

      {/* middle: title + meta */}
      <div>
        <div
          className="font-serif"
          style={{ fontSize: 17, lineHeight: 1.2, color: 'var(--ink)' }}
        >
          {a.title}
        </div>
        <div
          className="entry-meta flex items-center flex-wrap"
          style={{ marginTop: 4, gap: '0 6px', fontSize: 11, color: 'var(--mute)' }}
        >
          {a.category && (
            <span className="inline-flex items-center gap-1">
              <CatDot category={a.category} size={7} />
              {CAT_LABEL[a.category]}
            </span>
          )}
          {a.location && <span>· {a.location}</span>}
        </div>
      </div>

      {/* right: status dot */}
      <StatusDot userId={a.created_by} />
    </div>
  )
}

function LongtermRow({ activity: a, onTap, first }: { activity: Activity; onTap: () => void; first: boolean }) {
  return (
    <div
      onClick={onTap}
      className="cursor-pointer"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 12,
        padding: '16px 0',
        borderTop: first ? 'none' : '1px solid var(--hairline-soft)',
      }}
    >
      <div>
        <div
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--fab)', marginBottom: 4 }}
        >
          {phaseLabel(a)}
        </div>
        <div
          className="font-serif"
          style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--ink)' }}
        >
          {a.title}
        </div>
        {a.notes && (
          <div
            className="font-serif italic"
            style={{ fontSize: 14, color: 'var(--mute)', marginTop: 4 }}
          >
            "{a.notes}"
          </div>
        )}
        <div
          className="entry-meta flex items-center flex-wrap"
          style={{ marginTop: 6, gap: '0 6px', fontSize: 11, color: 'var(--mute)' }}
        >
          {a.category && (
            <span className="inline-flex items-center gap-1">
              <CatDot category={a.category} size={7} />
              {CAT_LABEL[a.category]}
            </span>
          )}
          {a.est_duration && <span>· {a.est_duration}</span>}
          {a.est_cost     && <span>· {a.est_cost}</span>}
        </div>
      </div>
      <StatusDot userId={a.created_by} />
    </div>
  )
}

function EmptyState({ copy, sub }: { copy: string; sub: string }) {
  return (
    <div
      style={{
        border: '1px dashed var(--hairline)',
        borderRadius: 12,
        padding: '22px 16px',
        textAlign: 'center',
      }}
    >
      <div className="font-serif italic" style={{ fontSize: 18, color: 'var(--mute)' }}>
        {copy}
      </div>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--mute-2)', marginTop: 8 }}
      >
        {sub}
      </div>
    </div>
  )
}

// ── main screen ───────────────────────────────────────────────────────────────

interface Props {
  activities: Activity[]
  onTap: (a: Activity) => void
}

export default function NextView({ activities, onTap }: Props) {
  const now = todayStart()
  const horizon = new Date(now.getTime() + 14 * 86400000)

  const upcoming = activities
    .filter(a =>
      a.status === 'planned' &&
      a.scheduled_at != null &&
      new Date(a.scheduled_at) >= now &&
      new Date(a.scheduled_at) < horizon,
    )
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())

  const onDeck = activities.filter(a =>
    a.this_week === true &&
    a.scheduled_at == null &&
    a.status !== 'done',
  )

  const longtermItems = activities
    .filter(a => isLongterm(a) && a.this_week !== true && a.scheduled_at == null)
    .sort((a, b) => phaseOrder(a) - phaseOrder(b))

  const onDeckCount  = upcoming.length + onDeck.length
  const longtermCount = longtermItems.length

  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--mono)',
    fontSize: 10,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--mute)',
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* header */}
      <div className="app-header flex-shrink-0" style={{ padding: '52px 22px 0' }}>
        <div className="flex items-end justify-between" style={{ marginBottom: 10 }}>
          <span style={eyebrow}>No. 02 — What&apos;s Next</span>
          <span style={{ ...eyebrow, color: 'var(--mute)' }}>
            {onDeckCount} on deck · {longtermCount} long
          </span>
        </div>
        <h1
          className="font-serif m-0"
          style={{ fontSize: 52, lineHeight: 0.95, letterSpacing: '-0.02em', color: 'var(--ink)' }}
        >
          <em>Next</em> up,<br />
          <span style={{ color: 'var(--mute)' }}>and the long arcs.</span>
        </h1>
        <div className="rule-double" style={{ margin: '14px 0' }} />
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ padding: '0 22px' }}>

        {/* ── On deck ── */}
        <div style={{ marginBottom: 0 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
            <span style={eyebrow}>On deck — next up to plan</span>
            <span style={{ ...eyebrow, color: 'var(--mute-2)', fontSize: 9 }}>
              {onDeckCount}
            </span>
          </div>

          {onDeckCount === 0 ? (
            <EmptyState
              copy="Nothing flagged yet."
              sub={'Open an idea and tap “Add to Next.”'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...upcoming, ...onDeck].map(a => (
                <NextCard key={a.id} activity={a} onTap={() => onTap(a)} />
              ))}
            </div>
          )}
        </div>

        {/* section break */}
        <div style={{ height: 28 }} />
        <div className="rule-soft" style={{ margin: '0 0 18px' }} />

        {/* ── Long-term ── */}
        <div style={{ paddingBottom: 120 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
            <span style={eyebrow}>Long-term — slowly in motion</span>
            <span style={{ ...eyebrow, color: 'var(--mute-2)', fontSize: 9 }}>
              {longtermCount}
            </span>
          </div>

          {longtermCount === 0 ? (
            <EmptyState
              copy="No long arcs right now."
              sub="Mark an activity as Long-term from its detail view."
            />
          ) : (
            <div>
              {longtermItems.map((a, i) => (
                <LongtermRow key={a.id} activity={a} onTap={() => onTap(a)} first={i === 0} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
