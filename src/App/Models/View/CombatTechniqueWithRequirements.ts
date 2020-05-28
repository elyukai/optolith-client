import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { CombatTechnique } from "../Wiki/CombatTechnique"

export interface CombatTechniqueWithRequirements {
  wikiEntry: CombatTechnique
  stateEntry: SkillDependent
  at: number
  pa?: number
  max: number
  min: number
}
