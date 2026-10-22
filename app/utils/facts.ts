import type { FactoryStat } from '~/data/factory'
import type { LocalizedText } from '~/shared/types/localization'

/** One proof fact as the Facts Band renders it (DESIGN.md "Facts Band"), already localised. */
export type Fact = {
  id: string
  label: string
  value: string
  /** A numeric figure keeps the Stat role; a phrase uses the Title role. */
  figure?: boolean
}

/** The factory proof facts in the band's shape, in the order given. */
export function factsFromStats(
  stats: readonly FactoryStat[],
  t: (text: LocalizedText) => string
): Fact[] {
  return stats.map(stat => ({
    id: stat.id,
    label: t(stat.label),
    value: t(stat.value),
    figure: stat.figure ?? false
  }))
}
