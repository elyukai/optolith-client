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
  description: Maybe<string>
  isSecret: Maybe<boolean>
  languages: Maybe<List<number>>
  continent: Maybe<number>
  isExtinct: Maybe<boolean>
  specializations: Maybe<List<string>>
  specializationInput: Maybe<string>
  gr: Maybe<number>
  level: Maybe<number>
  target: Maybe<string>
  applications: Maybe<List<Record<Application>>>
  applicationInput: Maybe<string>
}

export const SelectOption =
  fromDefault<SelectOption> ({
    id: 0,
    name: "",
    cost: Nothing,
    prerequisites: Nothing,
    description: Nothing,
    isSecret: Nothing,
    languages: Nothing,
    continent: Nothing,
    isExtinct: Nothing,
    specializations: Nothing,
    specializationInput: Nothing,
    gr: Nothing,
    level: Nothing,
    target: Nothing,
    applications: Nothing,
    applicationInput: Nothing,
  })

export const SelectOptionL = makeLenses (SelectOption)
