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
}

/**
 * Checks if a state is active.
 */
export const isStateActive = (
  getDynamicStateById: GetById.Dynamic.State,
  stateId: number,
): boolean => getDynamicStateById(stateId)?.active ?? false
