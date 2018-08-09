import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Maybe } from '../utils/dataUtils';
import { getCurrentHeroFuture, getCurrentHeroPast } from './stateSelectors';

export const getUndoAvailability = createMaybeSelector(
  getCurrentHeroPast,
  maybePast => Maybe.maybe(false, past => past.length > 0, maybePast)
);

export const getRedoAvailability = createMaybeSelector(
  getCurrentHeroFuture,
  maybeFuture => Maybe.maybe(false, future => future.length > 0, maybeFuture)
);
