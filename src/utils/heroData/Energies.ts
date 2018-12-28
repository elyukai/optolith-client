import { fromDefault, makeGetters, makeLenses_, Record } from '../structures/Record';
import { PermanentEnergyLoss } from './PermanentEnergyLoss';
import { PermanentEnergyLossAndBoughtBack } from './PermanentEnergyLossAndBoughtBack';

export interface Energies {
  addedLifePoints: number
  addedArcaneEnergyPoints: number
  addedKarmaPoints: number
  permanentLifePoints: Record<PermanentEnergyLoss>
  permanentArcaneEnergyPoints: Record<PermanentEnergyLossAndBoughtBack>
  permanentKarmaPoints: Record<PermanentEnergyLossAndBoughtBack>
}

/**
 * Create a new `Energies` object.
 */
export const EnergiesCreator =
  fromDefault<Energies> ({
    addedLifePoints: 0,
    addedArcaneEnergyPoints: 0,
    addedKarmaPoints: 0,
    permanentLifePoints: PermanentEnergyLoss .default,
    permanentArcaneEnergyPoints: PermanentEnergyLossAndBoughtBack .default,
    permanentKarmaPoints: PermanentEnergyLossAndBoughtBack .default,
  })

export const EnergiesG = makeGetters (EnergiesCreator)
export const EnergiesL = makeLenses_ (EnergiesG) (EnergiesCreator)
