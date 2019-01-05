import { ExperienceLevel } from '../App/Models/Wiki/wikiTypeHelpers';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { getExperienceLevelIdByAp } from '../App/Utils/ELUtils';
import { Maybe, OrderedMap, Record } from '../utils/dataUtils';
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

export const getMaxTotalAttributeValues = createMaybeSelector (
  getStartEl,
  Maybe.fmap (Record.get<ExperienceLevel, 'maxTotalAttributeValues'> ('maxTotalAttributeValues'))
);
