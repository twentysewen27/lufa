import { useState, useRef, useEffect } from 'react'
import Sheet from '../components/Sheet'
import CatDot from '../components/CatDot'
import Avatar from '../components/Avatar'
import type { Category, Vibe, Cost, Duration, ActivityInsert } from '../lib/types'
import { CATEGORIES, CAT_LABEL, VIBES, COSTS, DURATIONS, USERS } from '../lib/constants'

interface Props {
  currentUser: string
  onClose:     () => void
  onSave:      (insert: ActivityInsert) => void
}

export default function FastCaptureSheet({ currentUser, onClose, onSave }: Props) {
  const [title,    setTitle]    = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [vibe,     setVibe]     = useState<Vibe[]>([])
  const [bucket,   setBucket]   = useState<'backlog' | 'next' | 'long'>('backlog')
  const [expanded, setExpanded] = useState(false)
  const [notes,    setNotes]    = useState('')
  const [link,     setLink]     = useState('')
  const [location, setLocation] = useState('')
  const [cost,     setCost]     = useState<Cost | null>(null)
  const [duration, setDuration] = useState<Duration | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [])

  const canSave = title.trim().length > 0

  function save() {
    if (!canSave) return
    onSave({
      title:        title.trim(),
      category:     category ?? undefined,
      vibe:         vibe.length ? vibe : undefined,
      notes:        notes.trim()    || undefined,
      link:         link.trim()     || undefined,
      location:     location.trim() || undefined,
      est_cost:     cost            ?? undefined,
      est_duration: duration        ?? undefined,
      status:       'backlog',
      this_week:    bucket === 'next',
      longterm:     bucket === 'long',
      created_by:   currentUser,
      created_at:   new Date().toISOString(),
    })
  }

  function toggleCat(c: Category) {
    setCategory(prev => prev === c ? null : c)
  }
  function toggleVibe(v: Vibe) {
    setVibe(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const eyebrow: React.CSSProperties = { fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mute)' }

  return (
    <Sheet onClose={onClose}>
      {/* sticky header */}
      <div
        className="flex justify-between items-center"
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--paper)',
          padding: '4px 22px 0',
        }}
      >
        <button onClick={onClose} style={eyebrow}>Cancel</button>
        <span style={eyebrow}>New idea</span>
        <button
          onClick={save}
          disabled={!canSave}
          className="inline-flex items-center rounded-pill font-sans font-medium transition-opacity"
          style={{
            height: 34,
            padding: '0 16px',
            fontSize: 13,
            letterSpacing: '-0.01em',
            background: 'var(--ink)',
            color: 'var(--paper)',
            opacity: canSave ? 1 : 0.35,
          }}
        >
          Save
        </button>
      </div>

      <div className="rule-soft" style={{ margin: '14px 0' }} />

      {/* title field */}
      <div style={{ padding: '4px 22px 12px' }}>
        <div style={eyebrow}>What's the idea?</div>
        <textarea
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.metaKey && save()}
          rows={2}
          placeholder="A pottery class, a hike, that bar Lily mentioned…"
          className="w-full font-serif resize-none"
          style={{
            background: 'transparent', border: 0, outline: 0,
            fontSize: 28, lineHeight: 1.1, color: 'var(--ink)',
            letterSpacing: '-0.01em', marginTop: 8,
          }}
        />
      </div>

      <div className="rule-soft" />

      {/* category */}
      <div style={{ padding: '14px 22px' }}>
        <div style={eyebrow}>Category</div>
        <div className="flex flex-wrap gap-2" style={{ marginTop: 10 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => toggleCat(c)}
              className="inline-flex items-center gap-1.5 rounded-pill border transition-all"
              style={{
                height: 30, padding: '0 12px',
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                background:  category === c ? 'var(--ink)' : 'transparent',
                color:       category === c ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: category === c ? 'var(--ink)' : 'var(--hairline)',
              }}
            >
              <CatDot category={c} />
              {CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="rule-soft" />

      {/* vibe */}
      <div style={{ padding: '14px 22px' }}>
        <div style={eyebrow}>Vibe (any)</div>
        <div className="flex flex-wrap gap-2" style={{ marginTop: 10 }}>
          {VIBES.map(v => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className="inline-flex items-center rounded-pill border transition-all"
              style={{
                height: 30, padding: '0 12px',
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                background:  vibe.includes(v) ? 'var(--ink)' : 'transparent',
                color:       vibe.includes(v) ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: vibe.includes(v) ? 'var(--ink)' : 'var(--hairline)',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="rule-soft" />

      {/* where does it go? */}
      <div style={{ padding: '14px 22px' }}>
        <div style={eyebrow}>Where does it go?</div>
        <div className="flex gap-2" style={{ marginTop: 10 }}>
          {([
            { id: 'backlog', label: 'Backlog',   sub: 'just an idea'  },
            { id: 'next',    label: 'Up next',   sub: 'plan it soon'  },
            { id: 'long',    label: 'Long-term',  sub: 'a slow arc'   },
          ] as { id: 'backlog' | 'next' | 'long'; label: string; sub: string }[]).map(b => (
            <button
              key={b.id}
              onClick={() => setBucket(b.id)}
              className="flex flex-col items-start rounded-pill border transition-all"
              style={{
                gap: 2,
                height: 'auto',
                padding: '8px 12px',
                fontFamily: 'var(--mono)',
                background:  bucket === b.id ? 'var(--ink)' : 'transparent',
                color:       bucket === b.id ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: bucket === b.id ? 'var(--ink)' : 'var(--hairline)',
              }}
            >
              <span style={{ fontSize: 12 }}>{b.label}</span>
              <span
                style={{
                  fontSize: 8,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: bucket === b.id ? 'rgba(255,255,255,0.7)' : 'var(--mute-2)',
                }}
              >
                {b.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rule-soft" />

      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-left"
          style={{ padding: '14px 22px' }}
        >
          <span className="font-serif italic" style={{ fontSize: 16, color: 'var(--ink)' }}>+ add details</span>
          <span style={{ ...eyebrow, marginLeft: 10 }}>notes · link · location · cost · duration</span>
        </button>
      ) : (
        <div className="detail-expand">
          <div style={{ padding: '14px 22px' }}>
            <div style={eyebrow}>Notes</div>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="anything you want to remember…"
              className="w-full font-serif italic"
              style={{ background: 'transparent', border: 0, outline: 0, padding: '6px 0', fontSize: 18, color: 'var(--ink)' }}
            />
          </div>
          <div className="rule-soft" />
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '14px 22px' }}>
              <div style={eyebrow}>Link</div>
              <input value={link} onChange={e => setLink(e.target.value)} placeholder="—"
                className="w-full font-sans text-sm" style={{ background: 'transparent', border: 0, outline: 0, padding: '6px 0', color: 'var(--ink)' }} />
            </div>
            <div style={{ padding: '14px 22px', borderLeft: '1px solid var(--hairline-soft)' }}>
              <div style={eyebrow}>Location</div>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="—"
                className="w-full font-sans text-sm" style={{ background: 'transparent', border: 0, outline: 0, padding: '6px 0', color: 'var(--ink)' }} />
            </div>
          </div>
          <div className="rule-soft" />
          <div style={{ padding: '14px 22px' }}>
            <div style={eyebrow}>Estimated cost</div>
            <div className="flex gap-2" style={{ marginTop: 10 }}>
              {COSTS.map(c => (
                <button key={c} onClick={() => setCost(cost === c ? null : c)}
                  className="inline-flex items-center h-[30px] px-3 rounded-pill border transition-all font-mono text-[11px] uppercase"
                  style={{ letterSpacing: '0.06em', background: cost === c ? 'var(--ink)' : 'transparent', color: cost === c ? 'var(--paper)' : 'var(--ink-2)', borderColor: cost === c ? 'var(--ink)' : 'var(--hairline)' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="rule-soft" />
          <div style={{ padding: '14px 22px' }}>
            <div style={eyebrow}>Duration</div>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 10 }}>
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(duration === d ? null : d)}
                  className="inline-flex items-center h-[30px] px-3 rounded-pill border transition-all font-mono text-[11px] uppercase whitespace-nowrap"
                  style={{ letterSpacing: '0.06em', background: duration === d ? 'var(--ink)' : 'transparent', color: duration === d ? 'var(--paper)' : 'var(--ink-2)', borderColor: duration === d ? 'var(--ink)' : 'var(--hairline)' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* footer */}
      <div style={{ padding: '12px 22px 0' }}>
        <div className="flex items-center gap-2" style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mute)' }}>
          <Avatar userId={currentUser} />
          adding as {USERS[currentUser]?.name?.toLowerCase()}
        </div>
      </div>
    </Sheet>
  )
}
