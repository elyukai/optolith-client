import { last } from 'lodash';
import { createSelector } from 'reselect';
import { CANTRIPS, SPELLS } from '../constants/Categories';
import { CantripInstance, SpecialAbilityInstance, SpellInstance, ToListById } from '../types/data.d';
import { Spell } from '../types/view.d';
import { getSids, isActive } from '../utils/ActivatableUtils';
import { validate } from '../utils/RequirementUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getPresent } from './currentHeroSelectors';
import { getElState, getStart, getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getAdvantages, getCantrips, getDisadvantages, getPhase, getSpecialAbilities, getSpells } from './stateSelectors';

export const areMaxUnfamiliar = createSelector(
	getPhase,
	getSpells,
	getElState,
	mapGetToSlice(getSpecialAbilities, 'SA_70'),
	(phase, spells, el, tradition) => {
		if (phase > 2) {
			return false;
		}
		if (!tradition) {
			return true;
		}
		const max = getStart(el).maxUnfamiliarSpells;
		const unfamiliarSpells = [...spells.values()].reduce((n, e) => {
			const unknownTradition = !e.tradition.some(e => e === 1 || e === (getSids(tradition)[0] as number) + 1);
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
	mapGetToSlice(getSpecialAbilities, 'SA_70'),
	(allEntries, areMaxUnfamiliar, currentHero, tradition): InactiveSpells => {
		if (!tradition) {
			return {
				valid: [],
				invalid: []
			};
		}
		const allInactiveSpells = allEntries.filter(e => e.active === false);
		const lastTraditionId = last(getSids(tradition));
		if (lastTraditionId === 8) {
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
		else if (lastTraditionId === 6 || lastTraditionId === 7) {
			const lastTradition = last(tradition.active);
			const subtradition = lastTradition && lastTradition.sid2;
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
	mapGetToSlice(getSpecialAbilities, 'SA_70'),
	mapGetToSlice(getAdvantages, 'ADV_58'),
	mapGetToSlice(getDisadvantages, 'DISADV_59'),
	(startEl, phase, activeSpells, tradition, bonusEntry, penaltyEntry) => {
		if (!tradition) {
			return true;
		}
		const lastTraditionId = last(getSids(tradition));
		if (lastTraditionId === 8) {
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
	mapGetToSlice(getSpecialAbilities, 'SA_70'),
	(spells, traditionSA) => {
		const array: Spell[] = [];
		for (const [id, entry] of spells) {
			const { ic, name, active, value, check, checkmod, property, tradition, effect, castingTime, castingTimeShort, cost, costShort, range, rangeShort, duration, durationShort, target, src, category } = entry;
			if (active) {
				let traditions;
				if (!traditionSA || !isOwnTradition(traditionSA, entry)) {
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

function isOwnTradition(tradition: SpecialAbilityInstance, obj: SpellInstance | CantripInstance): boolean {
	return obj.tradition.some(e => e === 1 || e === last(getSids(tradition)) as number + 1);
}
