import { pipe } from 'ramda';
import { ActivatableDependent, ActivatableDependentG } from '../activeEntries/ActivatableDependent';
import { not } from '../not';
import { fnull } from '../structures/List';
import { fmap, Maybe, or } from '../structures/Maybe';
import { Record } from '../structures/Record';

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
