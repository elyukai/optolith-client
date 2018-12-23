import { Hero } from '../../types/data';
import { List } from '../structures/List';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';
import { UndoState } from '../undo';
import { HeroCreator } from './HeroCreator';

/**
 * Create a new `UndoHero` object.
 */
export const UndoHeroCreator =
  fromDefault<UndoState<Hero>> ({
    past: List.empty,
    present: HeroCreator ({ }),
    future: List.empty,
  })

export const UndoHeroG = makeGetters (UndoHeroCreator)
export const UndoHeroL = makeLenses_ (UndoHeroG) (UndoHeroCreator)
