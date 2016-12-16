import APStore from '../stores/APStore';
import iccalc from './iccalc';
import { get } from '../stores/ListStore';
import Categories from '../constants/Categories';

export const fn = req => {
	const [ id, value, ...options ] = req;
	let obj = get(id);

	switch (obj.category) {
		case Categories.ATTRIBUTES: {
			let values = Array.from({ length: value - 8 }, (v, i) => i + 8);
			obj.value = value;
			return values.map(e => iccalc(5, e)).reduce((a,b) => a + b, 0);
		}
		case Categories.ADVANTAGES:
		case Categories.DISADVANTAGES:
		case Categories.SPECIAL_ABILITIES: {
			obj.addDependencies();
			if (options.length === 0) {
				obj.activate(id);
				return obj.cost;
			} else {
				if (obj.tiers !== null && obj.tiers) {
					if (obj.max === null) {
						obj.activate(id);
						obj.tier = options[0];
						return obj.cost * options[0];
					} else {
						obj.active.push(options.reverse());
						return obj.cost * options[options.length - 1];
					}
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
			}
			break;
		}
	}

	
};

export default reqs => reqs.map(req => fn(req)).reduce((a,b) => a + b, 0);
