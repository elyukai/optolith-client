import { last } from 'lodash';
import { createSelector } from 'reselect';
import { CANTRIPS, SPELLS } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { CantripInstance, SpecialAbilityInstance, SpellInstance, ToListById } from '../types/data.d';
import { Spell } from '../types/view.d';
import { getSids, isActive } from '../utils/ActivatableUtils';
import { validate } from '../utils/RequirementUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getPresent } from './currentHeroSelectors';
import { getElState, getStart, getStartEl } from './elSelectors';
import { getPhase } from './phaseSelectors';
import { getAdvantages, getCantrips, getDisadvantages, getSpecialAbilities, getSpells } from './stateSelectors';

export const get = (state: Map<string, SpellInstance>, id: string) => state.get(id);
export { get as getSpell };
export const getCantripsState = (state: AppState) => state.currentHero.present.dependent.cantrips;
export const getSpellsState = (state: AppState) => state.currentHero.present.dependent.spells;

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

export const getAllForView = createSelector(
	getSpells,
	getCantrips,
	areMaxUnfamiliar,
	getPresent,
	mapGetToSlice(getSpecialAbilities, 'SA_70'),
	mapGetToSlice(getAdvantages, 'ADV_58'),
	mapGetToSlice(getDisadvantages, 'DISADV_59'),
	(spells, cantrips, areMaxUnfamiliar, currentHero, tradition) => {
		if (!tradition) {
			return [];
		}
		const allEntries = [...spells.values(), ...cantrips.values()];
		const lastTraditionId = last(getSids(tradition));
		if (lastTraditionId === 8) {
			return allEntries.filter(entry => {
				return entry.category === CANTRIPS || entry.gr < 3 && (entry.active === true || validate(currentHero, entry.reqs, entry.id) && (isOwnTradition(tradition, entry) || !areMaxUnfamiliar));
			});
		}
		else if (lastTraditionId === 6 || lastTraditionId === 7) {
			const lastTradition = last(tradition.active);
			const subtradition = lastTradition && lastTradition.sid2;
			if (typeof subtradition === 'number') {
				return allEntries.filter(entry => {
					return entry.category === CANTRIPS || entry.subtradition.includes(subtradition);
				});
			}
			return [];
		}
		return allEntries.filter(entry => {
			return entry.category === CANTRIPS || entry.active === true || validate(currentHero, entry.reqs, entry.id) && (isOwnTradition(tradition, entry) || entry.gr < 3 && !areMaxUnfamiliar);
		});
	}
);

export const getSpellsForSave = createSelector(
	getSpells,
	spells => {
		const active: ToListById<number> = {};
		for (const skill of [...spells.values()]) {
			const { id, active: isActive, value } = skill;
			if (isActive) {
				active[id] = value;
			}
		}
		return active;
	}
);

export const getCantripsForSave = createSelector(
	getCantrips,
	cantrips => {
		return [...cantrips.values()].reduce<string[]>((arr, e) => {
			if (e.active) {
				return [...arr, e.id];
			}
			return arr;
		}, []);
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
	getCantripsState,
	cantrips => [...cantrips.values()].filter(e => e.active)
);

export const getSpellsForSheet = createSelector(
	getSpellsState,
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
