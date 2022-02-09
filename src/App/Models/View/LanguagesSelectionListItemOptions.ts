import { fromDefault } from "../../../Data/Record"

export interface LanguagesSelectionListItemOptions {
  "@@name": "LanguagesSelectionListItemOptions"
  id: number
  name: string
  native: boolean
}

/**
 * Create a new `LanguagesSelectionListItem` object.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LanguagesSelectionListItemOptions =
  fromDefault ("LanguagesSelectionListItemOptions")
              <LanguagesSelectionListItemOptions> ({
                id: 0,
                name: "",
                native: false,
              })
