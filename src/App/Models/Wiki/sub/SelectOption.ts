import { List } from "../../../../Data/List";
import { Maybe, Nothing } from "../../../../Data/Maybe";
import { Pair } from "../../../../Data/Pair";
import { fromDefault, makeLenses, Record } from "../../../../Data/Record";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { Application } from "./Application";

export interface SelectOption {
  id: string | number
  name: string
  cost: Maybe<number>
  // req: Maybe<List<AllRequirementObjects>>
  prerequisites: Maybe<List<AllRequirementObjects>>
  target: Maybe<string>
  tier: Maybe<number>
  spec: Maybe<List<string>>
  specInput: Maybe<string>
  applications: Maybe<List<Record<Application>>>
  applicationsInput: Maybe<string>
  talent: Maybe<Pair<string, number>>
  gr: Maybe<number>
}

export const SelectOption =
  fromDefault<SelectOption> ({
    id: 0,
    name: "",
    cost: Nothing,
    // req: Nothing,
    prerequisites: Nothing,
    target: Nothing,
    tier: Nothing,
    spec: Nothing,
    specInput: Nothing,
    applications: Nothing,
    applicationsInput: Nothing,
    talent: Nothing,
    gr: Nothing,
  })

export const SelectOptionL = makeLenses (SelectOption)
