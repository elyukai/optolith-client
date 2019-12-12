import { List } from "../../../Data/List";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { UndoState } from "../../Utilities/undo";
import { HeroModel, HeroModelRecord } from "./HeroModel";

export type UndoableHeroModel = UndoState<HeroModelRecord>
export type UndoableHeroModelRecord = Record<UndoableHeroModel>

/**
 * Create a new `UndoHero` object.
 */
export const UndoableHero =
  fromDefault ("UndoState")
              <UndoableHeroModel> ({
                past: List.empty,
                present: HeroModel .default,
                future: List.empty,
              })

export const UndoableHeroL = makeLenses (UndoableHero)
