import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicJesterTrick,
  createInitial: createInitialDynamicJesterTrick,
  getValue: getJesterTrickValue,
  actions: {
    addAction: addJesterTrick,
    removeAction: removeJesterTrick,
    incrementAction: incrementJesterTrick,
    decrementAction: decrementJesterTrick,
  },
  reducer: jesterTricksReducer,
} = createActivatableRatedSlice({
  namespace: "jesterTricks",
  entityName: "JesterTrick",
  getState: state => state.magicalActions.jesterTricks,
  getImprovementCost: (id, database) =>
    fromRaw(database.jesterTricks[id]?.improvement_cost) ?? ImprovementCost.D,
})
