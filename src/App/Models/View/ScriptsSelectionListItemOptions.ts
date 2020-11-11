import { fromDefault } from "../../../Data/Record"

export interface ScriptsSelectionListItemOptions {
  "@@name": "ScriptsSelectionListItemOptions"
  id: number
  name: string
  cost: number
  native: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ScriptsSelectionListItemOptions =
  fromDefault ("ScriptsSelectionListItemOptions")
              <ScriptsSelectionListItemOptions> ({
                id: 0,
                name: "",
                cost: 0,
                native: false,
              })
