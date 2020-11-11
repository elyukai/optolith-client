import { List } from "../../../../Data/List"
import { fromDefault } from "../../../../Data/Record"

export interface CommonProfession {
  "@@name": "CommonProfession"
  list: List<string | number>
  reverse: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CommonProfession =
  fromDefault ("CommonProfession")
              <CommonProfession> ({
                list: List.empty,
                reverse: false,
              })
