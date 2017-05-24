import { SPECIAL_ABILITIES } from '../constants/Categories';
import { get, getAllByCategoryGroup } from '../stores/ListStore';
import { AbilityInstance, ActivatableInstance, ActivateObject, ActiveObject, ActiveViewObject, RequirementObject, SelectionObject, SpecialAbilityInstance, ToListById } from '../types/data.d';
import * as DependentUtils from './DependentUtils';
import { validateInstance, validateInstanceRequirementObject } from './validate';

export function isMultiselect(obj: ActivatableInstance): boolean {
	return obj.max !== 1;
}

export function isActive(obj?: ActivatableInstance): boolean {
	if (obj === undefined) {
		return false;
	}
	return obj.active.length > 0;
}

export function isActivatable(obj: ActivatableInstance): boolean {
	if (obj.category === SPECIAL_ABILITIES && [9, 10].includes(obj.gr)) {
		const combinationSA = get('SA_183') as SpecialAbilityInstance;
		if (!combinationSA) {
			const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 9, 10) as SpecialAbilityInstance[];
			const totalActive = allStyles.filter(e => isActive(e)).length;
			if (totalActive >= 1) {
				return false;
			}
		}
		else {
			const combinationAvailable = isActive(combinationSA);
			if (combinationAvailable) {
				const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 9, 10) as SpecialAbilityInstance[];
				const allEqualTypeStyles = allStyles.filter(e => e.gr === obj.gr);
				const totalActive = allStyles.filter(e => isActive(e)).length;
				const equalTypeStyleActive = allEqualTypeStyles.filter(e => isActive(e)).length;
				if (totalActive >= 3 || equalTypeStyleActive >= 2) {
					return false;
				}
			}
			else {
				const allEqualTypeStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, obj.gr) as SpecialAbilityInstance[];
				if (allEqualTypeStyles.find(e => isActive(e))) {
					return false;
				}
			}
		}
	}
	if (obj.category === SPECIAL_ABILITIES && obj.gr === 13) {
		const combinationSA = get('SA_293') as SpecialAbilityInstance;
		if (!combinationSA) {
			const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 13) as SpecialAbilityInstance[];
			const totalActive = allStyles.filter(e => isActive(e)).length;
			if (totalActive >= 1) {
				return false;
			}
		}
		else {
			const combinationAvailable = isActive(combinationSA);
			if (combinationAvailable) {
				const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 13) as SpecialAbilityInstance[];
				const totalActive = allStyles.filter(e => isActive(e)).length;
				if (totalActive >= 2) {
					return false;
				}
			}
			else {
				const allEqualTypeStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, obj.gr) as SpecialAbilityInstance[];
				if (allEqualTypeStyles.find(e => isActive(e))) {
					return false;
				}
			}
		}
	}
	else if (obj.id === 'SA_183') {
		const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 9, 10) as SpecialAbilityInstance[];
		const isOneActive = allStyles.find(e => isActive(e));
		if (!isOneActive) {
			return false;
		}
	}
	else if (obj.id === 'SA_293') {
		const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 13) as SpecialAbilityInstance[];
		const isOneActive = allStyles.find(e => isActive(e));
		if (!isOneActive) {
			return false;
		}
	}
	return validateInstance(obj.reqs, obj.id);
}

export function isDeactivatable(obj: ActivatableInstance, sid?: string | number): boolean {
	if (obj.id === 'SA_183') {
		const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 9, 10) as SpecialAbilityInstance[];
		const allArmedStyles = allStyles.filter(e => e.gr === 9);
		const allUnarmedStyles = allStyles.filter(e => e.gr === 10);
		const totalActive = allStyles.filter(e => isActive(e)).length;
		const armedStyleActive = allArmedStyles.filter(e => isActive(e)).length;
		const unarmedStyleActive = allUnarmedStyles.filter(e => isActive(e)).length;
		if (totalActive >= 3 || armedStyleActive >= 2 || unarmedStyleActive >= 2) {
			return false;
		}
	}
	else if (obj.id === 'SA_293') {
		const allStyles = getAllByCategoryGroup(SPECIAL_ABILITIES, 13) as SpecialAbilityInstance[];
		const totalActive = allStyles.filter(e => isActive(e)).length;
		if (totalActive >= 2) {
			return false;
		}
	}
	const dependencies = obj.dependencies.filter(e => {
		if (typeof e === 'object' && e.origin) {
			const origin = get(e.origin) as SpecialAbilityInstance;
			const req = origin.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && !!e.origin && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(e => validateInstanceRequirementObject({ ...req, id: e }, obj.id));
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? true : false;
			}
			return true;
		}
		else if (typeof e === 'object' && Array.isArray(e.sid)) {
			const list = e.sid;
			if (list.includes(sid as number)) {
				return !getSids(obj).some(n => n !== sid && list.includes(n as number));
			}
		}
		return true;
	});
	return dependencies.length === 0;
}

export function getSids(obj: ActivatableInstance): Array<string | number> {
	return obj.active.map(e => e.sid as string | number);
}

export function getDSids(obj: ActivatableInstance): Array<(string | number)[] | string | number | boolean | undefined> {
	return obj.dependencies.map(e => typeof e !== 'number' && typeof e !== 'boolean' && e.sid);
}

export function getSelectionItem(obj: ActivatableInstance, id?: string | number): SelectionObject | undefined {
	if (obj.sel) {
		return obj.sel.find(e => e.id === id);
	}
	return undefined;
}

export function getSelectionName(obj: ActivatableInstance, id?: string | number) {
	const selectionItem = getSelectionItem(obj, id);
	if (selectionItem) {
		return selectionItem.name;
	}
	return undefined;
}

export function getSelectionNameAndCost(obj: ActivatableInstance, id?: string | number) {
	const selectionItem = getSelectionItem(obj, id);
	if (selectionItem) {
		const { name, cost } = selectionItem;
		return cost && { name, cost };
	}
	return undefined;
}

export function activate(obj: ActivatableInstance, { sel, sel2, input, tier }: ActivateObject): ToListById<AbilityInstance> {
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
		case 'SA_97':
			active = { sid: sel };
			adds.push({ id: 'SA_88', active: true, sid: sel });
			break;
		case 'SA_484': {
			active = { sid: sel };
			const selectionItem = getSelectionItem(obj, sel) as SelectionObject & { req: RequirementObject[], target: string; tier: number; };
			adds.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
			break;
		}

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
	return DependentUtils.addDependencies(obj, adds, sidNew);
}

export function deactivate(obj: ActivatableInstance, index: number): ToListById<AbilityInstance> {
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
		case 'SA_97':
			adds.push({ id: 'SA_88', active: true, sid });
			break;
		case 'SA_484': {
			const selectionItem = getSelectionItem(obj, sid) as SelectionObject & { req: RequirementObject[], target: string; tier: number; };
			adds.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
			break;
		}
	}
	obj.active.splice(index, 1);
	return DependentUtils.removeDependencies(obj, adds, sidOld);
}

export function setTier(obj: ActivatableInstance, index: number, tier: number): ActivatableInstance {
	obj.active[index].tier = tier;
	const active = obj.active;
	active.splice(index, 1, { ...active[index], tier });
	return {
		...obj,
		active,
	};
}

export function reset(obj: ActivatableInstance): ActivatableInstance {
	return {
		...obj,
		active: [],
		dependencies: [],
	};
}

export function getFullName(obj: string | ActiveViewObject): string {
	if (typeof obj === 'string') {
		return obj;
	}
	const { tiers, id, tier } = obj;
	let { name } = obj;
	const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
	if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
		if (id === 'SA_30' && tier === 4) {
			name += ` MS`;
		}
		else {
			name += tier && ` ${roman[tier - 1]}`;
		}
	}

	return name;
}
