import { fromDefault } from "../../../Data/Record"

export interface PactType {
  "@@name": "PactType"
  id: number
  name: string
}

export const PactType =
  fromDefault ("PactType")
              <PactType> ({
                id: 0,
                name: "",
              })
