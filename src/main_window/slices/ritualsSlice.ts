import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { registerOrUnregisterPrerequisitesOfSpellworkAsDependencies } from "../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { createIdentifierObject } from "../../shared/domain/identifier.ts"
import { createEmptyDynamicSpell } from "../../shared/domain/rated/spell.ts"
import { createActivatableRatedWithEnhancementsSlice } from "./activatableRatedWithEnhancementsSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addAction: addRitual,
    removeAction: removeRitual,
    incrementAction: incrementRitual,
    decrementAction: decrementRitual,
    setAction: setRitual,
  },
  reducer: ritualsReducer,
} = createActivatableRatedWithEnhancementsSlice({
  namespace: "rituals",
  entityName: "Ritual",
  getState: state => state.rituals,
  getImprovementCost: (id, database) =>
    fromRaw(database.rituals[id]?.improvement_cost) ?? ImprovementCost.D,
  getEnhancementAdventurePointsModifier: (id, enhancementId, database) =>
    database.rituals[id]?.enhancements?.[enhancementId]?.adventure_points_modifier ?? 0,
  getPrerequisites: (id, database) => database.rituals[id]?.prerequisites ?? [],
  createIdentifierObject: id => createIdentifierObject("Ritual", id),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfSpellworkAsDependencies,
  createEmptyActivatableRatedWithEnhancements: createEmptyDynamicSpell,
})
