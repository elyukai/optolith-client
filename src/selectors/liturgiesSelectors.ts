import { createSelector } from 'reselect';
import { LITURGIES } from '../constants/Categories';
import { SpecialAbilityInstance, ToListById } from '../types/data.d';
import { Liturgy } from '../types/view.d';
import { isActive } from '../utils/ActivatableUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { getAspectsOfTradition, getNumericBlessedTraditionIdByInstanceId, isBlessedTraditionId, isOwnTradition } from '../utils/LiturgyUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getLiturgicalChantsSortOptions } from './sortOptionsSelectors';
import { getBlessings, getInactiveLiturgicalChantsFilterText, getLiturgicalChants, getLiturgicalChantsFilterText, getLocaleMessages, getPhase, getSpecialAbilities } from './stateSelectors';
import { getEnableActiveItemHints } from './uisettingsSelectors';

export const getBlessedTraditionResultFunc = (list: Map<string, SpecialAbilityInstance>) => {
	return [...list.values()].find(e => isBlessedTraditionId(e.id) && isActive(e));
};

export const getBlessedTradition = createSelector(
	getSpecialAbilities,
	getBlessedTraditionResultFunc
);

export const isLiturgicalChantsTabAvailable = createSelector(
	getBlessedTradition,
	tradition => typeof tradition === 'object'
);

export const getBlessedTraditionNumericId = createSelector(
	getBlessedTradition,
	tradition => tradition && getNumericBlessedTraditionIdByInstanceId(tradition.id)
);

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

export const getAvailableInactiveLiturgicalChants = createSelector(
	getLiturgicalChantsAndBlessings,
	getBlessedTradition,
	getRuleBooksEnabled,
	(list, tradition, availablility) => {
		return filterByAvailability(list.filter(e => tradition && isOwnTradition(tradition, e) && e.active === false), availablility);
	}
);

export const getFilteredActiveLiturgicalChantsAndBlessings = createSelector(
	getActiveLiturgicalChants,
	getLiturgicalChantsSortOptions,
	getLiturgicalChantsFilterText,
	getLocaleMessages,
	(liturgicalChants, sortOptions, filterText, locale) => {
		return filterAndSortObjects(liturgicalChants, locale!.id, filterText, sortOptions);
	}
);

export const getFilteredInactiveLiturgicalChantsAndBlessings = createSelector(
	getAvailableInactiveLiturgicalChants,
	getActiveLiturgicalChants,
	getLiturgicalChantsSortOptions,
	getInactiveLiturgicalChantsFilterText,
	getLocaleMessages,
	getEnableActiveItemHints,
	(inactive, active, sortOptions, filterText, locale, areActiveItemHintsEnabled) => {
		if (areActiveItemHintsEnabled) {
			return filterAndSortObjects([...inactive, ...active], locale!.id, filterText, sortOptions);
		}
		return filterAndSortObjects(inactive, locale!.id, filterText, sortOptions);
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
		return phase < 3 && [...liturgicalChants.values()].filter(e => e.ic < 3 && e.active).length >= startEl.maxSpellsLiturgies;
	}
);

export const getBlessingsForSheet = createSelector(
	getBlessings,
	blessings => [...blessings.values()].filter(e => e.active)
);

export const getLiturgiesForSheet = createSelector(
	getLiturgicalChants,
	getBlessedTradition,
	(liturgies, tradition) => {
		const array: Liturgy[] = [];
		for (const [id, entry] of liturgies) {
			const { ic, name, active, value, check, checkmod, aspects, category } = entry;
			const availableAspects = tradition && getAspectsOfTradition(getNumericBlessedTraditionIdByInstanceId(tradition.id) + 1);
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
