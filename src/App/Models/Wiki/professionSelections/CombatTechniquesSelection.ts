import { List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"
import { CombatTechniquesSecondSelection } from "./SecondCombatTechniquesSelection"

export interface CombatTechniquesSelection {
  "@@name": "CombatTechniquesSelection"
  id: ProfessionSelectionIds
  amount: number
  value: number
  second: Maybe<Record<CombatTechniquesSecondSelection>>
  sid: List<string>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CombatTechniquesSelection =
  fromDefault ("CombatTechniquesSelection")
              <CombatTechniquesSelection> ({
                id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
                amount: 0,
                value: 0,
                second: Nothing,
                sid: List.empty,
              })

export const CombatTechniquesSelectionL = makeLenses (CombatTechniquesSelection)
