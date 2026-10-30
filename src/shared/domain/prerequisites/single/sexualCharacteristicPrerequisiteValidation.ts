import type { SexualCharacteristicPrerequisite } from "@optolith/database-schema/gen"
import { type Sex, matchSexualCharacteristicToSex } from "../../sex.ts"

/**
 * Checks a single sexual characteristic prerequisite if it’s matched.
 */
export const checkSexualCharacteristicPrerequisite = (
  caps: {
    sex: Sex
  },
  p: SexualCharacteristicPrerequisite,
): boolean => matchSexualCharacteristicToSex(caps.sex, p.id)
