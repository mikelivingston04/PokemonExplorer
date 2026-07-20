import { Fragment } from 'react'
import { useBuilder } from '@/lib/builder/useBuilder'
import { TEAM_CAP } from '@/lib/builder/context'
import { BuilderPokemonRow } from '@/components/builder/BuilderPokemonRow'
import { TypeCoverageCard } from '@/components/builder/TypeCoverageCard'
import builderPlaceholder from '@/assets/builder-placeholder.png'
import styles from './BuilderPage.module.scss'

export function BuilderPage() {
  const { team, removeFromBuilder } = useBuilder()

  if (team.length === 0) {
    return (
      <div className={styles.empty}>
        <img src={builderPlaceholder} alt="" className={styles.emptyImage} />
        <p className={styles.emptyHint}>
          No Pokémon added yet — visit a Pokémon's page and hit "Add to Builder" to hold it here.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Your Team</h2>
      <TypeCoverageCard />
      <div className={styles.rows}>
        {team.map((name, i) => (
          <Fragment key={name}>
            {i === TEAM_CAP && (
              <div className={styles.capDivider}>
                <span className={styles.capDividerLabel}>
                  Teams cap at {TEAM_CAP} — anything below is just extra bench space and won't count
                  toward type coverage
                </span>
              </div>
            )}
            <BuilderPokemonRow name={name} onRemove={() => removeFromBuilder(name)} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
