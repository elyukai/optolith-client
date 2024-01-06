import { PrimaryAttributePrerequisite } from "optolith-database-schema/types/prerequisites/single/PrimaryAttributePrerequisite"
import { mapNullableDefault } from "../../../utils/nullable.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import {
  DisplayedPrimaryAttribute,
  GetBlessedPrimaryAttributeCapability,
  GetHighestMagicalPrimaryAttributesCapability,
} from "../../rated/primaryAttribute.ts"

/**
 * Checks a single primary attribute prerequisite if it’s matched.
 */
export const checkPrimaryAttributePrerequisite = (
  caps: {
    getBlessedPrimaryAttribute: GetBlessedPrimaryAttributeCapability
    getHighestMagicalPrimaryAttributes: GetHighestMagicalPrimaryAttributesCapability
  },
  p: PrimaryAttributePrerequisite,
): boolean => {
  const matchRated = (rated: DisplayedPrimaryAttribute) => rated.dynamic.value >= p.value

  switch (p.category) {
    case "Blessed":
      return mapNullableDefault(caps.getBlessedPrimaryAttribute(), matchRated, false)
    case "Magical":
      return caps.getHighestMagicalPrimaryAttributes().some(matchRated)
    default:
      return assertExhaustive(p.category)
  }
}
