import { createSelector } from "@reduxjs/toolkit"
import { Culture } from "optolith-database-schema/types/Culture"
import { selectCultureId } from "../slices/characterSlice.ts"
import { selectCultures } from "../slices/databaseSlice.ts"

export const selectCurrentCulture = createSelector(
  selectCultures,
  selectCultureId,
  (cultures, id): Culture | undefined => id === undefined ? undefined : cultures[id]
)
