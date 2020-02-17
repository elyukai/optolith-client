import { NonEmptyList } from "../../../../Data/List"
import { fromDefault, makeLenses } from "../../../../Data/Record"

export interface RequireIncreasable {
  "@@name": "RequireIncreasable"
  id: string | NonEmptyList<string>
  value: number
}

export const RequireIncreasable =
  fromDefault ("RequireIncreasable")
              <RequireIncreasable> ({
                id: "",
                value: 0,
              })

export const RequireIncreasableL = makeLenses (RequireIncreasable)
