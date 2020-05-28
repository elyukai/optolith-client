import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { CombatTechnique } from "../Wiki/CombatTechnique"

export interface CombatTechniqueCombined {
  wikiEntry: CombatTechnique
  stateEntry: SkillDependent
}
