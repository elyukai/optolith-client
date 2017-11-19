import { last } from 'lodash';
import { createSelector } from 'reselect';
import { LITURGIES } from '../constants/Categories';
import { ToListById } from '../types/data.d';
import { Liturgy } from '../types/view.d';
import { getSids } from '../utils/ActivatableUtils';
import { getAspectsOfTradition, isOwnTradition } from '../utils/LiturgyUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getBlessings, getDependentInstances, getLiturgicalChants, getPhase, getSpecialAbilities } from './stateSelectors';

export const getLiturgicalChantsAndBlessings = createSelector(
	getLiturgicalChants,
	getBlessings,
	(liturgicalChants, blessings) => {
		return [...liturgicalChants.values(), ...blessings.values()];
	}
);

export const getActiveLiturgicalChants = createSelector(
	getLiturgicalChantsAndBlessings,
	allEntries => {
		return allEntries.filter(e => e.active === true);
	}
);

export const getFilteredInactiveLiturgicalChants = createSelector(
	getLiturgicalChantsAndBlessings,
	getDependentInstances,
	getRuleBooksEnabled,
	(list, dependent, availablility) => {
		return filterByAvailability(list.filter(e => isOwnTradition(dependent, e)), availablility);
	}
);

export const getLiturgicalChantsAndBlessingsForSave = createSelector(
	getActiveLiturgicalChants,
	list => {
		const liturgies: ToListById<number> = {};
		const blessings: string[] = [];
		for (const entry of list) {
			if (entry.category === LITURGIES) {
				const { id, value } = entry;
				liturgies[id] = value;
			}
			else {
				blessings.push(entry.id);
			}
		}
		return {
			liturgies,
			blessings
		};
	}
);

export const isActivationDisabled = createSelector(
	getStartEl,
	getPhase,
	getLiturgicalChants,
	(startEl, phase, liturgicalChants) => {
		return phase < 3 && [...liturgicalChants.values()].filter(e => e.gr < 3 && e.active).length >= startEl.maxSpellsLiturgies;
	}
);

export const getTraditionId = createSelector(
	mapGetToSlice(getSpecialAbilities, 'SA_86'),
	tradition => {
		return last(getSids(tradition!)) as number | undefined;
	}
);

export const getBlessingsForSheet = createSelector(
	getBlessings,
	blessings => [...blessings.values()].filter(e => e.active)
);

export const getLiturgiesForSheet = createSelector(
	getLiturgicalChants,
	getTraditionId,
	(liturgies, traditionId) => {
		const array: Liturgy[] = [];
		for (const [id, entry] of liturgies) {
			const { ic, name, active, value, check, checkmod, aspects, category } = entry;
			const availableAspects = traditionId && getAspectsOfTradition(traditionId + 1);
			if (active) {
				array.push({
					id,
					name,
					value,
					ic,
					check,
					checkmod,
					aspects: aspects.filter(e => availableAspects && availableAspects.includes(e)),
					category
				});
			}
		}
		return array;
	}
);
