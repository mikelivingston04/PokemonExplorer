import { Link } from 'react-router-dom'
import { ChevronRightIcon } from 'lucide-react'
import type { EvolutionNode } from '@/lib/evolution/flattenChain'
import { usePokemon } from '@/lib/queries/usePokemon'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Skeleton } from '@/components/ui/skeleton'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import styles from './EvolutionChainView.module.scss'

function EvolutionCard({ speciesName }: { speciesName: string }) {
  const { data, isLoading } = usePokemon(speciesName)
  const sprite = data?.sprites.front_default

  return (
    <Link to={`/pokemon/${speciesName}`} className={styles.card}>
      {isLoading ? (
        <Skeleton style={{ height: 'var(--sprite-size-evolution)', width: 'var(--sprite-size-evolution)' }} />
      ) : (
        <SpriteImage src={sprite} alt="" className={styles.sprite} />
      )}
      <span className={styles.name}>{toDisplayName(speciesName)}</span>
    </Link>
  )
}

function EvolutionArrow({ conditions }: { conditions: string[] }) {
  return (
    <div className={styles.arrow}>
      <ChevronRightIcon className={styles.arrowIcon} />
      {conditions.length > 0 && <span className={styles.condition}>{conditions.join(' or ')}</span>}
    </div>
  )
}

export function EvolutionChainView({ node }: { node: EvolutionNode }) {
  return (
    <div className={styles.row}>
      <EvolutionCard speciesName={node.speciesName} />
      {node.children.map((child) => (
        <div key={child.speciesName} className={styles.row}>
          <EvolutionArrow conditions={child.conditions} />
          <EvolutionChainView node={child} />
        </div>
      ))}
    </div>
  )
}
