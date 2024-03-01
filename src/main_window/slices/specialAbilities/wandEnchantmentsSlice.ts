import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addWandEnchantment,
    changeInstanceLevel: changeWandEnchantmentLevel,
    removeInstance: removeWandEnchantment,
  },
  reducer: wandEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "WandEnchantment",
  getState: state => state.specialAbilities.wandEnchantments,
  getPrerequisites: (id, database) => database.wandEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("WandEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
