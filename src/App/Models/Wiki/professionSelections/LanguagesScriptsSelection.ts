import { fromDefault } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"

export interface LanguagesScriptsSelection {
  "@@name": "LanguagesScriptsSelection"
  id: ProfessionSelectionIds
  value: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LanguagesScriptsSelection =
  fromDefault ("LanguagesScriptsSelection")
              <LanguagesScriptsSelection> ({
                id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
                value: 0,
              })
