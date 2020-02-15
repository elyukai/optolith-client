import { List } from "../../../Data/List"
import { fromDefault, Record } from "../../../Data/Record"
import { SourceLink } from "../Wiki/sub/SourceLink"

export interface SrcOnly {
  "@@name": "SrcOnly"
  src: List<Record<SourceLink>>
}

export const SrcOnly =
  fromDefault ("SrcOnly")
              <SrcOnly> ({
                src: List<Record<SourceLink>> (),
              })
