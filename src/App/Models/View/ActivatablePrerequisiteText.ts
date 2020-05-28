import { NonEmptyList } from "../../../Data/List"

export interface ActivatablePrerequisiteText {
  id: string | NonEmptyList<string>
  active: boolean
  name: string
}
