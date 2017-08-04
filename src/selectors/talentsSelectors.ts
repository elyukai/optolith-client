import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { ToListById } from '../types/data.d';
import { getCurrentCulture } from './rcpSelectors';

export const getTalents = (state: AppState) => state.currentHero.present.dependent.talents;

export function getTalentsForSave(state: AppState) {
	const active: { [id: string]: number } = {};
	for (const [id, entry] of getTalents(state)) {
		const { value } = entry;
		if (value > 0) {
			active[id] = value;
		}
	}
	return active;
}

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
