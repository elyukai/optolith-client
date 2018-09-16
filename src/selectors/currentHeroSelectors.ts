import * as R from 'ramda';
import { Hero } from '../types/data';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe } from '../utils/dataUtils';
import { getCurrentHeroFuture, getCurrentHeroPast } from './stateSelectors';

const getStateHistoryAvailability = Maybe.maybe<List<Hero>, boolean> (false)
                                                                     (R.complement (List.null));

export const getUndoAvailability = createMaybeSelector (
  getCurrentHeroPast,
  getStateHistoryAvailability
);

export const getRedoAvailability = createMaybeSelector (
  getCurrentHeroFuture,
  getStateHistoryAvailability
);
