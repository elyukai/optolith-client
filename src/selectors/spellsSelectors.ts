import { createSelector } from 'reselect';
import { CANTRIPS, SPELLS } from '../constants/Categories';
import { CantripInstance, SpecialAbilityInstance, SpellInstance, ToListById } from '../types/data.d';
import { Spell } from '../types/view.d';
import { isActive } from '../utils/ActivatableUtils';
import { validate } from '../utils/RequirementUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { isMagicalTraditionId, isOwnTradition } from '../utils/SpellUtils';
import { getPresent } from './currentHeroSelectors';
import { getElState, getStart, getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getAdvantages, getCantrips, getDisadvantages, getPhase, getSpecialAbilities, getSpells } from './stateSelectors';

export const getMagicalTraditionsResultFunc = (list: Map<string, SpecialAbilityInstance>) => {
	return [...list.values()].filter(e => isMagicalTraditionId(e.id) && isActive(e));
};

export const getMagicalTraditions = createSelector(
	getSpecialAbilities,
	getMagicalTraditionsResultFunc
);

export const isSpellsTabAvailable = createSelector(
	getMagicalTraditions,
	traditions => traditions.length > 0
);

export const areMaxUnfamiliar = createSelector(
	getPhase,
	getSpells,
	getElState,
	getMagicalTraditions,
	(phase, spells, el, tradition) => {
		if (phase > 2) {
			return false;
		}
		if (!tradition) {
			return true;
		}
		const max = getStart(el).maxUnfamiliarSpells;
		const unfamiliarSpells = [...spells.values()].reduce((n, e) => {
			const unknownTradition = !isOwnTradition(tradition, e);
			return unknownTradition && e.gr < 3 && e.active ? n + 1 : n;
		}, 0);
		return unfamiliarSpells >= max;
	}
);

export const getActiveSpellsNumber = createSelector(
	getSpells,
	spells => {
		return [...spells.values()].reduce((n, entry) => {
			if (entry.category === SPELLS && entry.active === true) {
				return n + 1;
			}
			return n;
		}, 0);
	}
);

export const getSpellsAndCantrips = createSelector(
	getSpells,
	getCantrips,
	(spells, cantrips) => {
		return [...spells.values(), ...cantrips.values()];
	}
);

export interface InactiveSpells {
	valid: (SpellInstance | CantripInstance)[];
	invalid: (SpellInstance | CantripInstance)[];
}

export const getInactiveSpells = createSelector(
	getSpellsAndCantrips,
	areMaxUnfamiliar,
	getPresent,
	getMagicalTraditions,
	(allEntries, areMaxUnfamiliar, currentHero, tradition): InactiveSpells => {
		if (tradition.length === 0) {
			return {
				valid: [],
				invalid: []
			};
		}
		const allInactiveSpells = allEntries.filter(e => e.active === false);
		const lastTraditionId = tradition[0].id;
		if (lastTraditionId === 'SA_679') {
			return allInactiveSpells.reduce<InactiveSpells>((obj, entry) => {
				if (entry.category === CANTRIPS || entry.gr < 3 && validate(currentHero, entry.reqs, entry.id) && (isOwnTradition(tradition, entry) || !areMaxUnfamiliar)) {
					return {
						...obj,
						valid: [...obj.valid, entry]
					};
				}
				else {
					return {
						...obj,
						invalid: [...obj.invalid, entry]
					};
				}
			}, {
				valid: [],
				invalid: []
			});
		}
		else if (lastTraditionId === 'SA_677' || lastTraditionId === 'SA_678') {
			const lastTradition = tradition[0];
			const subtradition = lastTradition.active[0] && lastTradition.active[0].sid;
			if (typeof subtradition === 'number') {
				return allInactiveSpells.reduce<InactiveSpells>((obj, entry) => {
					if (entry.category === CANTRIPS || entry.subtradition.includes(subtradition)) {
						return {
							...obj,
							valid: [...obj.valid, entry]
						};
					}
					else {
						return {
							...obj,
							invalid: [...obj.invalid, entry]
						};
					}
				}, {
					valid: [],
					invalid: []
				});
			}
			return {
				valid: [],
				invalid: []
			};
		}
		return allInactiveSpells.reduce<InactiveSpells>((obj, entry) => {
			if (entry.category === CANTRIPS || validate(currentHero, entry.reqs, entry.id) && (isOwnTradition(tradition, entry) || entry.gr < 3 && !areMaxUnfamiliar)) {
				return {
					...obj,
					valid: [...obj.valid, entry]
				};
			}
			else {
				return {
					...obj,
					invalid: [...obj.invalid, entry]
				};
			}
		}, {
			valid: [],
			invalid: []
		});
	}
);

export const getActiveSpells = createSelector(
	getSpellsAndCantrips,
	allEntries => {
		return allEntries.filter(e => e.active === true);
	}
);

export const getFilteredInactiveSpells = createSelector(
	getInactiveSpells,
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByAvailability(list.valid, availablility);
	}
);

export const getFilteredSpellsWithUnmetPrerequisites = createSelector(
	getInactiveSpells,
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByAvailability(list.invalid, availablility);
	}
);

export const getSpellsAndCantripsForSave = createSelector(
	getActiveSpells,
	list => {
		const spells: ToListById<number> = {};
		const cantrips: string[] = [];
		for (const entry of list) {
			if (entry.category === SPELLS) {
				const { id, value } = entry;
				spells[id] = value;
			}
			else {
				cantrips.push(entry.id);
			}
		}
		return {
			spells,
			cantrips
		};
	}
);

export const isActivationDisabled = createSelector(
	getStartEl,
	getPhase,
	getActiveSpellsNumber,
	getMagicalTraditions,
	mapGetToSlice(getAdvantages, 'ADV_58'),
	mapGetToSlice(getDisadvantages, 'DISADV_59'),
	(startEl, phase, activeSpells, tradition, bonusEntry, penaltyEntry) => {
		if (tradition.length === 0) {
			return true;
		}
		const lastTraditionId = tradition[0].id;
		if (lastTraditionId === 'SA_679') {
			let maxSpells = 3;
			if (bonusEntry && isActive(bonusEntry)) {
				const tier = bonusEntry.active[0].tier;
				if (tier) {
					maxSpells += tier;
				}
			}
			else if (penaltyEntry && isActive(penaltyEntry)) {
				const tier = penaltyEntry.active[0].tier;
				if (tier) {
					maxSpells += tier;
				}
			}
			if (activeSpells >= maxSpells) {
				return true;
			}
		}
		const maxSpellsLiturgies = startEl.maxSpellsLiturgies;
		return phase < 3 && activeSpells >= maxSpellsLiturgies;
	}
);

export const getCantripsForSheet = createSelector(
	getCantrips,
	cantrips => [...cantrips.values()].filter(e => e.active)
);

export const getSpellsForSheet = createSelector(
	getSpells,
	getMagicalTraditions,
	(spells, traditionSA) => {
		const array: Spell[] = [];
		for (const [id, entry] of spells) {
			const { ic, name, active, value, check, checkmod, property, tradition, effect, castingTime, castingTimeShort, cost, costShort, range, rangeShort, duration, durationShort, target, src, category } = entry;
			if (active) {
				let traditions;
				if (traditionSA.length === 0 || !isOwnTradition(traditionSA, entry)) {
					traditions = tradition;
				}
				array.push({
					id,
					name,
					value,
					ic,
					check,
					checkmod,
					property,
					traditions,
					effect,
					castingTime,
					castingTimeShort,
					cost,
					costShort,
					range,
					rangeShort,
					duration,
					durationShort,
					target,
					src,
					category
				});
			}
		}
		return array;
	}
);
