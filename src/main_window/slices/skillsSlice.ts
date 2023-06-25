import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createRatedSlice } from "./ratedSlice.ts"

const {
  create,
  createInitial,
  getValue,
  actions: {
    incrementAction,
    decrementAction,
  },
  reducer,
} = createRatedSlice({
  namespace: "skills",
  entityName: "Skill",
  getState: state => state.skills,
  minValue: 0,
  getImprovementCost: (id, database) =>
    fromRaw(database.skills[id]?.improvement_cost) ?? ImprovementCost.D,
})

export {
  create as createDynamicSkill,
  createInitial as createInitialDynamicSkill,
  getValue as skillValue,
  incrementAction as incrementSkill,
  decrementAction as decrementSkill,
  reducer as skillsReducer,
}
