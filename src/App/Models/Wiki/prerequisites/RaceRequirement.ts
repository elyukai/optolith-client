import { List } from "../../../../Data/List";
import { fromDefault } from "../../../../Data/Record";

export interface RaceRequirement {
  "@@name": "RaceRequirement"
  id: "RACE"
  value: number | List<number>
  active: boolean
}

export const RaceRequirement =
  fromDefault ("RaceRequirement")
              <RaceRequirement> ({
                id: "RACE",
                value: 0,
                active: true,
              })
