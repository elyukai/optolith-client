import { Book, SourceLink } from '../types/wiki';
import { List, OrderedMap, OrderedSet, Record } from './dataUtils';

export const isCoreBook = (src: Record<SourceLink>) =>
  ['US25001', 'US25002'].includes (src.get ('id'));

interface ObjectWithSource {
  src: List<Record<SourceLink>>;
  [key: string]: any;
}

/**
 * Use because `entry.get('src')` does not work
 */
const getSourceLinks = (entry: any): List<Record<SourceLink>> =>
  entry.get ('src' as any);

/**
 * Use because `entry.get('stateEntry')` does not work
 */
const getInstance = <T extends ObjectWithSource>(entry: any): Record<T> =>
  entry.get ('stateEntry' as any);

/**
 * Use for combination of `getInstance` and `getSourceLinks`
 */
const getSourceLinksFromInstance = (entry: any): List<Record<SourceLink>> =>
  getSourceLinks (getInstance (entry));

/**
 * Returns if the given entry is available.
 * @param availablility The availability state.
 */
export const isAvailable =
  <T extends ObjectWithSource>(availablility: boolean | OrderedSet<string>) =>
    (entry: Record<T>) => {
      if (typeof availablility === 'boolean') {
        return availablility === true;
      }

      return getSourceLinks (entry).any (
        s => availablility.member (s.get ('id')) || isCoreBook (s)
      );
    };

/**
 * Returns if the given entry is from a core rule book.
 * @param entry The entry.
 */
export const isEntryFromCoreBook = <T extends ObjectWithSource>(entry: Record<T>) => {
  return getSourceLinks (entry).any (isCoreBook);
};

/**
 * Filters a list with `SourceLink`s by availability.
 * @param list A list with `SourceLink`s.
 * @param availablility The availability state.
 * @param or An additional function to state the entry should be still shown.
 */
export const filterByAvailability = <T extends ObjectWithSource>(
  list: List<Record<T>>,
  availablility: boolean | OrderedSet<string>,
  or?: (obj: Record<T>) => boolean
) => {
  if (or) {
    return list.filter (
      e => getSourceLinks (e).null () || isAvailable<T> (availablility) (e) || or (e)
    );
  }

  return list.filter (
    e => getSourceLinks (e).null () || isAvailable<T> (availablility) (e)
  );
};

export interface ObjectWithStateEntry {
  stateEntry: Record<ObjectWithSource>;
  [key: string]: any;
}

/**
 * Filters a list of objects with an `instance` property containing
 * `SourceLink`s by availability.
 * @param list A list of objects with an `instance` property containing
 * `SourceLink`s.
 * @param availablility The availability state.
 * @param or An additional function to state the entry should be still shown.
 */
export const filterByInstancePropertyAvailability = <T extends ObjectWithStateEntry>(
  list: List<Record<T>>,
  availablility: boolean | OrderedSet<string>,
  or?: (obj: Record<T>) => boolean
) => {
  if (or) {
    return list.filter (
      e => getSourceLinksFromInstance (e).null ()
        || isAvailable (availablility) (getInstance (e))
        || or (e)
    );
  }

  return list.filter (
    e => getSourceLinksFromInstance (e).null ()
      || isAvailable (availablility) (getInstance (e))
  );
};

/**
 * Returns if a book is currently enabled or not.
 * @param books All available books for the selected language.
 * @param availableBooks The current selection of enabled books or if all books
 * are enabled.
 * @param id The book's id.
 */
export const isBookEnabled = (books: OrderedMap<string, Record<Book>>) =>
  (availableBooks: true | OrderedSet<string>) =>
  (id: string) =>
    availableBooks === true ? books.member (id) : availableBooks.member (id);
