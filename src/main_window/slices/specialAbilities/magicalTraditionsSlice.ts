import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addMagicalTradition,
    changeInstanceLevel: changeMagicalTraditionLevel,
    removeInstance: removeMagicalTradition,
  },
  reducer: magicalTraditionsReducer,
} = createActivatableSlice({
  entityName: "MagicalTradition",
  getState: state => state.specialAbilities.magicalTraditions,
  getPrerequisites: (id, database) => database.magicalTraditions[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("MagicalTradition"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
