import { IntMap } from "../../Data/IntMap"
import { Maybe } from "../../Data/Maybe"
import { StrMap } from "../../Data/StrMap"
import { UndoState } from "../Utilities/undo"
import { Hero } from "./Hero/Hero"
import { User } from "./Hero/heroTypeHelpers"

export interface HeroesState {
  heroes: IntMap<UndoState<Hero>>
  users: StrMap<User>
  currentId: Maybe<string>
}
