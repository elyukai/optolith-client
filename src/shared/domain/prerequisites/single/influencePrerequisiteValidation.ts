import { InfluencePrerequisite } from "optolith-database-schema/types/prerequisites/single/InfluencePrerequisite"

/**
 * Checks a single influence prerequisite if it’s matched.
 */
export const checkInfluencePrerequisite = (
  caps: Record<string, never>,
  p: InfluencePrerequisite,
): boolean => false // TODO: Implementation
