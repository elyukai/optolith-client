import { CulturePrerequisite } from "@optolith/database-schema/gen"

/**
 * Checks a single culture prerequisite if it’s matched.
 */
export const checkCulturePrerequisite = (
  caps: {
    getCurrentCultureIdentifier: () => number | undefined
  },
  p: CulturePrerequisite,
): boolean => caps.getCurrentCultureIdentifier() === p.id.culture
