import { createSelector } from 'reselect';
import { ELState } from '../reducers/el';
import { ExperienceLevel } from '../types/data.d';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { getExperienceLevelStartId, getTotalAdventurePoints, getWikiExperienceLevels } from './stateSelectors';

export function getStart(state: ELState): ExperienceLevel {
	return state.all.get(state.startId!)!;
}

export const getCurrentEl = createSelector(
	getWikiExperienceLevels,
	getTotalAdventurePoints,
	(allEls, totalAp) => allEls.get(getExperienceLevelIdByAp(allEls, totalAp))
);

export const getStartEl = createSelector(
	getWikiExperienceLevels,
	getExperienceLevelStartId,
	(allEls, id) => allEls.get(id!)!
);
