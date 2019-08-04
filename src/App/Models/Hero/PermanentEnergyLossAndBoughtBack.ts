import { fromDefault, makeLenses } from "../../../Data/Record";
import { PermanentEnergyLoss } from "./PermanentEnergyLoss";

export interface PermanentEnergyLossAndBoughtBack extends PermanentEnergyLoss {
  redeemed: number
}

/**
 * Create a new `PermanentEnergyLossAndBoughtBack` object.
 */
export const PermanentEnergyLossAndBoughtBack =
  fromDefault ("PermanentEnergyLossAndBoughtBack")
              <PermanentEnergyLossAndBoughtBack> ({
                lost: 0,
                redeemed: 0,
              })

export const PermanentEnergyLossAndBoughtBackL =
  makeLenses (PermanentEnergyLossAndBoughtBack)
