import { fromDefault, makeLenses } from "../../../../Data/Record"

export interface ProfessionRequireIncreasable {
  "@@name": "ProfessionRequireIncreasable"
  id: string
  value: number
}

export const ProfessionRequireIncreasable =
  fromDefault ("ProfessionRequireIncreasable")
              <ProfessionRequireIncreasable> ({
                id: "",
                value: 0,
              })

export const ProfessionRequireIncreasableL = makeLenses (ProfessionRequireIncreasable)
