import { Categories } from '../constants/Categories';
import * as Wiki from '../types/wiki.d';

export const isCombatStyleSpecialAbility = (e: Wiki.EntryWithCategory) => {
  return e.category === Categories.SPECIAL_ABILITIES && [9, 10].includes(e.gr);
};

export const isMagicalStyleSpecialAbility = (e: Wiki.EntryWithCategory) => {
  return e.category === Categories.SPECIAL_ABILITIES && e.gr === 13;
};

export const isBlessedStyleSpecialAbility = (e: Wiki.EntryWithCategory) => {
  return e.category === Categories.SPECIAL_ABILITIES && e.gr === 25;
};

/**
 * Returns if the given entry is an extended (combat/magical/blessed) special ability.
 * @param entry The instance.
 */
export const isExtendedSpecialAbility = (e: Wiki.EntryWithCategory) => {
  return e.category === 'SPECIAL_ABILITIES' && [11, 14, 26].includes(e.gr);
}
