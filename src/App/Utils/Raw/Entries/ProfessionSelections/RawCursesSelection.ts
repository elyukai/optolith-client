import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawCursesSelection {
  id: ProfessionSelectionIds
  value: number
}

export const isRawCursesSelection =
  (obj: AnyRawProfessionSelection): obj is RawCursesSelection =>
    obj .id === ProfessionSelectionIds.CURSES
    // @ts-ignore
    && typeof obj .value === "number"
