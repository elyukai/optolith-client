import { createMaybeSelector } from '../utils/createMaybeSelector';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { getExperienceLevelStartId, getTotalAdventurePoints, getWikiExperienceLevels } from './stateSelectors';

export const getCurrentEl = createMaybeSelector (
  getWikiExperienceLevels,
  getTotalAdventurePoints,
  (allEls, maybeTotalAp) => maybeTotalAp.bind (
    totalAp => allEls.lookup (getExperienceLevelIdByAp (allEls, totalAp))
  )
);

export const getStartEl = createMaybeSelector (
  getWikiExperienceLevels,
  getExperienceLevelStartId,
  (allEls, maybeId) => maybeId.bind (allEls.lookup)!
);
