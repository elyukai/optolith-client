import AttributeStore from '../stores/AttributeStore';
import ELStore from '../stores/ELStore';
import { get } from '../stores/ListStore';
import PhaseStore from '../stores/PhaseStore';

export const isIncreasable = (obj: AttributeInstance): boolean => {
	if (PhaseStore.get() < 3) {
		const max = AttributeStore.getSum() >= ELStore.getStart().maxTotalAttributeValues ? 0 : ELStore.getStart().maxAttributeValue + obj.mod;
		return obj.value < max;
	}
	return true;
};

export const isDecreasable = (obj: AttributeInstance): boolean => {
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
};

export const reset = (obj: AttributeInstance): AttributeInstance => ({
	...obj,
	dependencies: [],
	mod: 0,
	value: 8,
});
