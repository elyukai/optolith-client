import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { Erratum } from "./sub/Errata";
import { SourceLink } from "./sub/SourceLink";

export interface Status {
  "@@name": "Status"
  id: string
  name: string
  description: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const Status =
  fromDefault ("Status")
              <Status> ({
                id: "",
                name: "",
                description: "",
                src: List (),
                errata: List (),
              })
