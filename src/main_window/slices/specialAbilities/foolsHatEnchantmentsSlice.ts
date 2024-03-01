import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addFoolsHatEnchantment,
    changeInstanceLevel: changeFoolsHatEnchantmentLevel,
    removeInstance: removeFoolsHatEnchantment,
  },
  reducer: foolsHatEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "FoolsHatEnchantment",
  getState: state => state.specialAbilities.foolsHatEnchantments,
  getPrerequisites: (id, database) => database.foolsHatEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("FoolsHatEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
