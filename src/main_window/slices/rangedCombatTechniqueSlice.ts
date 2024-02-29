import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicCombatTechnique } from "../../shared/domain/rated/combatTechnique.ts"
import { createRatedSlice } from "./ratedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    incrementEntry: incrementRangedCombatTechnique,
    setEntry: setRangedCombatTechnique,
    decrementEntry: decrementRangedCombatTechnique,
  },
  reducer: rangedCombatTechniquesReducer,
} = createRatedSlice({
  namespace: "combatTechniques/ranged",
  entityName: "RangedCombatTechnique",
  getState: state => state.combatTechniques.ranged,
  minValue: 6,
  getImprovementCost: (id, database) =>
    fromRaw(database.rangedCombatTechniques[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyRated: createEmptyDynamicCombatTechnique,
})
