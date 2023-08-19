import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { isEntryAvailable } from "../../shared/domain/availability.ts"
import {
  selectIncludeAllPublications,
  selectIncludePublications,
} from "../slices/characterSlice.ts"
import { selectPublications } from "../slices/databaseSlice.ts"
import { useAppSelector } from "./redux.ts"

export const useIsEntryAvailable = () => {
  const publications = useAppSelector(selectPublications)
  const includeAllPublications = useAppSelector(selectIncludeAllPublications) === true
  const includePublications = useAppSelector(selectIncludePublications) ?? []

  return (sourceReferences: PublicationRefs) =>
    isEntryAvailable(publications, includeAllPublications, includePublications, sourceReferences)
}
