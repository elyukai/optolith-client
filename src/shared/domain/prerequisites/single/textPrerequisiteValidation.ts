import { TextPrerequisite } from "@optolith/database-schema/gen"
import { assertExhaustive } from "../../../utils/typeSafety.ts"

/**
 * Checks a single text prerequisite if it’s matched.
 */
export const checkTextPrerequisite = (_caps: object, p: TextPrerequisite): boolean => {
  switch (p.verification) {
    case "Pass":
      return true
    case "Deny":
      return false
    default:
      return assertExhaustive(p.verification)
  }
}
