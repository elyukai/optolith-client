import { elem } from "../../Data/Maybe"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { getCurrentPhase } from "./stateSelectors"
import { getIsEditingHeroAfterCreationPhaseEnabled } from "./uisettingsSelectors"

export const getIsInCharacterCreation = createMaybeSelector (
  getCurrentPhase,
  elem (2)
)

export const getIsRemovingEnabled = createMaybeSelector (
  getIsInCharacterCreation,
  getIsEditingHeroAfterCreationPhaseEnabled,
  (isInCharacterCreation, isEditingHeroAfterCreationPhaseEnabled) =>
    isInCharacterCreation || isEditingHeroAfterCreationPhaseEnabled
)
