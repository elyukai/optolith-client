import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { mapGetToMaybeSlice } from '../App/Utils/SelectorsUtils';
import { isActive } from '../utils/activatable/isActive';
import { Just, OrderedSet } from '../utils/dataUtils';
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