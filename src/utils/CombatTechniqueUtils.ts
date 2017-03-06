import CombatTechniquesStore from '../stores/CombatTechniquesStore';
import ELStore from '../stores/ELStore';
import { get, getAllByCategoryGroup } from '../stores/ListStore';
import PhaseStore from '../stores/PhaseStore';
import { getSids } from './ActivatableUtils';

export const getAt = (obj: CombatTechniqueInstance): number => {
	const array = obj.gr === 2 ? obj.primary : ['ATTR_1'];
	const mod = CombatTechniquesStore.getPrimaryAttributeMod(array);
	return obj.value + mod;
};

export const getPa = (obj: CombatTechniqueInstance): number | string => {
	const mod = CombatTechniquesStore.getPrimaryAttributeMod(obj.primary);
	return obj.gr === 2 ? '--' : Math.round(obj.value / 2) + mod;
};

export const isIncreasable = (obj: CombatTechniqueInstance): boolean => {
	let max = 0;
	const bonus = getSids(get('ADV_17') as AdvantageInstance).includes(obj.id) ? 1 : 0;

	if (PhaseStore.get() < 3) {
		max = ELStore.getStart().maxCombatTechniqueRating;
	} else {
		max = CombatTechniquesStore.getMaxPrimaryAttributeValueByID(obj.primary) + 2;
	}

	return obj.value < max + bonus;
};

export const isDecreasable = (obj: CombatTechniqueInstance): boolean => {
	const SA_19_REQ = (get('SA_19') as SpecialAbilityInstance).active.length > 0 && (getAllByCategoryGroup(obj.category, 2) as CombatTechniqueInstance[]).filter(e => e.value >= 10).length === 1;

	return (SA_19_REQ && obj.value > 10 && obj.gr === 2) || obj.value > Math.max(6, ...(obj.dependencies));
};

export const reset = (obj: CombatTechniqueInstance): CombatTechniqueInstance => ({
	...obj,
	dependencies: [],
	value: 6,
});
