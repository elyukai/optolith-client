import { Maybe, Nothing } from "../../Data/Maybe"
import { OrderedMap } from "../../Data/OrderedMap"
import { fromDefault, makeLenses, Record } from "../../Data/Record"
import { UndoState } from "../Utilities/undo"
import { HeroModelRecord } from "./Hero/HeroModel"
import { User } from "./Hero/heroTypeHelpers"

export interface HeroesState {
  "@@name": "HeroesState"
  heroes: StrMap<Record<UndoState<HeroModelRecord>>>
  users: StrMap<User>
  currentId: Maybe<string>
}

export const HeroesState =
  fromDefault ("HeroesState")
              <HeroesState> ({
                heroes: OrderedMap.empty,
                users: OrderedMap.empty,
                currentId: Nothing,
              })

export const HeroesStateL = makeLenses (HeroesState)
