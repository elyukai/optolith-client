import { PublicationIdentifier } from "optolith-database-schema/types/_Identifier"

/**
 * A dependency on a publication.
 */
export type PublicationDependency = Readonly<{
  /**
   * The identifier of the dependency source.
   */
  sourceId: PublicationIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean

  /**
   * The identifier of the required publication.
   */
  id: number
}>
