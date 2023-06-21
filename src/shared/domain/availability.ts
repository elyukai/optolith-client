import { Publication } from "optolith-database-schema/types/source/Publication"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"

/**
 * Checks if a publication is enabled, depending on the type of publication and
 * which publications were enabled for the character.
 */
export const isPublicationEnabled = (
  publication: Publication,
  includeAllPublications: boolean,
  includePublications: number[],
) => publication.category === "CoreRules"
  || (!publication.contains_adult_content && includeAllPublications)
  || includePublications.includes(publication.id)

/**
 * Checks if an entry from one or more publications is available, based on if
 * at least one of its associated publications is enabled.
 */
export const isEntryAvailable = (
  publications: Record<number, Publication>,
  includeAllPublications: boolean,
  includePublications: number[],
  sourceReferences: PublicationRefs,
) =>
  sourceReferences.some(ref => {
    const publication = publications[ref.id.publication]
    return publication !== undefined
      && isPublicationEnabled(publication, includeAllPublications, includePublications)
  })
