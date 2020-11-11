import { Just } from "../../Data/Maybe"
import { fromDefault, Record } from "../../Data/Record"
import { DropdownOption } from "./View/DropdownOption"

export interface NumIdName {
  "@@name": "NumIdName"
  id: number
  name: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
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

export const numIdNameToDropdown = (x: Record<NumIdName>) => DropdownOption<number> ({
                                                               id: Just (NumIdName.A.id (x)),
                                                               name: NumIdName.A.name (x),
                                                             })
