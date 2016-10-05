import APStore from '../stores/APStore';
import ListStore from '../stores/ListStore';

export const fn = req => {
	const [ id, value, ...options ] = req;
	let obj = ListStore.get(id);

	switch (obj.category) {
		case 'attributes': {
			let values = Array.from({ length: value - 8 }, (v, i) => i + 8);
			ListStore.addToProperty(id, 'value', value - 8);
			return values.map(e => APStore.getCosts(e, 5)).reduce((a,b) => a + b, 0);
		}
		case 'adv':
		case 'disadv':
		case 'special': {
			ListStore.addDependencies(obj.req);
			if (options.length === 0) {
				ListStore.activate(id);
				return obj.ap;
			} else {
				if (obj.tiers !== null && obj.tiers) {
					if (obj.max === null) {
						ListStore.activate(id);
						obj.tier = options[0];
						return obj.ap * options[0];
					} else {
						obj.active.push(options.reverse());
						return obj.ap * options[options.length - 1];
					}
				} else if (obj.sel.length > 0) {
					if (obj.max === null) {
						ListStore.activate(id);
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
