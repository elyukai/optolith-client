import { AnimistPowerPrerequisite } from "optolith-database-schema/types/prerequisites/single/AnimistPowerPrerequisite"

/**
 * Checks a single animist power prerequisite if it’s matched.
 */
export const checkAnimistPowerPrerequisite = (
  caps: Record<string, never>,
  p: AnimistPowerPrerequisite,
): boolean => false // TODO: Implementation
