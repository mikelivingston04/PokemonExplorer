import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient, persistOptions } from '@/lib/queryClient'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/routes/HomePage'
import { PokemonDetailPage } from '@/routes/PokemonDetailPage'
import { MoveDetailPage } from '@/routes/MoveDetailPage'
import { TypeDetailPage } from '@/routes/TypeDetailPage'

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="pokemon/:name" element={<PokemonDetailPage />} />
            <Route path="move/:name" element={<MoveDetailPage />} />
            <Route path="type/:name" element={<TypeDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  )
}

export default App
