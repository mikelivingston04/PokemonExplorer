import { Link } from 'react-router-dom'
import { TYPE_COLORS, isPokemonType } from '@/lib/constants/typeColors'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { cn } from '@/lib/utils'
import styles from './TypeBadge.module.scss'

interface TypeBadgeProps {
  type: string
  linkTo?: boolean
  className?: string
}

export function TypeBadge({ type, linkTo = false, className }: TypeBadgeProps) {
  const colors = isPokemonType(type) ? TYPE_COLORS[type] : { bg: '#999999', fg: '#ffffff' }
  const label = toDisplayName(type)

  const badge = (
    <span
      className={cn(styles.badge, linkTo && styles.link, className)}
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      {label}
    </span>
  )

  if (linkTo) {
    return <Link to={`/type/${type}`}>{badge}</Link>
  }
  return badge
}
