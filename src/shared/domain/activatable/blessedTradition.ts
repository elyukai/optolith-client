import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { Activatable, ActivatableMap, isActive } from "./activatableEntry.ts"

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
  blessedTraditions: ActivatableMap,
): boolean => isActive(blessedOne) && Object.values(blessedTraditions).some(isActive)
