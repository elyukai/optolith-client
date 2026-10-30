import type { TextPrerequisite } from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

/**
 * Checks a single text prerequisite if it’s matched.
 */
export const checkTextPrerequisite = (_caps: {}, p: TextPrerequisite): boolean => {
  switch (p.verification.kind) {
    case "Pass":
      return true
    case "Deny":
      return false
    default:
      return assertExhaustive(p.verification)
  }
}
