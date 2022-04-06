import { fromDefault, Record } from "../../../Data/Record"
import { List } from "../../../Data/List"
import { pipe } from "../../Utilities/pipe"
import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { Skill } from "../Wiki/Skill"
import { Application } from "../Wiki/sub/Application"
import { ApplicationWithAffection } from "./ApplicationWithAffection"

export interface SkillWithActivations {
  "@@name": "SkillWithActivations"
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
  activeAffections: List<Record<ApplicationWithAffection>>
  activeApplications: List<Record<Application>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SkillWithActivations =
  fromDefault ("SkillWithActivations")
  <SkillWithActivations> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
    activeAffections: List .empty,
    activeApplications: List .empty,
  })

export const SkillWithActivationsA_ = {
  id: pipe (SkillWithActivations.A.wikiEntry, Skill.A.id),
  name: pipe (SkillWithActivations.A.wikiEntry, Skill.A.name),
  check: pipe (SkillWithActivations.A.wikiEntry, Skill.A.check),
  ic: pipe (SkillWithActivations.A.wikiEntry, Skill.A.ic),
  encumbrance: pipe (SkillWithActivations.A.wikiEntry, Skill.A.encumbrance),
  gr: pipe (SkillWithActivations.A.wikiEntry, Skill.A.gr),
  value: pipe (SkillWithActivations.A.stateEntry, SkillDependent.A.value),
  dependencies: pipe (SkillWithActivations.A.stateEntry, SkillDependent.A.dependencies),
}
