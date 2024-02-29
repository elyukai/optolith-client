import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { Activatable, isActive } from "./activatableEntry.ts"

/**
 * A combination of a static and corresponding dynamic active magical tradition
 * entry.
 */
export type CombinedActiveMagicalTradition = {
  static: MagicalTradition
  dynamic: Activatable
}

/**
 * A capability type for getting the active magical traditions.
 */
export type GetActiveMagicalTraditionsCapability = () => CombinedActiveMagicalTradition[]

/**
 * Checks if a character is a spellcaster.
 */
export const isSpellcaster = (
  spellcaster: Activatable | undefined,
  magicalTraditions: Activatable[],
): boolean => isActive(spellcaster) && magicalTraditions.some(isActive)
