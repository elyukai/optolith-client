import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { CombatTechnique } from "../Wiki/CombatTechnique"

export interface CombatTechniqueWithAttackParryBase {
  wikiEntry: CombatTechnique
  stateEntry: SkillDependent
  at: number
  pa?: number
}
