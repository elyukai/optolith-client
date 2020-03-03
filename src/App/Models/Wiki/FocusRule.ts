import { List } from "../../../Data/List"
import { fromDefault, Record } from "../../../Data/Record"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"

export interface FocusRule {
  "@@name": "FocusRule"
  id: string
  name: string
  level: number
  subject: number
  description: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const FocusRule =
  fromDefault ("FocusRule")
              <FocusRule> ({
                id: "",
                name: "",
                level: 0,
                subject: 0,
                description: "",
                src: List (),
                errata: List (),
              })
