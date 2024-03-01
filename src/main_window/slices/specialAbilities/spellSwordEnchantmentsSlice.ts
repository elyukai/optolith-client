import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addSpellSwordEnchantment,
    changeInstanceLevel: changeSpellSwordEnchantmentLevel,
    removeInstance: removeSpellSwordEnchantment,
  },
  reducer: spellSwordEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "SpellSwordEnchantment",
  getState: state => state.specialAbilities.spellSwordEnchantments,
  getPrerequisites: (id, database) => database.spellSwordEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("SpellSwordEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
