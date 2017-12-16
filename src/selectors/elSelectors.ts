import { createSelector } from 'reselect';
import { ELState } from '../reducers/el';
import { ExperienceLevel } from '../types/data.d';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { getTotal } from './adventurePointsSelectors';
import { getExperienceLevelStartId, getWikiExperienceLevels } from './stateSelectors';

export function getStart(state: ELState): ExperienceLevel {
	return state.all.get(state.startId!)!;
}

export const getCurrentEl = createSelector(
	getWikiExperienceLevels,
	getTotal,
	(allEls, totalAp) => allEls.get(getExperienceLevelIdByAp(allEls, totalAp)) as ExperienceLevel | undefined
);

export const getStartEl = createSelector(
	getWikiExperienceLevels,
	getExperienceLevelStartId,
	(allEls, id) => allEls.get(id!) as ExperienceLevel
);
