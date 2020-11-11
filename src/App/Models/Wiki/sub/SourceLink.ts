import { fromDefault } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"

export interface SourceLink {
  "@@name": "SourceLink"
  id: string
  page: number | Pair<number, number>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SourceLink =
  fromDefault ("SourceLink")
              <SourceLink> ({
                id: "",
                page: 0,
              })
