import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from 'lucide-react'
import type { EvolutionNode } from '@/lib/evolution/flattenChain'
import { usePokemon } from '@/lib/queries/usePokemon'
import { toDisplayName } from '@/lib/constants/nameOverrides'
import { Skeleton } from '@/components/ui/skeleton'
import { SpriteImage } from '@/components/pokemon/SpriteImage'
import { cn } from '@/lib/utils'
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
  const text = conditions.join(' or ')
  const [expanded, setExpanded] = useState(false)
  const [truncated, setTruncated] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  // Measured against the clamped (collapsed) text specifically, since
  // that's the only state where overflow can actually happen — tells us
  // whether there's anything for "more..." to reveal in the first place.
  // The "more..." hint is a sibling of the clamped span, not a child of
  // it — inside the clamp it would just get cut off along with the text.
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el || expanded) return
    setTruncated(el.scrollHeight > el.clientHeight + 1)
  }, [text, expanded])

  return (
    <div className={styles.arrow}>
      <ChevronRightIcon className={styles.arrowIcon} />
      {conditions.length > 0 && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className={styles.condition}>
          <span ref={textRef} className={cn(styles.conditionText, expanded && styles.conditionTextExpanded)}>
            {text}
          </span>
          {!expanded && truncated && <span className={styles.conditionMore}>more...</span>}
        </button>
      )}
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
