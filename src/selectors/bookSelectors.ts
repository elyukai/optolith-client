import { createSelector } from 'reselect';
import { sortObjects } from '../utils/FilterSortUtils';
import { getLocaleAsProp, getWikiBooks } from './stateSelectors';

export const getSortedBooks = createSelector(
	getWikiBooks,
	getLocaleAsProp,
	(books, locale) => sortObjects([...books.values()], locale.id, 'id')
);
