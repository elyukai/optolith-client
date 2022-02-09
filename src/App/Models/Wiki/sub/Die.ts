import { fromDefault } from "../../../../Data/Record"

export interface Die {
  "@@name": "Die"
  sides: number
  amount: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Die =
  fromDefault ("Die")
              <Die> ({
                amount: 0,
                sides: 0,
              })
