import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicMagicalMelody,
  createInitial: createInitialDynamicMagicalMelody,
  getValue: getMagicalMelodyValue,
  actions: {
    addAction: addMagicalMelody,
    removeAction: removeMagicalMelody,
    incrementAction: incrementMagicalMelody,
    decrementAction: decrementMagicalMelody,
  },
  reducer: magicalMelodiesReducer,
} = createActivatableRatedSlice({
  namespace: "magicalMelodies",
  entityName: "MagicalMelody",
  getState: state => state.magicalActions.magicalMelodies,
  getImprovementCost: (id, database) =>
    fromRaw(database.magicalMelodies[id]?.improvement_cost) ?? ImprovementCost.D,
})
