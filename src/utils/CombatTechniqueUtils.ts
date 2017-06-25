import { CurrentHeroState } from '../reducers/currentHero';
import { DependentInstancesState, get, getAllByCategoryGroup } from '../reducers/dependentInstances';
import { getStart } from '../reducers/el';
import { AdvantageInstance, AttributeInstance, CombatTechniqueInstance, SpecialAbilityInstance } from '../types/data.d';
import { getSids } from './ActivatableUtils';

export function getMaxPrimaryAttributeValueByID(state: DependentInstancesState, array: string[]) {
	return array.map(attr => (get(state, attr) as AttributeInstance).value).reduce((a, b) => Math.max(a, b), 0);
}

export function getPrimaryAttributeMod(state: DependentInstancesState, array: string[]) {
	return Math.max(Math.floor((getMaxPrimaryAttributeValueByID(state, array) - 8) / 3), 0);
}

export function getAt(state: DependentInstancesState, obj: CombatTechniqueInstance): number {
	const array = obj.gr === 2 ? obj.primary : ['ATTR_1'];
	const mod = getPrimaryAttributeMod(state, array);
	return obj.value + mod;
}

export function getPa(state: DependentInstancesState, obj: CombatTechniqueInstance): number | undefined {
	const mod = getPrimaryAttributeMod(state, obj.primary);
	return obj.gr === 2 || obj.id === 'CT_6' || obj.id === 'CT_8' ? undefined : Math.round(obj.value / 2) + mod;
}

export function isIncreasable(state: CurrentHeroState, obj: CombatTechniqueInstance): boolean {
	let max = 0;
	const bonus = getSids(get(state.dependent, 'ADV_17') as AdvantageInstance).includes(obj.id) ? 1 : 0;

	if (state.phase < 3) {
		max = getStart(state.el).maxCombatTechniqueRating;
	}
	else {
		max = getMaxPrimaryAttributeValueByID(state.dependent, obj.primary) + 2;
	}

	return obj.value < max + bonus;
}

export function isDecreasable(state: CurrentHeroState, obj: CombatTechniqueInstance): boolean {
	const SA_19_REQ = (get(state.dependent, 'SA_19') as SpecialAbilityInstance).active.length > 0 && (getAllByCategoryGroup(state.dependent, obj.category, 2) as CombatTechniqueInstance[]).filter(e => e.value >= 10).length === 1;

	return (SA_19_REQ && obj.value > 10 && obj.gr === 2) || obj.value > Math.max(6, ...(obj.dependencies));
}

export function reset(obj: CombatTechniqueInstance): CombatTechniqueInstance {
	return {
		...obj,
		dependencies: [],
		value: 6,
	};
}
