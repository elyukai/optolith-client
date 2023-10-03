import { createSelector } from "@reduxjs/toolkit"
import { selectIsCharacterCreationFinished } from "../slices/characterSlice.ts"
import { selectIsEditAfterCreationEnabled } from "../slices/settingsSlice.ts"

/**
 * Returns whether the character is still being created, i.e. the character
 * creation has not been finished.
 */
export const selectIsInCharacterCreation = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => !isCharacterCreationFinished,
)

/**
 * Returns whether the more adventure points can be added to the character.
 */
export const selectCanAddAdventurePoints = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => isCharacterCreationFinished,
)

/**
 * Returns whether entries of the character can be removed or lowered in points.
 */
export const selectCanRemove = createSelector(
  selectIsCharacterCreationFinished,
  selectIsEditAfterCreationEnabled,
  (isCharacterCreationFinished, isEditAfterCreationEnabled): boolean =>
    !isCharacterCreationFinished || isEditAfterCreationEnabled,
)
