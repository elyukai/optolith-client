import { fromDefault, makeLenses } from "../../../Data/Record"

export interface PermanentEnergyLoss {
  "@@name": "PermanentEnergyLoss"
  lost: number
}

/**
 * Create a new `PermanentEnergyLoss` object.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PermanentEnergyLoss =
  fromDefault ("PermanentEnergyLoss")
              <PermanentEnergyLoss> ({
                lost: 0,
              })

export const PermanentEnergyLossL = makeLenses (PermanentEnergyLoss)
