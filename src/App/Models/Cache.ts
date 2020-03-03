export interface Cache extends PresavedCache {
  appVersion: string
}

export interface PresavedCache {
  ap: {
    [heroId: string]: APCache
  }
}

export interface APCache {
  spent: number
  available?: number
  spentOnAdvantages?: number | [number, number]
  spentOnMagicalAdvantages?: number | [number, number]
  spentOnBlessedAdvantages?: number | [number, number]
  spentOnDisadvantages?: number | [number, number]
  spentOnMagicalDisadvantages?: number | [number, number]
  spentOnBlessedDisadvantages?: number | [number, number]
  spentOnSpecialAbilities?: number
  spentOnAttributes: number
  spentOnSkills: number
  spentOnCombatTechniques: number
  spentOnSpells: number
  spentOnLiturgicalChants: number
  spentOnCantrips: number
  spentOnBlessings: number
  spentOnEnergies: number
}
