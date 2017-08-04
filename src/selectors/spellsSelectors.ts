import { last } from 'lodash';
import { createSelector } from 'reselect';
import { CANTRIPS, SPELLS } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { AdvantageInstance, CantripInstance, DisadvantageInstance, SpecialAbilityInstance, SpellInstance } from '../types/data.d';
import { Spell } from '../types/view.d';
import { getSids, isActive } from '../utils/ActivatableUtils';
import { validate } from '../utils/RequirementUtils';
import { isOwnTradition } from '../utils/SpellUtils';
import { getAdv, getDisadv, getSpecialAbility } from './activatableSelectors';
import { getPresent } from './currentHeroSelectors';
import { getAllByCategory, getDependent } from './dependentInstancesSelectors';
import { getElState, getStart } from './elSelectors';
import { getPhase } from './phaseSelectors';

export const get = (state: Map<string, SpellInstance>, id: string) => state.get(id);
export { get as getSpell };
export const getCantripsState = (state: AppState) => state.currentHero.present.dependent.cantrips;
export const getSpellsState = (state: AppState) => state.currentHero.present.dependent.spells;

export const areMaxUnfamiliar = createSelector(
	[ getPhase, getDependent, getElState ],
	(phase, dependent, el) => {
		if (phase > 2) {
			return false;
		}
		const max = getStart(el).maxUnfamiliarSpells;
		const SA_86 = getSpecialAbility(dependent.specialAbilities, 'SA_86')!;
		const unfamiliarSpells = (getAllByCategory(dependent, SPELLS) as SpellInstance[]).reduce((n, e) => {
			const unknownTradition = !e.tradition.some(e => e === 1 || e === (getSids(SA_86)[0] as number) + 1);
			return unknownTradition && e.gr < 3 && e.active ? n + 1 : n;
		}, 0);
		return unfamiliarSpells >= max;
	}
);

export const getActiveSpellsNumber = createSelector(
	getDependent,
	dependent => {
		return (getAllByCategory(dependent, SPELLS) as SpellInstance[]).reduce((n, entry) => {
			if (entry.category === SPELLS && entry.value > 0) {
				return n + 1;
			}
			return n;
		}, 0);
	}
);

export const getAllForView = createSelector(
	[ getDependent, areMaxUnfamiliar, getActiveSpellsNumber, getPresent ],
	(dependent, areMaxUnfamiliar, activeSpells, currentHero) => {
	const tradition = getSpecialAbility(dependent.specialAbilities, 'SA_86') as SpecialAbilityInstance;
	const allEntries = getAllByCategory(dependent, CANTRIPS, SPELLS) as (CantripInstance | SpellInstance)[];
	const lastTraditionId = last(getSids(tradition));
	if (lastTraditionId === 8) {
		let maxSpells = 3;
		const bonusEntry = getAdv(dependent.advantages, 'ADV_58') as AdvantageInstance;
		const penaltyEntry = getDisadv(dependent.disadvantages, 'DISADV_59') as DisadvantageInstance;
		if (isActive(bonusEntry)) {
			const tier = bonusEntry.active[0].tier;
			if (tier) {
				maxSpells += tier;
			}
		}
		else if (isActive(penaltyEntry)) {
			const tier = penaltyEntry.active[0].tier;
			if (tier) {
				maxSpells += tier;
			}
		}
		return allEntries.filter(entry => {
			return entry.category === CANTRIPS || entry.gr === 1 && activeSpells <= maxSpells && (entry.active === true || validate(currentHero, entry.reqs, entry.id) && (isOwnTradition(dependent, entry) || !areMaxUnfamiliar));
		});
	}
	else if (lastTraditionId === 6 || lastTraditionId === 7) {
		const tradition = getSpecialAbility(dependent.specialAbilities, 'SA_86') as SpecialAbilityInstance;
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
		return entry.category === CANTRIPS || entry.active === true || validate(currentHero, entry.reqs, entry.id) && (isOwnTradition(dependent, entry) || entry.gr < 3 && !areMaxUnfamiliar);
	});
});

export function getForSave(state: DependentInstancesState) {
	const active: { [id: string]: number } = {};
	for (const skill of getAllByCategory(state, SPELLS) as SpellInstance[]) {
		const { id, active: isActive, value } = skill;
		if (isActive) {
			active[id] = value;
		}
	}
	return active;
}

export function getCantripsForSave(state: DependentInstancesState) {
	return (getAllByCategory(state, CANTRIPS) as CantripInstance[]).reduce<string[]>((arr, e) => {
		if (e.active) {
			return [...arr, e.id];
		}
		return arr;
	}, []);
}

export function isActivationDisabled(state: AppState) {
	const maxSpellsLiturgies = getStart(getElState(state)).maxSpellsLiturgies;
	return getPhase(state) < 3 && (getAllByCategory(getDependent(state), SPELLS) as SpellInstance[]).filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
}

export const getCantripsForSheet = createSelector(
	getCantripsState,
	cantrips => [...cantrips.values()].filter(e => e.active)
);

export const getSpellsForSheet = createSelector(
	getSpellsState,
	getDependent,
	(spells, dependent) => {
		const array: Spell[] = [];
		for (const [id, entry] of spells) {
			const { ic, name, active, value, check, checkmod, property, tradition } = entry;
			if (active) {
				let traditions;
				if (!isOwnTradition(dependent, entry)) {
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
					traditions
				});
			}
		}
		return array;
	}
);
