import { fromDefault, makeLenses } from "../../../Data/Record";

export interface Purse {
  "@@name": "Purse"
  d: string
  s: string
  k: string
  h: string
}

/**
 * Create a new `Purse` object.
 */
export const Purse =
  fromDefault ("Purse")
              <Purse> ({
                d: "",
                s: "",
                h: "",
                k: "",
              })

export const PurseL = makeLenses (Purse)
