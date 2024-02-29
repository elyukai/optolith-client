import { ImprovementCost } from "../../../shared/domain/adventurePoints/improvementCost.ts"
import { MagicalTraditionIdentifier } from "../../../shared/domain/identifier.ts"
import { getImprovementCostForAnimistPower } from "../../../shared/domain/rated/animistPower.ts"
import { createEmptyDynamicMagicalAction } from "../../../shared/domain/rated/magicalActions.ts"
import { createActivatableRatedSlice } from "../activatableRatedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addAnimistPower,
    removeAction: removeAnimistPower,
    incrementAction: incrementAnimistPower,
    decrementAction: decrementAnimistPower,
    setAction: setAnimistPower,
  },
  reducer: animistPowersReducer,
} = createActivatableRatedSlice({
  namespace: "animistPowers",
  entityName: "AnimistPower",
  getState: state => state.magicalActions.animistPowers,
  getImprovementCost: (id, database, character) => {
    const animistPower = database.animistPowers[id]
    const traditionAnimists =
      character.specialAbilities.magicalTraditions[MagicalTraditionIdentifier.Animisten]

    if (animistPower === undefined || traditionAnimists === undefined) {
      return ImprovementCost.D
    }

    return (
      getImprovementCostForAnimistPower(
        patronId => database.patrons[patronId],
        traditionAnimists,
        animistPower.improvement_cost,
      ) ?? ImprovementCost.D
    )
  },
  createEmptyActivatableRated: createEmptyDynamicMagicalAction,
})
