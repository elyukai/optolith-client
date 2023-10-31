import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { registerOrUnregisterPrerequisitesOfLiturgyAsDependencies } from "../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { createIdentifierObject } from "../../shared/domain/identifier.ts"
import { createActivatableRatedWithEnhancementsSlice } from "./activatableRatedWithEnhancementsSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
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
  getPrerequisites: (id, database) => database.ceremonies[id]?.prerequisites ?? [],
  createIdentifierObject: id => createIdentifierObject("Ceremony", id),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfLiturgyAsDependencies,
})
