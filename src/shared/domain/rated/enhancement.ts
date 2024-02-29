import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"

/**
 * A dependency on this enhancement from another enhancement or activatable.
 */
export type EnhancementDependency =
  | {
      tag: "Internal"

      /**
       * The depending enhancement.
       */
      sourceId: number
    }
  | {
      tag: "External"

      /**
       * The identifier of the dependency source.
       */
      sourceId: ActivatableIdentifier

      /**
       * The top-level index of the prerequisite. If the prerequisite is part of a
       * group or disjunction, this is the index of the group or disjunction.
       */
      index: number

      /**
       * Is the source prerequisite part of a prerequisite disjunction?
       */
      isPartOfDisjunction: boolean
    }

/**
 * An active enhancement instance.
 */
export type Enhancement = {
  id: number
  dependencies: EnhancementDependency[]
}
