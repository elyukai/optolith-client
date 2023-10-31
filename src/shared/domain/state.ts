/**
 * An active state instance.
 */
export type ActiveState = {
  id: number
}

/**
 * Checks if a state is active.
 */
export const isStateActive = (
  activeStates: Record<number, ActiveState>,
  stateId: number,
): boolean => stateId in activeStates
