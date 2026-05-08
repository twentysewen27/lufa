import { USERS } from '../lib/constants'

interface Props {
  userId: string
  size?: 'sm' | 'lg'
}

export default function Avatar({ userId, size = 'sm' }: Props) {
  const user = USERS[userId]
  const color = user?.color ?? '#7a7064'
  const label = user?.short ?? '?'
  const dim = size === 'lg' ? 28 : 22

  return (
    <span
      style={{ width: dim, height: dim, background: color, fontSize: size === 'lg' ? 15 : 13 }}
      className="inline-flex items-center justify-center rounded-full text-white font-serif italic flex-shrink-0"
    >
      {label}
    </span>
  )
}
