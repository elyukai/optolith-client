import { ActivatableDependent } from '../types/data.d';
import { isBlessedTraditionId, isMagicalTraditionId } from './IDUtils';
import { isActive } from './isActive';

export const getMagicalTraditions = (list: Map<string, ActivatableDependent>) => {
  return [...list.values()].filter(e => isMagicalTraditionId(e.id) && isActive(e));
};

export const getBlessedTradition = (list: Map<string, ActivatableDependent>) => {
	return [...list.values()].find(e => isBlessedTraditionId(e.id) && isActive(e));
};
