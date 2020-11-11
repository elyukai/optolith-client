import { NonEmptyList } from "../../../Data/List"
import { fromDefault } from "../../../Data/Record"

export interface ActivatablePrerequisiteText {
  "@@name": "ActivatablePrerequisiteText"
  id: string | NonEmptyList<string>
  active: boolean
  name: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ActivatablePrerequisiteText =
  fromDefault ("ActivatablePrerequisiteText")
              <ActivatablePrerequisiteText> ({
                id: "",
                active: false,
                name: "",
              })
