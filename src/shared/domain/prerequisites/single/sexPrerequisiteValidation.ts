import { SexPrerequisite } from "@optolith/database-schema/gen"
import { Sex, matchBinarySexToSex } from "../../sex.ts"

/**
 * Checks a single sex prerequisite if it’s matched.
 */
export const checkSexPrerequisite = (
  caps: {
    getSex: () => Sex
  },
  p: SexPrerequisite,
): boolean => matchBinarySexToSex(caps.getSex(), p.id)
