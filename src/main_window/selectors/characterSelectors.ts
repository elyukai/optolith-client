import { createSelector } from "@reduxjs/toolkit"
import { selectIsCharacterCreationFinished } from "../slices/characterSlice.ts"
import { selectIsEditAfterCreationEnabled } from "../slices/settingsSlice.ts"

export const selectIsInCharacterCreation = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => !isCharacterCreationFinished
)

export const selectCanAddAdventurePoints = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => isCharacterCreationFinished
)

export const selectCanRemove = createSelector(
  selectIsCharacterCreationFinished,
  selectIsEditAfterCreationEnabled,
  (isCharacterCreationFinished, isEditAfterCreationEnabled): boolean =>
    !isCharacterCreationFinished || isEditAfterCreationEnabled
)
