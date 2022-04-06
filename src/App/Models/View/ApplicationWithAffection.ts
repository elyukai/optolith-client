import { fromDefault, Record } from "../../../Data/Record"
import { Application } from "../Wiki/sub/Application"

export interface ApplicationWithAffection {
  "@@name": "ApplicationWithAffection"
  entry: Record<Application>
  active: boolean
  bonus: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ApplicationWithAffection =
  fromDefault ("ApplicationWithAffection")
  <ApplicationWithAffection> ({
    entry: Application.default,
    active: false,
    bonus: 0,
  })
