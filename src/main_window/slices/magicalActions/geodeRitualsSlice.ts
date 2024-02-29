import {
  createEmptyDynamicMagicalAction,
  geodeRitualsImprovementCost,
} from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addGeodeRitual,
    removeAction: removeGeodeRitual,
    incrementAction: incrementGeodeRitual,
    decrementAction: decrementGeodeRitual,
    setAction: setGeodeRitual,
  },
  reducer: geodeRitualsReducer,
} = createActivatableRatedSlice({
  namespace: "geodeRituals",
  entityName: "GeodeRitual",
  getState: state => state.magicalActions.geodeRituals,
  getImprovementCost: (_id, _database) => geodeRitualsImprovementCost,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
