import { fromDefault, makeLenses } from "../../../Data/Record";

export interface PermanentEnergyLoss {
  lost: number
}

/**
 * Create a new `PermanentEnergyLoss` object.
 */
export const PermanentEnergyLoss =
  fromDefault<PermanentEnergyLoss> ({
    lost: 0,
  })

export const PermanentEnergyLossL = makeLenses (PermanentEnergyLoss)
