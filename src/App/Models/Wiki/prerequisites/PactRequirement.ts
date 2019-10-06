import { equals } from "../../../../Data/Eq";
import { List } from "../../../../Data/List";
import { Maybe, Nothing } from "../../../../Data/Maybe";
import { fromDefault, Record } from "../../../../Data/Record";
import { pipe } from "../../../Utilities/pipe";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { RequireActivatable } from "./ActivatableRequirement";

export interface PactRequirement {
  "@@name": "PactRequirement"
  id: "PACT"
  category: number
  domain: Maybe<number | List<number>>
  level: Maybe<number>
}

export const PactRequirement =
  fromDefault ("PactRequirement")
              <PactRequirement> ({
                id: "PACT",
                category: 0,
                domain: Nothing,
                level: Nothing,
              })

export const isPactRequirement =
  pipe (RequireActivatable.AL.id, equals<string | List<string>> ("PACT")) as unknown as
    (req: AllRequirementObjects) => req is Record<PactRequirement>
