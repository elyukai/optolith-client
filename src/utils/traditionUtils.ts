import R from 'ramda';
import { ActivatableDependent } from '../types/data.d';
import { SpecialAbility } from '../types/wiki';
import { List, Maybe, ReadMap } from './dataUtils';
import { isBlessedTraditionId, isMagicalTraditionId } from './IDUtils';
import { isActive } from './isActive';

const isActiveMagicalTradition = (e: ActivatableDependent) => {
  return isMagicalTraditionId(e.id) && isActive(Maybe.of(e));
};

const isActiveBlessedTradition = (e: ActivatableDependent) => {
  return isBlessedTraditionId(e.id) && isActive(Maybe.of(e));
};

/**
 * Get magical traditions' dependent entries.
 * @param list
 */
export const getMagicalTraditions =
  (list: ReadMap<string, ActivatableDependent>) =>
    list.elems().filter(isActiveMagicalTradition);


/**
 * Get magical traditions' wiki entries.
 * @param wiki
 * @param list
 */
export const getMagicalTraditionsFromWiki = (
  wiki: ReadMap<string, SpecialAbility>,
  list: ReadMap<string, ActivatableDependent>,
): List<SpecialAbility> => R.pipe(
  getMagicalTraditions,
  Maybe.mapMaybe(e => wiki.lookup(e.id)),
)(list);

/**
 * Get blessed tradition's' dependent entry.
 * @param list
 */
export const getBlessedTradition =
  (list: ReadMap<string, ActivatableDependent>) =>
    list.elems().find(isActiveBlessedTradition);

/**
 * Get blessed tradition's' wiki entry.
 * @param wiki
 * @param list
 */
export const getBlessedTraditionFromWiki = (
  wiki: ReadMap<string, SpecialAbility>,
  list: ReadMap<string, ActivatableDependent>,
) => getBlessedTradition(list).bind(e => wiki.lookup(e.id));
