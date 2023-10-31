import { createSelector } from "@reduxjs/toolkit"
import {
  DisplayedMagicalPrimaryAttributes,
  DisplayedPrimaryAttribute,
  getBlessedPrimaryAttribute,
  getHighestMagicalPrimaryAttributes,
} from "../../shared/domain/primaryAttribute.ts"
import { selectDynamicAttributes } from "../slices/characterSlice.ts"
import { selectStaticAttributes } from "../slices/databaseSlice.ts"
import {
  selectActiveBlessedTradition,
  selectActiveMagicalTraditions,
} from "./traditionSelectors.ts"

/**
 * Returns the highest primary attributes of all active magical traditions, and
 * if they are halfed for calculating arcane energy.
 */
export const selectHighestMagicalPrimaryAttributes = createSelector(
  selectActiveMagicalTraditions,
  selectStaticAttributes,
  selectDynamicAttributes,
  (
    activeMagicalTraditions,
    staticAttributes,
    dynamicAttributes,
  ): DisplayedMagicalPrimaryAttributes =>
    getHighestMagicalPrimaryAttributes(
      activeMagicalTraditions,
      id => staticAttributes[id],
      id => dynamicAttributes[id],
    ),
)

/**
 * Returns the primary attribute of the active blessed tradition, if any.
 */
export const selectBlessedPrimaryAttribute = createSelector(
  selectActiveBlessedTradition,
  selectStaticAttributes,
  selectDynamicAttributes,
  (
    activeBlessedTradition,
    staticAttributes,
    dynamicAttributes,
  ): DisplayedPrimaryAttribute | undefined =>
    activeBlessedTradition === undefined
      ? undefined
      : getBlessedPrimaryAttribute(
          activeBlessedTradition,
          id => staticAttributes[id],
          id => dynamicAttributes[id],
        ),
)
