import { fromDefault } from "../../../Data/Record";

export interface ExperienceLevel {
  "@@name": "ExperienceLevel"
  id: string
  name: string
  ap: number
  maxAttributeValue: number
  maxSkillRating: number
  maxCombatTechniqueRating: number
  maxTotalAttributeValues: number
  maxSpellsLiturgicalChants: number
  maxUnfamiliarSpells: number
}

export const ExperienceLevel =
  fromDefault ("ExperienceLevel")
              <ExperienceLevel> ({
                id: "",
                name: "",
                ap: 0,
                maxAttributeValue: 0,
                maxSkillRating: 0,
                maxCombatTechniqueRating: 0,
                maxTotalAttributeValues: 0,
                maxSpellsLiturgicalChants: 0,
                maxUnfamiliarSpells: 0,
              })
