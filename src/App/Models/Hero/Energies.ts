import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { PermanentEnergyLoss } from "./PermanentEnergyLoss";
import { PermanentEnergyLossAndBoughtBack } from "./PermanentEnergyLossAndBoughtBack";

export interface Energies {
  "@@name": "Energies"
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
export const Energies =
  fromDefault ("Energies")
              <Energies> ({
                addedLifePoints: 0,
                addedArcaneEnergyPoints: 0,
                addedKarmaPoints: 0,
                permanentLifePoints: PermanentEnergyLoss .default,
                permanentArcaneEnergyPoints: PermanentEnergyLossAndBoughtBack .default,
                permanentKarmaPoints: PermanentEnergyLossAndBoughtBack .default,
              })

export const EnergiesL = makeLenses (Energies)
