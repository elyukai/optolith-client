import { List, NonEmptyList } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault } from "../../../Data/Record"

export interface IncreasableListForView {
  "@@name": "IncreasableListForView"
  id: NonEmptyList<string>
  name: List<string>
  value: number
  previous: Maybe<number>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const IncreasableListForView =
  fromDefault ("IncreasableListForView")
              <IncreasableListForView> ({
                id: List.pure (""),
                name: List.empty,
                value: 0,
                previous: Nothing,
              })
