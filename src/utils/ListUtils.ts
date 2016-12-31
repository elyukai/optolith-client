import SpellsStore from '../stores/SpellsStore';

export const filter = <T>(list: T[], filterText: string, addProperty?: string): T[] => {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(obj => obj['name'] && obj['name'].toLowerCase().match(filterText) && (!addProperty || obj[addProperty].toLowerCase().match(filterText)));
	}
	return list;
};

export const sortByName = (a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

let SEX;

export const sortByNameSex = (a, b) => {
	const an = a.name[SEX] || a.name;
	const bn = b.name[SEX] || b.name;
	return an < bn ? -1 : an > bn ? 1 : 0;
};

export const sortByCost = (a, b) => a.ap < b.ap ? -1 : a.ap > b.ap ? 1 : sortByName(a,b);

export const sortByCostSex = (a, b) => a.ap < b.ap ? -1 : a.ap > b.ap ? 1 : sortByNameSex(a,b);

export const sortByGroup = (a, b) => a.gr < b.gr ? -1 : a.gr > b.gr ? 1 : sortByName(a,b);

let GROUPS;

export const sortByGroupName = (a, b) => {
	const agr = GROUPS[a.gr - 1];
	const bgr = GROUPS[b.gr - 1];
	return agr < bgr ? -1 : agr > bgr ? 1 : sortByName(a,b);
};

export const sortByIC = (a, b) => a.ic < b.ic ? -1 : a.ic > b.ic ? 1 : sortByName(a,b);

export const sortByProperty = (a, b) => {
	const PROPERTIES = SpellsStore.getPropertyNames();
	const ap = PROPERTIES[a.property - 1];
	const bp = PROPERTIES[b.property - 1];
	return ap < bp ? -1 : ap > bp ? 1 : sortByName(a,b);
};

export const sortByAspect = (a, b) => {
	return a.aspect < b.aspect ? -1 : a.aspect > b.aspect ? 1 : sortByName(a,b);
};

export const sortByPrice = (a, b) => a.price < b.price ? -1 : a.price > b.price ? 1 : sortByName(a,b);

export const sortByWeight = (a, b) => a.weight < b.weight ? -1 : a.weight > b.weight ? 1 : sortByName(a,b);

export const sortByWhere = (a, b) => a.where < b.where ? -1 : a.where > b.where ? 1 : sortByName(a,b);

export const sort = <T>(list: T[], sortOrder: string): T[] => {
	let sort;
	switch (sortOrder) {
		case 'name':
			sort = sortByName;
			break;
		case 'cost':
			sort = sortByCost;
			break;
		case 'group':
			sort = sortByGroup;
			break;
		case 'groupname':
			sort = sortByGroupName;
			break;
		case 'ic':
			sort = sortByIC;
			break;
		case 'property':
			sort = sortByProperty;
			break;
		case 'aspect':
			sort = sortByAspect;
			break;
		case 'price':
			sort = sortByPrice;
			break;
		case 'weight':
			sort = sortByWeight;
			break;
		case 'where':
			sort = sortByWhere;
			break;

		default:
			return list;
	}
	return list.sort(sort);
};

export const sortSex = <T>(list: T[], sortOrder: string, sex: string): T[] => {
	let sort;
	switch (sortOrder) {
		case 'name':
			sort = sortByNameSex;
			break;
		case 'cost':
			sort = sortByCostSex;
			break;

		default:
			return list;
	}
	SEX = sex;
	return list.sort(sort);
};

export const filterAndSort = <T>(list: T[], filterText: string, sortOrder: string, option?: any[] | string): T[] => {
	if (Array.isArray(option)) {
		GROUPS = option;
	}
	else if (typeof option === 'string') {
		return sortSex<T>(filter(list, filterText), sortOrder, option);
	}
	return sort<T>(filter(list, filterText), sortOrder);
};
