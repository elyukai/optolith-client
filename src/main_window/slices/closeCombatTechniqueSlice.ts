import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicCombatTechnique } from "../../shared/domain/rated/combatTechnique.ts"
import { createRatedSlice } from "./ratedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    incrementEntry: incrementCloseCombatTechnique,
    setEntry: setCloseCombatTechnique,
    decrementEntry: decrementCloseCombatTechnique,
  },
  reducer: closeCombatTechniquesReducer,
} = createRatedSlice({
  namespace: "combatTechniques/close",
  entityName: "CloseCombatTechnique",
  getState: state => state.combatTechniques.close,
  minValue: 6,
  getImprovementCost: (id, database) =>
    fromRaw(database.closeCombatTechniques[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyRated: createEmptyDynamicCombatTechnique,
})
