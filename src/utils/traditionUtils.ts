import { ActivatableDependent } from '../types/data.d';
import { SpecialAbility } from '../types/wiki';
import { isBlessedTraditionId, isMagicalTraditionId } from './IDUtils';
import { convertMapToValueArray, filterExisting } from './collectionUtils';
import { maybe } from './exists';
import { isActive } from './isActive';
import { pipe } from './pipe';

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
  list: Map<string, ActivatableDependent>,
) => {
  return convertMapToValueArray(list).filter(isActiveMagicalTradition);
};

/**
 * Get magical traditions' wiki entries.
 * @param wiki
 * @param list
 */
export const getMagicalTraditionsFromWiki = (
  wiki: Map<string, SpecialAbility>,
  list: Map<string, ActivatableDependent>,
) => pipe(
  getMagicalTraditions,
  traditions => traditions.map(e => wiki.get(e.id)),
  filterExisting
)(list);

/**
 * Get blessed tradition's' dependent entry.
 * @param list
 */
export const getBlessedTradition = (
  list: Map<string, ActivatableDependent>,
) => {
	return convertMapToValueArray(list).find(isActiveBlessedTradition);
};

/**
 * Get blessed tradition's' wiki entry.
 * @param wiki
 * @param list
 */
export const getBlessedTraditionFromWiki = (
  wiki: Map<string, SpecialAbility>,
  list: Map<string, ActivatableDependent>,
) => pipe(
  getBlessedTradition,
  maybe(e => wiki.get(e.id)),
)(list);
