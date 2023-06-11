import { Activatable } from "../../main_window/slices/characterSlice.ts"
import { firstLevel, isActive } from "./activatableEntry.ts"

/**
 * There are pairs of entries that are mutually exclusive and modify a certain
 * value by their level, either in a positive or a negative way. This function
 * returns the value modifier that is caused by the given pair of entries.
 */
export const modifierByLevel = (
  incrementor: Activatable | undefined,
  decrementor: Activatable | undefined,
): number =>
  firstLevel(incrementor) - firstLevel(decrementor)

/**
 * There are pairs of entries that are mutually exclusive and modify a certain
 * value by being purchased, either in a positive or a negative way. This
 * function returns the value modifier that is caused by the given pair of
 * entries.
 */
export const modifierByIsActive = (
  incrementor: Activatable | undefined,
  decrementor: Activatable | undefined,
): number =>
  isActive(incrementor) ? 1 : isActive(decrementor) ? -1 : 0

const countActive = (activatables: (Activatable | undefined)[]) =>
  activatables.reduce((acc, entry) => acc + (isActive(entry) ? 1 : 0), 0)

/**
 * There are entries that modify a certain value by being purchased, either in a
 * positive or a negative way. This function returns the value modifier that is
 * caused by the given entries.
 */
export const modifierByIsActives = (
  incrementors: (Activatable | undefined)[],
  decrementors: (Activatable | undefined)[],
): number =>
  countActive(incrementors) - countActive(decrementors)
