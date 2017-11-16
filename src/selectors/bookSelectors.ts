import { createSelector } from 'reselect';
import { sortObjects } from '../utils/FilterSortUtils';
import { getBooks, getLocaleAsProp } from './stateSelectors';

export const getSortedBooks = createSelector(
	getBooks,
	getLocaleAsProp,
	(books, locale) => sortObjects([...books.values()], locale.id, 'id')
);
