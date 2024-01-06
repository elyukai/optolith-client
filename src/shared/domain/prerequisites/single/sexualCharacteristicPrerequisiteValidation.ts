import { SexualCharacteristicPrerequisite } from "optolith-database-schema/types/prerequisites/single/SexualCharacteristicPrerequisite"
import { Sex, matchSexualCharacteristicToSex } from "../../sex.ts"

/**
 * Checks a single sexual characteristic prerequisite if it’s matched.
 */
export const checkSexualCharacteristicPrerequisite = (
  caps: {
    getSex: () => Sex
  },
  p: SexualCharacteristicPrerequisite,
): boolean => matchSexualCharacteristicToSex(caps.getSex(), p.id)
