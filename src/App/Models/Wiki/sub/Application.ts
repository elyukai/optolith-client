import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault, Record } from "../../../../Data/Record"
import { RequireActivatable } from "../prerequisites/ActivatableRequirement"

export interface Application {
  "@@name": "Application"
  id: number
  name: string
  prerequisite: Maybe<Record<RequireActivatable>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Application =
  fromDefault ("Application")
              <Application> ({
                id: 0,
                name: "",
                prerequisite: Nothing,
              })
