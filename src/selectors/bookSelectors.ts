import { createMaybeSelector } from '../utils/createMaybeSelector';
import { sortObjects } from '../utils/FilterSortUtils';
import { getLocaleAsProp, getWikiBooks } from './stateSelectors';

export const getSortedBooks = createMaybeSelector (
  getWikiBooks,
  getLocaleAsProp,
  (books, locale) => sortObjects (books.elems (), locale.get ('id'), 'id')
);
