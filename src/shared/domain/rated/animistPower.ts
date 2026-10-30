import { mapNullable } from "@elyukai/utils/nullable"
import { AnimistPowerImprovementCost, type ImprovementCost } from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

/**
 * Returns the improvement cost for an animist power.
 */
export const getImprovementCostForAnimistPower = (
  getStaticPatronById: GetById.Static.Patron,
  dynamicTradition: Activatable,
  improvementCost: AnimistPowerImprovementCost,
): ImprovementCost | undefined => {
  switch (improvementCost.tag) {
    case "Fixed":
      return fromRaw(improvementCost.fixed)
    case "ByPrimaryPatron": {
      const primaryPatronId = getFirstOptionOfType(dynamicTradition, "Patron")
      const primaryPatron = mapNullable(primaryPatronId, getStaticPatronById)
      return mapNullable(primaryPatron?.improvement_cost, fromRaw)
    }
    default:
      return assertExhaustive(improvementCost)
  }
}
