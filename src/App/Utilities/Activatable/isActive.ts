import { notNull } from "../../../Data/List"
import { Just, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { pipe } from "../pipe"

const { active } = ActivatableDependent.AL

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isActive: (obj: Record<ActivatableDependent>) => boolean =
  pipe (active, notNull)

/**
 * Checks if the entry is active. This will be the case if there is at least one
 * `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export const isMaybeActive =
  (obj: Maybe<Record<ActivatableDependent>>): obj is Just<Record<ActivatableDependent>> =>
    maybe (false) (isActive) (obj)
