import { fromDefault } from "../../../Data/Record";

export interface LanguagesSelectionListItem {
  id: number
  name: string
  native: boolean
}

/**
 * Create a new `LanguagesSelectionListItem` object.
 */
export const LanguagesSelectionListItem =
  fromDefault ("LanguagesSelectionListItem")
              <LanguagesSelectionListItem> ({
                id: 0,
                name: "",
                native: false,
              })
