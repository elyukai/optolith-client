import { createSelector } from 'reselect';
import { Maybe, OrderedSet } from '../utils/dataUtils';
import { isActive } from '../utils/isActive';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { areAllRuleBooksEnabled, getEnabledRuleBooks, getSpecialAbilities } from './stateSelectors';

export const getRuleBooksEnabled = createSelector(
  areAllRuleBooksEnabled,
  getEnabledRuleBooks,
  (maybeAreAllRuleBooksEnabled, maybeEnabledRuleBooks) => {
    return (maybeAreAllRuleBooksEnabled as Maybe<OrderedSet<string> | boolean>)
      .alt(maybeEnabledRuleBooks);
  }
);

export const isEnableLanguageSpecializationsDeactivatable = createSelector(
  mapGetToSlice(getSpecialAbilities, 'SA_699'),
  isActive
);
