import { createSelector } from 'reselect';
import { areAllRuleBooksEnabled, getEnabledRuleBooks } from './stateSelectors';

export const getRuleBooksEnabled = createSelector(
	areAllRuleBooksEnabled,
	getEnabledRuleBooks,
	(areAllRuleBooksEnabled, getEnabledRuleBooks) => {
		return areAllRuleBooksEnabled || getEnabledRuleBooks;
	}
);
