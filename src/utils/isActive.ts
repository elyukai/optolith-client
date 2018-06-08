import { ActivatableDependent } from '../types/data.d';
import { Maybe } from './dataUtils';

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isActive = (obj: Maybe<ActivatableDependent> | ActivatableDependent): boolean => {
  if (obj instanceof Maybe) {
    return Maybe.isJust(obj) && Maybe.fromJust(obj).active.length > 0;
  }

  return obj.active.length > 0;
};
