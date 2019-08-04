import { List } from "../../../../Data/List";
import { fromDefault } from "../../../../Data/Record";

export interface CommonProfession {
  list: List<string | number>
  reverse: boolean
}

export const CommonProfession =
  fromDefault ("CommonProfession")
              <CommonProfession> ({
                list: List.empty,
                reverse: false,
              })
