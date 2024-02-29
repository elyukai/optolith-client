import { AnimistPowerImprovementCost } from "optolith-database-schema/types/magicalActions/AnimistPower"
import { mapNullable } from "../../utils/nullable.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Activatable, getFirstOptionOfType } from "../activatable/activatableEntry.ts"
import { ImprovementCost, fromRaw } from "../adventurePoints/improvementCost.ts"
import { GetById } from "../getTypes.ts"

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
