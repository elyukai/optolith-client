import { registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies } from "../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { createIdentifierObject } from "../../shared/domain/identifier.ts"
import { createActivatableSlice } from "./activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addAdvantage,
    changeInstanceLevel: changeAdvantageLevel,
    removeInstance: removeAdvantage,
  },
  reducer: advantagesReducer,
} = createActivatableSlice({
  entityName: "Advantage",
  getState: state => state.advantages,
  getPrerequisites: (id, database) => database.advantages[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: id => createIdentifierObject("Advantage", id),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies,
})
