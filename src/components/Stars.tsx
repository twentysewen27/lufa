import { Star } from 'lucide-react'

interface SmallProps { rating?: number }
interface BigProps   { rating: number; onSet: (r: number) => void }

export function StarsSmall({ rating = 0 }: SmallProps) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={12}
          strokeWidth={1.5}
          style={{ color: i <= rating ? 'var(--ink)' : 'var(--hairline)' }}
          fill={i <= rating ? 'var(--ink)' : 'none'}
        />
      ))}
    </span>
  )
}

export function StarsBig({ rating, onSet }: BigProps) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onSet(i === rating ? 0 : i)}
          className="active:scale-90 transition-transform duration-100"
        >
          <Star
            size={38}
            strokeWidth={1.5}
            style={{ color: i <= rating ? 'var(--ink)' : 'var(--hairline)' }}
            fill={i <= rating ? 'var(--ink)' : 'none'}
          />
        </button>
      ))}
    </div>
  )
}
