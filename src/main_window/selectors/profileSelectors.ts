import { createSelector } from "@reduxjs/toolkit"
import { ProfessionIdentifier } from "../../shared/domain/identifier.ts"
import { selectIsCharacterCreationFinished } from "../slices/characterSlice.ts"
import { selectAdventurePointsAvailable } from "./adventurePointSelectors.ts"
import { selectCurrentProfession } from "./professionSelectors.ts"

/**
 * Returns whether the *finish character creation* button needs to be shown.
 */
export const selectShowFinishCharacterCreation = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => !isCharacterCreationFinished,
)

/**
 * Returns whether the character creation can be finished.
 */
export const selectCanFinishCharacterCreation = createSelector(
  selectAdventurePointsAvailable,
  (availableAdventurePoints): boolean =>
    availableAdventurePoints >= 0 && availableAdventurePoints <= 10,
)

/**
 * Returns whether the profession name can be customized.
 */
export const selectCanDefineCustomProfessionName = createSelector(
  selectCurrentProfession,
  (profession): boolean => profession?.base.id === ProfessionIdentifier.OwnProfession,
)
