import { PokeballIcon } from '@/components/layout/PokeballIcon'
import styles from './HomePage.module.scss'

// The empty landing state — shown only when nothing is being searched or
// filtered yet (AppShell swaps this out for live results the instant either
// one becomes active, and swaps it back the instant both clear).
export function HomePage() {
  return (
    <div className={styles.empty}>
      <PokeballIcon className={styles.emptyIcon} />
    </div>
  )
}
