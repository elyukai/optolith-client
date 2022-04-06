import { List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault, Record } from "../../../../Data/Record"
import { RequireActivatable } from "../prerequisites/ActivatableRequirement"
import { Affection } from "./Affection"

export interface Application {
  "@@name": "Application"
  id: number
  name: string
  prerequisite: Maybe<Record<RequireActivatable>>
  affections: List<Affection>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Application =
  fromDefault ("Application")
              <Application> ({
                id: 0,
                name: "",
                prerequisite: Nothing,
                affections: List.empty,
              })
