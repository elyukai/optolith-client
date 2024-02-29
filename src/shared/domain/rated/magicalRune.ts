import { MagicalRuneImprovementCost } from "optolith-database-schema/types/magicalActions/MagicalRune"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { ImprovementCost, fromRaw } from "../adventurePoints/improvementCost.ts"

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
