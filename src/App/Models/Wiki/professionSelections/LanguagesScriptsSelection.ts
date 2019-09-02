import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface LanguagesScriptsSelection {
  "@@name": "LanguagesScriptsSelection"
  id: ProfessionSelectionIds
  value: number
}

export const LanguagesScriptsSelection =
  fromDefault ("LanguagesScriptsSelection")
              <LanguagesScriptsSelection> ({
                id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
                value: 0,
              })

export const isLanguagesScriptsSelection =
  (obj: AnyProfessionSelection): obj is Record<LanguagesScriptsSelection> =>
    LanguagesScriptsSelection.AL.id (obj) === ProfessionSelectionIds.LANGUAGES_SCRIPTS
