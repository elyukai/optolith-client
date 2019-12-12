import { empty, List } from "../../../../Data/List";
import { fromDefault, makeLenses } from "../../../../Data/Record";
import { Pair } from "../../../../Data/Tuple";

export interface SourceLinks {
  "@@name": "SourceLinks"
  id: string
  pages: List<number | Pair<number, number>>
}

export const SourceLinks =
  fromDefault ("SourceLinks")
              <SourceLinks> ({
                id: "",
                pages: empty,
              })

export const SourceLinksL = makeLenses (SourceLinks)
