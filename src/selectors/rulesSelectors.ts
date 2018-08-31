import { createSelector } from 'reselect';
import { Just, OrderedSet } from '../utils/dataUtils';
import { isActive } from '../utils/isActive';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getAreAllRuleBooksEnabled, getEnabledRuleBooks, getSpecialAbilities } from './stateSelectors';

export const getRuleBooksEnabled = createSelector (
  getAreAllRuleBooksEnabled,
  getEnabledRuleBooks,
  (maybeAreAllRuleBooksEnabled, maybeEnabledRuleBooks) =>
    maybeAreAllRuleBooksEnabled.bind<true | OrderedSet<string>> (
      areAllRuleBooksEnabled => areAllRuleBooksEnabled ? Just<true> (true) : maybeEnabledRuleBooks
    )
);

export const isEnableLanguageSpecializationsDeactivatable = createSelector (
  mapGetToSlice (getSpecialAbilities, 'SA_699'),
  isActive
);
