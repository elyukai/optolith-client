import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addAttireEnchantment,
    changeInstanceLevel: changeAttireEnchantmentLevel,
    removeInstance: removeAttireEnchantment,
  },
  reducer: attireEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "AttireEnchantment",
  getState: state => state.specialAbilities.attireEnchantments,
  getPrerequisites: (id, database) => database.attireEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("AttireEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
