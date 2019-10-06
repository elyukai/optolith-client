import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { Skill } from "../Wiki/Skill";
import { IncreasableWithRequirements } from "./viewTypeHelpers";

export interface SkillWithRequirements extends IncreasableWithRequirements {
  "@@name": "SkillWithRequirements"
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillWithRequirements =
  fromDefault ("SkillWithRequirements")
              <SkillWithRequirements> ({
                wikiEntry: Skill .default,
                stateEntry: SkillDependent .default,
                isIncreasable: false,
                isDecreasable: false,
              })

export const SkillWithRequirementsA_ = {
  id: pipe (SkillWithRequirements.A.wikiEntry, Skill.A.id),
  name: pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name),
  check: pipe (SkillWithRequirements.A.wikiEntry, Skill.A.check),
  ic: pipe (SkillWithRequirements.A.wikiEntry, Skill.A.ic),
  encumbrance: pipe (SkillWithRequirements.A.wikiEntry, Skill.A.encumbrance),
  gr: pipe (SkillWithRequirements.A.wikiEntry, Skill.A.gr),
  value: pipe (SkillWithRequirements.A.stateEntry, SkillDependent.A.value),
  dependencies: pipe (SkillWithRequirements.A.stateEntry, SkillDependent.A.dependencies),
}
