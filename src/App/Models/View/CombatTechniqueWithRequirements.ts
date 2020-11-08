import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { pipe } from "../../Utilities/pipe"
import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { CombatTechnique } from "../Wiki/CombatTechnique"
import { IncreasableWithRequirements } from "./viewTypeHelpers"

export interface CombatTechniqueWithRequirements extends IncreasableWithRequirements {
  "@@name": "CombatTechniqueWithRequirements"
  wikiEntry: Record<CombatTechnique>
  stateEntry: Record<SkillDependent>
  at: number
  pa: Maybe<number>
}

export const CombatTechniqueWithRequirements =
  fromDefault ("CombatTechniqueWithRequirements")
              <CombatTechniqueWithRequirements> ({
                wikiEntry: CombatTechnique .default,
                stateEntry: SkillDependent .default,
                at: 0,
                pa: Nothing,
                isIncreasable: false,
                isDecreasable: false,
              })

export const CombatTechniqueWithRequirementsA_ = {
  id: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.id),
  primary: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.primary),
  name: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name),
  ic: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.ic),
  gr: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.gr),
  value: pipe (CombatTechniqueWithRequirements.A.stateEntry, SkillDependent.A.value),
}
