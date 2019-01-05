import * as R from 'ramda';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { UndoState } from '../App/Utils/undo';
import { Hero } from '../types/data';
import { List, OrderedMap, OrderedSet } from '../utils/dataUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { getHerolistSortOptions } from './sortOptionsSelectors';
import { getHeroes, getHerolistFilterText, getLocaleAsProp } from './stateSelectors';

export const getHeroesArray = createMaybeSelector (
  getHeroes,
  R.pipe (
    OrderedMap.elems,
    List.map (e => e.present)
  )
);

export const getUnsavedHeroesById = createMaybeSelector (
  getHeroes,
  OrderedMap.foldl<UndoState<Hero>, OrderedSet<string>>
    (acc => undoState => !undoState.past .null ()
      ? acc.insert (undoState.present .get ('id'))
      : acc)
    (OrderedSet.empty ())
);

export const getSortedHerolist = createMaybeSelector (
  getHeroesArray,
  getHerolistSortOptions,
  getHerolistFilterText,
  getLocaleAsProp,
  (list, sortOptions, filterText, locale) =>
    filterAndSortObjects (list, locale.get ('id'), filterText, sortOptions)
);
