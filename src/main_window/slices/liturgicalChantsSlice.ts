import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { createActivatableRatedWithEnhancementsSlice } from "./activatableRatedWithEnhancementsSlice.ts"

export const {
  create: createDynamicLiturgicalChant,
  createInitial: createInitialDynamicLiturgicalChant,
  getValue: getLiturgicalChantValue,
  actions: {
    addAction: addLiturgicalChant,
    removeAction: removeLiturgicalChant,
    incrementAction: incrementLiturgicalChant,
    decrementAction: decrementLiturgicalChant,
  },
  reducer: liturgicalChantsReducer,
} = createActivatableRatedWithEnhancementsSlice({
  namespace: "liturgicalChants",
  entityName: "LiturgicalChant",
  getState: state => state.liturgicalChants,
  getImprovementCost: (id, database) =>
    fromRaw(database.liturgicalChants[id]?.improvement_cost) ?? ImprovementCost.D,
  getEnhancementAdventurePointsModifier: (id, enhancementId, database) =>
    database.liturgicalChants[id]?.enhancements?.[enhancementId]?.adventure_points_modifier ?? 0,
})
