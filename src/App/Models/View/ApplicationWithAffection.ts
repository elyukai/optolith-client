import { fromDefault, Record } from "../../../Data/Record"
import { Application } from "../Wiki/sub/Application"

export interface ApplicationWithAffection {
  "@@name": "ApplicationWithAffection"
  entry: Record<Application>
  active: boolean
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
export const ApplicationWithAffection =
  fromDefault ("ApplicationWithAffection")
  <ApplicationWithAffection> ({
    entry: Application.default,
    active: false,
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
