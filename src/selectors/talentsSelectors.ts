import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { ToListById } from '../types/data.d';
import { getCurrentCulture } from './rcpSelectors';

export const getTalents = (state: AppState) => state.currentHero.present.dependent.talents;

export const getTalentsRating = createSelector(
	getCurrentCulture,
	culture => {
		const rating: ToListById<string> = {};

		if (culture) {
			culture.typicalTalents.forEach(e => { rating[e] = 'TYP'; });
			culture.untypicalTalents.forEach(e => { rating[e] = 'UNTYP'; });
		}

		return rating;
	}
);
