import { fromDefault } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"

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
