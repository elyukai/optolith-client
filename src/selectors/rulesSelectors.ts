import { createSelector } from 'reselect';
import { isActive } from '../utils/ActivatableUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { areAllRuleBooksEnabled, getEnabledRuleBooks, getSpecialAbilities } from './stateSelectors';

export const getRuleBooksEnabled = createSelector(
	areAllRuleBooksEnabled,
	getEnabledRuleBooks,
	(areAllRuleBooksEnabled, getEnabledRuleBooks) => {
		return areAllRuleBooksEnabled || getEnabledRuleBooks;
	}
);

export const isEnableLanguageSpecializationsDeactivatable = createSelector(
	mapGetToSlice(getSpecialAbilities, 'SA_699'),
	languageSpecialization => {
		return isActive(languageSpecialization);
	}
);
