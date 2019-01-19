import { List } from "../../../../Data/List";
import { Maybe, Nothing } from "../../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../../Data/Record";
import { AllRequirementObjects } from "../wikiTypeHelpers";
import { Application } from "./Application";

export interface SelectOption {
  id: string | number
  name: string
  cost: Maybe<number>
  prerequisites: Maybe<List<AllRequirementObjects>>
  target: Maybe<string>
  tier: Maybe<number>
  specializations: Maybe<List<string>>
  specializationsInput: Maybe<string>
  applications: Maybe<List<Record<Application>>>
  applicationsInput: Maybe<string>
  gr: Maybe<number>
}

export const SelectOption =
  fromDefault<SelectOption> ({
    id: 0,
    name: "",
    cost: Nothing,
    prerequisites: Nothing,
    target: Nothing,
    tier: Nothing,
    specializations: Nothing,
    specializationsInput: Nothing,
    applications: Nothing,
    applicationsInput: Nothing,
    gr: Nothing,
  })

export const SelectOptionL = makeLenses (SelectOption)
