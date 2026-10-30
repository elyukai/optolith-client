import { isNotNullish } from "@elyukai/utils/nullable"
import { AdvantageIdentifier } from "@optolith/database-schema/types/_Identifier"
import { createSelector } from "@reduxjs/toolkit"
import { getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "../../shared/domain/activatable/advantagesDisadvantages.ts"
import {
  CombinedActiveBlessedTradition,
  isBlessedOne,
} from "../../shared/domain/activatable/blessedTradition.ts"
import {
  CombinedActiveMagicalTradition,
  isSpellcaster,
} from "../../shared/domain/activatable/magicalTradition.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectDynamicAdvantages } from "../slices/characterSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"

/**
 * Returns all active magical traditions with their corresponding static
 * entries.
 */
export const selectActiveMagicalTraditions = createSelector(
  SelectGetById.Static.MagicalTradition,
  SelectAll.Dynamic.MagicalTraditions,
  (getStaticMagicalTraditionById, dynamicMagicalTraditions): CombinedActiveMagicalTradition[] =>
    Object.values(dynamicMagicalTraditions)
      .map(dynamicMagicalTradition => {
        const staticMagicalTradition = getStaticMagicalTraditionById(dynamicMagicalTradition.id)

        if (isActive(dynamicMagicalTradition) && staticMagicalTradition !== undefined) {
          return {
            static: staticMagicalTradition,
            dynamic: dynamicMagicalTradition,
          }
        }

        return undefined
      })
      .filter(isNotNullish),
)

/**
 * Returns the active blessed traditions with its corresponding static entry,
 * if any.
 */
export const selectActiveBlessedTradition = createSelector(
  SelectGetById.Static.BlessedTradition,
  SelectAll.Dynamic.BlessedTraditions,
  (
    getStaticBlessedTraditionById,
    dynamicBlessedTraditions,
  ): CombinedActiveBlessedTradition | undefined =>
    Object.values(dynamicBlessedTraditions)
      .map(dynamicBlessedTradition => {
        const staticBlessedTradition = getStaticBlessedTraditionById(dynamicBlessedTradition.id)

        if (isActive(dynamicBlessedTradition) && staticBlessedTradition !== undefined) {
          return {
            static: staticBlessedTradition,
            dynamic: dynamicBlessedTradition,
          }
        }

        return undefined
      })
      .find(isNotNullish),
)

/**
 * Selects whether the character is a spellcaster.
 */
export const selectIsSpellcaster = createSelector(
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Spellcaster),
  SelectAll.Dynamic.MagicalTraditions,
  isSpellcaster,
)

/**
 * Selects whether the character is a Blessed One.
 */
export const selectIsBlessedOne = createSelector(
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Blessed),
  SelectAll.Dynamic.BlessedTraditions,
  isBlessedOne,
)

/**
 * Selects the maximum number of adventure points that can be spent for magical
 * advantages and disadvantages, based on the active magical traditions.
 */
export const selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages = createSelector(
  selectActiveMagicalTraditions,
  (magicalTraditions): number =>
    getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages(
      magicalTraditions.map(combined => combined.static),
    ),
)
