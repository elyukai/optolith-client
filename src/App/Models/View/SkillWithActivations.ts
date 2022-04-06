import { fromDefault, Record } from "../../../Data/Record"
import { List } from "../../../Data/List"
import { pipe } from "../../Utilities/pipe"
import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { Advantage } from "../Wiki/Advantage"
import { Skill } from "../Wiki/Skill"
import { SpecialAbility } from "../Wiki/SpecialAbility"
import { Application } from "../Wiki/sub/Application"

export interface SkillWithActivations {
  "@@name": "SkillWithActivations"
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
  activeAdvantages: List<Record<Advantage>>
  activeApplications: List<Record<Application>>
  activeSpecialAbilities: List<Record<SpecialAbility>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SkillWithActivations =
  fromDefault ("SkillWithActivations")
  <SkillWithActivations> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
    activeAdvantages: List .empty,
    activeApplications: List .empty,
    activeSpecialAbilities: List .empty,
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
