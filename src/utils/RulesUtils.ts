import { SourceLink } from '../types/data';
import { Book } from '../types/wiki';

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
 * Returns if the given entry is from a core rule book.
 * @param entry The entry.
 */
export const isEntryFromCoreBook = <T extends ObjectWithSource>(entry: T) => {
	return entry.src.some(s => isCoreBook(s));
};

/**
 * Filters a list with `SourceLink`s by availability.
 * @param list A list with `SourceLink`s.
 * @param availablility The availability state.
 * @param or An additional function to state the entry should be still shown.
 */
export const filterByAvailability = <T extends ObjectWithSource>(list: T[], availablility: boolean | Set<string>, or?: (obj: T) => boolean) => {
	if (or) {
		return list.filter(e => e.src.length === 0 || isAvailable(availablility)(e) || or(e));
	}
	return list.filter(e => e.src.length === 0 || isAvailable(availablility)(e));
};

interface ObjectWithInstance {
	instance: ObjectWithSource;
	[key: string]: any;
}

/**
 * Filters a list of objects with an `instance` property containing `SourceLink`s by availability.
 * @param list A list of objects with an `instance` property containing `SourceLink`s.
 * @param availablility The availability state.
 * @param or An additional function to state the entry should be still shown.
 */
export const filterByInstancePropertyAvailability = <T extends ObjectWithInstance>(list: T[], availablility: boolean | Set<string>, or?: (obj: T) => boolean) => {
	if (or) {
		return list.filter(e => e.instance.src.length === 0 || isAvailable(availablility)(e.instance) || or(e));
	}
	return list.filter(e => e.instance.src.length === 0 || isAvailable(availablility)(e.instance));
};

/**
 * Returns if a book is currently enabled or not.
 * @param books All available books for the selected language.
 * @param availableBooks The current selection of enabled books or if all books
 * are enabled.
 * @param id The book's id.
 */
export function isBookEnabled(
	books: Map<string, Book>,
	availableBooks: true | Set<string>,
	id: string,
): boolean {
	if (availableBooks === true) {
		return books.has(id);
	}
	return availableBooks.has(id);
}
