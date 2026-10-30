import { MagicalRuneImprovementCost, type ImprovementCost } from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

/**
 * Returns the improvement cost for a magical rune.
 */
export const getImprovementCostForMagicalRune = (
  improvementCost: MagicalRuneImprovementCost,
): ImprovementCost | undefined => {
  switch (improvementCost.tag) {
    case "Constant":
      return fromRaw(improvementCost.constant.value)
    case "DerivedFromOption": {
      // TODO
      return undefined
    }
    default:
      return assertExhaustive(improvementCost)
  }
}
