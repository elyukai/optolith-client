import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addStaffEnchantment,
    changeInstanceLevel: changeStaffEnchantmentLevel,
    removeInstance: removeStaffEnchantment,
  },
  reducer: staffEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "StaffEnchantment",
  getState: state => state.specialAbilities.staffEnchantments,
  getPrerequisites: (id, database) => database.staffEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("StaffEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
