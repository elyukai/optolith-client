import { Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
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
