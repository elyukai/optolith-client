import { List } from "../../../../Data/List";
import { fromDefault, makeLenses, member, Record } from "../../../../Data/Record";
import { AnyProfessionVariantSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface CombatTechniquesSelection {
  "@@name": "CombatTechniquesSelection"
  id: ProfessionSelectionIds
  amount: number
  value: number
  sid: List<string>
}

export const CombatTechniquesSelection =
  fromDefault ("CombatTechniquesSelection")
              <CombatTechniquesSelection> ({
                id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
                amount: 0,
                value: 0,
                sid: List.empty,
              })

export const CombatTechniquesSelectionL = makeLenses (CombatTechniquesSelection)

export const isCombatTechniquesSelection =
  (obj: AnyProfessionVariantSelection): obj is Record<CombatTechniquesSelection> =>
    CombatTechniquesSelection.AL.id (obj) === ProfessionSelectionIds.COMBAT_TECHNIQUES
      && member ("sid") (obj)
      && member ("value") (obj)
      && member ("amount") (obj)
