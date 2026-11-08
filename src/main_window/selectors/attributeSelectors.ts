import { createSelector } from "@reduxjs/toolkit"
import { getCarryingCapacity } from "../../shared/domain/equipment.ts"
import { AttributeIdentifier } from "../../shared/domain/identifier.ts"
import { getAttributeValue } from "../../shared/domain/rated/attribute.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { selectDynamicAttributes } from "../slices/characterSlice.ts"

/**
 * Returns the carrying capacity of the character.
 */
export const selectCarryingCapacity = createSelector(
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Strength),
  (strength): number => getCarryingCapacity(getAttributeValue(strength)),
)
