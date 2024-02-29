import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { GetById } from "./getTypes.ts"

/**
 * A character’s state instance.
 */
export type StateInstance = {
  /**
   * The state’s identifier.
   */
  id: number

  /**
   * Is the state active?
   */
  active: boolean

  /**
   * The dependencies on the state.
   */
  dependencies: StateDependency[]
}

/**
 * A dependency on a state.
 */
export type StateDependency = {
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean
}

/**
 * Creates an instance of a state.
 */
export const createState = (id: number): StateInstance => ({
  id,
  active: false,
  dependencies: [],
})

/**
 * Checks if a state is active.
 */
export const isStateActive = (
  getDynamicStateById: GetById.Dynamic.State,
  stateId: number,
): boolean => getDynamicStateById(stateId)?.active ?? false
