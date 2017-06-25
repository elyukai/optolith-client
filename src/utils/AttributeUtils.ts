import { last } from 'lodash';
import { ATTRIBUTES } from '../constants/Categories';
import { CurrentHeroState } from '../reducers/currentHero';
import { DependentInstancesState, get, getAllByCategory } from '../reducers/dependentInstances';
import { getStart } from '../reducers/el';
import { AttributeInstance, RequirementObject, SpecialAbilityInstance, TalentInstance } from '../types/data.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';

export function getSum(list: AttributeInstance[]): number {
	return list.reduce((n, e) => n + e.value, 0);
}

export function isIncreasable(state: CurrentHeroState, obj: AttributeInstance): boolean {
	if (state.phase < 3) {
		const attributes = getAllByCategory(state.dependent, ATTRIBUTES) as AttributeInstance[];
		const el = getStart(state.el);
		const max = getSum(attributes) >= el.maxTotalAttributeValues ? 0 : el.maxAttributeValue + obj.mod;
		return obj.value < max;
	}
	else if (state.rules.attributeValueLimit === true) {
		const currentElId = getExperienceLevelIdByAp(state.el.all, state.ap.total);
		const currentEl = state.el.all.get(currentElId);
		return typeof currentEl === 'object' && obj.value < currentEl.maxAttributeValue + 2;
	}
	return true;
}

export function isDecreasable(state: CurrentHeroState, obj: AttributeInstance): boolean {
	const dependencies = obj.dependencies.map(e => {
		if (typeof e !== 'number') {
			const target = get(state.dependent, e.origin) as SpecialAbilityInstance;
			const req = target.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => (get(state.dependent, id) as TalentInstance).value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	return obj.value > Math.max(8, ...dependencies);
}

export function reset(obj: AttributeInstance): AttributeInstance {
	return {
		...obj,
		dependencies: [],
		mod: 0,
		value: 8,
	};
}

export function convertId<T extends string | undefined>(id: T): T {
	switch (id) {
		case 'COU':
			return 'ATTR_1' as T;
		case 'SGC':
			return 'ATTR_2' as T;
		case 'INT':
			return 'ATTR_3' as T;
		case 'CHA':
			return 'ATTR_4' as T;
		case 'DEX':
			return 'ATTR_5' as T;
		case 'AGI':
			return 'ATTR_6' as T;
		case 'CON':
			return 'ATTR_7' as T;
		case 'STR':
			return 'ATTR_8' as T;

		default:
			return id;
	}
}

export function getPrimaryAttributeId(state: DependentInstancesState, type: 1 | 2) {
	if (type === 1) {
		const tradition = get(state, 'SA_86') as SpecialAbilityInstance;
		switch (last(ActivatableUtils.getSids(tradition))) {
			case 1:
			case 4:
			case 10:
				return 'ATTR_2';
			case 3:
				return 'ATTR_3';
			case 2:
			case 5:
			case 6:
			case 7:
				return 'ATTR_4';
		}
	}
	else if (type === 2) {
		const tradition = get(state, 'SA_102') as SpecialAbilityInstance;
		switch (last(ActivatableUtils.getSids(tradition))) {
			case 2:
			case 3:
				return 'ATTR_1';
			case 1:
			case 4:
				return 'ATTR_2';
			case 5:
			case 6:
				return 'ATTR_3';
		}
	}
	return;
}
