import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent"
import { Spell } from "../Wiki/Spell"

export interface SpellCombined {
  wikiEntry: Spell
  stateEntry: ActivatableSkillDependent
}
