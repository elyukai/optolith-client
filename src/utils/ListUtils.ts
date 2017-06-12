import { translate } from './I18n';

interface Data {
	ap?: number;
	gr?: number;
	ic?: number;
	property?: number;
	aspect?: number[];
	price?: number;
	weight?: number;
	where?: string;
	[id: string]: any;
}

interface PlainNameData extends Data {
	name: string;
}

interface NameBySexData extends Data {
	name: string | {
		m: string;
		f: string;
	};
}

export function filter(list: PlainNameData[], filterText: string, addProperty?: string): PlainNameData[] {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(obj => obj.name.toLowerCase().match(filterText) && (!addProperty || (obj[addProperty] as string).toLowerCase().match(filterText)));
	}
	return list;
}

let SEX: 'm' | 'f';

export function filterSex(list: NameBySexData[], filterText: string, addProperty?: string): NameBySexData[] {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(obj => (typeof obj.name === 'object' ? obj.name[SEX] : obj.name).toLowerCase().match(filterText) && (!addProperty || (typeof obj[addProperty] === 'object' ? obj[addProperty][SEX] as string : obj.name as string).toLowerCase().match(filterText)));
	}
	return list;
}

export const sortByName = (a: PlainNameData, b: PlainNameData) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

export const sortByNameSex = (a: NameBySexData, b: NameBySexData) => {
	const an = typeof a.name === 'object' ? a.name[SEX] : a.name;
	const bn = typeof b.name === 'object' ? b.name[SEX] : b.name;
	return an < bn ? -1 : an > bn ? 1 : 0;
};

export const sortByCost = (a: PlainNameData, b: PlainNameData) => a.ap! < b.ap! ? -1 : a.ap! > b.ap! ? 1 : sortByName(a, b);

export const sortByCostSex = (a: NameBySexData, b: NameBySexData) => a.ap! < b.ap! ? -1 : a.ap! > b.ap! ? 1 : sortByNameSex(a, b);

export const sortByGroup = (a: PlainNameData, b: PlainNameData) => {
	if (!a.gr && !b.gr) {
		return sortByName(a, b);
	}
	else if (!a.gr) {
		return 1;
	}
	else if (!b.gr) {
		return -1;
	}
	return a.gr < b.gr ? -1 : a.gr > b.gr ? 1 : sortByName(a, b);
};

let GROUPS: string[];

export const sortByGroupName = (a: PlainNameData, b: PlainNameData) => {
	const agr = GROUPS[a.gr! - 1];
	const bgr = GROUPS[b.gr! - 1];
	return agr < bgr ? -1 : agr > bgr ? 1 : sortByName(a, b);
};

export const sortByIC = (a: PlainNameData, b: PlainNameData) => a.ic! < b.ic! ? -1 : a.ic! > b.ic! ? 1 : sortByName(a, b);

export const sortByProperty = (a: PlainNameData, b: PlainNameData) => {
	const PROPERTIES = translate('spells.view.properties');
	const ap = PROPERTIES[a.property! - 1];
	const bp = PROPERTIES[b.property! - 1];
	return ap < bp ? -1 : ap > bp ? 1 : sortByName(a, b);
};

export const sortByAspect = (a: PlainNameData, b: PlainNameData) => {
	return a.aspect! < b.aspect! ? -1 : a.aspect! > b.aspect! ? 1 : sortByName(a, b);
};

export const sortByPrice = (a: PlainNameData, b: PlainNameData) => a.price! < b.price! ? -1 : a.price! > b.price! ? 1 : sortByName(a, b);

export const sortByWeight = (a: PlainNameData, b: PlainNameData) => a.weight! < b.weight! ? -1 : a.weight! > b.weight! ? 1 : sortByName(a, b);

export const sortByWhere = (a: PlainNameData, b: PlainNameData) => a.where! < b.where! ? -1 : a.where! > b.where! ? 1 : sortByName(a, b);

export function sort<T extends PlainNameData>(list: T[], sortOrder: string = 'name'): T[] {
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
}

export function sortSex(list: NameBySexData[], sortOrder: string = 'name'): NameBySexData[] {
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
	return list.sort(sort);
}

export function filterAndSort<T>(list: T[], filterText: string, sortOrder?: string, option?: string[] | 'm' | 'f'): T[] {
	if (Array.isArray(option)) {
		GROUPS = option;
	}
	else if (typeof option === 'string') {
		SEX = option;
		return sortSex(filterSex(list as any, filterText), sortOrder) as any;
	}
	return sort(filter(list as any, filterText), sortOrder) as any;
}
