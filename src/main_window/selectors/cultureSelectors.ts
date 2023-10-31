import { createSelector } from "@reduxjs/toolkit"
import { Culture } from "optolith-database-schema/types/Culture"
import { getCulture } from "../../shared/domain/culture.ts"
import { selectCultureId } from "../slices/characterSlice.ts"
import { selectStaticCultures } from "../slices/databaseSlice.ts"

/**
 * Select the current culture of the character.
 */
export const selectCurrentCulture = createSelector(
  selectStaticCultures,
  selectCultureId,
  (cultures, id): Culture | undefined => (id === undefined ? undefined : getCulture(cultures, id)),
)
