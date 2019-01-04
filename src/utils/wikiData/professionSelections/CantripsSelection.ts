import { List } from "../../structures/List";
import { fromDefault, Record } from "../../structures/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface CantripsSelection {
  id: ProfessionSelectionIds
  amount: number
  sid: List<string>
}

export const CantripsSelection =
  fromDefault<CantripsSelection> ({
    id: ProfessionSelectionIds.CANTRIPS,
    amount: 0,
    sid: List.empty,
  })

export const isCantripsSelection =
  (obj: AnyProfessionSelection): obj is Record<CantripsSelection> =>
    CantripsSelection.A.id (obj) === ProfessionSelectionIds.CANTRIPS
