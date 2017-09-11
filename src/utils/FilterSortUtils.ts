import { first } from 'lodash';

export function sortByLocaleName<T extends { name: string; [key: string]: any; }>(list: T[], locale: string) {
	return list.sort((a, b) => a.name.localeCompare(b.name, locale));
}

interface BaseObject {
	name: any;
	[key: string]: any;
}

interface SortOption<T> {
	key: keyof T | ((object: T) => any);
	keyOfProperty?: string;
	mapToIndex?: string[];
	reverse?: boolean;
}

export function sortObjects<T extends BaseObject>(list: T[], locale: string, sortOptions: (keyof T | SortOption<T>)[] = ['name']) {
	const sortFunctions: ((a: T, b: T) => number)[] = [];
	const isSortOptionObject = (option: keyof T | SortOption<T>): option is SortOption<T> => typeof option === 'object';
	const firstItem = first(list);

	if (firstItem) {
		for (const option of sortOptions) {
			if (isSortOptionObject(option)) {
				const { key, mapToIndex, reverse, keyOfProperty } = option;
				const propertyType = typeof key === 'function' ? typeof (key as (object: T) => any)(firstItem) : typeof firstItem[key];
				if (reverse === true) {
					if (typeof key === 'function') {
						if (propertyType === 'string') {
							sortFunctions.push((a: T, b: T) => ((key as (object: T) => any)(a) as string).localeCompare((key as (object: T) => any)(b), locale) * -1);
						}
						else if (propertyType === 'number') {
							sortFunctions.push((a: T, b: T) => ((key as (object: T) => any)(b) as number) - ((key as (object: T) => any)(a) as number));
						}
					}
					else if (keyOfProperty !== undefined) {
						sortFunctions.push((a: T, b: T) => (typeof a[key] === 'object' ? a[key][keyOfProperty] as string : a[key] as string).localeCompare((typeof b[key] === 'object' ? b[key][keyOfProperty] as string : b[key] as string), locale) * -1);
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
				else if (typeof key === 'function') {
					if (propertyType === 'string') {
						sortFunctions.push((a: T, b: T) => ((key as (object: T) => any)(a) as string).localeCompare((key as (object: T) => any)(b), locale));
					}
					else if (propertyType === 'number') {
						sortFunctions.push((a: T, b: T) => ((key as (object: T) => any)(a) as number) - ((key as (object: T) => any)(b) as number));
					}
				}
				else if (keyOfProperty !== undefined) {
					sortFunctions.push((a: T, b: T) => (typeof a[key] === 'object' ? a[key][keyOfProperty] as string : a[key] as string).localeCompare((typeof b[key] === 'object' ? b[key][keyOfProperty] as string : b[key] as string), locale));
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
				if (typeof obj.name === 'object' && typeof obj[addProperty] === 'object' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().match(filterText) || (obj[addProperty][keyOfName] as string).toLowerCase().match(filterText);
				}
				else if (typeof obj.name === 'object' && typeof obj[addProperty] === 'string' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().match(filterText) || (obj[addProperty] as string).toLowerCase().match(filterText);
				}
				else if (typeof obj.name === 'string' && typeof obj[addProperty] === 'object' && keyOfName) {
					return obj.name.toLowerCase().match(filterText) || (obj[addProperty][keyOfName] as string).toLowerCase().match(filterText);
				}
				else if (typeof obj.name === 'string' && typeof obj[addProperty] === 'string') {
					return obj.name.toLowerCase().match(filterText) || (obj[addProperty] as string).toLowerCase().match(filterText);
				}
				else if (typeof obj.name === 'object' && keyOfName) {
					return (obj.name[keyOfName] as string).toLowerCase().match(filterText);
				}
				else if (typeof obj.name === 'string') {
					return obj.name.toLowerCase().match(filterText);
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
