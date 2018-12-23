import { PermanentEnergyLoss } from '../../types/data';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';

/**
 * Create a new `PermanentEnergyLoss` object.
 */
export const PermanentEnergyLossCreator =
  fromDefault<PermanentEnergyLoss> ({
    lost: 0,
  })

export const PermanentEnergyLossG = makeGetters (PermanentEnergyLossCreator)
export const PermanentEnergyLossL = makeLenses_ (PermanentEnergyLossG) (PermanentEnergyLossCreator)
