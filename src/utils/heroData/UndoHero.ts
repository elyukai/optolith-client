import { List } from '../structures/List';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';
import { HeroModel, UndoableHeroModel } from './HeroModel';

/**
 * Create a new `UndoHero` object.
 */
export const UndoHeroCreator =
  fromDefault<UndoableHeroModel> ({
    past: List.empty,
    present: HeroModel .default,
    future: List.empty,
  })

export const UndoHeroG = makeGetters (UndoHeroCreator)
export const UndoHeroL = makeLenses_ (UndoHeroG) (UndoHeroCreator)
