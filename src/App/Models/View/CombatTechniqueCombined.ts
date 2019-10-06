import { fromDefault, Record } from "../../../Data/Record";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { CombatTechnique } from "../Wiki/CombatTechnique";

export interface CombatTechniqueCombined {
  "@@name": "CombatTechniqueCombined"
  wikiEntry: Record<CombatTechnique>
  stateEntry: Record<SkillDependent>
}

export const CombatTechniqueCombined =
  fromDefault ("CombatTechniqueCombined")
              <CombatTechniqueCombined> ({
                wikiEntry: CombatTechnique .default,
                stateEntry: SkillDependent .default,
              })
