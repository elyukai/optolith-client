import { first } from 'lodash';

export interface BaseObject {
	name: any;
	[key: string]: any;
}

export type AllSortOptions<T> = (keyof T | SortOption<T>)[] | keyof T | SortOption<T>;

export interface SortOption<T> {
	key: keyof T | ((object: T) => any);
	keyOfProperty?: string;
	mapToIndex?: string[];
	reverse?: boolean;
}

export function sortObjects<T extends BaseObject>(list: T[], locale: string, sortOptions: AllSortOptions<T> = 'name') {
	if (list.length < 2) {
		return list;
	}

	const sortFunctions: ((a: T, b: T) => number)[] = [];
	const firstItem = first(list);

	if (firstItem) {
		if (Array.isArray(sortOptions)) {
			for (const option of sortOptions) {
				const sortFunction = createSortFunction(option, firstItem, locale);
				if (sortFunction) {
					sortFunctions.push(sortFunction);
				}
			}
		}
		else {
			const sortFunction = createSortFunction(sortOptions, firstItem, locale);
			if (sortFunction) {
				sortFunctions.push(sortFunction);
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

export interface FilterOptions<T> {
	addProperty?: keyof T;
	keyOfName?: string;
}

export function filterObjects<T extends BaseObject>(list: T[], filterText: string, options: FilterOptions<T> = {}) {
	const { addProperty, keyOfName } = options;
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		if (addProperty) {
			return list.filter(obj => {
				if (typeof obj.name === 'object' && typeof obj[addProperty] === 'object' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().includes(filterText) || (obj[addProperty][keyOfName] as string).toLowerCase().includes(filterText);
				}
				else if (typeof obj.name === 'object' && typeof obj[addProperty] === 'string' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().includes(filterText) || (obj[addProperty] as string).toLowerCase().includes(filterText);
				}
				else if (typeof obj.name === 'string' && typeof obj[addProperty] === 'object' && keyOfName) {
					return obj.name.toLowerCase().includes(filterText) || (obj[addProperty][keyOfName] as string).toLowerCase().includes(filterText);
				}
				else if (typeof obj.name === 'string' && typeof obj[addProperty] === 'string') {
					return obj.name.toLowerCase().includes(filterText) || (obj[addProperty] as string).toLowerCase().includes(filterText);
				}
				else if (typeof obj.name === 'object' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().includes(filterText);
				}
				else if (typeof obj.name === 'string') {
					return obj.name.toLowerCase().includes(filterText);
				}
				return true;
			});
		}
		return list.filter(obj => {
			if (typeof obj.name === 'string') {
				return obj.name.toLowerCase().includes(filterText);
			}
			else if (typeof obj.name === 'object' && keyOfName) {
				return (obj.name[keyOfName] as string).toLowerCase().includes(filterText);
			}
			return true;
		});
	}
	return list;
}

function isSortOptionType<T>(test: AllSortOptions<T> | FilterOptions<T> | undefined): test is AllSortOptions<T> {
	return Array.isArray(test) || typeof test === 'string' || typeof test === 'object' && test.hasOwnProperty('key');
}

export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, sortOptions: AllSortOptions<T>): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, filterOptions: FilterOptions<T>): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, sortOptions: AllSortOptions<T>, filterOptions: FilterOptions<T>): T[];
export function filterAndSortObjects<T extends BaseObject>(list: T[], locale: string, filterText: string, sortOrFilterOptions?: AllSortOptions<T> | FilterOptions<T>, filterOptions?: FilterOptions<T>): T[] {
	let sortOptionsFinal: AllSortOptions<T> | undefined;
	let filterOptionsFinal: FilterOptions<T> | undefined;
	if (isSortOptionType(sortOrFilterOptions)) {
		sortOptionsFinal = sortOrFilterOptions;
	}
	else if (sortOrFilterOptions !== undefined) {
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
		return list.filter(e => e.toLowerCase().includes(filterText));
	}
	return list;
}

export function filterAndSortStrings(list: string[], locale: string, filterText: string) {
	return sortStrings(filterStrings(list, filterText), locale);
}

const isSortOptionObject = <T extends BaseObject>(option: keyof T | SortOption<T>): option is SortOption<T> => typeof option === 'object';

function createSortFunction<T extends BaseObject>(option: keyof T | SortOption<T>, firstItem: T, locale: string): ((a: T, b: T) => number) | undefined {
	if (isSortOptionObject(option)) {
		const { key, mapToIndex, reverse, keyOfProperty } = option;
		const propertyType = typeof key === 'function' ? typeof (key as (object: T) => any)(firstItem) : typeof firstItem[key];
		if (reverse === true) {
			if (typeof key === 'function') {
				if (propertyType === 'string') {
					return (a: T, b: T) => ((key as (object: T) => any)(a) as string).localeCompare((key as (object: T) => any)(b), locale) * -1;
				}
				else if (propertyType === 'number') {
					return (a: T, b: T) => ((key as (object: T) => any)(b) as number) - ((key as (object: T) => any)(a) as number);
				}
			}
			else if (keyOfProperty !== undefined) {
				return (a: T, b: T) => (typeof a[key] === 'object' ? a[key][keyOfProperty] as string : a[key] as string).localeCompare((typeof b[key] === 'object' ? b[key][keyOfProperty] as string : b[key] as string), locale) * -1;
			}
			else if (propertyType === 'string') {
				return (a: T, b: T) => (a[key] as string).localeCompare(b[key], locale) * -1;
			}
			else if (propertyType === 'number' && mapToIndex !== undefined) {
				return (a: T, b: T) => (mapToIndex[a[key] as number - 1]).localeCompare(mapToIndex[b[key] as number - 1], locale) * -1;
			}
			else if (propertyType === 'number') {
				return (a: T, b: T) => (b[key] as number) - (a[key] as number);
			}
		}
		else if (typeof key === 'function') {
			if (propertyType === 'string') {
				return (a: T, b: T) => ((key as (object: T) => any)(a) as string).localeCompare((key as (object: T) => any)(b), locale);
			}
			else if (propertyType === 'number') {
				return (a: T, b: T) => ((key as (object: T) => any)(a) as number) - ((key as (object: T) => any)(b) as number);
			}
		}
		else if (keyOfProperty !== undefined) {
			return (a: T, b: T) => (typeof a[key] === 'object' ? a[key][keyOfProperty] as string : a[key] as string).localeCompare((typeof b[key] === 'object' ? b[key][keyOfProperty] as string : b[key] as string), locale);
		}
		else if (propertyType === 'string') {
			return (a: T, b: T) => (a[key] as string).localeCompare(b[key], locale);
		}
		else if (propertyType === 'number' && mapToIndex !== undefined) {
			return (a: T, b: T) => (mapToIndex[a[key] as number - 1]).localeCompare(mapToIndex[b[key] as number - 1], locale);
		}
		else if (propertyType === 'number') {
			return (a: T, b: T) => (a[key] as number) - (b[key] as number);
		}
	}
	else {
		const propertyType = typeof firstItem[option];
		if (propertyType === 'string') {
			return (a: T, b: T) => (a[option] as string).localeCompare(b[option], locale);
		}
		else if (propertyType === 'number') {
			return (a: T, b: T) => (a[option] as number) - (b[option] as number);
		}
	}
	return;
}
