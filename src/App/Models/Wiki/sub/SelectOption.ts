import { List } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault, makeLenses, Record } from "../../../../Data/Record"
import { DropdownOption } from "../../View/DropdownOption"
import { AllRequirementObjects } from "../wikiTypeHelpers"
import { Application } from "./Application"
import { Erratum } from "./Errata"
import { SourceLink } from "./SourceLink"

export interface SelectOption {
  "@@name": "SelectOption"
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
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SelectOption =
  fromDefault ("SelectOption")
              <SelectOption> ({
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
                src: List.empty,
                errata: List (),
              })

export const SelectOptionL = makeLenses (SelectOption)

export const selectToDropdownOption =
  (x: Record<SelectOption>) =>
    DropdownOption ({
      id: Just (SelectOption.A.id (x)),
      name: SelectOption.A.name (x),
    })
