import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addOrbEnchantment,
    changeInstanceLevel: changeOrbEnchantmentLevel,
    removeInstance: removeOrbEnchantment,
  },
  reducer: orbEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "OrbEnchantment",
  getState: state => state.specialAbilities.orbEnchantments,
  getPrerequisites: (id, database) => database.orbEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("OrbEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
