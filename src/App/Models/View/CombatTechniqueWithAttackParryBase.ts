import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { CombatTechnique } from "../Wiki/CombatTechnique";
import { CombatTechniqueCombined } from "./CombatTechniqueCombined";

export interface CombatTechniqueWithAttackParryBase extends CombatTechniqueCombined {
  at: number
  pa: Maybe<number>
}

export const CombatTechniqueWithAttackParryBase =
  fromDefault<CombatTechniqueWithAttackParryBase> ({
    wikiEntry: CombatTechnique .default,
    stateEntry: SkillDependent .default,
    at: 0,
    pa: Nothing,
  })
