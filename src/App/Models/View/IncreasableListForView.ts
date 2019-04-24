import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface IncreasableListForView {
  id: string
  name: List<string>
  value: number
  previous: Maybe<number>
}

export const IncreasableListForView =
  fromDefault<IncreasableListForView> ({
    id: "",
    name: List.empty,
    value: 0,
    previous: Nothing,
  })
