import { fromDefault } from "../../../Data/Record";

export interface ScriptsSelectionListItem {
  id: number
  name: string
  cost: number
  native: boolean
}

/**
 * Create a new `ScriptsSelectionListItem` object.
 */
export const ScriptsSelectionListItem =
  fromDefault<ScriptsSelectionListItem> ({
    id: 0,
    name: "",
    cost: 0,
    native: false,
  })
