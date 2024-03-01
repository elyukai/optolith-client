import { registerOrUnregisterPrerequisitesOfGeneralAsDependencies } from "../../../shared/domain/dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { getCreateIdentifierObject } from "../../../shared/domain/identifier.ts"
import { createActivatableSlice } from "../activatableSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    addInstance: addLycantropicGift,
    changeInstanceLevel: changeLycantropicGiftLevel,
    removeInstance: removeLycantropicGift,
  },
  reducer: lycantropicGiftsReducer,
} = createActivatableSlice({
  entityName: "LycantropicGift",
  getState: state => state.specialAbilities.lycantropicGifts,
  getPrerequisites: (id, database) => database.lycantropicGifts[id]?.prerequisites ?? [],
  getAdventurePointsValue: staticEntry => staticEntry.ap_value,
  createIdentifierObject: getCreateIdentifierObject("LycantropicGift"),
  registerOrUnregisterPrerequisitesAsDependencies:
    registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
})
