import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addChronicleEnchantment,
    changeInstanceLevel: changeChronicleEnchantmentLevel,
    removeInstance: removeChronicleEnchantment,
  },
  reducer: chronicleEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "ChronicleEnchantment",
  getState: state => state.specialAbilities.chronicleEnchantments,
  getPrerequisites: (id, database) => database.chronicleEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("ChronicleEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
