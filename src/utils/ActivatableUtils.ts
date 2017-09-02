import { SPECIAL_ABILITIES } from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { get, getAllByCategoryGroup } from '../selectors/dependentInstancesSelectors';
import { ActiveObjectName } from '../types/activatables';
import { ActivatableInstance, ActivateObject, ActiveObject, ActiveViewObject, AllRequirementObjects, RequirementObject, SelectionObject, SkillishInstance, SpecialAbilityInstance, SpellInstance, TalentInstance, ToOptionalKeys } from '../types/data.d';
import { AllRequirementTypes } from '../types/reusable.d';
import * as DependentUtils from './DependentUtils';
import { getRoman } from './NumberUtils';
import { isRequiringActivatable, validate, validateObject } from './RequirementUtils';

export function isMultiselect(obj: ActivatableInstance): boolean {
	return obj.max !== 1;
}

export function isActive(obj?: ActivatableInstance): boolean {
	if (obj === undefined) {
		return false;
	}
	return obj.active.length > 0;
}

export function isActivatable(state: CurrentHeroInstanceState, obj: ActivatableInstance): boolean {
	const { dependent } = state;
	if (obj.category === SPECIAL_ABILITIES && [9, 10].includes(obj.gr)) {
		const combinationSA = get(dependent, 'SA_183') as SpecialAbilityInstance;
		if (!combinationSA) {
			const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 9, 10);
			const totalActive = allStyles.filter(e => isActive(e)).length;
			if (totalActive >= 1) {
				return false;
			}
		}
		else {
			const combinationAvailable = isActive(combinationSA);
			if (combinationAvailable) {
				const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 9, 10);
				const allEqualTypeStyles = allStyles.filter(e => e.gr === obj.gr);
				const totalActive = allStyles.filter(e => isActive(e)).length;
				const equalTypeStyleActive = allEqualTypeStyles.filter(e => isActive(e)).length;
				if (totalActive >= 3 || equalTypeStyleActive >= 2) {
					return false;
				}
			}
			else {
				const allEqualTypeStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, obj.gr);
				if (allEqualTypeStyles.find(e => isActive(e))) {
					return false;
				}
			}
		}
	}
	if (obj.category === SPECIAL_ABILITIES && obj.gr === 13) {
		const combinationSA = get(dependent, 'SA_293') as SpecialAbilityInstance;
		if (!combinationSA) {
			const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 13);
			const totalActive = allStyles.filter(e => isActive(e)).length;
			if (totalActive >= 1) {
				return false;
			}
		}
		else {
			const combinationAvailable = isActive(combinationSA);
			if (combinationAvailable) {
				const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 13);
				const totalActive = allStyles.filter(e => isActive(e)).length;
				if (totalActive >= 2) {
					return false;
				}
			}
			else {
				const allEqualTypeStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, obj.gr);
				if (allEqualTypeStyles.find(e => isActive(e))) {
					return false;
				}
			}
		}
	}
	else if (obj.id === 'SA_183') {
		const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 9, 10);
		const isOneActive = allStyles.find(e => isActive(e));
		if (!isOneActive) {
			return false;
		}
	}
	else if (obj.id === 'SA_293') {
		const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 13);
		const isOneActive = allStyles.find(e => isActive(e));
		if (!isOneActive) {
			return false;
		}
	}
	return validate(state, obj.reqs, obj.id);
}

export function isDeactivatable(state: CurrentHeroInstanceState, obj: ActivatableInstance, sid?: string | number): boolean {
	const { dependent } = state;
	if (obj.id === 'SA_183') {
		const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 9, 10);
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
		const allStyles = getAllByCategoryGroup(dependent, SPECIAL_ABILITIES, 13);
		const totalActive = allStyles.filter(e => isActive(e)).length;
		if (totalActive >= 2) {
			return false;
		}
	}
	const dependencies = obj.dependencies.filter(e => {
		if (typeof e === 'object' && e.origin) {
			const origin = get(dependent, e.origin) as SpecialAbilityInstance;
			const req = origin.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && !!e.origin && r.id.includes(e.origin)) as AllRequirementObjects | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(e => validateObject(state, { ...req, id: e } as AllRequirementObjects, obj.id));
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

export function activate(state: DependentInstancesState, obj: ActivatableInstance, { sel, sel2, input, tier }: ActivateObject): ToOptionalKeys<DependentInstancesState> {
	const adds: AllRequirementTypes[] = [];
	let active: ActiveObject | undefined;
	let sidNew;
	switch (obj.id) {
		case 'ADV_4':
		case 'ADV_16':
		case 'DISADV_48':
			active = { sid: sel };
			sidNew = sel as string;
			break;
		case 'ADV_68':
			active = { sid: sel, sid2: input };
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
				active = { sid: (obj.input && input) || sel, sid2: sel2 };
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
		return DependentUtils.addDependencies(state, {...obj, active: [...obj.active, active]}, adds, sidNew);
	}
	return state;
}

export function deactivate(state: DependentInstancesState, obj: ActivatableInstance, index: number): ToOptionalKeys<DependentInstancesState> {
	const adds: AllRequirementTypes[] = [];
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
	return DependentUtils.removeDependencies(state, {...obj, active: [...obj.active.slice(0, index), ...obj.active.slice(index + 1)]}, adds, sidOld);
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
	if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
		if (id === 'SA_30' && tier === 4) {
			name += ` MS`;
		}
		else {
			name += tier && ` ${getRoman(tier)}`;
		}
	}
	return name;
}

export function isMagicalOrBlessed(obj: ActivatableInstance) {
	const isBlessed = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_12' && isRequiringActivatable(e) && !!e.active);
	const isMagical = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_50' && isRequiringActivatable(e) && !!e.active);
	return {
		isBlessed,
		isMagical
	};
}

export function getSecondSidMap(entry: ActivatableInstance): Map<string, (string | number)[]> {
	return entry.active.reduce((map, obj) => {
		const { sid, sid2 } = obj as { sid: string; sid2: string | number };
		const current = map.get(sid);
		if (current) {
			return map.set(sid, [...current, sid2]);
		}
		return map.set(sid, [sid2]);
	}, new Map<string, (number | string)[]>());
}

export function getActiveSelection(state: DependentInstancesState, entry: ActivatableInstance, index: number): ActiveObjectName | undefined {
	const { active, id, input, sel } = entry;
	const { sid, sid2, ...other } = active[index];
	let finalName;
	switch (id) {
		case 'ADV_4':
		case 'ADV_16':
		case 'ADV_17':
		case 'ADV_47':
		case 'DISADV_48':
		case 'SA_252':
		case 'SA_273': {
			const { name } = (get(state, sid as string)) as SkillishInstance;
			finalName = name;
			break;
		}
		case 'ADV_32':
		case 'DISADV_1':
		case 'DISADV_24':
		case 'DISADV_34':
		case 'DISADV_36':
		case 'DISADV_45':
		case 'DISADV_50':
			finalName = typeof sid === 'number' ? getSelectionName(entry, sid) : sid;
			break;
		case 'ADV_68': {
			const selectionItem = getSelectionItem(entry, sid);
			finalName = selectionItem && `${sid2} (${selectionItem.name})`;
			break;
		}
		case 'DISADV_33': {
			const selectionItem = getSelectionItem(entry, sid);
			if ([7, 8].includes(sid as number)) {
				finalName = `${selectionItem && selectionItem.name}: ${sid2}`;
			} else {
				finalName = selectionItem && selectionItem.name;
			}
			break;
		}
		case 'SA_10': {
			const skill = get(state, sid as string) as TalentInstance;
			let name;
			if (typeof sid2 === 'string') {
				name = sid2;
			}
			else {
				const selectedApplication = skill.applications && skill.applications.find(e => e.id === sid2);
				if (typeof selectedApplication === 'undefined') {
					return;
				}
				name = selectedApplication.name;
			}
			finalName = `${skill.name}: ${name}`;
			break;
		}
		case 'SA_484': {
			const selectionItem = getSelectionItem(entry, sid) as (SelectionObject & { target: string; }) | undefined;
			finalName = selectionItem && `${(get(state, selectionItem.target) as SpellInstance).name}: ${selectionItem.name}`;
			break;
		}

		default:
			if (typeof input === 'string') {
				finalName = sid as string;
			}
			else if (Array.isArray(sel)) {
				finalName = getSelectionName(entry, sid);
			}
			break;
	}

	if (typeof finalName === 'string') {
		return { name: finalName, ...other };
	}
	return;
}
