import { fromDefault, makeLenses } from "../../../Data/Record"

export interface PermanentEnergyLossAndBoughtBack {
  "@@name": "PermanentEnergyLossAndBoughtBack"
  lost: number
  redeemed: number
}

/**
 * Create a new `PermanentEnergyLossAndBoughtBack` object.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PermanentEnergyLossAndBoughtBack =
  fromDefault ("PermanentEnergyLossAndBoughtBack")
              <PermanentEnergyLossAndBoughtBack> ({
                lost: 0,
                redeemed: 0,
              })

export const PermanentEnergyLossAndBoughtBackL =
  makeLenses (PermanentEnergyLossAndBoughtBack)
