import { Link, Outlet } from 'react-router-dom'
import { CommandSearch } from '@/components/search/CommandSearch'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="shrink-0 font-semibold tracking-tight">
            <span className="hidden sm:inline">Pokémon FireRed Explorer</span>
            <span className="sm:hidden">FireRed Explorer</span>
          </Link>
          <div className="ml-auto">
            <CommandSearch />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
