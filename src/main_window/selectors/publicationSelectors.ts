import { createSelector } from "@reduxjs/toolkit"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { isEntryAvailable } from "../../shared/domain/availability.ts"
import {
  selectIncludeAllPublications,
  selectIncludePublications,
} from "../slices/characterSlice.ts"
import { selectStaticPublications } from "../slices/databaseSlice.ts"

/**
 * Selects a function that checks if an entry from one or more publications is
 * available, based on if at least one of its associated publications is
 * enabled.
 */
export const selectIsEntryAvailable = createSelector(
  selectStaticPublications,
  selectIncludeAllPublications,
  selectIncludePublications,
  (publications, includeAllPublications, includePublications) =>
    (sourceReferences: PublicationRefs) =>
      isEntryAvailable(publications, includeAllPublications, includePublications, sourceReferences),
)
