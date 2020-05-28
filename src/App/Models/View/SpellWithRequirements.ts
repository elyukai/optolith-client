import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent"
import { Spell } from "../Wiki/Spell"

export interface SpellWithRequirements {
  wikiEntry: Spell
  stateEntry: ActivatableSkillDependent
  isUnfamiliar: boolean
  isIncreasable: boolean
  isDecreasable: boolean
}
