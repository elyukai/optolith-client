import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addMagicalSign,
    changeInstanceLevel: changeMagicalSignLevel,
    removeInstance: removeMagicalSign,
  },
  reducer: magicalSignsReducer,
} = createActivatableSlice({
  entityName: "MagicalSign",
  getState: state => state.specialAbilities.magicalSigns,
  getPrerequisites: (id, database) => database.magicalSigns[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => ({ tag: "Fixed", fixed: staticEntry.ap_value }),
  createIdentifierObject: getCreateIdentifierObject("MagicalSign"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
