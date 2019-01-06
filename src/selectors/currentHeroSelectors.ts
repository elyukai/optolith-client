import * as R from 'ramda';
import { Hero } from '../App/Models/Hero/heroTypeHelpers';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
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
