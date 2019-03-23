import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { sortObjects } from '../Utilities/FilterSortUtils';
import { getLocaleAsProp, getWikiBooks } from './stateSelectors';

export const getSortedBooks = createMaybeSelector (
  getWikiBooks,
  getLocaleAsProp,
  (books, locale) => sortObjects (books.elems (), locale.get ('id'), 'id')
);
