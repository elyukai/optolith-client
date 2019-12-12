import { fromDefault } from "../../../../Data/Record";
import { Pair } from "../../../../Data/Tuple";

export interface SourceLink {
  "@@name": "SourceLink"
  id: string
  page: number | Pair<number, number>
}

export const SourceLink =
  fromDefault ("SourceLink")
              <SourceLink> ({
                id: "",
                page: 0,
              })
