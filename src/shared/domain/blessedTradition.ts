import { Activatable, ActivatableMap, isActive } from "./activatableEntry.ts"

export const isBlessedOne = (
  blessedOne: Activatable | undefined,
  blessedTraditions: ActivatableMap,
): boolean => isActive(blessedOne) && Object.values(blessedTraditions).some(isActive)
