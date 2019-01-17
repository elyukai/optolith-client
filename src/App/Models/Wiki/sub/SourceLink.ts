import { Pair } from "../../../../Data/Pair";
import { fromDefault } from "../../../../Data/Record";

export interface SourceLink {
  id: string
  page: number | Pair<number, number>
}

export const SourceLink =
  fromDefault<SourceLink> ({
    id: "",
    page: 0,
  })
