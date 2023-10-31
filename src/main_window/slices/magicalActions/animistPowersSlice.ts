import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { assertExhaustive } from "../../../shared/utils/typeSafety.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicAnimistPower,
  createInitial: createInitialDynamicAnimistPower,
  getValue: getAnimistPowerValue,
  actions: {
    addAction: addAnimistPower,
    removeAction: removeAnimistPower,
    incrementAction: incrementAnimistPower,
    decrementAction: decrementAnimistPower,
  },
  reducer: animistPowersReducer,
} = createActivatableRatedSlice({
  namespace: "animistPowers",
  entityName: "AnimistPower",
  getState: state => state.magicalActions.animistPowers,
  getImprovementCost: (id, database) => {
    const animistPower = database.animistPowers[id]
    if (animistPower === undefined) {
      return ImprovementCost.D
    }
    switch (animistPower.improvement_cost.tag) {
      case "Fixed":
        return fromRaw(animistPower.improvement_cost.fixed)
      case "ByPrimaryPatron":
        // TODO: Replace with derived improvement cost
        return ImprovementCost.D
      default:
        return assertExhaustive(animistPower.improvement_cost)
    }
  },
})
