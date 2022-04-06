import { fromDefault } from "../../../../Data/Record"

export interface Affection {
  "@@name": "Affection"
  id: string

  bonus: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Affection =
  fromDefault ("Affection")
  <Affection> ({
    id: "",
    bonus: 0,
  })
