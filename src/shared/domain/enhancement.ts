import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"

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

export type Enhancement = {
  id: number
  dependencies: EnhancementDependency[]
}
