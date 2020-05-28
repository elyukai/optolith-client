import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent"
import { LiturgicalChant } from "../Wiki/LiturgicalChant"

export interface LiturgicalChantCombined {
  wikiEntry: LiturgicalChant
  stateEntry: ActivatableSkillDependent
}
