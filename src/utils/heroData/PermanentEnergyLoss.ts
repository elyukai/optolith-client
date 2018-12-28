import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';

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

export const PermanentEnergyLossG = makeGetters (PermanentEnergyLoss)
export const PermanentEnergyLossL = makeLenses_ (PermanentEnergyLossG) (PermanentEnergyLoss)
