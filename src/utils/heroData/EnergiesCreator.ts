import { Energies } from '../../types/data';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';
import { PermanentEnergyLossAndBoughtBackCreator } from './PermanentEnergyLossAndBoughtBackCreator';
import { PermanentEnergyLossCreator } from './PermanentEnergyLossCreator';

/**
 * Create a new `Energies` object.
 */
export const EnergiesCreator =
  fromDefault<Energies> ({
    addedLifePoints: 0,
    addedArcaneEnergyPoints: 0,
    addedKarmaPoints: 0,
    permanentLifePoints: PermanentEnergyLossCreator ({ lost: 0 }),
    permanentArcaneEnergyPoints: PermanentEnergyLossAndBoughtBackCreator ({ lost: 0, redeemed: 0 }),
    permanentKarmaPoints: PermanentEnergyLossAndBoughtBackCreator ({ lost: 0, redeemed: 0 }),
  })

export const EnergiesG = makeGetters (EnergiesCreator)
export const EnergiesL = makeLenses_ (EnergiesG) (EnergiesCreator)
