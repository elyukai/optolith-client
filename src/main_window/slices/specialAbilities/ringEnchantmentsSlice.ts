import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addRingEnchantment,
    changeInstanceLevel: changeRingEnchantmentLevel,
    removeInstance: removeRingEnchantment,
  },
  reducer: ringEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "RingEnchantment",
  getState: state => state.specialAbilities.ringEnchantments,
  getPrerequisites: (id, database) => database.ringEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("RingEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
