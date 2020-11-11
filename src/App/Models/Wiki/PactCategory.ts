import { List } from "../../../Data/List"
import { fromDefault, Record } from "../../../Data/Record"
import { PactDomain } from "./PactDomain"
import { PactType } from "./PactType"

export interface PactCategory {
  "@@name": "PactCategory"
  id: number
  name: string
  types: List<Record<PactType>>
  domains: List<Record<PactDomain>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PactCategory =
  fromDefault ("PactCategory")
              <PactCategory> ({
                id: 0,
                name: "",
                types: List (),
                domains: List (),
              })
