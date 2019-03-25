import { bindF, Just, Maybe } from "../../Data/Maybe";
import { OrderedSet } from "../../Data/OrderedSet";
import { uncurryN } from "../../Data/Pair";
import { isMaybeActive } from "../Utilities/Activatable/isActive";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { prefixSA } from "../Utilities/IDUtils";
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils";
import { getAreAllRuleBooksEnabled, getEnabledRuleBooks, getSpecialAbilities } from "./stateSelectors";

export const getRuleBooksEnabled = createMaybeSelector (
  getEnabledRuleBooks,
  getAreAllRuleBooksEnabled,
  uncurryN (menabledBooks =>
             bindF ((areAllEnabled): Maybe<true | OrderedSet<string>> => areAllEnabled
                                                                           ? Just<true> (true)
                                                                           : menabledBooks))
)

export const isEnableLanguageSpecializationsDeactivatable = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities) (prefixSA (699)),
  isMaybeActive
)
