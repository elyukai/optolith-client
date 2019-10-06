import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface CantripsSelection {
  "@@name": "CantripsSelection"
  id: ProfessionSelectionIds
  amount: number
  sid: List<string>
}

export const CantripsSelection =
  fromDefault ("CantripsSelection")
              <CantripsSelection> ({
                id: ProfessionSelectionIds.CANTRIPS,
                amount: 0,
                sid: List.empty,
              })

export const isCantripsSelection =
  (obj: AnyProfessionSelection): obj is Record<CantripsSelection> =>
    CantripsSelection.AL.id (obj) === ProfessionSelectionIds.CANTRIPS
