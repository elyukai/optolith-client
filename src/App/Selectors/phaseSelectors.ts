import { elem } from "../../Data/Maybe";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { getPhase } from "./stateSelectors";
import { getIsEditingHeroAfterCreationPhaseEnabled } from "./uisettingsSelectors";

export const getIsInCharacterCreation = createMaybeSelector (
  getPhase,
  elem (2)
)

export const getIsRemovingEnabled = createMaybeSelector (
  getIsInCharacterCreation,
  getIsEditingHeroAfterCreationPhaseEnabled,
  (isInCharacterCreation, isEditingHeroAfterCreationPhaseEnabled) =>
    isInCharacterCreation || isEditingHeroAfterCreationPhaseEnabled
)
