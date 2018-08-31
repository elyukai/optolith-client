import { ActivatableDependent } from '../types/data';
import { Maybe, Record } from './dataUtils';

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isActive = (
  obj: Maybe<Record<ActivatableDependent>> | Record<ActivatableDependent>
): boolean => {
  if (obj instanceof Maybe) {
    return Maybe.isJust (obj) && Maybe.fromJust (
      Maybe.fromJust (obj)
        .lookup ('active')
        .fmap (e => !e.null ())
    );
  }

  return !obj.get ('active').null ();
};
