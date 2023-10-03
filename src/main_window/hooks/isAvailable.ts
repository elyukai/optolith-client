import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { isEntryAvailable } from "../../shared/domain/availability.ts"
import {
  selectIncludeAllPublications,
  selectIncludePublications,
} from "../slices/characterSlice.ts"
import { selectPublications } from "../slices/databaseSlice.ts"
import { useAppSelector } from "./redux.ts"

/**
 * Returns a function that checks if a given entry is available based on the
 * enabled publications.
 */
export const useIsEntryAvailable = () => {
  const publications = useAppSelector(selectPublications)
  const includeAllPublications = useAppSelector(selectIncludeAllPublications) === true
  const includePublications = useAppSelector(selectIncludePublications) ?? []

  return (sourceReferences: PublicationRefs) =>
    isEntryAvailable(publications, includeAllPublications, includePublications, sourceReferences)
}
