import { useState } from 'react'
import { Check } from 'lucide-react'
import Sheet from '../components/Sheet'
import { StarsBig } from '../components/Stars'
import type { Activity, ActivityPatch } from '../lib/types'
import { RATING_LABELS } from '../lib/constants'

interface Props {
  activity: Activity
  onClose:  () => void
  onSave:   (patch: ActivityPatch) => void
}

export default function MarkDoneSheet({ activity: a, onClose, onSave }: Props) {
  const [rating,    setRating]    = useState(0)
  const [note,      setNote]      = useState('')
  const [showCheck, setShowCheck] = useState(false)

  function save() {
    setShowCheck(true)
    setTimeout(() => {
      onSave({
        rating:    rating > 0 ? (rating as 1|2|3|4|5) : undefined,
        done_note: note.trim() || undefined,
      })
    }, 700)
  }

  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'var(--mute)',
  }

  if (showCheck) {
    return (
      <Sheet onClose={() => {}}>
        <div className="flex flex-col items-center text-center gap-3.5" style={{ padding: '40px 22px 60px' }}>
          <div
            className="flex items-center justify-center rounded-full check-pop"
            style={{ width: 72, height: 72, background: 'var(--done)', color: 'white' }}
          >
            <Check size={40} strokeWidth={1.5} />
          </div>
          <p className="font-serif italic m-0" style={{ fontSize: 26, color: 'var(--ink)' }}>Done.</p>
          <span style={eyebrow}>Filed under memories.</span>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet onClose={onClose}>
      {/* header */}
      <div className="flex justify-between items-center" style={{ padding: '4px 22px 0' }}>
        <button onClick={onClose} style={eyebrow}>Cancel</button>
        <span style={eyebrow}>Mark done</span>
        <button onClick={save} style={{ ...eyebrow, color: 'var(--ink)' }}>Save ↵</button>
      </div>

      <div className="rule-soft" style={{ margin: '14px 0' }} />

      {/* activity title */}
      <div style={{ padding: '0 22px 12px' }}>
        <div className="font-serif italic" style={{ fontSize: 14, color: 'var(--mute)' }}>You did</div>
        <div className="font-serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          {a.title}
        </div>
      </div>

      <div className="rule-soft" />

      {/* star rating */}
      <div className="text-center" style={{ padding: '24px 22px' }}>
        <div style={eyebrow}>How was it?</div>
        <div className="flex justify-center" style={{ marginTop: 16 }}>
          <StarsBig rating={rating} onSet={setRating} />
        </div>
        <div className="font-serif italic" style={{ fontSize: 14, color: 'var(--mute)', marginTop: 10, minHeight: 18 }}>
          {rating === 0 ? 'optional' : RATING_LABELS[rating]}
        </div>
      </div>

      <div className="rule-soft" />

      {/* done note */}
      <div style={{ padding: '14px 22px' }}>
        <div style={eyebrow}>A line about it</div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          placeholder="the part you'll want to remember…"
          className="w-full font-serif italic resize-none"
          style={{
            background: 'transparent', border: 0, outline: 0,
            fontSize: 18, lineHeight: 1.4, color: 'var(--ink)', marginTop: 8,
          }}
        />
      </div>
    </Sheet>
  )
}
