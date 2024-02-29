import {
  createEmptyDynamicMagicalAction,
  cursesImprovementCost,
} from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addCurse,
    removeAction: removeCurse,
    incrementAction: incrementCurse,
    decrementAction: decrementCurse,
    setAction: setCurse,
  },
  reducer: cursesReducer,
} = createActivatableRatedSlice({
  namespace: "curses",
  entityName: "Curse",
  getState: state => state.magicalActions.curses,
  getImprovementCost: (_id, _database) => cursesImprovementCost,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
