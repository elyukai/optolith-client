import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createRatedSlice } from "./ratedSlice.ts"

const {
  create,
  createInitial,
  getValue,
  actions: { incrementAction, decrementAction },
  reducer,
} = createRatedSlice({
  namespace: "combatTechniques/close",
  entityName: "CloseCombatTechnique",
  getState: state => state.combatTechniques.close,
  minValue: 6,
  getImprovementCost: (id, database) =>
    fromRaw(database.closeCombatTechniques[id]?.improvement_cost) ?? ImprovementCost.D,
})

export {
  reducer as closeCombatTechniquesReducer,
  create as createDynamicCloseCombatTechnique,
  createInitial as createInitialDynamicCloseCombatTechnique,
  decrementAction as decrementCloseCombatTechnique,
  getValue as getCloseCombatTechniqueValue,
  incrementAction as incrementCloseCombatTechnique,
}
