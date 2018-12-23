import { PermanentEnergyLossAndBoughtBack } from '../../types/data';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';

/**
 * Create a new `PermanentEnergyLossAndBoughtBack` object.
 */
export const PermanentEnergyLossAndBoughtBackCreator =
  fromDefault<PermanentEnergyLossAndBoughtBack> ({
    lost: 0,
    redeemed: 0,
  })

export const PermanentEnergyLossAndBoughtBackG =
  makeGetters (PermanentEnergyLossAndBoughtBackCreator)

export const PermanentEnergyLossAndBoughtBackL =
  makeLenses_ (PermanentEnergyLossAndBoughtBackG)
              (PermanentEnergyLossAndBoughtBackCreator)
