import type { PublicationPrerequisite } from "@optolith/database-schema/gen"
import {
  isPublicationIncludedById,
  type PublicationOptions,
} from "@optolith/entity-descriptions/publication-options"
import type { GetInstanceById } from "../../../database.ts"
import type { TranslateMap } from "../../../utils/locale.ts"

/**
 * Checks a single publication prerequisite if it’s matched.
 */
export const checkPublicationPrerequisite = (
  caps: {
    translateMap: TranslateMap
    getInstanceById: GetInstanceById<"Publication">
    publicationOptions: PublicationOptions
  },
  p: PublicationPrerequisite,
): boolean =>
  isPublicationIncludedById(caps.translateMap, caps.getInstanceById, caps.publicationOptions, p.id)
