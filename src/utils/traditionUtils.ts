import { ActivatableDependent } from '../types/data.d';
import { isBlessedTraditionId, isMagicalTraditionId } from './IDUtils';
import { convertMapToValueArray } from './collectionUtils';
import { isActive } from './isActive';

const isActiveMagicalTradition = (e: ActivatableDependent) => {
  return isMagicalTraditionId(e.id) && isActive(e);
};

const isActiveBlessedTradition = (e: ActivatableDependent) => {
  return isBlessedTraditionId(e.id) && isActive(e);
};

export const getMagicalTraditions = (list: Map<string, ActivatableDependent>) => {
  return convertMapToValueArray(list).filter(isActiveMagicalTradition);
};

export const getBlessedTradition = (list: Map<string, ActivatableDependent>) => {
	return convertMapToValueArray(list).find(isActiveBlessedTradition);
};
