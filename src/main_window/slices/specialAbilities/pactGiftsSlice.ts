import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addPactGift,
    changeInstanceLevel: changePactGiftLevel,
    removeInstance: removePactGift,
  },
  reducer: pactGiftsReducer,
} = createActivatableSlice({
  entityName: "PactGift",
  getState: state => state.specialAbilities.pactGifts,
  getPrerequisites: (id, database) => database.pactGifts[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("PactGift"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
