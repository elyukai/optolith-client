import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface CombatTechniquesSecondSelection {
  "@@name": "CombatTechniquesSecondSelection"
  id: ProfessionSelectionIds
  amount: number
  value: number
  sid: List<string>
}

export const CombatTechniquesSecondSelection =
  fromDefault ("CombatTechniquesSecondSelection")
              <CombatTechniquesSecondSelection> ({
                id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
                amount: 0,
                value: 0,
                sid: List.empty,
              })

export const isSecondCombatTechniquesSelection =
  (obj: AnyProfessionSelection): obj is Record<CombatTechniquesSecondSelection> =>
    CombatTechniquesSecondSelection.AL.id (obj) === ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND
