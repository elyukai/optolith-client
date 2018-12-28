import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';
import { PermanentEnergyLoss } from './PermanentEnergyLoss';

export interface PermanentEnergyLossAndBoughtBack extends PermanentEnergyLoss {
  redeemed: number
}

/**
 * Create a new `PermanentEnergyLossAndBoughtBack` object.
 */
export const PermanentEnergyLossAndBoughtBack =
  fromDefault<PermanentEnergyLossAndBoughtBack> ({
    lost: 0,
    redeemed: 0,
  })

export const PermanentEnergyLossAndBoughtBackG =
  makeGetters (PermanentEnergyLossAndBoughtBack)

export const PermanentEnergyLossAndBoughtBackL =
  makeLenses_ (PermanentEnergyLossAndBoughtBackG)
              (PermanentEnergyLossAndBoughtBack)
