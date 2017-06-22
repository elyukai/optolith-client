import * as Categories from '../constants/Categories';
import * as Data from '../types/data.d';

export function clear(list: Data.AllInstancesList) {
	return new Map([...list].map((e): [string, Data.Instance] => {
		const [id, entry] = e;
		if (entry.category === Categories.ATTRIBUTES) {
			return [id, {...entry, dependencies: [], value: 8, mod: 0}];
		}
		else if (entry.category === Categories.COMBAT_TECHNIQUES) {
			return [id, {...entry, dependencies: [], value: 6}];
		}
		else if (entry.category === Categories.LITURGIES || entry.category === Categories.SPELLS) {
			return [id, {...entry, dependencies: [], value: 0, active: false}];
		}
		else if (entry.category === Categories.BLESSINGS || entry.category === Categories.CANTRIPS) {
			return [id, {...entry, dependencies: [], active: false}];
		}
		else if (entry.category === Categories.TALENTS) {
			return [id, {...entry, dependencies: [], value: 0}];
		}
		else if (entry.category === Categories.ADVANTAGES || entry.category === Categories.DISADVANTAGES || entry.category === Categories.SPECIAL_ABILITIES) {
			return [id, {...entry, dependencies: [], active: []}];
		}
		return e;
	}));
}
