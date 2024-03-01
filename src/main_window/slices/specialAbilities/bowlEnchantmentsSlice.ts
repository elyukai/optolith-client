import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addBowlEnchantment,
    changeInstanceLevel: changeBowlEnchantmentLevel,
    removeInstance: removeBowlEnchantment,
  },
  reducer: bowlEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "BowlEnchantment",
  getState: state => state.specialAbilities.bowlEnchantments,
  getPrerequisites: (id, database) => database.bowlEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("BowlEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
