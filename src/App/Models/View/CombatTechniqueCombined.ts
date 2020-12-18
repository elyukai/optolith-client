import { fromDefault, Record } from "../../../Data/Record"
import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { CombatTechnique } from "../Wiki/CombatTechnique"

export interface CombatTechniqueCombined {
  "@@name": "CombatTechniqueCombined"
  wikiEntry: Record<CombatTechnique>
  stateEntry: Record<SkillDependent>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CombatTechniqueCombined =
  fromDefault ("CombatTechniqueCombined")
              <CombatTechniqueCombined> ({
                wikiEntry: CombatTechnique .default,
                stateEntry: SkillDependent .default,
              })
