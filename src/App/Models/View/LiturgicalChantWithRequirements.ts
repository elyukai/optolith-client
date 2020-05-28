import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent"
import { LiturgicalChant } from "../Wiki/LiturgicalChant"

export interface LiturgicalChantWithRequirements {
  wikiEntry: LiturgicalChant
  stateEntry: ActivatableSkillDependent
  isIncreasable: boolean
  isDecreasable: boolean
}
