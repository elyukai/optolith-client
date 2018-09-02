import { createMaybeSelector } from '../utils/createMaybeSelector';
import { OrderedMap } from '../utils/dataUtils';
import { getHeroes } from './stateSelectors';

export const getHeroesArray = createMaybeSelector (
  getHeroes,
  OrderedMap.elems
);
