import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addKrallenkettenzauber,
    changeInstanceLevel: changeKrallenkettenzauberLevel,
    removeInstance: removeKrallenkettenzauber,
  },
  reducer: krallenkettenzauberReducer,
} = createActivatableSlice({
  entityName: "Krallenkettenzauber",
  getState: state => state.specialAbilities.krallenkettenzauber,
  getPrerequisites: (id, database) => database.krallenkettenzauber[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("Krallenkettenzauber"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
