import { PublicationPrerequisite } from "optolith-database-schema/types/prerequisites/single/PublicationPrerequisite"
import { Publication } from "optolith-database-schema/types/source/Publication"

/**
 * Checks a single publication prerequisite if it’s matched.
 */
export const checkPublicationPrerequisite = (
  caps: {
    getAreAllPublicationsEnabled: () => boolean
    getIsPublicationEnabledManually: (id: number) => boolean
    getStaticPublication: (id: number) => Publication | undefined
  },
  p: PublicationPrerequisite,
): boolean => {
  const publication = caps.getStaticPublication(p.id)

  if (publication === undefined) {
    return false
  }

  if (publication.contains_adult_content) {
    return caps.getIsPublicationEnabledManually(p.id)
  } else {
    return caps.getAreAllPublicationsEnabled() || caps.getIsPublicationEnabledManually(p.id)
  }
}
