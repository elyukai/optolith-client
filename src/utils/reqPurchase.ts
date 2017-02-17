import { final } from './iccalc';
import { get } from '../stores/ListStore';
import * as Categories from '../constants/Categories';

export const fn = (req: RequirementObject) => {
	const { id, sid, sid2, tier, value } = req;
	const obj = get(id);

	switch (obj.category) {
		case Categories.ATTRIBUTES: {
			const values: number[] = Array.from({ length: value! - 8 }, ({}, i) => i + 8);
			obj.set(value!);
			return values.map(e => final(5, e)).reduce((a, b) => a + b, 0);
		}

		case Categories.ADVANTAGES:
		case Categories.DISADVANTAGES:
		case Categories.SPECIAL_ABILITIES: {
			obj.addDependencies();
			obj.active.push({ sid: sid as string | number | undefined, sid2, tier });
			if (obj.tiers) {
				return (obj.cost as number) * tier!;
			} else if (obj.sel.length > 0) {
				return obj.sel[(sid as number) - 1].cost!;
			}
			break;
		}
	}
	return 0;
};

export default (reqs: RequirementObject[]) => reqs.map(req => fn(req)).reduce((a, b) => a + b, 0);
