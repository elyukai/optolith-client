import { geodeRitualsImprovementCost } from "../../../shared/domain/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicGeodeRitual,
  createInitial: createInitialDynamicGeodeRitual,
  getValue: getGeodeRitualValue,
  actions: {
    addAction: addGeodeRitual,
    removeAction: removeGeodeRitual,
    incrementAction: incrementGeodeRitual,
    decrementAction: decrementGeodeRitual,
  },
  reducer: geodeRitualsReducer,
} = createActivatableRatedSlice({
  namespace: "geodeRituals",
  entityName: "GeodeRitual",
  getState: state => state.magicalActions.geodeRituals,
  getImprovementCost: (_id, _database) => geodeRitualsImprovementCost,
})
