import { StatePrerequisite } from "optolith-database-schema/types/prerequisites/single/StatePrerequisite"
import { GetById } from "../../getTypes.ts"
import { isStateActive } from "../../state.ts"

/**
 * Checks a single state prerequisite if it’s matched.
 */
export const checkStatePrerequisite = (
  caps: {
    getDynamicStateById: GetById.Dynamic.State
  },
  p: StatePrerequisite,
): boolean => isStateActive(caps.getDynamicStateById, p.id.state)
