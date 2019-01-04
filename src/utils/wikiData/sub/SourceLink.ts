import { fromDefault } from "../../structures/Record";

export interface SourceLink {
  id: string
  page: number
}

export const SourceLink =
  fromDefault<SourceLink> ({
    id: "",
    page: 0,
  })
