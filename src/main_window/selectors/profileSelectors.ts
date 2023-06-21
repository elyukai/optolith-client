import { createSelector } from "@reduxjs/toolkit"
import { ProfessionIdentifier } from "../../shared/domain/identifier.ts"
import { selectIsCharacterCreationFinished } from "../slices/characterSlice.ts"
import { selectAdventurePointsAvailable } from "./adventurePointSelectors.ts"
import { selectCurrentProfession } from "./professionSelectors.ts"

export const selectShowFinishCharacterCreation = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => !isCharacterCreationFinished
)

export const selectCanFinishCharacterCreation = createSelector(
  selectAdventurePointsAvailable,
  (availableAdventurePoints): boolean =>
    availableAdventurePoints >= 0 && availableAdventurePoints <= 10
)

export const selectCanDefineCustomProfessionName = createSelector(
  selectCurrentProfession,
  (profession): boolean =>
    profession?.profession.id === ProfessionIdentifier.OwnProfession
)
