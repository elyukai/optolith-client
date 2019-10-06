import { fromDefault, makeLenses } from "../../../Data/Record";

export interface Pact {
  "@@name": "Pact"
  category: number
  level: number
  type: number
  domain: number | string
  name: string
}

export const Pact =
  fromDefault ("Pact")
              <Pact> ({
                name: "",
                category: 0,
                domain: 0,
                type: 0,
                level: 0,
              })

export const PactL = makeLenses (Pact)
