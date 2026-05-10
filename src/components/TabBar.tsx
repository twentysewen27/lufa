import type { Tab } from '../lib/types'

const TABS: { id: Tab; label: string }[] = [
  { id: 'backlog',  label: 'Backlog'   },
  { id: 'next',     label: 'Next'      },
  { id: 'calendar', label: 'Calendar'  },
  { id: 'done',     label: 'Done'      },
]

interface Props {
  active:   Tab
  onChange: (t: Tab) => void
}

export default function TabBar({ active, onChange }: Props) {
  return (
    <div
      className="relative z-30 grid flex-shrink-0"
      style={{
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop:  '1px solid var(--hairline)',
        background: 'var(--paper)',
        padding:    '8px 0 28px',
      }}
    >
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex flex-col items-center gap-1 py-2 font-serif italic text-sm relative"
          style={{
            letterSpacing: '-0.005em',
            color: active === t.id ? 'var(--ink)' : 'var(--mute)',
          }}
        >
          {t.label}
          {active === t.id && (
            <span
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
              style={{ background: 'var(--ink)' }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
