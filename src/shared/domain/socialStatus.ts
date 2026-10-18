import { ActivatableIdentifier } from "@optolith/database-schema/gen"

/**
 * A dependency on a social status.
 */
export type SocialStatusDependency = {
  id: number
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean
}
