import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicMagicalAction } from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addZibiljaRitual,
    removeAction: removeZibiljaRitual,
    incrementAction: incrementZibiljaRitual,
    decrementAction: decrementZibiljaRitual,
    setAction: setZibiljaRitual,
  },
  reducer: zibiljaRitualsReducer,
} = createActivatableRatedSlice({
  namespace: "zibiljaRituals",
  entityName: "ZibiljaRitual",
  getState: state => state.magicalActions.zibiljaRituals,
  getImprovementCost: (id, database) =>
    fromRaw(database.zibiljaRituals[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
