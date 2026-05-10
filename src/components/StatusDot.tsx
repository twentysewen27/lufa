import { USERS } from '../lib/constants'

interface Props {
  userId: string
  thisWeek?: boolean
  longterm?: boolean
}

export default function StatusDot({ userId, thisWeek, longterm }: Props) {
  const color = USERS[userId]?.color ?? '#7a7064'
  return (
    <div className="flex flex-col items-end gap-1.5 pt-2">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      {thisWeek && (
        <span
          className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: 'var(--fab)' }}
        >
          on deck
        </span>
      )}
      {!thisWeek && longterm && (
        <span
          className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: 'var(--luca)' }}
        >
          long
        </span>
      )}
    </div>
  )
}
