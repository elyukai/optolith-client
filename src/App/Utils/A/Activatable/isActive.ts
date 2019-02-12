import { pipe } from "ramda";
import { fmap } from "../../../../Data/Functor";
import { fnull } from "../../../../Data/List";
import { Just, Maybe, or } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { not } from "../../not";

const { active } = ActivatableDependent.A

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
  (obj: Maybe<Record<ActivatableDependent>>): obj is Just<Record<ActivatableDependent>> =>
    or (fmap (isActive) (obj))
