import { Search, X } from 'lucide-react'
import type { Activity, Filters, Category, Vibe } from '../lib/types'
import { CATEGORIES, CAT_LABEL, VIBES } from '../lib/constants'
import Entry from '../components/Entry'
import Avatar from '../components/Avatar'
import CatDot from '../components/CatDot'

interface Props {
  activities:  Activity[]
  filters:     Filters
  setFilters:  (f: Filters) => void
  currentUser: string
  onTap:       (a: Activity) => void
  onAction:    (a: Activity, action: 'schedule' | 'done') => void
}

export default function Backlog({ activities, filters, setFilters, currentUser, onTap, onAction }: Props) {
  const backlog = activities.filter(a => a.status === 'backlog' && !a.longterm)

  const filtered = backlog
    .filter(a => {
      if (filters.cat.length && !filters.cat.includes(a.category as Category)) return false
      if (filters.vibe.length && !(a.vibe ?? []).some(v => filters.vibe.includes(v as Vibe))) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!a.title.toLowerCase().includes(q) && !(a.notes ?? '').toLowerCase().includes(q)) return false
      }
      return true
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function toggleCat(c: Category) {
    setFilters({
      ...filters,
      cat: filters.cat.includes(c) ? filters.cat.filter(x => x !== c) : [...filters.cat, c],
    })
  }

  function toggleVibe(v: Vibe) {
    setFilters({
      ...filters,
      vibe: filters.vibe.includes(v) ? filters.vibe.filter(x => x !== v) : [...filters.vibe, v],
    })
  }

  const hasFilters = filters.cat.length > 0 || filters.vibe.length > 0 || filters.q.length > 0

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar">
      {/* header */}
      <div
        className="flex items-end justify-between"
        style={{ padding: '70px 22px 18px' }}
      >
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)' }}>
            No. 01 — The Backlog
          </div>
          <h1
            className="font-serif"
            style={{ fontSize: 52, lineHeight: 0.95, margin: '8px 0 0', letterSpacing: '-0.02em', color: 'var(--ink)' }}
          >
            Things <em>we&apos;d</em><br />like to do.
          </h1>
        </div>
        <Avatar userId={currentUser} size="lg" />
      </div>

      <div className="rule-double" style={{ margin: '0 22px 14px' }} />

      {/* search */}
      <div
        className="flex items-center gap-2.5 mx-[22px] mb-3 rounded-pill"
        style={{ padding: '10px 14px', background: 'var(--paper-2)' }}
      >
        <Search size={14} strokeWidth={1.5} style={{ color: 'var(--mute)', flexShrink: 0 }} />
        <input
          value={filters.q}
          onChange={e => setFilters({ ...filters, q: e.target.value })}
          placeholder="search titles & notes…"
          className="flex-1 font-sans text-sm"
          style={{ background: 'transparent', border: 0, outline: 0, color: 'var(--ink)' }}
        />
        {filters.q && (
          <button onClick={() => setFilters({ ...filters, q: '' })} style={{ color: 'var(--mute)' }}>
            <X size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* category chips */}
      <div className="overflow-x-auto hide-scrollbar" style={{ padding: '0 22px 8px' }}>
        <div className="flex gap-2 pb-1">
          <button
            className="inline-flex items-center h-[30px] px-3 rounded-pill font-mono text-[11px] uppercase border transition-all"
            style={{
              letterSpacing: '0.06em',
              background: !hasFilters ? 'var(--ink)' : 'transparent',
              color:      !hasFilters ? 'var(--paper)' : 'var(--ink-2)',
              borderColor: !hasFilters ? 'var(--ink)' : 'var(--hairline)',
            }}
            onClick={() => setFilters({ q: '', cat: [], vibe: [] })}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-pill font-mono text-[11px] uppercase border transition-all whitespace-nowrap"
              style={{
                letterSpacing: '0.06em',
                background:  filters.cat.includes(c) ? 'var(--ink)' : 'transparent',
                color:       filters.cat.includes(c) ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: filters.cat.includes(c) ? 'var(--ink)' : 'var(--hairline)',
              }}
              onClick={() => toggleCat(c)}
            >
              <CatDot category={c} />
              {CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {/* vibe chips */}
      <div className="overflow-x-auto hide-scrollbar" style={{ padding: '0 22px 14px' }}>
        <div className="flex gap-2 items-center">
          <span className="font-mono uppercase flex-shrink-0" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)', marginRight: 6 }}>
            vibe ·
          </span>
          {VIBES.map(v => (
            <button
              key={v}
              className="inline-flex items-center h-[26px] px-2 rounded-pill font-mono text-[10px] uppercase border transition-all whitespace-nowrap"
              style={{
                letterSpacing: '0.06em',
                background:  filters.vibe.includes(v) ? 'var(--ink)' : 'transparent',
                color:       filters.vibe.includes(v) ? 'var(--paper)' : 'var(--ink-2)',
                borderColor: filters.vibe.includes(v) ? 'var(--ink)' : 'var(--hairline)',
              }}
              onClick={() => toggleVibe(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="rule-soft" />

      {/* count */}
      <div className="flex justify-between items-baseline" style={{ padding: '14px 22px 6px' }}>
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
          {filtered.length} {filtered.length === 1 ? 'idea' : 'ideas'} in queue
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
          long-press to drag →
        </span>
      </div>

      {/* entries */}
      {filtered.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        filtered.map((a, i) => (
          <Entry
            key={a.id}
            activity={a}
            index={i}
            onTap={() => onTap(a)}
            onAction={act => onAction(a, act)}
          />
        ))
      )}

      <div style={{ height: 120 }} />
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center text-center gap-3.5" style={{ padding: '48px 32px' }}>
        <span className="font-serif italic" style={{ fontSize: 30, color: 'var(--ink)' }}>∅</span>
        <p className="font-serif italic m-0" style={{ fontSize: 20, color: 'var(--ink)' }}>
          Nothing matches that.
        </p>
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
          Clear the filters and try again.
        </span>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center text-center gap-3.5" style={{ padding: '48px 32px' }}>
      <span className="font-serif italic" style={{ fontSize: 30, color: 'var(--ink)' }}>↘</span>
      <p className="font-serif italic m-0" style={{ fontSize: 24, color: 'var(--ink)', lineHeight: 1.2, maxWidth: 240 }}>
        Drop your first idea&nbsp;in.
      </p>
      <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--mute)' }}>
        tap the + to begin
      </span>
    </div>
  )
}
