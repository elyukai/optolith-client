import { equals, pipe } from "ramda";
import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { RequireActivatable } from "./ActivatableRequirement";

export interface RequirePrimaryAttribute {
  id: "ATTR_PRIMARY"
  value: number
  type: 1 | 2
}

export const RequirePrimaryAttribute =
  fromDefault<RequirePrimaryAttribute> ({
    id: "ATTR_PRIMARY",
    type: 1,
    value: 0,
  })

export const isPrimaryAttributeRequirement =
  pipe (RequireActivatable.A.id, equals<string | List<string>> ("ATTR_PRIMARY")) as unknown as
    (req: AllRequirementObjects) => req is Record<RequirePrimaryAttribute>
