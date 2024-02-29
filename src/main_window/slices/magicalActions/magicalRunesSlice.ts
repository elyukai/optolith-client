import { ImprovementCost } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicMagicalAction } from "../../../shared/domain/rated/magicalActions.ts"
import { getImprovementCostForMagicalRune } from "../../../shared/domain/rated/magicalRune.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addMagicalRune,
    removeAction: removeMagicalRune,
    incrementAction: incrementMagicalRune,
    decrementAction: decrementMagicalRune,
    setAction: setMagicalRune,
  },
  reducer: magicalRunesReducer,
} = createActivatableRatedSlice({
  namespace: "magicalRunes",
  entityName: "MagicalRune",
  getState: state => state.magicalActions.magicalRunes,
  getImprovementCost: (id, database) => {
    const staticEntry = database.magicalRunes[id]
    return (
      getImprovementCostForMagicalRune(
        // staticEntry?.options,
        staticEntry?.improvement_cost ?? { tag: "Constant", constant: { value: "D" } },
      ) ?? ImprovementCost.D
    )
  },
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
