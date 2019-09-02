import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { IncreaseSkill } from "../Wiki/sub/IncreaseSkill";

export interface IncreasableForView {
  "@@name": "IncreasableForView"
  id: string
  name: string
  value: number
  previous: Maybe<number>
}

export const IncreasableForView =
  fromDefault ("IncreasableForView")
              <IncreasableForView> ({
                id: "",
                name: "",
                value: 0,
                previous: Nothing,
              })

export const increasableViewFrom =
  (x: Record<IncreaseSkill>) =>
  (name: string) =>
    IncreasableForView ({
      id: IncreaseSkill.A.id (x),
      name,
      value: IncreaseSkill.A.value (x),
    })
