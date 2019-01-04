import { equals, pipe } from "ramda";
import { List } from "../../structures/List";
import { Maybe, Nothing } from "../../structures/Maybe";
import { fromDefault, Record } from "../../structures/Record";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { RequireActivatable } from "./ActivatableRequirement";

export interface PactRequirement {
  id: "PACT";
  category: number;
  domain: Maybe<number | List<number>>;
  level: Maybe<number>;
}

export const PactRequirement =
  fromDefault<PactRequirement> ({
    id: "PACT",
    category: 0,
    domain: Nothing,
    level: Nothing,
  })

export const isPactRequirement =
  pipe (RequireActivatable.A.id, equals<string | List<string>> ("PACT")) as unknown as
    (req: AllRequirementObjects) => req is Record<PactRequirement>
