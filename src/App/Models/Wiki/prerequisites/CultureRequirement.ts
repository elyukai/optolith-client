import { equals } from "../../../../Data/Eq";
import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { pipe } from "../../../Utilities/pipe";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { RequireActivatable } from "./ActivatableRequirement";

export interface CultureRequirement {
  id: "CULTURE"
  value: number | List<number>
}

export const CultureRequirement =
  fromDefault<CultureRequirement> ({
    id: "CULTURE",
    value: 0,
  })

export const isCultureRequirement =
  pipe (RequireActivatable.A.id, equals<string | List<string>> ("CULTURE")) as unknown as
    (req: AllRequirementObjects) => req is Record<CultureRequirement>
