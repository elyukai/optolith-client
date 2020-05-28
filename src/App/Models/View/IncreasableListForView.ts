import { List, NonEmptyList } from "../../../Data/List"

export interface IncreasableListForView {
  id: NonEmptyList<number>
  name: List<string>
  value: number
  previous?: number
}
