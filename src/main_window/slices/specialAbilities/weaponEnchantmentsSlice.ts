import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addWeaponEnchantment,
    changeInstanceLevel: changeWeaponEnchantmentLevel,
    removeInstance: removeWeaponEnchantment,
  },
  reducer: weaponEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "WeaponEnchantment",
  getState: state => state.specialAbilities.weaponEnchantments,
  getPrerequisites: (id, database) => database.weaponEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("WeaponEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
