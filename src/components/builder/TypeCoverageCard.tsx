import { ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible'
import { useTeamCoverage } from '@/lib/builder/useTeamCoverage'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { ALL_TYPE_NAMES } from '@/lib/constants/typeColors'
import styles from './TypeCoverageCard.module.scss'

export function TypeCoverageCard() {
  const { covered } = useTeamCoverage()

  return (
    <Collapsible className={styles.root}>
      <CollapsibleTrigger className={styles.trigger}>
        <span className={styles.triggerLabel}>Type Coverage</span>
        <span className={styles.triggerRight}>
          <span className={styles.triggerCount}>
            {covered.size}/{ALL_TYPE_NAMES.length} covered
          </span>
          <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
        </span>
      </CollapsibleTrigger>
      <CollapsiblePanel className={styles.panel}>
        <div className={styles.grid}>
          {ALL_TYPE_NAMES.map((type) => {
            const isCovered = covered.has(type)
            return (
              <div key={type} className={styles.row}>
                <TypeBadge type={type} />
                {isCovered ? (
                  <CheckIcon className={styles.checkIcon} aria-hidden="true" />
                ) : (
                  <XIcon className={styles.xIcon} aria-hidden="true" />
                )}
                <span className="sr-only">{isCovered ? 'Covered' : 'Not covered'}</span>
              </div>
            )
          })}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
