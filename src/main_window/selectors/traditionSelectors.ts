import { createSelector } from "@reduxjs/toolkit"
import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { Activatable, isActive } from "../../shared/domain/activatableEntry.ts"
import { isBlessedOne } from "../../shared/domain/blessedTradition.ts"
import { AdvantageIdentifier } from "../../shared/domain/identifier.ts"
import {
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

export type CombinedActiveMagicalTradition = {
  static: MagicalTradition
  dynamic: Activatable
}

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

export type CombinedActiveBlessedTradition = {
  static: BlessedTradition
  dynamic: Activatable
}

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

export const selectIsSpellcaster = createSelector(
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Spellcaster),
  selectDynamicMagicalTraditions,
  isSpellcaster,
)

export const selectIsBlessedOne = createSelector(
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Blessed),
  selectDynamicBlessedTraditions,
  isBlessedOne,
)

export const selectMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages = createSelector(
  selectActiveMagicalTraditions,
  (magicalTraditions): number =>
    getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages(
      magicalTraditions.map(combined => combined.static),
    ),
)
