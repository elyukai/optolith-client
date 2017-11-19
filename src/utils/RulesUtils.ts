import { SourceLink } from '../types/data';

export const isCoreBook = (src: SourceLink) => ['US25001', 'US25002'].includes(src.id);

interface ObjectWithSource {
	src: SourceLink[];
	[key: string]: any;
}

/**
 * Returns if the given entry is available.
 * @param availablility The availability state.
 */
export const isAvailable = <T extends ObjectWithSource>(availablility: boolean | Set<string>) => (entry: T) => {
	if (typeof availablility === 'boolean') {
		return availablility === true;
	}
	return entry.src.some(s => availablility.has(s.id) || isCoreBook(s));
};

/**
 * Filters a list with `SourceLink`s by availability.
 * @param list A list with `SourceLink`s.
 * @param availablility The availability state.
 */
export const filterByAvailability = <T extends ObjectWithSource>(list: T[], availablility: boolean | Set<string>) => {
	return list.filter(isAvailable(availablility));
};
