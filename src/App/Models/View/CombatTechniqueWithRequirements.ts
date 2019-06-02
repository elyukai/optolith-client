import { Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { CombatTechnique } from "../Wiki/CombatTechnique";
import { CombatTechniqueWithAttackParryBase } from "./CombatTechniqueWithAttackParryBase";

export interface CombatTechniqueWithRequirements extends CombatTechniqueWithAttackParryBase {
  max: number
  min: number
}

export const CombatTechniqueWithRequirements =
  fromDefault<CombatTechniqueWithRequirements> ({
    wikiEntry: CombatTechnique .default,
    stateEntry: SkillDependent .default,
    at: 0,
    pa: Nothing,
    max: 0,
    min: 0,
  })

export const CombatTechniqueWithRequirementsA_ = {
  id: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.id),
  primary: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.primary),
  name: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name),
  ic: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.ic),
  gr: pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.gr),
  value: pipe (CombatTechniqueWithRequirements.A.stateEntry, SkillDependent.A.value),
}
