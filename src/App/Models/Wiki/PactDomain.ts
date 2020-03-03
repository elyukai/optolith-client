import { fromDefault } from "../../../Data/Record"

export interface PactDomain {
  "@@name": "PactDomain"
  id: number
  name: string
}

export const PactDomain =
  fromDefault ("PactDomain")
              <PactDomain> ({
                id: 0,
                name: "",
              })
