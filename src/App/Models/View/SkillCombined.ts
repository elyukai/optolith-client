import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { Skill } from "../Wiki/Skill"

export interface SkillCombined {
  wikiEntry: Skill
  stateEntry: SkillDependent
}
