import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { mapNullableDefault } from "../utils/nullable.ts"
import { Activatable, ActivatableMap, isActive } from "./activatableEntry.ts"

export const isSpellcaster = (
  spellcaster: Activatable | undefined,
  magicalTraditions: ActivatableMap,
): boolean => isActive(spellcaster) && Object.values(magicalTraditions).some(isActive)

export const getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages = (
  activeMagicalTraditions: MagicalTradition[],
): number =>
  activeMagicalTraditions.reduce(
    (currentMax, tradition) =>
      mapNullableDefault(
        tradition.alternative_magical_adventure_points_maximum,
        altMax => Math.min(altMax, currentMax),
        currentMax,
      ),
    50,
  )
