import { isEqual } from 'lodash';
import { get, getPrimaryAttrID } from '../stores/ListStore';
import { ActivatableInstance, AttributeInstance, CantripInstance, DependencyObject, RequirementObject, SkillOptionalDependency, SpellInstance, ToListById } from '../types/data.d';
import { AbilityInstance } from '../types/data.d';
import { convertId } from './AttributeUtils';

type RequiringInstance = ActivatableInstance | SpellInstance | CantripInstance;

function addDependencyToArray<T>(array: T[], add: T): T[] {
	return [ ...array, add ];
}

function removeDependencyFromArray<T>(array: T[], index: number): T[] {
	array.splice(index, 1);
	return [ ...array ];
}

function addDependency(obj: AbilityInstance, add: any): AbilityInstance {
	return {
		...obj,
		dependencies: addDependencyToArray(obj.dependencies, add),
	};
}

function removeDependency<D>(obj: AbilityInstance, remove: D): AbilityInstance {
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

function getInstance<T extends AbilityInstance>(instances: ToListById<AbilityInstance>, id: string) {
	return (instances.hasOwnProperty(id) ? instances[id] : get(id)) as T;
}

export function addDependencies(obj: RequiringInstance, adds: RequirementObject[] = [], sel?: string): ToListById<AbilityInstance> {
	const allReqs = [ ...obj.reqs, ...adds ];
	const instances: ToListById<AbilityInstance> = {
		[obj.id]: obj,
	};

	allReqs.forEach(req => {
		if (req !== 'RCP' && req.id !== 'RACE') {
			const { active, value, sid, sid2, type } = req;
			let id: string | string[] | undefined = req.id;
			if (id === 'auto_req' || sid === 'GR') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = convertId(getPrimaryAttrID(type as 1 | 2));
				if (id) {
					const requiredAbility = getInstance<AttributeInstance>(instances, id);
					instances[id] = addDependency(requiredAbility, value);
				}
			}
			else {
				if (Array.isArray(id)) {
					let add: SkillOptionalDependency | DependencyObject;
					if (Object.keys(req).length === 2 && typeof active === 'boolean') {
						add = { active, origin: obj.id };
					}
					else if (value) {
						add = { value, origin: obj.id };
					}
					else {
						add = { sid: sid === 'sel' ? sel : (sid as string | number | undefined), sid2, origin: obj.id };
					}
					id.forEach(e => {
						const id = convertId(e);
						const requiredAbility = getInstance(instances, id);
						if (requiredAbility) {
							instances[id] = addDependency(requiredAbility, add);
						}
					});
				}
				else {
					let add: boolean | number | DependencyObject;
					if (Object.keys(req).length === 2 && typeof active === 'boolean') {
						add = active;
					}
					else if (value) {
						add = value;
					}
					else if (Array.isArray(sid)) {
						add = { active, sid };
					}
					else {
						add = { sid: sid === 'sel' ? sel : (sid as string | number | undefined), sid2 };
					}
					id = convertId(id);
					const requiredAbility = getInstance(instances, id);
					instances[id] = addDependency(requiredAbility, add);
				}
			}
		}
	});
	return instances;
}

export function removeDependencies(obj: RequiringInstance, adds: RequirementObject[] = [], sel?: string): ToListById<AbilityInstance> {
	const allReqs = [ ...obj.reqs, ...adds ];
	const instances: ToListById<AbilityInstance> = {
		[obj.id]: obj,
	};

	allReqs.forEach(req => {
		if (req !== 'RCP' && req.id !== 'RACE') {
			const { active, value, sid, sid2, type } = req;
			let id: string | string[] | undefined = req.id;
			if (id === 'auto_req' || sid === 'GR') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = convertId(getPrimaryAttrID(type as 1 | 2));
				if (id) {
					const requiredAbility = getInstance<AttributeInstance>(instances, id);
					instances[id] = removeDependency(requiredAbility, value);
				}
			}
			else {
				if (Array.isArray(id)) {
					let add: SkillOptionalDependency | DependencyObject;
					if (Object.keys(req).length === 2 && typeof active === 'boolean') {
						add = { active, origin: obj.id };
					}
					else if (value) {
						add = { value, origin: obj.id };
					}
					else {
						add = { sid: sid === 'sel' ? sel : (sid as string | number | undefined), sid2, origin: obj.id };
					}
					id.forEach(e => {
						const id = convertId(e);
						const requiredAbility = getInstance(instances, id);
						if (requiredAbility) {
							instances[id] = removeDependency(requiredAbility, add);
						}
					});
				}
				else {
					let add: boolean | number | DependencyObject;
					if (Object.keys(req).length === 2 && typeof active === 'boolean') {
						add = active;
					}
					else if (value) {
						add = value;
					}
					else if (Array.isArray(sid)) {
						add = { active, sid };
					}
					else {
						add = { sid: sid === 'sel' ? sel : (sid as string | number | undefined), sid2 };
					}
					id = convertId(id);
					const requiredAbility = getInstance(instances, id);
					instances[id] = removeDependency(requiredAbility, add);
				}
			}
		}
	});

	return instances;
}
