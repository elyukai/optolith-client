import { final } from './iccalc';
import { get } from '../stores/ListStore';
import Categories from '../constants/Categories';

export const fn = (req: RequirementObject) => {
	const { id, active, sid, sid2, tier, value, type } = req;
	const obj = get(id);

	switch (obj.category) {
		case Categories.ATTRIBUTES: {
			const values: number[] = Array.from({ length: (value as number) - 8 }, ({}, i) => i + 8);
			obj.set(value as number);
			return values.map(e => final(5, e)).reduce((a, b) => a + b, 0);
		}

		case Categories.ADVANTAGES:
		case Categories.DISADVANTAGES:
		case Categories.SPECIAL_ABILITIES: {
			obj.addDependencies();
			if (obj.tiers) {
				obj.active.push();
				return obj.cost * options[options.length - 1];
			} else if (obj.sel.length > 0) {
				if (obj.max === null) {
					obj.activate(id);
					obj.sid = options[0];
					return obj.sel[options[0] - 1][2];
				} else if (options.length > 1) {
					obj.active.push(options.reverse());
					return obj.sel[options.length - 2][2];
				} else {
					obj.active.push(options[0]);
					return obj.sel[options[0] - 1][2];
				}
			}
			break;
		}

		default:
			return 0;
	}
};

export default (reqs: RequirementObject[]) => reqs.map(req => fn(req)).reduce((a, b) => a + b, 0);
