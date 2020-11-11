import { fromDefault } from "../../../../Data/Record"

export interface Erratum {
  "@@name": "Erratum"
  date: Date
  description: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Erratum =
  fromDefault ("Erratum")
              <Erratum> ({
                date: new Date (),
                description: "",
              })
