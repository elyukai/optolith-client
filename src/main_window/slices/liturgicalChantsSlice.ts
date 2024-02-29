import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { registerOrUnregisterPrerequisitesOfLiturgyAsDependencies } from "../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { createIdentifierObject } from "../../shared/domain/identifier.ts"
import { createEmptyDynamicLiturgicalChant } from "../../shared/domain/rated/liturgicalChant.ts"
import { createActivatableRatedWithEnhancementsSlice } from "./activatableRatedWithEnhancementsSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addLiturgicalChant,
    removeAction: removeLiturgicalChant,
    incrementAction: incrementLiturgicalChant,
    decrementAction: decrementLiturgicalChant,
    setAction: setLiturgicalChant,
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
  getPrerequisites: (id, database) => database.liturgicalChants[id]?.prerequisites ?? [],
  createIdentifierObject: id => createIdentifierObject("LiturgicalChant", id),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfLiturgyAsDependencies,
  createEmptyActivatableRatedWithEnhancements: createEmptyDynamicLiturgicalChant,
})
