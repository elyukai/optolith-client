import type { SexPrerequisite } from "@optolith/database-schema/gen"
import { type Sex, matchBinarySexToSex } from "../../sex.ts"

/**
 * Checks a single sex prerequisite if it’s matched.
 */
export const checkSexPrerequisite = (
  caps: {
    sex: Sex
  },
  p: SexPrerequisite,
): boolean => matchBinarySexToSex(caps.sex, p.id)
