import { fromDefault, makeGetters } from '../structures/Record';

export interface ExperienceLevel {
  id: string
  name: string
  ap: number
  maxAttributeValue: number
  maxSkillRating: number
  maxCombatTechniqueRating: number
  maxTotalAttributeValues: number
  maxSpellsLiturgies: number
  maxUnfamiliarSpells: number
}

export const ExperienceLevel =
  fromDefault<ExperienceLevel> ({
    id: '',
    name: '',
    ap: 0,
    maxAttributeValue: 0,
    maxSkillRating: 0,
    maxCombatTechniqueRating: 0,
    maxTotalAttributeValues: 0,
    maxSpellsLiturgies: 0,
    maxUnfamiliarSpells: 0,
  })

export const ExperienceLevelG = makeGetters (ExperienceLevel)
