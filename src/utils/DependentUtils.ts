import { isEqual } from 'lodash';
import { AbilityInstance, ActivatableInstance, ActivatableInstanceDependency, AttributeInstance, AttributeInstanceDependency, CombatTechniqueInstance, CombatTechniqueInstanceDependency, LiturgyInstance, SpellInstance, SpellInstanceDependency, TalentInstance, TalentInstanceDependency } from '../types/data.d';

function addDependencyToArray<T>(array: T[], add: T): T[] {
	return [ ...array, add ];
}

function removeDependencyFromArray<T>(array: T[], index: number): T[] {
	array.splice(index, 1);
	return [ ...array ];
}

export function addDependency(obj: ActivatableInstance, add: ActivatableInstanceDependency): ActivatableInstance;
export function addDependency(obj: AttributeInstance, add: AttributeInstanceDependency): AttributeInstance;
export function addDependency(obj: CombatTechniqueInstance, add: CombatTechniqueInstanceDependency): CombatTechniqueInstance;
export function addDependency(obj: LiturgyInstance, add: SpellInstanceDependency): LiturgyInstance;
export function addDependency(obj: SpellInstance, add: SpellInstanceDependency): SpellInstance;
export function addDependency(obj: TalentInstance, add: TalentInstanceDependency): TalentInstance;
export function addDependency(obj: AbilityInstance, add: any): AbilityInstance {
	return {
		...obj,
		dependencies: addDependencyToArray(obj.dependencies, add),
	};
}

export function removeDependency(obj: ActivatableInstance, add: ActivatableInstanceDependency): ActivatableInstance;
export function removeDependency(obj: AttributeInstance, add: AttributeInstanceDependency): AttributeInstance;
export function removeDependency(obj: CombatTechniqueInstance, add: CombatTechniqueInstanceDependency): CombatTechniqueInstance;
export function removeDependency(obj: LiturgyInstance, add: SpellInstanceDependency): LiturgyInstance;
export function removeDependency(obj: SpellInstance, add: SpellInstanceDependency): SpellInstance;
export function removeDependency(obj: TalentInstance, add: TalentInstanceDependency): TalentInstance;
export function removeDependency<D>(obj: AbilityInstance, remove: D): AbilityInstance {
	let index;
	if (typeof remove === 'object') {
		index = (obj.dependencies as D[]).findIndex(e => isEqual(remove, e));
	}
	else {
		index = (obj.dependencies as D[]).findIndex(e => e === remove);
	}
	if (index > -1) {
		return {
			...obj,
			dependencies: removeDependencyFromArray(obj.dependencies as D[], index),
		} as AbilityInstance;
	}
	else {
		return obj;
	}
}
