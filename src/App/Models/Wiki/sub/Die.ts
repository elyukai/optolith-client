import { fromDefault } from "../../../../Data/Record";

export interface Die {
  "@@name": "Die"
  sides: number
  amount: number
}

export const Die =
  fromDefault ("Die")
              <Die> ({
                amount: 0,
                sides: 0,
              })
