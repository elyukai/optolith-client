import { ActivatableDependent } from '../types/data.d';

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isActive = (obj: ActivatableDependent | undefined): boolean => {
  return typeof obj === 'object' && obj.active.length > 0;
};
