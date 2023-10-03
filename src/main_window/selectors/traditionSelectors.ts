import { createSelector } from "@reduxjs/toolkit"
import { isActive } from "../../shared/domain/activatableEntry.ts"
import {
  CombinedActiveBlessedTradition,
  isBlessedOne,
} from "../../shared/domain/blessedTradition.ts"
import { AdvantageIdentifier } from "../../shared/domain/identifier.ts"
import {
  CombinedActiveMagicalTradition,
  getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages,
  isSpellcaster,
} from "../../shared/domain/magicalTradition.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import {
  selectAdvantages,
  selectBlessedTraditions as selectDynamicBlessedTraditions,
  selectMagicalTraditions as selectDynamicMagicalTraditions,
} from "../slices/characterSlice.ts"
import {
  selectBlessedTraditions as selectStaticBlessedTraditions,
  selectMagicalTraditions as selectStaticMagicalTraditions,
} from "../slices/databaseSlice.ts"

/**
 * Returns all active magical traditions with their corresponding static
 * entries.
 */
export const selectActiveMagicalTraditions = createSelector(
  selectStaticMagicalTraditions,
  selectDynamicMagicalTraditions,
  (staticMagicalTraditions, dynamicMagicalTraditions): CombinedActiveMagicalTradition[] =>
    Object.values(dynamicMagicalTraditions)
      .map(dynamicMagicalTradition => {
        const staticMagicalTradition = staticMagicalTraditions[dynamicMagicalTradition.id]

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
  selectStaticBlessedTraditions,
  selectDynamicBlessedTraditions,
  (staticBlessedTraditions, dynamicBlessedTraditions): CombinedActiveBlessedTradition | undefined =>
    Object.values(dynamicBlessedTraditions)
      .map(dynamicBlessedTradition => {
        const staticBlessedTradition = staticBlessedTraditions[dynamicBlessedTradition.id]

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
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Spellcaster),
  selectDynamicMagicalTraditions,
  isSpellcaster,
)

/**
 * Selects whether the character is a Blessed One.
 */
export const selectIsBlessedOne = createSelector(
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Blessed),
  selectDynamicBlessedTraditions,
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
