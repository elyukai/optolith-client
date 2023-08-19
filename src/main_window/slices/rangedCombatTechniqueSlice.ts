import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createRatedSlice } from "./ratedSlice.ts"

const {
  create,
  createInitial,
  getValue,
  actions: { incrementAction, decrementAction },
  reducer,
} = createRatedSlice({
  namespace: "combatTechniques/ranged",
  entityName: "RangedCombatTechnique",
  getState: state => state.combatTechniques.ranged,
  minValue: 6,
  getImprovementCost: (id, database) =>
    fromRaw(database.rangedCombatTechniques[id]?.improvement_cost) ?? ImprovementCost.D,
})

export {
  create as createDynamicRangedCombatTechnique,
  createInitial as createInitialDynamicRangedCombatTechnique,
  decrementAction as decrementRangedCombatTechnique,
  getValue as getRangedCombatTechniqueValue,
  incrementAction as incrementRangedCombatTechnique,
  reducer as rangedCombatTechniquesReducer,
}
