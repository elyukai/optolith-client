import * as Wiki from '../../types/wiki';
import { isSpecialAbility } from '../WikiUtils';

export const isCombatStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    isSpecialAbility (e) && [9, 10].includes (e.get ('gr'));

export const isMagicalStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    isSpecialAbility (e) && e.get ('gr') === 13;

export const isBlessedStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    isSpecialAbility (e) && e.get ('gr') === 25;

/**
 * Returns if the given entry is an extended (combat/magical/blessed) special
 * ability.
 * @param entry The instance.
 */
export const isExtendedSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    isSpecialAbility (e) && [11, 14, 26].includes (e.get ('gr'));
