import { CharacterActivatable } from "./activatable.ts"

/**
 * There are pairs of entries that are mutually exclusive and modify a certain
 * value by their level, either in a positive or a negative way. This function
 * returns the value modifier that is caused by the given pair of entries.
 */
export const modifierByLevel = (
  incrementor: CharacterActivatable | undefined,
  decrementor: CharacterActivatable | undefined,
): number => (incrementor?.firstLevel ?? 0) - (decrementor?.firstLevel ?? 0)

/**
 * There are pairs of entries that are mutually exclusive and modify a certain
 * value by being purchased, either in a positive or a negative way. This
 * function returns the value modifier that is caused by the given pair of
 * entries.
 */
export const modifierByIsActive = (
  incrementor: CharacterActivatable | undefined,
  decrementor: CharacterActivatable | undefined,
): number => ((incrementor?.isActive ?? false) ? 1 : (decrementor?.isActive ?? false) ? -1 : 0)

const countActive = (activatables: (CharacterActivatable | undefined)[]) =>
  activatables.reduce((acc, entry) => acc + ((entry?.isActive ?? false) ? 1 : 0), 0)

/**
 * There are entries that modify a certain value by being purchased, either in a
 * positive or a negative way. This function returns the value modifier that is
 * caused by the given entries.
 */
export const modifierByIsActives = (
  incrementors: (CharacterActivatable | undefined)[],
  decrementors: (CharacterActivatable | undefined)[],
): number => countActive(incrementors) - countActive(decrementors)
