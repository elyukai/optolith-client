import { List } from "../../../Data/List"
import { fromDefault, Record } from "../../../Data/Record"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"

export interface State {
  "@@name": "State"
  id: string
  name: string
  description: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const State =
  fromDefault ("State")
              <State> ({
                id: "",
                name: "",
                description: "",
                src: List (),
                errata: List (),
              })
