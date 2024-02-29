import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicMagicalAction } from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addMagicalDance,
    removeAction: removeMagicalDance,
    incrementAction: incrementMagicalDance,
    decrementAction: decrementMagicalDance,
    setAction: setMagicalDance,
  },
  reducer: magicalDancesReducer,
} = createActivatableRatedSlice({
  namespace: "magicalDances",
  entityName: "MagicalDance",
  getState: state => state.magicalActions.magicalDances,
  getImprovementCost: (id, database) =>
    fromRaw(database.magicalDances[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
