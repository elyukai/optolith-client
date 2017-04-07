import APStore from '../stores/APStore';
import AttributeStore from '../stores/AttributeStore';
import ELStore from '../stores/ELStore';
import { get } from '../stores/ListStore';
import PhaseStore from '../stores/PhaseStore';
import RulesStore from '../stores/RulesStore';
import calcEL from '../utils/calcEL';

export function isIncreasable(obj: AttributeInstance): boolean {
	if (PhaseStore.get() < 3) {
		const max = AttributeStore.getSum() >= ELStore.getStart().maxTotalAttributeValues ? 0 : ELStore.getStart().maxAttributeValue + obj.mod;
		return obj.value < max;
	}
	else if (RulesStore.getAttributeValueLimit()) {
		const currentAp = APStore.getTotal();
		const currentElId = calcEL(currentAp);
		const currentEl = ELStore.get(currentElId);
		return obj.value < currentEl.maxAttributeValue + 2;
	}
	return true;
}

export function isDecreasable(obj: AttributeInstance): boolean {
	const dependencies = obj.dependencies.map(e => {
		if (typeof e !== 'number') {
			const target = get(e.origin) as SpecialAbilityInstance;
			const req = target.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => (get(id) as TalentInstance).value >= e.value);
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
