import { SexualCharacteristicPrerequisite } from "optolith-database-schema/types/prerequisites/single/SexualCharacteristicPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { Sex } from "../../sex.ts"

/**
 * Checks a single sexual characteristic prerequisite if it’s matched.
 */
export const checkSexualCharacteristicPrerequisite = (
  caps: {
    getSex: () => Sex
  },
  p: SexualCharacteristicPrerequisite,
): boolean => {
  const sex = caps.getSex()
  switch (p.id) {
    case "Penis": {
      switch (sex.type) {
        case "Male":
          return true
        case "Female":
          return false
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.sexualCharacteristics.hasPenis
        default:
          return assertExhaustive(sex)
      }
    }
    case "Vagina": {
      switch (sex.type) {
        case "Male":
          return false
        case "Female":
          return true
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.sexualCharacteristics.hasVagina
        default:
          return assertExhaustive(sex)
      }
    }
    default:
      return assertExhaustive(p.id)
  }
}
