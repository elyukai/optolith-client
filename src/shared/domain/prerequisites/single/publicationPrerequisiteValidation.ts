import { PublicationPrerequisite } from "@optolith/database-schema/gen"
import { GetById } from "../../getTypes.ts"

/**
 * Checks a single publication prerequisite if it’s matched.
 */
export const checkPublicationPrerequisite = (
  caps: {
    getAreAllPublicationsEnabled: () => boolean
    getIsPublicationEnabledManually: (id: number) => boolean
    getStaticPublicationById: GetById.Static.Publication
  },
  p: PublicationPrerequisite,
): boolean => {
  const publication = caps.getStaticPublicationById(p.id)

  if (publication === undefined) {
    return false
  }

  if (publication.contains_adult_content) {
    return caps.getIsPublicationEnabledManually(p.id)
  } else {
    return caps.getAreAllPublicationsEnabled() || caps.getIsPublicationEnabledManually(p.id)
  }
}
