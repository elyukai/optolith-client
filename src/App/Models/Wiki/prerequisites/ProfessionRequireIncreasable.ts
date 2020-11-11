import { fromDefault, makeLenses } from "../../../../Data/Record"

export interface ProfessionRequireIncreasable {
  "@@name": "ProfessionRequireIncreasable"
  id: string
  value: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ProfessionRequireIncreasable =
  fromDefault ("ProfessionRequireIncreasable")
              <ProfessionRequireIncreasable> ({
                id: "",
                value: 0,
              })

export const ProfessionRequireIncreasableL = makeLenses (ProfessionRequireIncreasable)
