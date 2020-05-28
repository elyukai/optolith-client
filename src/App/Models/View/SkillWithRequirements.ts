import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { Skill } from "../Wiki/Skill"

export interface SkillWithRequirements {
  wikiEntry: Skill
  stateEntry: SkillDependent
  isIncreasable: boolean
  isDecreasable: boolean
}
