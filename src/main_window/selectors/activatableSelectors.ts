import { createSelector } from "@reduxjs/toolkit"
import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { getSelectOptionsFromCacheById } from "../../shared/domain/database.ts"
import { selectDatabase } from "../slices/databaseSlice.ts"

/**
 * Selects a function that returns the select options for a given activatable
 *identifier.
 */
export const selectGetSelectOptionsById = createSelector(
  selectDatabase,
  database =>
    (id: ActivatableIdentifier): ResolvedSelectOption[] | undefined =>
      getSelectOptionsFromCacheById(database.cache.activatableSelectOptions, id),
)
