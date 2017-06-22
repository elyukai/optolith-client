import { isEqual } from 'lodash';
import { get, getPrimaryAttrID } from '../stores/ListStore';
import { ActivatableInstance, AttributeInstance, BlessingInstance, CantripInstance, SpellInstance } from '../types/data.d';
import { AbilityInstanceExtended, AllInstancesList, AllRequirementObjects } from '../types/data.d';
import { ActiveDependency, ActiveOptionalDependency, ValueOptionalDependency } from '../types/reusable.d';
import { isCultureRequirement, isRaceRequirement, isRequiringIncreasable, isRequiringPrimaryAttribute, isSexRequirement } from './RequirementUtils';

type RequiringInstance = ActivatableInstance | SpellInstance | CantripInstance | BlessingInstance;
export type AdditionalRequirements = ActivatableInstance | SpellInstance | CantripInstance | BlessingInstance;

function addToArray<T>(array: T[], add: T): T[] {
	return [ ...array, add ];
}

function removeFromArray<T>(array: T[], index: number): T[] {
	array.splice(index, 1);
	return [ ...array ];
}

function addDependency(obj: AbilityInstanceExtended, add: any): AbilityInstanceExtended {
	return {
		...obj,
		dependencies: addToArray(obj.dependencies, add),
	};
}

function removeDependency<D>(obj: AbilityInstanceExtended, remove: D): AbilityInstanceExtended {
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
			dependencies: removeFromArray(obj.dependencies as D[], index),
		} as AbilityInstanceExtended;
	}
	else {
		return obj;
	}
}

function getInstance<T extends AbilityInstanceExtended>(all: AllInstancesList, updated: Map<string, AbilityInstanceExtended>, id: string) {
	return (updated.has(id) ? updated.get(id) : all.get(id)) as T;
}

/**
 * Adds dependencies to all required entries to ensure rule validity. The returned Map needs to be merged into the main Map in ListStore.
 * @param list All entries available for dependencies.
 * @param obj The entry of which requirements you want to add dependencies for.
 * @param adds Additional (computed) requirements that are not included in the static requirements.
 * @param sel The SID from the current selection.
 */
export function addDependencies(list: AllInstancesList, obj: RequiringInstance, adds: AllRequirementObjects[] = [], sel?: string): Map<string, AbilityInstanceExtended> {
	const allReqs = [ ...obj.reqs, ...adds ];
	const instances = new Map<string, AbilityInstanceExtended>().set(obj.id, obj);

	allReqs.forEach(req => {
		if (req !== 'RCP' && !isRaceRequirement(req) && !isCultureRequirement(req) && !isSexRequirement(req)) {
			if (isRequiringPrimaryAttribute(req)) {
				const { type, value } = req;
				const id = getPrimaryAttrID(type);
				if (id) {
					const requiredAbility = getInstance<AttributeInstance>(list, instances, id);
					instances.set(id, addDependency(requiredAbility, value));
				}
			}
			else if (isRequiringIncreasable(req)) {
				const { id, value } = req;
				if (Array.isArray(id)) {
					const add: ValueOptionalDependency = { value, origin: obj.id };
					id.forEach(e => {
						const requiredAbility = getInstance(list, instances, e);
						if (requiredAbility) {
							instances.set(e, addDependency(requiredAbility, add));
						}
					});
				}
				else {
					const requiredAbility = getInstance(list, instances, id);
					instances.set(id, addDependency(requiredAbility, value));
				}
			}
			else {
				const { id, active, sid, sid2 } = req;
				if (sid !== 'GR') {
					if (Array.isArray(id)) {
						let add: ActiveOptionalDependency = { origin: obj.id };
						if (Object.keys(req).length === 2 && typeof active === 'boolean') {
							add = { active, ...add };
						}
						else {
							add = { sid: sid === 'sel' ? sel : sid, sid2, ...add };
						}
						id.forEach(e => {
							const requiredAbility = getInstance(list, instances, e);
							if (requiredAbility) {
								instances.set(e, addDependency(requiredAbility, add));
							}
						});
					}
					else {
						let add: boolean | ActiveDependency;
						if (Object.keys(req).length === 2 && typeof active === 'boolean') {
							add = active;
						}
						else if (Array.isArray(sid)) {
							add = { active, sid };
						}
						else {
							add = { sid: sid === 'sel' ? sel : sid, sid2 };
						}
						const requiredAbility = getInstance(list, instances, id);
						instances.set(id, addDependency(requiredAbility, add));
					}
				}
			}
		}
	});
	return instances;
}

/**
 * Removes dependencies from all required entries to ensure rule validity.
 * @param obj The entry of which requirements you want to remove dependencies from.
 * @param adds Additional (computed) requirements that are not included in the static requirements.
 * @param sel The SID from the current selection.
 */
export function removeDependencies(list: AllInstancesList, obj: RequiringInstance, adds: AllRequirementObjects[] = [], sel?: string): Map<string, AbilityInstanceExtended> {
	const allReqs = [ ...obj.reqs, ...adds ];
	const instances = new Map<string, AbilityInstanceExtended>().set(obj.id, obj);

	allReqs.forEach(req => {
		if (req !== 'RCP' && !isRaceRequirement(req) && !isCultureRequirement(req) && !isSexRequirement(req)) {
			if (isRequiringPrimaryAttribute(req)) {
				const { type, value } = req;
				const id = getPrimaryAttrID(type);
				if (id) {
					const requiredAbility = getInstance<AttributeInstance>(list, instances, id);
					instances.set(id, removeDependency(requiredAbility, value));
				}
			}
			else if (isRequiringIncreasable(req)) {
				const { id, value } = req;
				if (Array.isArray(id)) {
					const add: ValueOptionalDependency = { value, origin: obj.id };
					id.forEach(e => {
						const requiredAbility = getInstance(list, instances, e);
						if (requiredAbility) {
							instances.set(e, removeDependency(requiredAbility, add));
						}
					});
				}
				else {
					const requiredAbility = getInstance(list, instances, id);
					instances.set(id, removeDependency(requiredAbility, value));
				}
			}
			else {
				const { id, active, sid, sid2 } = req;
				if (sid !== 'GR') {
					if (Array.isArray(id)) {
						let add: ActiveOptionalDependency = { origin: obj.id };
						if (Object.keys(req).length === 2 && typeof active === 'boolean') {
							add = { active, ...add };
						}
						else {
							add = { sid: sid === 'sel' ? sel : sid, sid2, ...add };
						}
						id.forEach(e => {
							const requiredAbility = getInstance(list, instances, e);
							if (requiredAbility) {
								instances.set(e, removeDependency(requiredAbility, add));
							}
						});
					}
					else {
						let add: boolean | ActiveDependency;
						if (Object.keys(req).length === 2 && typeof active === 'boolean') {
							add = active;
						}
						else if (Array.isArray(sid)) {
							add = { active, sid };
						}
						else {
							add = { sid: sid === 'sel' ? sel : sid, sid2 };
						}
						const requiredAbility = getInstance(list, instances, id);
						instances.set(id, removeDependency(requiredAbility, add));
					}
				}
			}
		}
	});
	return instances;
}
