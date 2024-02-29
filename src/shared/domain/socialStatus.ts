import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"

/**
 * A dependency on a social status.
 */
export type SocialStatusDependency = {
  id: number
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean
}
