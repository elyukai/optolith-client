import { ImprovementCost, fromRaw } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicMagicalAction } from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addMagicalMelody,
    removeAction: removeMagicalMelody,
    incrementAction: incrementMagicalMelody,
    decrementAction: decrementMagicalMelody,
    setAction: setMagicalMelody,
  },
  reducer: magicalMelodiesReducer,
} = createActivatableRatedSlice({
  namespace: "magicalMelodies",
  entityName: "MagicalMelody",
  getState: state => state.magicalActions.magicalMelodies,
  getImprovementCost: (id, database) =>
    fromRaw(database.magicalMelodies[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
