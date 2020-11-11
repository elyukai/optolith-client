import { List } from "../../../Data/List"
import { fromDefault, Record } from "../../../Data/Record"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"

export interface OptionalRule {
  "@@name": "OptionalRule"
  id: string
  name: string
  description: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OptionalRule =
  fromDefault ("OptionalRule")
              <OptionalRule> ({
                id: "",
                name: "",
                description: "",
                src: List (),
                errata: List (),
              })
