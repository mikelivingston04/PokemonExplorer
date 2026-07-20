import { useBuilder } from '@/lib/builder/useBuilder'
import { BuilderPokemonRow } from '@/components/builder/BuilderPokemonRow'
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
      <h1 className={styles.title}>Your Team</h1>
      <div className={styles.rows}>
        {team.map((name) => (
          <BuilderPokemonRow key={name} name={name} onRemove={() => removeFromBuilder(name)} />
        ))}
      </div>
    </div>
  )
}
