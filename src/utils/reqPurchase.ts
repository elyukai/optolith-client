import * as Categories from '../constants/Categories';
import { get } from '../stores/ListStore';
import { final } from './iccalc';

export const fn = (req: RequirementObject) => {
	const { id, sid, sid2, tier, value } = req;
	const obj = get(id as string);

	switch (obj.category) {
		case Categories.ATTRIBUTES: {
			const values: number[] = Array.from({ length: value! - 8 }, ({}, i) => i + 8);
			obj.set(value!);
			return values.map(e => final(5, e)).reduce((a, b) => a + b, 0);
		}

		case Categories.ADVANTAGES:
		case Categories.DISADVANTAGES:
		case Categories.SPECIAL_ABILITIES: {
			let cost;
			obj.addDependencies();
			obj.active.push({ sid: sid as string | number | undefined, sid2, tier });
			if (obj.tiers) {
				cost = (obj.cost as number) * tier!;
			}
			else if (obj.sel.length > 0) {
				cost = obj.sel[(sid as number) - 1].cost!;
			}
			else {
				cost = obj.cost as number;
			}
			if (cost && (obj.category === Categories.ADVANTAGES || obj.category === Categories.DISADVANTAGES)) {
				const isKar = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_12' && !!e.active);
				const isMag = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_50' && !!e.active);
				const index = isKar ? 2 : isMag ? 1 : 0;

				cost = {
					total: cost,
					adv: [0, 0, 0],
					disadv: [0, 0, 0]
				};

				if (obj.category === Categories.ADVANTAGES) {
					cost.adv[0] = cost.total;
					cost.adv[index] = cost.total;
				}
				else {
					cost.disadv[0] = cost.total;
					cost.disadv[index] = cost.total;
				}
			}
			return cost || 0;
		}
	}
	return 0;
};

const reducer = (a: ProfessionDependencyCost, b: number | ProfessionDependencyCost): ProfessionDependencyCost => {
	if (typeof b === 'number') {
		a.total += b;
	}
	else {
		a.total += b.total;
		a.adv = a.adv.map((e, i) => e + b.adv[i]);
		a.disadv = a.disadv.map((e, i) => e + b.disadv[i]);
	}
	return a;
};

export default (reqs: RequirementObject[]): ProfessionDependencyCost => {
	const allCosts = reqs.map(req => fn(req));
	return allCosts.reduce<ProfessionDependencyCost>(reducer, {
		total: 0,
		adv: [0, 0, 0],
		disadv: [0, 0, 0]
	});
};
