import { get, getPrimaryAttrID } from '../stores/ListStore';
import * as DependentUtils from './DependentUtils';
import validate from './validate';
import { fn } from './validate';

export const isMultiselect = (obj: ActivatableInstance): boolean => obj.max !== 1;

export const isActive = (obj: ActivatableInstance): boolean => obj.active.length > 0;

export const isActivatable = (obj: ActivatableInstance): boolean => validate(obj.reqs);

export const isDeactivatable = (obj: ActivatableInstance): boolean => {
	const dependencies = obj.dependencies.filter(e => {
		if (typeof e === 'object' && e.origin) {
			const origin = get(e.origin) as SpecialAbilityInstance;
			const req = origin.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin!)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(e => fn({ ...req, id: e }));
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? true : false;
			}
			return true;
		}
		return true;
	});
	return dependencies.length === 0;
};

export const getSids = (obj: ActivatableInstance): Array<string | number> => obj.active.map(e => e.sid!);

export const getDSids = (obj: ActivatableInstance): Array<string | number | boolean | undefined> => {
	return obj.dependencies.map(e => typeof e !== 'number' && typeof e !== 'boolean' && e.sid);
};

export const getSelectionItem = (obj: ActivatableInstance, id: string | number): SelectionObject | undefined => {
	return obj.sel.find(e => e.id === id);
};

export const activate = (obj: ActivatableInstance, { sel, sel2, input, tier }: ActivateObject): ToListById<AbilityInstance> => {
	const adds: RequirementObject[] = [];
	let active: ActiveObject | undefined;
	let sidNew;
	switch (obj.id) {
		case 'ADV_4':
		case 'ADV_16':
		case 'DISADV_48':
			active = { sid: sel };
			sidNew = sel as string;
			break;
		case 'DISADV_1':
		case 'DISADV_34':
		case 'DISADV_50':
			if (!input) {
				active = { sid: sel, tier };
			}
			else if (obj.active.filter(e => e.sid === input).length === 0) {
				active = { sid: input, tier };
			}
			break;
		case 'DISADV_33':
			if ([7, 8].includes(sel as number) && input) {
				if (obj.active.filter(e => e.sid2 === input).length === 0) {
					active = { sid: sel, sid2: input };
				}
			} else {
				active = { sid: sel };
			}
			break;
		case 'DISADV_36':
			if (!input) {
				active = { sid: sel };
			}
			else if (obj.active.filter(e => e.sid === input).length === 0) {
				active = { sid: input };
			}
			break;
		case 'SA_10':
			if (!input) {
				active = { sid: sel, sid2: sel2 };
			} else if (obj.active.filter(e => e.sid === input).length === 0) {
				active = { sid: sel, sid2: input };
			}
			adds.push({ id: sel as string, value: (obj.active.filter(e => e.sid === sel).length + 1) * 6 });
			break;
		case 'SA_30':
			active = { sid: sel, tier };
			break;

		default:
			if (sel) {
				active = { sid: (obj.input && input) || sel };
			}
			else if (input && obj.active.filter(e => e.sid === input).length === 0) {
				active = { sid: input };
			}
			else if (tier) {
				active = { tier };
			}
			else if (obj.max === 1) {
				active = {};
			}
			break;
	}
	if (active) {
		obj.active.push(active);
	}
	return addDependencies(obj, adds, sidNew);
};

export const deactivate = (obj: ActivatableInstance, index: number): ToListById<AbilityInstance> => {
	const adds: RequirementObject[] = [];
	const sid = obj.active[index].sid;
	let sidOld;
	switch (obj.id) {
		case 'ADV_4':
		case 'ADV_16':
		case 'DISADV_48':
			sidOld = sid as string;
			break;
		case 'SA_10':
			adds.push({ id: sid as string, value: obj.active.filter(e => e.sid === sid).length * 6 });
			break;
	}
	obj.active.splice(index, 1);
	return removeDependencies(obj, adds, sidOld);
};

export const setTier = (obj: ActivatableInstance, index: number, tier: number): ActivatableInstance => {
	obj.active[index].tier = tier;
	const active = obj.active;
	active.splice(index, 1, { ...active[index], tier });
	return {
		...obj,
		active,
	};
};

export const addDependencies = (obj: ActivatableInstance, adds: RequirementObject[] = [], sel?: string): ToListById<AbilityInstance> => {
	const allReqs = [ ...obj.reqs, ...adds ];
	const instances: ToListById<AbilityInstance> = {
		[obj.id]: obj,
	};

	const getInstance = <T extends AbilityInstance>(id: string) => (instances.hasOwnProperty(id) ? instances[id] : get(id)) as T;

	allReqs.forEach(req => {
		if (req !== 'RCP' && req.id !== 'RACE') {
			const { active, value, sid, sid2, type } = req;
			let id: string | string[] | undefined = req.id;
			if (id === 'auto_req' || sid === 'GR') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = getPrimaryAttrID(type as 1 | 2);
				if (id) {
					const requiredAbility = getInstance<AttributeInstance>(id);
					instances[id] = DependentUtils.addDependency(requiredAbility, value!);
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
						const requiredAbility = getInstance(e);
						instances[e] = DependentUtils.addDependency(requiredAbility, add);
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
					else {
						add = { sid: sid === 'sel' ? sel : (sid as string | number | undefined), sid2 };
					}
					const requiredAbility = getInstance(id);
					instances[id] = DependentUtils.addDependency(requiredAbility, add);
				}
			}
		}
	});
	return instances;
};

export const removeDependencies = (obj: ActivatableInstance, adds: RequirementObject[] = [], sel?: string): ToListById<AbilityInstance> => {
	const allReqs = [ ...obj.reqs, ...adds ];
	const instances: ToListById<AbilityInstance> = {
		[obj.id]: obj,
	};

	const getInstance = <T extends AbilityInstance>(id: string) => (instances.hasOwnProperty(id) ? instances[id] : get(id)) as T;

	allReqs.forEach(req => {
		if (req !== 'RCP' && req.id !== 'RACE') {
			const { active, value, sid, sid2, type } = req;
			let id: string | string[] | undefined = req.id;
			if (id === 'auto_req' || sid === 'GR') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = getPrimaryAttrID(type as 1 | 2);
				if (id) {
					const requiredAbility = getInstance<AttributeInstance>(id);
					instances[id] = DependentUtils.removeDependency(requiredAbility, value!);
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
						const requiredAbility = getInstance(e);
						instances[e] = DependentUtils.removeDependency(requiredAbility, add);
					});
				}
				else {
					let add: boolean | number | DependencyObject;
					if (Object.keys(req).length === 2 && typeof active === 'boolean') {
						add = active!;
					}
					else if (value) {
						add = value;
					}
					else {
						add = { sid: sid === 'sel' ? sel : (sid as string | number | undefined), sid2 };
					}
					const requiredAbility = getInstance(id);
					instances[id] = DependentUtils.removeDependency(requiredAbility, add);
				}
			}
		}
	});

	return instances;
};

export const reset = (obj: ActivatableInstance): ActivatableInstance => ({
	...obj,
	active: [],
	dependencies: [],
});
