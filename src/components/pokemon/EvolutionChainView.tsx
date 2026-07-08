import { Link } from 'react-router-dom'
import { ChevronRightIcon } from 'lucide-react'
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
      className="flex w-fit shrink-0 flex-col items-center gap-1 rounded-xl border bg-card/60 p-3 text-center transition-colors hover:border-foreground/20 hover:bg-card"
    >
      {isLoading ? (
        <Skeleton className="h-14 w-14 rounded-md" />
      ) : (
        <SpriteImage src={sprite} alt="" className="h-14 w-14 object-contain" />
      )}
      <span className="text-sm font-medium">{toDisplayName(speciesName)}</span>
    </Link>
  )
}

function EvolutionArrow({ conditions }: { conditions: string[] }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5 px-1 text-muted-foreground">
      <ChevronRightIcon className="size-5" />
      {conditions.length > 0 && (
        <span className="max-w-24 text-center text-[10px] leading-tight text-balance">
          {conditions.join(' or ')}
        </span>
      )}
    </div>
  )
}

export function EvolutionChainView({ node }: { node: EvolutionNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <EvolutionCard speciesName={node.speciesName} />
      {node.children.map((child) => (
        <div key={child.speciesName} className="flex flex-wrap items-center gap-2">
          <EvolutionArrow conditions={child.conditions} />
          <EvolutionChainView node={child} />
        </div>
      ))}
    </div>
  )
}
