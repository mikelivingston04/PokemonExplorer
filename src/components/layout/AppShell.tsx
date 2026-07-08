import { Link, Outlet } from 'react-router-dom'
import { CommandSearch } from '@/components/search/CommandSearch'
import styles from './AppShell.module.scss'

export function AppShell() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.tagline}>
            Explore Pokémon, moves, TMs, types and more
          </Link>
          <div className={styles.searchSlot}>
            <CommandSearch />
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
