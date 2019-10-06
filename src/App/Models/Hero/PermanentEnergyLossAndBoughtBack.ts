import { fromDefault, makeLenses } from "../../../Data/Record";

export interface PermanentEnergyLossAndBoughtBack {
  "@@name": "PermanentEnergyLossAndBoughtBack"
  lost: number
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
