import { fromDefault } from "../../../../Data/Record"

export interface Affection {
  "@@name": "Affection"
  id: string

  bonus: number
  bonusOnAttribute: {
    CH: number
    KL: number
  }
  penalty: number
  penaltyOnAttribute: {
    CH: number
    KL: number
  }
  situative: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Affection =
  fromDefault ("Affection")
  <Affection> ({
    id: "",
    bonus: 0,
    bonusOnAttribute: {
      CH: 0,
      KL: 0,
    },
    penalty: 0,
    penaltyOnAttribute: {
      CH: 0,
      KL: 0,
    },
    situative: false,
  })
