import { StatePrerequisite } from "optolith-database-schema/types/prerequisites/single/StatePrerequisite"

/**
 * Checks a single state prerequisite if it’s matched.
 */
export const checkStatePrerequisite = (
  caps: {
    getDynamicState: (id: number) => boolean
  },
  p: StatePrerequisite,
): boolean => caps.getDynamicState(p.id.state)
