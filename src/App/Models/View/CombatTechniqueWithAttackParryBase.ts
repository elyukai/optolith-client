import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
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

const CTWAPBA = CombatTechniqueWithAttackParryBase.A
const CTA = CombatTechnique.A
const SDA = SkillDependent.A

export const CombatTechniqueWithAttackParryBaseA_ = {
  id: pipe (CTWAPBA.wikiEntry, CTA.id),
  name: pipe (CTWAPBA.wikiEntry, CTA.name),
  primary: pipe (CTWAPBA.wikiEntry, CTA.primary),
  ic: pipe (CTWAPBA.wikiEntry, CTA.ic),
  value: pipe (CTWAPBA.stateEntry, SDA.value),
}
