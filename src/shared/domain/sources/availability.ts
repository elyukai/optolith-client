import { Publication } from "optolith-database-schema/types/source/Publication"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { GetById } from "../getTypes.ts"

/**
 * Checks if a publication is enabled, depending on the type of publication and
 * which publications were enabled for the character.
 */
export const isPublicationEnabled = (
  publication: Publication,
  includeAllPublications: boolean,
  includePublications: number[],
) =>
  publication.category === "CoreRules" ||
  (!publication.contains_adult_content && includeAllPublications) ||
  includePublications.includes(publication.id)

/**
 * Checks if an entry from one or more publications is available, based on if
 * at least one of its associated publications is enabled.
 */
export const isEntryAvailable = (
  getPublication: GetById.Static.Publication,
  includeAllPublications: boolean,
  includePublications: number[],
  sourceReferences: PublicationRefs,
) =>
  sourceReferences.some(ref => {
    const publication = getPublication(ref.id.publication)
    return (
      publication !== undefined &&
      isPublicationEnabled(publication, includeAllPublications, includePublications)
    )
  })
