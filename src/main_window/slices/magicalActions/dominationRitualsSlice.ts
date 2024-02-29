import {
  createEmptyDynamicMagicalAction,
  dominationRitualsImprovementCost,
} from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addDominationRitual,
    removeAction: removeDominationRitual,
    incrementAction: incrementDominationRitual,
    decrementAction: decrementDominationRitual,
    setAction: setDominationRitual,
  },
  reducer: dominationRitualsReducer,
} = createActivatableRatedSlice({
  namespace: "dominationRituals",
  entityName: "DominationRitual",
  getState: state => state.magicalActions.dominationRituals,
  getImprovementCost: (_id, _database) => dominationRitualsImprovementCost,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
