import { createSelector } from 'reselect';
import { ToListById } from '../types/data.d';
import { getCurrentCulture } from './rcpSelectors';
import { getSkills } from './stateSelectors';

export const getSkillsForSave = createSelector(
	getSkills,
	skills => {
		const active: ToListById<number> = {};

		for (const [id, { value }] of skills) {
			if (value > 0) {
				active[id] = value;
			}
		}

		return active;
	}
);

export const getAllSkills = createSelector(
	getSkills,
	skills => {
		return [...skills.values()];
	}
);

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
