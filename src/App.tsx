import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persistOptions } from '@/lib/queryClient'
import { BuilderProvider } from '@/lib/builder/BuilderContext'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/routes/HomePage'
import { PokemonDetailPage } from '@/routes/PokemonDetailPage'
import { MoveDetailPage } from '@/routes/MoveDetailPage'
import { TypeDetailPage } from '@/routes/TypeDetailPage'
import { BuilderPage } from '@/routes/BuilderPage'

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <BuilderProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="pokemon/:name" element={<PokemonDetailPage />} />
              <Route path="move/:name" element={<MoveDetailPage />} />
              <Route path="type/:name" element={<TypeDetailPage />} />
              <Route path="builder" element={<BuilderPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BuilderProvider>
    </PersistQueryClientProvider>
  )
}

export default App
