import { equals, pipe } from "ramda";
import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { RequireActivatable } from "./ActivatableRequirement";

export interface RaceRequirement {
  id: "RACE";
  value: number | List<number>;
}

export const RaceRequirement =
  fromDefault<RaceRequirement> ({
    id: "RACE",
    value: 0,
  })

export const isRaceRequirement =
  pipe (RequireActivatable.A.id, equals<string | List<string>> ("RACE")) as unknown as
    (req: AllRequirementObjects) => req is Record<RaceRequirement>
