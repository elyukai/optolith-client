import { fromDefault } from "../../../../Data/Record"

export interface Erratum {
  "@@name": "Erratum"
  date: Date
  description: string
}

export const Erratum =
  fromDefault ("Erratum")
              <Erratum> ({
                date: new Date (),
                description: "",
              })
