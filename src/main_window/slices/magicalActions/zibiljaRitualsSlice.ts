import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicZibiljaRitual,
  createInitial: createInitialDynamicZibiljaRitual,
  getValue: getZibiljaRitualValue,
  actions: {
    addAction: addZibiljaRitual,
    removeAction: removeZibiljaRitual,
    incrementAction: incrementZibiljaRitual,
    decrementAction: decrementZibiljaRitual,
  },
  reducer: zibiljaRitualsReducer,
} = createActivatableRatedSlice({
  namespace: "zibiljaRituals",
  entityName: "ZibiljaRitual",
  getState: state => state.magicalActions.zibiljaRituals,
  getImprovementCost: (id, database) =>
    fromRaw(database.zibiljaRituals[id]?.improvement_cost) ?? ImprovementCost.D,
})
