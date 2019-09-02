import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { CombatTechnique } from "../Wiki/CombatTechnique";

export interface CombatTechniqueWithAttackParryBase {
  "@@name": "CombatTechniqueWithAttackParryBase"
  wikiEntry: Record<CombatTechnique>
  stateEntry: Record<SkillDependent>
  at: number
  pa: Maybe<number>
}

export const CombatTechniqueWithAttackParryBase =
  fromDefault ("CombatTechniqueWithAttackParryBase")
              <CombatTechniqueWithAttackParryBase> ({
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
