import { fromDefault, Record } from "../../../../Data/Record"
import { RequireActivatable } from "../prerequisites/ActivatableRequirement"

export interface Use {
  "@@name": "Use"
  id: number
  name: string
  prerequisite: Record<RequireActivatable>
}

export const Use =
  fromDefault ("Use")
              <Use> ({
                id: 0,
                name: "",
                prerequisite: RequireActivatable.default,
              })
