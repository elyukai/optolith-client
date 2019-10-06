import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface CursesSelection {
  "@@name": "CursesSelection"
  id: ProfessionSelectionIds
  value: number
}

export const CursesSelection =
  fromDefault ("CursesSelection")
              <CursesSelection> ({
                id: ProfessionSelectionIds.CURSES,
                value: 0,
              })

export const isCursesSelection =
  (obj: AnyProfessionSelection): obj is Record<CursesSelection> =>
    CursesSelection.AL.id (obj) === ProfessionSelectionIds.CURSES
