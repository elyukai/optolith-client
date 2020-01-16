import { fromDefault } from "../../../Data/Record";

export interface LanguagesSelectionListItemOptions {
  "@@name": "LanguagesSelectionListItemOptions"
  id: number
  name: string
  native: boolean
}

/**
 * Create a new `LanguagesSelectionListItem` object.
 */
export const LanguagesSelectionListItemOptions =
  fromDefault ("LanguagesSelectionListItemOptions")
              <LanguagesSelectionListItemOptions> ({
                id: 0,
                name: "",
                native: false,
              })
