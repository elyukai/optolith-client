import { createSelector } from 'reselect';
import { Categories } from '../constants/Categories';
import { BlessingInstance, LiturgyInstance, SpecialAbilityInstance, ToListById } from '../types/data.d';
import { LiturgicalChantWithRequirements, Liturgy } from '../types/view.d';
import { isActive } from '../utils/ActivatableUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { getAspectsOfTradition, getNumericBlessedTraditionIdByInstanceId, isBlessedTraditionId, isDecreasable, isIncreasable, isOwnTradition } from '../utils/LiturgyUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getLiturgicalChantsSortOptions } from './sortOptionsSelectors';
import { getAdvantages, getAttributes, getBlessings, getInactiveLiturgicalChantsFilterText, getLiturgicalChants, getLiturgicalChantsFilterText, getLocaleMessages, getPhase, getSpecialAbilities, getWiki } from './stateSelectors';
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
	getBlessedTradition,
	getStartEl,
	getPhase,
	getAttributes,
	mapGetToSlice(getAdvantages, 'ADV_16'),
	mapGetToSlice(getSpecialAbilities, 'SA_87'),
	getWiki,
	getLiturgicalChants,
	(allEntries, blessedTradition, el, phase, attributes, exceptionalSkill, aspectKnowledge, wiki, liturgicalChants) => {
		const list: (LiturgicalChantWithRequirements | BlessingInstance)[] = [];
		for (const entry of allEntries) {
			if (entry.active === true) {
				if (entry.category === Categories.BLESSINGS) {
					list.push(entry);
				}
				else {
					list.push({
						...entry,
						isIncreasable: isIncreasable(blessedTradition!, entry, el, phase, attributes, exceptionalSkill!, aspectKnowledge!),
						isDecreasable: isDecreasable(wiki, entry, liturgicalChants, aspectKnowledge!),
					});
				}
			}
		}
		return list;
	}
);

export const getActiveLiturgicalChantsWithRequirements = createSelector(
	getActiveLiturgicalChants,
	list => {
		return list;
	}
);

export const getInactiveLiturgicalChants = createSelector(
	getLiturgicalChantsAndBlessings,
	allEntries => {
		return allEntries.filter(e => e.active === false);
	}
);

export const getAdditionalValidLiturgicalChants = createSelector(
	getInactiveLiturgicalChants,
	getActiveLiturgicalChants,
	getBlessedTradition,
	mapGetToSlice(getSpecialAbilities, 'SA_623'),
	mapGetToSlice(getSpecialAbilities, 'SA_625'),
	mapGetToSlice(getSpecialAbilities, 'SA_632'),
	(inactiveList, activeList, tradition, zugvoegel, jaegerinnenDerWeissenMaid, anhaengerDesGueldenen) => {
		const add: string[] = [];

		type entry = LiturgicalChantWithRequirements | LiturgyInstance | BlessingInstance;
		type validateFunc = (e: entry) => boolean;

		const inactiveListFilter = (validate: validateFunc) => {
			if (!activeList.some(validate)) {
				add.push(...inactiveList.filter(e => {
					const isTraditionValid = !e.tradition.includes(1) && validate(e);
					const isICValid = typeof e.ic === 'number' && e.ic <= 3;
					return isTraditionValid && isICValid;
				}).map(e => e.id));
			}
		}

		if (isActive(zugvoegel)) {
			// Phex
			inactiveListFilter(e => e.tradition.includes(6));

			// Travia
			inactiveListFilter(e => e.tradition.includes(9));
		}
		else if (isActive(jaegerinnenDerWeissenMaid)) {
			// Firun Liturgical Chant
			inactiveListFilter(e => e.tradition.includes(10) && e.gr === 1);

			// Firun Ceremony
			inactiveListFilter(e => e.tradition.includes(10) && e.gr === 2);
		}
		else if (isActive(anhaengerDesGueldenen)) {
			const unfamiliarChants = activeList.filter(e => {
				return !tradition || !isOwnTradition(tradition, e);
			});

			const inactiveWithValidIC = inactiveList.filter(e => {
				return typeof e.ic === 'number' && e.ic <= 2;
			});

			if (unfamiliarChants.length > 0) {
				const otherTraditions = new Set<number>();

				for (const obj of unfamiliarChants) {
					for (const tradition of obj.tradition) {
						otherTraditions.add(tradition);
					}
				}

				add.push(...inactiveWithValidIC.filter(e => {
					return e.tradition.some(n => otherTraditions.has(n));
				}).map(e => e.id));
			}
			else {
				add.push(...inactiveWithValidIC.map(e => e.id));
			}
		}

		return add;
	}
);

export const getAvailableInactiveLiturgicalChants = createSelector(
	getInactiveLiturgicalChants,
	getAdditionalValidLiturgicalChants,
	getBlessedTradition,
	getRuleBooksEnabled,
	(inactiveList, additionalValidLiturgicalChants, tradition, availablility) => {
		return filterByAvailability(inactiveList.filter(e => {
			const ownTradition = tradition && isOwnTradition(tradition, e);
			return ownTradition || additionalValidLiturgicalChants.includes(e.id);
		}), availablility);
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
			if (entry.category === Categories.LITURGIES) {
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
