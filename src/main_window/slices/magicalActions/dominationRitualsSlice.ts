import { dominationRitualsImprovementCost } from "../../../shared/domain/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicDominationRitual,
  createInitial: createInitialDynamicDominationRitual,
  getValue: getDominationRitualValue,
  actions: {
    addAction: addDominationRitual,
    removeAction: removeDominationRitual,
    incrementAction: incrementDominationRitual,
    decrementAction: decrementDominationRitual,
  },
  reducer: dominationRitualsReducer,
} = createActivatableRatedSlice({
  namespace: "dominationRituals",
  entityName: "DominationRitual",
  getState: state => state.magicalActions.dominationRituals,
  getImprovementCost: (_id, _database) => dominationRitualsImprovementCost,
})
