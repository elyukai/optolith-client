import { fromDefault } from "../../../../Data/Record";

export interface SourceLink {
  id: string
  page: number
}

export const SourceLink =
  fromDefault<SourceLink> ({
    id: "",
    page: 0,
  })
