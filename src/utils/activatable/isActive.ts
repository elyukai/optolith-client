import { pipe } from 'ramda';
import { ActivatableDependent, ActivatableDependentG } from '../../App/Models/ActiveEntries/ActivatableDependent';
import { fnull } from '../../Data/List';
import { fmap, Maybe, or } from '../../Data/Maybe';
import { Record } from '../../Data/Record';
import { not } from '../not';

const { active } = ActivatableDependentG

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isActive: (obj: Record<ActivatableDependent>) => boolean = pipe (active, fnull, not)

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isMaybeActive =
  (obj: Maybe<Record<ActivatableDependent>>): boolean =>
    or (fmap (isActive) (obj))
