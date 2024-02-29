import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createEmptyDynamicSkill } from "../../shared/domain/rated/skill.ts"
import { createRatedSlice } from "./ratedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: { incrementEntry: incrementSkill, decrementEntry: decrementSkill, setEntry: setSkill },
  reducer: skillsReducer,
} = createRatedSlice({
  namespace: "skills",
  entityName: "Skill",
  getState: state => state.skills,
  minValue: 0,
  getImprovementCost: (id, database) =>
    fromRaw(database.skills[id]?.improvement_cost) ?? ImprovementCost.D,
  createEmptyRated: createEmptyDynamicSkill,
})
