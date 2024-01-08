import { createSelector } from "@reduxjs/toolkit"
import {
  DisplayedMagicalPrimaryAttributes,
  DisplayedPrimaryAttribute,
  getBlessedPrimaryAttribute,
  getHighestMagicalPrimaryAttributes,
} from "../../shared/domain/rated/primaryAttribute.ts"
import { SelectGetById } from "./basicCapabilitySelectors.ts"
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
  SelectGetById.Static.Attribute,
  SelectGetById.Dynamic.Attribute,
  (
    activeMagicalTraditions,
    getStaticAttributeById,
    getDynamicAttributeById,
  ): DisplayedMagicalPrimaryAttributes =>
    getHighestMagicalPrimaryAttributes(
      activeMagicalTraditions,
      getStaticAttributeById,
      getDynamicAttributeById,
    ),
)

/**
 * Returns the primary attribute of the active blessed tradition, if any.
 */
export const selectBlessedPrimaryAttribute = createSelector(
  selectActiveBlessedTradition,
  SelectGetById.Static.Attribute,
  SelectGetById.Dynamic.Attribute,
  (
    activeBlessedTradition,
    getStaticAttributeById,
    getDynamicAttributeById,
  ): DisplayedPrimaryAttribute | undefined =>
    activeBlessedTradition === undefined
      ? undefined
      : getBlessedPrimaryAttribute(
          activeBlessedTradition,
          getStaticAttributeById,
          getDynamicAttributeById,
        ),
)
