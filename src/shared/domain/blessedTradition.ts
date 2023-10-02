import { Activatable, ActivatableMap, isActive } from "./activatableEntry.ts"

/**
 * Checks if the character is a Blessed One.
 */
export const isBlessedOne = (
  blessedOne: Activatable | undefined,
  blessedTraditions: ActivatableMap,
): boolean => isActive(blessedOne) && Object.values(blessedTraditions).some(isActive)
