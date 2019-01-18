import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawLanguagesScriptsSelection {
  id: ProfessionSelectionIds
  value: number
}

export const isRawLanguagesScriptsSelection =
  (obj: AnyRawProfessionSelection): obj is RawLanguagesScriptsSelection =>
    obj .id === ProfessionSelectionIds.CURSES
    // @ts-ignore
    && typeof obj .value === "number"
