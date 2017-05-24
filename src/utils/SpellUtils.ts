import { ELStore } from '../stores/ELStore';
import { get } from '../stores/ListStore';
import { PhaseStore } from '../stores/PhaseStore';
import { SpellsStore } from '../stores/SpellsStore';
import { AbilityInstance, AdvantageInstance, AttributeInstance, CantripInstance, SpecialAbilityInstance, SpellInstance, ToListById } from '../types/data.d';
import { getSids } from './ActivatableUtils';
import { addDependencies, removeDependencies } from './DependentUtils';

export function isOwnTradition(obj: SpellInstance | CantripInstance): boolean {
	const SA = get('SA_86') as SpecialAbilityInstance;
	return obj.tradition.some(e => e === 1 || e === getSids(SA)[0] as number + 1);
}

export function isIncreasable(obj: SpellInstance): boolean {
	let max = 0;
	const bonus = (get('ADV_16') as AdvantageInstance).active.filter(e => e === obj.id).length;

	if (PhaseStore.get() < 3) {
		max = ELStore.getStart().maxSkillRating;
	} else {
		const checkValues = obj.check.map((attr, i) => i > 2 ? 0 : (get(attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	if (!(get('SA_88') as SpecialAbilityInstance).active.includes(obj.property)) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(obj: SpellInstance): boolean {
	if ((get('SA_88') as SpecialAbilityInstance).active.includes(obj.property)) {
		const counter = SpellsStore.getPropertyCounter();

		return !(counter.get(obj.property) <= 3 && obj.value <= 10 && obj.gr !== 5);
	}
	return true;
}

export function activate(obj: SpellInstance): ToListById<AbilityInstance> {
	return addDependencies({ active: true, ...obj });
}

export function activateCantrip(obj: CantripInstance): ToListById<AbilityInstance> {
	return addDependencies({ active: true, ...obj });
}

export function deactivate(obj: SpellInstance): ToListById<AbilityInstance> {
	return removeDependencies({ active: false, ...obj });
}

export function deactivateCantrip(obj: CantripInstance): ToListById<AbilityInstance> {
	return removeDependencies({ active: false, ...obj });
}

export function reset(obj: SpellInstance): SpellInstance {
	return {
		...obj,
		active: false,
		dependencies: [],
		value: 0
	};
}

export function resetCantrip(obj: CantripInstance): CantripInstance {
	return {
		...obj,
		active: false,
		dependencies: []
	};
}
