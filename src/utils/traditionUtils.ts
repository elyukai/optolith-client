import R from 'ramda';
import { ActivatableDependent } from '../types/data.d';
import { SpecialAbility } from '../types/wiki';
import { isBlessedTraditionId, isMagicalTraditionId } from './IDUtils';
import { convertMapToValues } from './collectionUtils';
import { isActive } from './isActive';
import { Maybe } from './maybe';

const isActiveMagicalTradition = (e: ActivatableDependent) => {
  return isMagicalTraditionId(e.id) && isActive(e);
};

const isActiveBlessedTradition = (e: ActivatableDependent) => {
  return isBlessedTraditionId(e.id) && isActive(e);
};

/**
 * Get magical traditions' dependent entries.
 * @param list
 */
export const getMagicalTraditions = (
  list: ReadonlyMap<string, ActivatableDependent>,
) => {
  return convertMapToValues(list).filter(isActiveMagicalTradition);
};

/**
 * Get magical traditions' wiki entries.
 * @param wiki
 * @param list
 */
export const getMagicalTraditionsFromWiki = (
  wiki: ReadonlyMap<string, SpecialAbility>,
  list: ReadonlyMap<string, ActivatableDependent>,
): ReadonlyArray<SpecialAbility> => R.pipe(
  getMagicalTraditions,
  Maybe.mapMaybe(e => Maybe.from(wiki.get(e.id))),
)(list);

/**
 * Get blessed tradition's' dependent entry.
 * @param list
 */
export const getBlessedTradition = (
  list: ReadonlyMap<string, ActivatableDependent>,
) => {
	return convertMapToValues(list).find(isActiveBlessedTradition);
};

/**
 * Get blessed tradition's' wiki entry.
 * @param wiki
 * @param list
 */
export const getBlessedTraditionFromWiki = (
  wiki: ReadonlyMap<string, SpecialAbility>,
  list: ReadonlyMap<string, ActivatableDependent>,
) => Maybe.from(getBlessedTradition(list))
  .map(e => wiki.get(e.id));
