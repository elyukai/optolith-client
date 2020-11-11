import { List } from "../../../../Data/List"
import { fromDefault } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"

export interface CantripsSelection {
  "@@name": "CantripsSelection"
  id: ProfessionSelectionIds
  amount: number
  sid: List<string>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CantripsSelection =
  fromDefault ("CantripsSelection")
              <CantripsSelection> ({
                id: ProfessionSelectionIds.CANTRIPS,
                amount: 0,
                sid: List.empty,
              })
