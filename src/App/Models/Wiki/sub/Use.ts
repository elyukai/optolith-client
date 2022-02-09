import { fromDefault, Record } from "../../../../Data/Record"
import { RequireActivatable } from "../prerequisites/ActivatableRequirement"

export interface Use {
  "@@name": "Use"
  id: number
  name: string
  prerequisite: Record<RequireActivatable>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Use =
  fromDefault ("Use")
              <Use> ({
                id: 0,
                name: "",
                prerequisite: RequireActivatable.default,
              })
