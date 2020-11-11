import { fromDefault, makeLenses } from "../../../Data/Record"

export interface ActivatableDeactivationOptions {
  "@@name": "ActivatableDeactivationOptions"
  id: string
  index: number
  cost: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActivatableDeactivationOptions =
  fromDefault ("ActivatableDeactivationOptions")
              <ActivatableDeactivationOptions> ({
                id: "",
                index: -1,
                cost: 0,
              })

export const ActivatableDeactivationOptionsL = makeLenses (ActivatableDeactivationOptions)
