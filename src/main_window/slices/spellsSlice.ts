import { ImprovementCost, fromRaw } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { registerOrUnregisterPrerequisitesOfSpellworkAsDependencies } from "../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { createIdentifierObject } from "../../shared/domain/identifier.ts"
import { createActivatableRatedWithEnhancementsSlice } from "./activatableRatedWithEnhancementsSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  create: createDynamicSpell,
  createInitial: createInitialDynamicSpell,
  getValue: getSpellValue,
  actions: {
    addAction: addSpell,
    removeAction: removeSpell,
    incrementAction: incrementSpell,
    decrementAction: decrementSpell,
  },
  reducer: spellsReducer,
} = createActivatableRatedWithEnhancementsSlice({
  namespace: "spells",
  entityName: "Spell",
  getState: state => state.spells,
  getImprovementCost: (id, database) =>
    fromRaw(database.spells[id]?.improvement_cost) ?? ImprovementCost.D,
  getEnhancementAdventurePointsModifier: (id, enhancementId, database) =>
    database.spells[id]?.enhancements?.[enhancementId]?.adventure_points_modifier ?? 0,
  getPrerequisites: (id, database) => database.spells[id]?.prerequisites ?? [],
  createIdentifierObject: id => createIdentifierObject("Ritual", id),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfSpellworkAsDependencies,
})
