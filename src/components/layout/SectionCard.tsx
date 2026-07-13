import { cn } from '@/lib/utils'
import styles from './SectionCard.module.scss'

// The bordered-card-with-a-heading look shared by every self-sizing detail
// section (Pokémon and Move detail pages alike) — one definition so their
// headings can't drift out of sync with each other.
export function SectionCard({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn(styles.section, className)}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}
