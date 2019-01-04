import { pipe } from "ramda";
import { Sex } from "../../../types/data";
import { equals } from "../../structures/Eq";
import { List } from "../../structures/List";
import { fromDefault, Record } from "../../structures/Record";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { RequireActivatable } from "./ActivatableRequirement";

export interface SexRequirement {
  id: "SEX";
  value: Sex;
}

export const SexRequirement =
  fromDefault<SexRequirement> ({
    id: "SEX",
    value: "m",
  })

export const isSexRequirement =
  pipe (RequireActivatable.A.id, equals<string | List<string>> ("SEX")) as unknown as
    (req: AllRequirementObjects) => req is Record<SexRequirement>
