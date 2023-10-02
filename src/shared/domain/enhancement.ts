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
      id: number
    }
  | {
      tag: "External"

      /**
       * The depending activatable.
       */
      id: ActivatableIdentifier
    }

/**
 * An active enhancement instance.
 */
export type Enhancement = {
  id: number
  dependencies: EnhancementDependency[]
}
