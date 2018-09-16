import { ExperienceLevel } from '../types/wiki';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { OrderedMap, Record } from '../utils/dataUtils';
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
  (allEls, maybeId) => maybeId.bind (
    id => OrderedMap.lookup<string, Record<ExperienceLevel>> (id) (allEls)
  )
);
