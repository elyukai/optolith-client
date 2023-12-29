import { cursesImprovementCost } from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicCurse,
  createInitial: createInitialDynamicCurse,
  getValue: getCurseValue,
  actions: {
    addAction: addCurse,
    removeAction: removeCurse,
    incrementAction: incrementCurse,
    decrementAction: decrementCurse,
  },
  reducer: cursesReducer,
} = createActivatableRatedSlice({
  namespace: "curses",
  entityName: "Curse",
  getState: state => state.magicalActions.curses,
  getImprovementCost: (_id, _database) => cursesImprovementCost,
})
