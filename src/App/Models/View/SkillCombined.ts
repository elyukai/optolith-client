import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { Skill } from "../Wiki/Skill";

export interface SkillCombined {
  "@@name": "SkillCombined"
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillCombined =
  fromDefault ("SkillCombined")
              <SkillCombined> ({
                wikiEntry: Skill .default,
                stateEntry: SkillDependent .default,
              })

export const SkillCombinedA_ = {
  id: pipe (SkillCombined.A.wikiEntry, Skill.A.id),
  name: pipe (SkillCombined.A.wikiEntry, Skill.A.name),
  check: pipe (SkillCombined.A.wikiEntry, Skill.A.check),
  ic: pipe (SkillCombined.A.wikiEntry, Skill.A.ic),
  encumbrance: pipe (SkillCombined.A.wikiEntry, Skill.A.encumbrance),
  gr: pipe (SkillCombined.A.wikiEntry, Skill.A.gr),
  value: pipe (SkillCombined.A.stateEntry, SkillDependent.A.value),
  dependencies: pipe (SkillCombined.A.stateEntry, SkillDependent.A.dependencies),
}
