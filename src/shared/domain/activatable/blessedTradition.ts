import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { Activatable, isActive } from "./activatableEntry.ts"

/**
 * A combination of a static and corresponding dynamic active blessed tradition
 * entry.
 */
export type CombinedActiveBlessedTradition = {
  static: BlessedTradition
  dynamic: Activatable
}

/**
 * A capability type for getting the active blessed tradition, if any.
 */
export type GetActiveBlessedTraditionCapability = () => CombinedActiveBlessedTradition | undefined

/**
 * Checks if the character is a Blessed One.
 */
export const isBlessedOne = (
  blessedOne: Activatable | undefined,
  blessedTraditions: Activatable[],
): boolean => isActive(blessedOne) && blessedTraditions.some(isActive)
