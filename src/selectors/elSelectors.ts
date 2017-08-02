import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { ELState } from '../reducers/el';
import { ExperienceLevel } from '../types/data.d';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { getTotal } from './adventurePointsSelectors';

export const getElState = (state: AppState) => state.currentHero.present.el;
export const getAll = (state: AppState) => state.currentHero.present.el.all;
export const getStartId = (state: AppState) => state.currentHero.present.el.startId;

export function getStart(state: ELState): ExperienceLevel {
	return state.all.get(state.startId!)!;
}

export const getCurrentEl = createSelector(
	getAll,
	getTotal,
	(allEls, totalAp) => allEls.get(getExperienceLevelIdByAp(allEls, totalAp)) as ExperienceLevel | undefined
);

export const getStartEl = createSelector(
	[ getAll, getStartId ],
	(allEls, id) => allEls.get(id!) as ExperienceLevel
);
