import { List } from "../../../Data/List";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { UndoState } from "../../Utilities/undo";
import { HeroModel, HeroModelRecord } from "./HeroModel";

export type UndoableHeroModelRecord = Record<UndoableHeroModel>
export type UndoableHeroModel = UndoState<HeroModelRecord>

/**
 * Create a new `UndoHero` object.
 */
export const UndoableHero =
  fromDefault ("UndoableHero")
              <UndoableHeroModel> ({
                past: List.empty,
                present: HeroModel .default,
                future: List.empty,
              })

export const UndoableHeroL = makeLenses (UndoableHero)
