import { fromDefault } from "../../Data/Record";

export interface NumIdName {
  "@@name": "NumIdName"
  id: number
  name: string
}

export const NumIdName =
  fromDefault ("NumIdName")
              <NumIdName> ({
                id: 0,
                name: "",
              })

/**
 * Note: The id will always be 1 higher than the corresponding index.
 */
export const fromIndexName =
  (index: number) => (name: string) => NumIdName ({ id: index + 1, name })
