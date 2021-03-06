import { List } from "../../../../Data/List"
import { fromDefault } from "../../../../Data/Record"

export interface RaceRequirement {
  "@@name": "RaceRequirement"
  id: "RACE"
  value: string | List<string>
  active: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RaceRequirement =
  fromDefault ("RaceRequirement")
              <RaceRequirement> ({
                id: "RACE",
                value: "",
                active: true,
              })
