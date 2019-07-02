import { fromDefault } from "../../../../Data/Record";
import { Pair } from "../../../../Data/Tuple";

export interface SourceLink {
  id: string
  page: number | Pair<number, number>
}

export const SourceLink =
  fromDefault<SourceLink> ({
    id: "",
    page: 0,
  })
