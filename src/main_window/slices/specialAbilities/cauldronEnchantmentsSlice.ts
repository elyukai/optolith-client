import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addCauldronEnchantment,
    changeInstanceLevel: changeCauldronEnchantmentLevel,
    removeInstance: removeCauldronEnchantment,
  },
  reducer: cauldronEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "CauldronEnchantment",
  getState: state => state.specialAbilities.cauldronEnchantments,
  getPrerequisites: (id, database) => database.cauldronEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("CauldronEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
