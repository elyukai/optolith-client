import type { StatePrerequisite, State_ID } from "@optolith/database-schema/gen"

/**
 * Checks a single state prerequisite if it’s matched.
 */
export const checkStatePrerequisite = (
  caps: {
    isStateActive: (id: State_ID) => boolean
  },
  p: StatePrerequisite,
): boolean => caps.isStateActive(p.id)
