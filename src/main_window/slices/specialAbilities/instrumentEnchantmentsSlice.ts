import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addInstrumentEnchantment,
    changeInstanceLevel: changeInstrumentEnchantmentLevel,
    removeInstance: removeInstrumentEnchantment,
  },
  reducer: instrumentEnchantmentsReducer,
} = createActivatableSlice({
  entityName: "InstrumentEnchantment",
  getState: state => state.specialAbilities.instrumentEnchantments,
  getPrerequisites: (id, database) => database.instrumentEnchantments[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("InstrumentEnchantment"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
