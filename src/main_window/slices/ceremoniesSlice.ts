import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createActivatableRatedWithEnhancementsSlice } from "./activatableRatedWithEnhancementsSlice.ts"

export const {
  create: createDynamicCeremony,
  createInitial: createInitialDynamicCeremony,
  getValue: getCeremonyValue,
  actions: {
    addAction: addCeremony,
    removeAction: removeCeremony,
    incrementAction: incrementCeremony,
    decrementAction: decrementCeremony,
  },
  reducer: ceremoniesReducer,
} = createActivatableRatedWithEnhancementsSlice({
  namespace: "ceremonies",
  entityName: "Ceremony",
  getState: state => state.ceremonies,
  getImprovementCost: (id, database) =>
    fromRaw(database.ceremonies[id]?.improvement_cost) ?? ImprovementCost.D,
  getEnhancementAdventurePointsModifier: (id, enhancementId, database) =>
    database.ceremonies[id]?.enhancements?.[enhancementId]?.adventure_points_modifier ?? 0,
})
