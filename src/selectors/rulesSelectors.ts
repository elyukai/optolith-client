import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, OrderedSet } from '../utils/dataUtils';
import { isActive } from '../utils/isActive';
import { mapGetToMaybeSlice } from '../utils/SelectorsUtils';
import { getAreAllRuleBooksEnabled, getEnabledRuleBooks, getSpecialAbilities } from './stateSelectors';

export const getRuleBooksEnabled = createMaybeSelector (
  getAreAllRuleBooksEnabled,
  getEnabledRuleBooks,
  (maybeAreAllRuleBooksEnabled, maybeEnabledRuleBooks) =>
    maybeAreAllRuleBooksEnabled.bind<true | OrderedSet<string>> (
      areAllRuleBooksEnabled => areAllRuleBooksEnabled ? Just<true> (true) : maybeEnabledRuleBooks
    )
);

export const isEnableLanguageSpecializationsDeactivatable = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_699'),
  isActive
);
