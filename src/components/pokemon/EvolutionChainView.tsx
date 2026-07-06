import { Link } from 'react-router-dom'
import type { EvolutionNode } from '@/lib/evolution/flattenChain'
import { usePokemon } from '@/lib/queries/usePokemon'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Skeleton } from '@/components/ui/skeleton'
import { SpriteImage } from '@/components/pokemon/SpriteImage'

function EvolutionCard({ speciesName }: { speciesName: string }) {
  const { data, isLoading } = usePokemon(speciesName)
  const sprite = data?.sprites.front_default

  return (
    <Link
      to={`/pokemon/${speciesName}`}
      className="flex w-fit items-center gap-3 rounded-lg border bg-card p-2 pr-4 transition-colors hover:bg-accent"
    >
      {isLoading ? (
        <Skeleton className="h-12 w-12 rounded-md" />
      ) : (
        <SpriteImage src={sprite} alt="" className="h-12 w-12" />
      )}
      <span className="font-medium">{toDisplayName(speciesName)}</span>
    </Link>
  )
}

export function EvolutionChainView({ node }: { node: EvolutionNode }) {
  return (
    <div className="flex flex-col gap-3">
      <EvolutionCard speciesName={node.speciesName} />
      {node.children.map((child) => (
        <div key={child.speciesName} className="ml-6 flex flex-col gap-2 border-l pl-4">
          {child.conditions.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {child.conditions.join(' or ')}
            </span>
          )}
          <EvolutionChainView node={child} />
        </div>
      ))}
    </div>
  )
}
