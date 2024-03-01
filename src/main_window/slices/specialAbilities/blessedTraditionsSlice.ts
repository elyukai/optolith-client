import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addBlessedTradition,
    changeInstanceLevel: changeBlessedTraditionLevel,
    removeInstance: removeBlessedTradition,
  },
  reducer: blessedTraditionsReducer,
} = createActivatableSlice({
  entityName: "BlessedTradition",
  getState: state => state.specialAbilities.blessedTraditions,
  getPrerequisites: (id, database) => database.blessedTraditions[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("BlessedTradition"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
