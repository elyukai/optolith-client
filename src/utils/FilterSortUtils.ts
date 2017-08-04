import { first } from 'lodash';
import { getLocale, translate } from './I18n';

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

export const sortByName = (a: PlainNameData, b: PlainNameData) => a.name.localeCompare(b.name, getLocale());

export const sortByNameSex = (a: NameBySexData, b: NameBySexData) => {
	const an = typeof a.name === 'object' ? a.name[SEX] : a.name;
	const bn = typeof b.name === 'object' ? b.name[SEX] : b.name;
	return an.localeCompare(bn, getLocale());
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
	return agr.localeCompare(bgr, getLocale()) || sortByName(a, b);
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

export const sortByWhere = (a: PlainNameData, b: PlainNameData) => a.where!.localeCompare(b.where!, getLocale()) || sortByName(a, b);

export function sort<T extends PlainNameData>(list: T[], sortOrder: string = 'name', option?: string[]): T[] {
	if (Array.isArray(option)) {
		GROUPS = option;
	}
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

export function sortByLocaleName<T extends { name: string; [key: string]: any; }>(list: T[], locale: string) {
	return list.sort((a, b) => a.name.localeCompare(b.name, locale));
}

interface BaseObject {
	name: any;
	[key: string]: any;
}

interface SortOption<T> {
	key: keyof T;
	mapToIndex?: string[];
	reverse?: boolean;
	sex?: string;
}

export function sortObjects<T extends BaseObject>(list: T[], locale: string, sortOptions: (keyof T | SortOption<T>)[] = ['name']) {
	const sortFunctions: ((a: T, b: T) => number)[] = [];
	const isSortOptionObject = (option: keyof T | SortOption<T>): option is SortOption<T> => typeof option === 'object';
	const firstItem = first(list);

	if (firstItem) {
		for (const option of sortOptions) {
			if (isSortOptionObject(option)) {
				const { key, mapToIndex, reverse, sex } = option;
				const propertyType = typeof firstItem[key];
				if (reverse === true) {
					if (propertyType === 'object' && sex !== undefined) {
						sortFunctions.push((a: T, b: T) => (a[key][sex] as string).localeCompare(b[key][sex], locale) * -1);
					}
					else if (propertyType === 'string') {
						sortFunctions.push((a: T, b: T) => (a[key] as string).localeCompare(b[key], locale) * -1);
					}
					else if (propertyType === 'number' && mapToIndex !== undefined) {
						sortFunctions.push((a: T, b: T) => (mapToIndex[a[key] as number - 1]).localeCompare(mapToIndex[b[key] as number - 1], locale) * -1);
					}
					else if (propertyType === 'number') {
						sortFunctions.push((a: T, b: T) => (b[key] as number) - (a[key] as number));
					}
				}
				else if (propertyType === 'object' && sex !== undefined) {
					sortFunctions.push((a: T, b: T) => (a[key][sex] as string).localeCompare(b[key][sex], locale));
				}
				else if (propertyType === 'string') {
					sortFunctions.push((a: T, b: T) => (a[key] as string).localeCompare(b[key], locale));
				}
				else if (propertyType === 'number' && mapToIndex !== undefined) {
					sortFunctions.push((a: T, b: T) => (mapToIndex[a[key] as number - 1]).localeCompare(mapToIndex[b[key] as number - 1], locale));
				}
				else if (propertyType === 'number') {
					sortFunctions.push((a: T, b: T) => (a[key] as number) - (b[key] as number));
				}
			}
			else {
				const propertyType = typeof firstItem[option];
				if (propertyType === 'string') {
					sortFunctions.push((a: T, b: T) => (a[option] as string).localeCompare(b[option], locale));
				}
				else if (propertyType === 'number') {
					sortFunctions.push((a: T, b: T) => (a[option] as number) - (b[option] as number));
				}
			}
		}
	}

	return list.sort((a, b) => {
		for (const compare of sortFunctions) {
			const result = compare(a, b);
			if (result !== 0) {
				return result;
			}
		}
		return 0;
	});
}

interface FilterOptions<T> {
	addProperty?: keyof T;
	keyOfName?: string;
}

export function filterObjects<T extends BaseObject>(list: T[], filterText: string, options: FilterOptions<T> = {}) {
	const { addProperty, keyOfName } = options;
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		if (addProperty) {
			return list.filter(obj => {
				if (typeof obj.name === 'string') {
					return obj.name.toLowerCase().match(filterText) && (obj[addProperty] as string).toLowerCase().match(filterText);
				}
				else if (typeof obj.name === 'object' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().match(filterText) && (obj[addProperty] as string).toLowerCase().match(filterText);
				}
				return true;
			});
		}
		return list.filter(obj => {
			if (typeof obj.name === 'string') {
				return obj.name.toLowerCase().match(filterText);
			}
			else if (typeof obj.name === 'object' && keyOfName) {
				return (obj.name[keyOfName] as string).toLowerCase().match(filterText);
			}
			return true;
		});
	}
	return list;
}

export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, sortOptions: (keyof T | SortOption<T>)[]): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, filterOptions: FilterOptions<T>): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, sortOptions: (keyof T | SortOption<T>)[], filterOptions: FilterOptions<T>): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, sortOrFilterOptions?: (keyof T | SortOption<T>)[] | FilterOptions<T>, filterOptions?: FilterOptions<T>): T[] {
	let sortOptionsFinal: (keyof T | SortOption<T>)[] | undefined;
	let filterOptionsFinal: FilterOptions<T> | undefined;
	if (Array.isArray(sortOrFilterOptions)) {
		sortOptionsFinal = sortOrFilterOptions;
	}
	else if (typeof sortOrFilterOptions === 'object') {
		filterOptionsFinal = sortOrFilterOptions;
	}
	if (filterOptions && !filterOptionsFinal) {
		filterOptionsFinal = filterOptions;
	}
	return sortObjects(filterObjects(list, filterText, filterOptionsFinal), locale, sortOptionsFinal);
}

export function sortStrings(list: string[], locale: string) {
	return list.sort((a, b) => a.localeCompare(b, locale));
}

export function filterStrings(list: string[], filterText: string) {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(e => e.toLowerCase().match(filterText));
	}
	return list;
}

export function filterAndSortStrings(list: string[], locale: string, filterText: string) {
	return sortStrings(filterStrings(list, filterText), locale);
}
