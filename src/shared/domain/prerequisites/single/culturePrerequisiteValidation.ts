import type { Culture_ID, CulturePrerequisite } from "@optolith/database-schema/gen"

/**
 * Checks a single culture prerequisite if it’s matched.
 */
export const checkCulturePrerequisite = (
  caps: {
    cultureId: Culture_ID | undefined
  },
  p: CulturePrerequisite,
): boolean => caps.cultureId === p.id
