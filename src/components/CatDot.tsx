import type { Category } from '../lib/types'
import { CAT_COLOR } from '../lib/constants'

interface Props {
  category?: Category
  size?: number
}

export default function CatDot({ category, size = 8 }: Props) {
  const color = category ? CAT_COLOR[category] : '#7a7064'
  return (
    <span
      style={{ width: size, height: size, background: color }}
      className="inline-block rounded-full flex-shrink-0"
    />
  )
}
