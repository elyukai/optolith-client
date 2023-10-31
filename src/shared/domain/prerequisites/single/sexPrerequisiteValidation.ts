import { SexPrerequisite } from "optolith-database-schema/types/prerequisites/single/SexPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { Sex } from "../../sex.ts"

/**
 * Checks a single sex prerequisite if it’s matched.
 */
export const checkSexPrerequisite = (
  caps: {
    getSex: () => Sex
  },
  p: SexPrerequisite,
): boolean => {
  const sex = caps.getSex()
  switch (p.id) {
    case "Male": {
      switch (sex.type) {
        case "Male":
          return true
        case "Female":
          return false
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.asMale
        default:
          return assertExhaustive(sex)
      }
    }
    case "Female": {
      switch (sex.type) {
        case "Male":
          return false
        case "Female":
          return true
        case "BalThani":
        case "Tsajana":
        case "Custom":
          return sex.ruleBasedInterpretation.asFemale
        default:
          return assertExhaustive(sex)
      }
    }
    default:
      return assertExhaustive(p.id)
  }
}
