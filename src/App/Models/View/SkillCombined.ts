import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { Skill } from "../Wiki/Skill";

export interface SkillCombined {
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillCombined =
  fromDefault<SkillCombined> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
  })

const { wikiEntry, stateEntry } = SkillCombined.AL
const { id, check } = Skill.AL
const { value, dependencies } = SkillDependent.AL

export const SkillCombinedAccessors = {
  ...SkillCombined.AL,
  id: pipe (wikiEntry, id),
  check: pipe (wikiEntry, check),
  value: pipe (stateEntry, value),
  dependencies: pipe (stateEntry, dependencies),
}
