interface Props<T extends string> {
  options:  T[]
  labels?:  Record<T, string>
  selected: T[]
  small?:   boolean
  onToggle: (v: T) => void
  renderPrefix?: (v: T) => React.ReactNode
}

export default function ChipGroup<T extends string>({
  options, labels, selected, small = false, onToggle, renderPrefix,
}: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(v => {
        const on = selected.includes(v)
        return (
          <button
            key={v}
            type="button"
            onClick={() => onToggle(v)}
            className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border transition-all duration-150 rounded-pill"
            style={{
              height: small ? 26 : 30,
              padding: small ? '0 8px' : '0 12px',
              fontSize: small ? 10 : 11,
              letterSpacing: small ? '0.06em' : '0.06em',
              background: on ? 'var(--ink)' : 'transparent',
              color:      on ? 'var(--paper)' : 'var(--ink-2)',
              borderColor: on ? 'var(--ink)' : 'var(--hairline)',
            }}
          >
            {renderPrefix?.(v)}
            {labels ? labels[v] : v}
          </button>
        )
      })}
    </div>
  )
}
