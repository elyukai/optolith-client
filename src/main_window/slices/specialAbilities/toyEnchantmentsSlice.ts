import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addToyEnchantment,
    changeInstanceLevel: changeToyEnchantmentLevel,
    removeInstance: removeToyEnchantment,
  },
  reducer: toyEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "ToyEnchantment",
  getState: state => state.specialAbilities.toyEnchantments,
  getPrerequisites: (id, database) => database.toyEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("ToyEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
