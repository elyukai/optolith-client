import type { Profession_ID, ProfessionPrerequisite } from "@optolith/database-schema/gen"

/**
 * Checks a single profession prerequisite if it’s matched.
 */
export const checkProfessionPrerequisite = (
  caps: {
    professionId: Profession_ID | undefined
  },
  p: ProfessionPrerequisite,
): boolean => caps.professionId === p.id
