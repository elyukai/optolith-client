import type { ActivatableIdentifier, SocialStatus_ID } from "@optolith/database-schema/gen"

/**
 * A dependency on a social status.
 */
export type SocialStatusDependency = {
  id: SocialStatus_ID
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean
}
