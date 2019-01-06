import { Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";
import { ActiveObject } from "./ActiveObject";

export interface ActiveObjectWithId extends ActiveObject {
  id: string
  index: number
}

export const ActiveObjectWithId =
  fromDefault<ActiveObjectWithId> ({
    id: "",
    index: -1,
    cost: Nothing,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const ActiveObjectWithIdL = makeLenses (ActiveObjectWithId)
