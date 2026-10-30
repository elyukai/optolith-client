import type { PrimaryAttributePrerequisite } from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

/**
 * Checks a single primary attribute prerequisite if it’s matched.
 */
export const checkPrimaryAttributePrerequisite = (
  caps: {
    primaryBlessedAttribute: number | undefined
    highestPrimaryMagicalAttribute: number | undefined
  },
  p: PrimaryAttributePrerequisite,
): boolean => {
  switch (p.category.kind) {
    case "Blessed":
      return (caps.primaryBlessedAttribute ?? 0) >= p.value
    case "Magical":
      return (caps.highestPrimaryMagicalAttribute ?? 0) >= p.value
    default:
      return assertExhaustive(p.category)
  }
}
